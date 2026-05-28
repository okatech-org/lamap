import {
  Rank,
  SUIT_COLORS,
  SUIT_HIGHLIGHT,
  Suit,
  makeSuitHighlightPath,
  makeSuitPath,
} from "@/components/game/playing-card-skia";
import { COLORS } from "@/design";
import { useSettings, type CardLayout } from "@/hooks/use-settings";
import {
  BlurMask,
  Canvas,
  Group,
  LinearGradient,
  Path,
  RoundedRect,
  Text as SkText,
  matchFont,
  rect,
  rrect,
  useFont,
  vec,
  type SkFont,
} from "@shopify/react-native-skia";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, Platform, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  Easing,
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

/**
 * Card shape is structurally identical to the legacy `Card` in card-hand.tsx,
 * so <CardHandSkia /> is a drop-in replacement for <CardHand />.
 */
export type Card = {
  id: string;
  suit: Suit;
  rank: Rank;
  playable: boolean;
};

interface CardHandSkiaProps {
  cards: Card[];
  isMyTurn: boolean;
  onCardSelect: (card: Card) => void;
  onCardDoubleTap?: (card: Card) => void;
  selectedCard?: Card | null;
  disabled?: boolean;
  /** Override the configured layout. Defaults to useSettings().cardLayout. */
  layout?: CardLayout;
  /** Canvas height (width is measured from the parent). */
  height?: number;
  cardWidth?: number;
  /** Fan spacing multiplier (× cardWidth). Defaults to the legacy formula. */
  fanSpacingFactor?: number;
  /** Fan rotation per card, in degrees. Defaults to the legacy value. */
  fanTiltDeg?: number;
  /** How far (px) the card bottoms spill below the canvas, like the old hand. */
  bottomSpill?: number;
}

const CARD_ASPECT_RATIO = 5 / 7;

const SYSTEM_FONT_FAMILY = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

interface Slot {
  x: number; // card CENTER x
  y: number; // card CENTER y
  angle: number; // radians, rotation around the card center
}

function computeLayout(
  total: number,
  layout: CardLayout,
  opts: {
    centerX: number;
    baseY: number;
    cardW: number;
    availWidth: number;
    spacingFactor?: number;
    tiltDeg?: number;
  },
): Slot[] {
  const centerIndex = (total - 1) / 2;

  // Cap the spacing so the whole spread always fits on screen (edges included,
  // with a small margin) — keeps every card's rank corner visible.
  const edgeMargin = 10;
  const fitSpacing =
    total > 1
      ? (opts.availWidth - opts.cardW - edgeMargin * 2) / (total - 1)
      : 0;

  if (layout === "fan") {
    // Legacy-style fan: linear X positions + per-card rotation around the card
    // center, but the spread is clamped to the screen width.
    const factor = opts.spacingFactor ?? Math.max(0.5, 0.85 - total * 0.05);
    const desired = opts.cardW * factor * 1.2;
    const spacing = Math.min(desired, fitSpacing);
    const tiltPerCard = opts.tiltDeg ?? Math.min(total, 8);
    return Array.from({ length: total }, (_, i) => ({
      x: opts.centerX + (i - centerIndex) * spacing,
      y: opts.baseY,
      angle: ((i - centerIndex) * tiltPerCard * Math.PI) / 180,
    }));
  }

  // linear / compact: a flat row, no rotation. compact overlaps more.
  const desired = opts.cardW * (layout === "compact" ? 0.5 : 0.8);
  const spacing = Math.min(desired, fitSpacing);
  return Array.from({ length: total }, (_, i) => ({
    x: opts.centerX + (i - centerIndex) * spacing,
    y: opts.baseY,
    angle: 0,
  }));
}

export function CardHandSkia({
  cards,
  isMyTurn,
  onCardSelect,
  onCardDoubleTap,
  selectedCard,
  disabled = false,
  layout: layoutProp,
  height = 420,
  cardWidth = 132,
  fanSpacingFactor,
  fanTiltDeg,
  bottomSpill = 30,
}: CardHandSkiaProps) {
  const { cardLayout } = useSettings();
  const layout = layoutProp ?? cardLayout;

  const [measuredWidth, setMeasuredWidth] = useState(0);
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setMeasuredWidth(e.nativeEvent.layout.width);
  }, []);

  const width = measuredWidth;
  const cardW = cardWidth;
  const cardH = cardWidth / CARD_ASPECT_RATIO;
  const radius = cardW * 0.1;

  // Card CENTER y — cards sit near the bottom and spill below by `bottomSpill`.
  const baseY = Math.round(height - cardH / 2 + bottomSpill);

  const slots = useMemo(
    () =>
      width > 0
        ? computeLayout(cards.length, layout, {
            centerX: width / 2,
            baseY,
            cardW,
            availWidth: width,
            spacingFactor: fanSpacingFactor,
            tiltDeg: fanTiltDeg,
          })
        : [],
    [cards.length, layout, width, baseY, cardW, fanSpacingFactor, fanTiltDeg],
  );

  // "Armed to play" when a card's center is dragged above this line — a fixed
  // distance above the resting cards, so the drag feel is height-independent.
  const playThresholdY = Math.max(8, baseY - 130);

  // Font
  const fontSize = Math.round(cardW * 0.2);
  const ttf = useFont(
    require("@expo-google-fonts/crimson-pro/700Bold/CrimsonPro_700Bold.ttf"),
    fontSize,
  );
  const fallback = useMemo(
    () => matchFont({ fontFamily: SYSTEM_FONT_FAMILY, fontSize, fontWeight: "700" }),
    [fontSize],
  );
  const font = ttf ?? fallback;

  const interactive = isMyTurn && !disabled;

  // --- Drag state (UI thread) ---
  const draggedIndex = useSharedValue<number>(-1);
  const dragTx = useSharedValue(0);
  const dragTy = useSharedValue(0);
  const dragLift = useSharedValue(0);
  const dropZoneActive = useSharedValue(0);
  const dropFlash = useSharedValue(0);
  const isDragging = useSharedValue(0);
  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);

  // --- Selection (driven by the selectedCard prop) ---
  const selectedIndex = useSharedValue(-1);
  const selectionLift = useSharedValue(0);
  const selIdx = useMemo(
    () => (selectedCard ? cards.findIndex((c) => c.id === selectedCard.id) : -1),
    [selectedCard, cards],
  );
  useEffect(() => {
    selectedIndex.value = selIdx;
    selectionLift.value = withTiming(selIdx === -1 ? 0 : 1, { duration: 200 });
  }, [selIdx, selectedIndex, selectionLift]);

  // --- JS callbacks (bridged from worklets) ---
  const handleTapCard = useCallback(
    (idx: number) => {
      if (!interactive) return;
      const card = cards[idx];
      if (!card || !card.playable) return;
      if (selectedCard && selectedCard.id === card.id) {
        onCardDoubleTap?.(card);
      } else {
        onCardSelect(card);
      }
    },
    [interactive, cards, selectedCard, onCardSelect, onCardDoubleTap],
  );

  const handlePlayDragged = useCallback(
    (idx: number) => {
      const card = cards[idx];
      if (!card) return;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onCardDoubleTap?.(card);
    },
    [cards, onCardDoubleTap],
  );

  const pickupHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);
  const armHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  // Hit-test a point against the cards (center-anchored, rotation-aware).
  // Defined as a closure used inside worklets below.
  const hitTest = (px: number, py: number): number => {
    "worklet";
    for (let i = slots.length - 1; i >= 0; i--) {
      const slot = slots[i];
      const dx = px - slot.x;
      const dy = py - slot.y;
      const cos = Math.cos(-slot.angle);
      const sin = Math.sin(-slot.angle);
      const lx = dx * cos - dy * sin;
      const ly = dx * sin + dy * cos;
      if (Math.abs(lx) <= cardW / 2 && Math.abs(ly) <= cardH / 2) {
        return i;
      }
    }
    return -1;
  };

  // --- Gestures ---
  const tapGesture = Gesture.Tap()
    .maxDuration(260)
    .onEnd((e, success) => {
      "worklet";
      if (!success) return;
      const hit = hitTest(e.x, e.y);
      if (hit !== -1) runOnJS(handleTapCard)(hit);
    });

  const panGesture = Gesture.Pan()
    .minDistance(12)
    .onBegin((e) => {
      "worklet";
      touchX.value = e.x;
      touchY.value = e.y;
    })
    .onStart(() => {
      "worklet";
      if (!interactive) return;
      const hit = hitTest(touchX.value, touchY.value);
      if (hit !== -1 && cards[hit]?.playable) {
        draggedIndex.value = hit;
        isDragging.value = 1;
        dragTx.value = 0;
        dragTy.value = 0;
        dragLift.value = withSpring(1, { damping: 14, stiffness: 220 });
        runOnJS(pickupHaptic)();
      }
    })
    .onChange((e) => {
      "worklet";
      const idx = draggedIndex.value;
      if (idx === -1) return;
      dragTx.value = e.translationX;
      dragTy.value = e.translationY;

      const slot = slots[idx];
      if (!slot) return;
      const cy = slot.y + dragTy.value;
      const nextActive = cy < playThresholdY ? 1 : 0;
      if (nextActive === 1 && dropZoneActive.value === 0) {
        runOnJS(armHaptic)();
      }
      dropZoneActive.value = nextActive;
    })
    .onEnd(() => {
      "worklet";
      const idx = draggedIndex.value;
      if (idx === -1) return;

      const played = dropZoneActive.value === 1;
      if (played) {
        runOnJS(handlePlayDragged)(idx);
        dropFlash.value = withSequence(
          withTiming(1, { duration: 160, easing: Easing.out(Easing.cubic) }),
          withTiming(0, { duration: 360, easing: Easing.in(Easing.cubic) }),
        );
      }

      dropZoneActive.value = 0;
      const springCfg = { damping: 16, stiffness: 170 };
      dragTx.value = withSpring(0, springCfg);
      dragTy.value = withSpring(0, springCfg);
      dragLift.value = withSpring(0, springCfg, (done) => {
        if (done) {
          draggedIndex.value = -1;
          isDragging.value = 0;
        }
      });
    })
    .onFinalize(() => {
      "worklet";
      if (draggedIndex.value === -1) isDragging.value = 0;
    });

  const composed = Gesture.Race(panGesture, tapGesture);

  return (
    <View style={{ width: "100%", height }} onLayout={onLayout}>
      {width > 0 && (
        <GestureDetector gesture={composed}>
          <Canvas style={{ width, height }}>
            <PlayLineSkia
              width={width}
              y={playThresholdY}
              active={dropZoneActive}
              flash={dropFlash}
              isDragging={isDragging}
            />

            {/* Base layer */}
            {cards.map((card, i) => (
              <HandCardSkia
                key={`base-${card.id}`}
                layer="base"
                index={i}
                slot={slots[i]}
                card={card}
                interactive={interactive}
                cardW={cardW}
                cardH={cardH}
                radius={radius}
                font={font}
                draggedIndex={draggedIndex}
                dragTx={dragTx}
                dragTy={dragTy}
                dragLift={dragLift}
                dropZoneActive={dropZoneActive}
                selectedIndex={selectedIndex}
                selectionLift={selectionLift}
              />
            ))}

            {/* Drag layer (on top) */}
            {cards.map((card, i) => (
              <HandCardSkia
                key={`drag-${card.id}`}
                layer="drag"
                index={i}
                slot={slots[i]}
                card={card}
                interactive={interactive}
                cardW={cardW}
                cardH={cardH}
                radius={radius}
                font={font}
                draggedIndex={draggedIndex}
                dragTx={dragTx}
                dragTy={dragTy}
                dragLift={dragLift}
                dropZoneActive={dropZoneActive}
                selectedIndex={selectedIndex}
                selectionLift={selectionLift}
              />
            ))}
          </Canvas>
        </GestureDetector>
      )}
    </View>
  );
}

// --- Play line (horizontal threshold indicator, only visible while dragging) ---
function PlayLineSkia({
  width,
  y,
  active,
  flash,
  isDragging,
}: {
  width: number;
  y: number;
  active: SharedValue<number>;
  flash: SharedValue<number>;
  isDragging: SharedValue<number>;
}) {
  const inset = Math.min(40, width * 0.1);
  const lineW = width - inset * 2;

  const lineOpacity = useDerivedValue(
    () => isDragging.value * (0.3 + active.value * 0.6) + flash.value * 0.5,
  );
  const lineHeight = useDerivedValue(() => 2 + active.value * 2);
  const glowOpacity = useDerivedValue(
    () => active.value * 0.8 + flash.value * 0.9,
  );
  const glowBlur = useDerivedValue(() => 10 + active.value * 14 + flash.value * 16);

  return (
    <Group>
      <RoundedRect
        x={inset}
        y={y - 3}
        width={lineW}
        height={6}
        r={3}
        color={COLORS.or2}
        opacity={glowOpacity}
      >
        <BlurMask blur={glowBlur} style="solid" />
      </RoundedRect>
      <RoundedRect
        x={inset}
        y={y}
        width={lineW}
        height={lineHeight}
        r={2}
        color={COLORS.or2}
        opacity={lineOpacity}
      />
    </Group>
  );
}

// --- Hand card ---
interface HandCardSkiaProps {
  layer: "base" | "drag";
  index: number;
  slot: Slot;
  card: Card;
  interactive: boolean;
  cardW: number;
  cardH: number;
  radius: number;
  font: SkFont;
  draggedIndex: SharedValue<number>;
  dragTx: SharedValue<number>;
  dragTy: SharedValue<number>;
  dragLift: SharedValue<number>;
  dropZoneActive: SharedValue<number>;
  selectedIndex: SharedValue<number>;
  selectionLift: SharedValue<number>;
}

function HandCardSkia({
  layer,
  index,
  slot,
  card,
  interactive,
  cardW,
  cardH,
  radius,
  font,
  draggedIndex,
  dragTx,
  dragTy,
  dragLift,
  dropZoneActive,
  selectedIndex,
  selectionLift,
}: HandCardSkiaProps) {
  const suitPath = useMemo(() => makeSuitPath(card.suit), [card.suit]);
  const suitHighlight = useMemo(
    () => makeSuitHighlightPath(card.suit),
    [card.suit],
  );
  const suitColor = SUIT_COLORS[card.suit];
  const suitHighlightColor = SUIT_HIGHLIGHT[card.suit];

  const dimmed = !interactive || !card.playable;

  // Entrance: the base layer rises + fades in once on mount, staggered.
  const entrance = useSharedValue(layer === "base" ? 0 : 1);
  useEffect(() => {
    if (layer === "base") {
      entrance.value = withDelay(
        index * 55,
        withTiming(1, { duration: 340, easing: Easing.out(Easing.cubic) }),
      );
    }
    // mount only — persistent cards (stable id key) don't replay
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const opacity = useDerivedValue(() => {
    const isMe = draggedIndex.value === index;
    const base = dimmed ? 0.42 : 1;
    if (layer === "base") return (isMe ? 0 : base) * entrance.value;
    return isMe ? 1 : 0;
  }, [index, layer, dimmed]);

  // All transforms are CENTER-anchored: place the card center at the slot,
  // rotate around it, then offset by half-size to draw from the top-left.
  const transform = useDerivedValue(() => {
    if (layer === "drag") {
      const lift = dragLift.value;
      const scale = 1 + lift * 0.16;
      const tilt = dropZoneActive.value * -0.06;
      return [
        { translateX: slot.x + dragTx.value },
        { translateY: slot.y + dragTy.value - lift * 22 },
        { rotate: tilt },
        { scale },
        { translateX: -cardW / 2 },
        { translateY: -cardH / 2 },
      ];
    }
    const selLift =
      selectedIndex.value === index ? selectionLift.value * -34 : 0;
    const enterOffset = (1 - entrance.value) * 70;
    return [
      { translateX: slot.x },
      { translateY: slot.y + selLift + enterOffset },
      { rotate: slot.angle },
      { translateX: -cardW / 2 },
      { translateY: -cardH / 2 },
    ];
  }, [layer, slot, cardW, cardH, index]);

  const glowOpacity = useDerivedValue(() => {
    if (layer === "drag") return 0.4 + dropZoneActive.value * 0.5;
    return selectedIndex.value === index ? selectionLift.value * 0.7 : 0;
  }, [layer, index]);
  const glowBlur = useDerivedValue(() => {
    if (layer === "drag") return 16 + dropZoneActive.value * 14;
    return 18;
  }, [layer]);
  const glowColor = useDerivedValue(() => {
    if (layer === "drag") {
      return dropZoneActive.value > 0.5 ? COLORS.or2 : COLORS.terre2;
    }
    return COLORS.or2;
  }, [layer]);

  const borderColor = useDerivedValue(() => {
    const isSel = selectedIndex.value === index && layer === "base";
    return isSel ? COLORS.or2 : "rgba(20,26,34,0.35)";
  }, [index, layer]);
  const borderWidth = useDerivedValue(() => {
    const isSel = selectedIndex.value === index && layer === "base";
    return isSel ? 3 : 1.4;
  }, [index, layer]);

  const cornerSuitSize = cardW * 0.15;
  const centerSuitSize = cardW * 0.46;
  const padding = cardW * 0.07;
  const titleSize = Math.round(cardW * 0.2);

  return (
    <Group transform={transform} opacity={opacity}>
      {/* Drop shadow */}
      <RoundedRect
        x={0}
        y={8}
        width={cardW}
        height={cardH}
        r={radius}
        color="rgba(0,0,0,0.5)"
      >
        <BlurMask blur={12} style="normal" />
      </RoundedRect>

      {/* Glow halo */}
      <RoundedRect
        x={-3}
        y={-3}
        width={cardW + 6}
        height={cardH + 6}
        r={radius + 2}
        color={glowColor}
        opacity={glowOpacity}
      >
        <BlurMask blur={glowBlur} style="solid" />
      </RoundedRect>

      {/* Body gradient */}
      <RoundedRect x={0} y={0} width={cardW} height={cardH} r={radius}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(cardW, cardH)}
          colors={["#FAF7F1", "#ECE6DA", "#E2DACB"]}
        />
      </RoundedRect>

      {/* Holographic sheen */}
      <Group clip={rrect(rect(0, 0, cardW, cardH), radius, radius)}>
        <RoundedRect x={0} y={0} width={cardW} height={cardH} r={radius}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(cardW, cardH)}
            colors={[
              "rgba(255,255,255,0)",
              "rgba(255,255,255,0.35)",
              "rgba(201,168,118,0.22)",
              "rgba(255,255,255,0)",
            ]}
            positions={[0, 0.35, 0.65, 1]}
          />
        </RoundedRect>
      </Group>

      {/* Inner gold accent */}
      <RoundedRect
        x={4}
        y={4}
        width={cardW - 8}
        height={cardH - 8}
        r={radius - 2}
        color="rgba(166,130,88,0.45)"
        style="stroke"
        strokeWidth={1.2}
      />

      {/* Outer border */}
      <RoundedRect
        x={0}
        y={0}
        width={cardW}
        height={cardH}
        r={radius}
        color={borderColor}
        style="stroke"
        strokeWidth={borderWidth}
      />

      {/* TOP-LEFT corner */}
      <Group transform={[{ translateX: padding }, { translateY: padding }]}>
        <SkText x={0} y={titleSize * 0.9} text={card.rank} font={font} color={suitColor} />
        <Group transform={[{ translateY: titleSize + 3 }, { scale: cornerSuitSize / 100 }]}>
          <Path path={suitPath} color={suitColor} />
          <Path path={suitHighlight} color={suitHighlightColor} opacity={0.35} />
        </Group>
      </Group>

      {/* BOTTOM-RIGHT corner */}
      <Group
        transform={[
          { translateX: cardW - padding },
          { translateY: cardH - padding },
          { rotate: Math.PI },
        ]}
      >
        <SkText x={0} y={titleSize * 0.9} text={card.rank} font={font} color={suitColor} />
        <Group transform={[{ translateY: titleSize + 3 }, { scale: cornerSuitSize / 100 }]}>
          <Path path={suitPath} color={suitColor} />
          <Path path={suitHighlight} color={suitHighlightColor} opacity={0.35} />
        </Group>
      </Group>

      {/* CENTER large suit */}
      <Group
        transform={[
          { translateX: cardW / 2 - centerSuitSize / 2 },
          { translateY: cardH / 2 - centerSuitSize / 2 },
          { scale: centerSuitSize / 100 },
        ]}
      >
        <Path path={suitPath} color={suitColor} />
        <Path path={suitHighlight} color={suitHighlightColor} opacity={0.4} />
      </Group>
    </Group>
  );
}
