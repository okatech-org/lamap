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
  Circle,
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
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutChangeEvent, Platform, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  Easing,
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

export type Card = {
  id: string;
  suit: Suit;
  rank: Rank;
  playable: boolean;
};

export type PlayedCard = { suit: Suit; rank: Rank };

interface GameTableSkiaProps {
  myHand: Card[];
  playerStack: PlayedCard[];
  opponentStack: PlayedCard[];
  leadSuit?: Suit;
  isMyTurn: boolean;
  disabled?: boolean;
  selectedCard?: Card | null;
  onCardSelect: (card: Card) => void;
  onCardDoubleTap?: (card: Card) => void;
  /** Shows battle stacks. Set false in history mode (hand only). */
  showBattle?: boolean;
  /** "me" | "opponent" — glows the winner's slot for the resolved trick. */
  trickWinner?: "me" | "opponent" | null;
  /** Increments when a trick resolves — fires the particle burst once. */
  trickNonce?: number;
  height?: number;
  layout?: CardLayout;
  handCardWidth?: number;
  /** Bottom safe-area inset — the canvas extends past it so cards reach the
   * true screen edge (no empty gap below the hand). */
  bottomInset?: number;
}

const CARD_ASPECT_RATIO = 5 / 7;
const PARTICLE_COUNT = 16;

const SYSTEM_FONT_FAMILY = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

interface Slot {
  x: number;
  y: number;
  angle: number;
}

function computeFan(
  total: number,
  layout: CardLayout,
  opts: { centerX: number; baseY: number; cardW: number; availWidth: number },
): Slot[] {
  const centerIndex = (total - 1) / 2;
  const edgeMargin = 10;
  const fitSpacing =
    total > 1 ? (opts.availWidth - opts.cardW - edgeMargin * 2) / (total - 1) : 0;

  if (layout === "fan") {
    const desired = opts.cardW * Math.max(0.5, 0.85 - total * 0.05) * 1.2;
    const spacing = Math.min(desired, fitSpacing);
    const tiltPerCard = Math.min(total, 8);
    return Array.from({ length: total }, (_, i) => ({
      x: opts.centerX + (i - centerIndex) * spacing,
      y: opts.baseY,
      angle: ((i - centerIndex) * tiltPerCard * Math.PI) / 180,
    }));
  }
  const desired = opts.cardW * (layout === "compact" ? 0.5 : 0.8);
  const spacing = Math.min(desired, fitSpacing);
  return Array.from({ length: total }, (_, i) => ({
    x: opts.centerX + (i - centerIndex) * spacing,
    y: opts.baseY,
    angle: 0,
  }));
}

export function GameTableSkia({
  myHand,
  playerStack,
  opponentStack,
  leadSuit,
  isMyTurn,
  disabled = false,
  selectedCard,
  onCardSelect,
  onCardDoubleTap,
  showBattle = true,
  trickWinner = null,
  trickNonce = 0,
  height: heightProp,
  layout: layoutProp,
  handCardWidth = 140,
  bottomInset = 0,
}: GameTableSkiaProps) {
  const { cardLayout } = useSettings();
  const layout = layoutProp ?? cardLayout;

  const [measured, setMeasured] = useState({ width: 0, height: 0 });
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width: w, height: h } = e.nativeEvent.layout;
    setMeasured((prev) =>
      prev.width === w && prev.height === h ? prev : { width: w, height: h },
    );
  }, []);
  const width = measured.width;
  // Extend the canvas past the bottom safe-area inset so the hand reaches the
  // true screen edge (no empty gap below it).
  const height = (measured.height || heightProp || 560) + bottomInset;

  // --- Sizes ---
  const handCardW = handCardWidth;
  const handCardH = handCardW / CARD_ASPECT_RATIO;
  const battleCardW = Math.min(86, Math.max(64, width * 0.2));
  const battleCardH = battleCardW / CARD_ASPECT_RATIO;

  // --- Regions ---
  const opponentSlotY = Math.round(height * 0.24);
  const playerSlotY = Math.round(height * 0.46);
  const slotX = width / 2;
  // Card CENTER y — cards sit low and spill a little below the canvas, like the
  // pre-Skia hand (held-in-hand look).
  const handBaseY = Math.round(height - handCardH / 2 + 28);

  // --- Hand fan ---
  const slots = useMemo(
    () =>
      width > 0
        ? computeFan(myHand.length, layout, {
            centerX: width / 2,
            baseY: handBaseY,
            cardW: handCardW,
            availWidth: width,
          })
        : [],
    [myHand.length, layout, width, handBaseY, handCardW],
  );
  const playThresholdY = Math.max(8, handBaseY - 150);

  // --- Font ---
  const handFontSize = Math.round(handCardW * 0.2);
  const battleFontSize = Math.round(battleCardW * 0.2);
  const ttfHand = useFont(
    require("@expo-google-fonts/crimson-pro/700Bold/CrimsonPro_700Bold.ttf"),
    handFontSize,
  );
  const ttfBattle = useFont(
    require("@expo-google-fonts/crimson-pro/700Bold/CrimsonPro_700Bold.ttf"),
    battleFontSize,
  );
  const handFont =
    ttfHand ??
    matchFont({ fontFamily: SYSTEM_FONT_FAMILY, fontSize: handFontSize, fontWeight: "700" });
  const battleFont =
    ttfBattle ??
    matchFont({ fontFamily: SYSTEM_FONT_FAMILY, fontSize: battleFontSize, fontWeight: "700" });

  const interactive = isMyTurn && !disabled;

  // --- Drag state ---
  const draggedIndex = useSharedValue(-1);
  const dragTx = useSharedValue(0);
  const dragTy = useSharedValue(0);
  const dragLift = useSharedValue(0);
  const dropZoneActive = useSharedValue(0);
  const isDragging = useSharedValue(0);
  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);

  // --- Selection ---
  const selectedIndex = useSharedValue(-1);
  const selectionLift = useSharedValue(0);
  const selIdx = useMemo(
    () => (selectedCard ? myHand.findIndex((c) => c.id === selectedCard.id) : -1),
    [selectedCard, myHand],
  );
  useEffect(() => {
    selectedIndex.value = selIdx;
    selectionLift.value = withTiming(selIdx === -1 ? 0 : 1, { duration: 200 });
  }, [selIdx, selectedIndex, selectionLift]);

  // --- Particle burst ---
  const burst = useSharedValue(0);
  const burstX = useSharedValue(slotX);
  const burstY = useSharedValue(playerSlotY);
  const triggerBurstHaptic = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);
  const prevNonce = useRef(trickNonce);
  useEffect(() => {
    // Only fire when a NEW trick resolves — not on mount / game resume.
    if (trickNonce <= 0 || trickNonce <= prevNonce.current) {
      prevNonce.current = trickNonce;
      return;
    }
    prevNonce.current = trickNonce;
    burstX.value = slotX;
    burstY.value = trickWinner === "opponent" ? opponentSlotY : playerSlotY;
    burst.value = 0;
    burst.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
    if (trickWinner === "me") triggerBurstHaptic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trickNonce]);

  // --- JS callbacks ---
  const handleTapCard = useCallback(
    (idx: number) => {
      if (!interactive) return;
      const card = myHand[idx];
      if (!card || !card.playable) return;
      if (selectedCard && selectedCard.id === card.id) onCardDoubleTap?.(card);
      else onCardSelect(card);
    },
    [interactive, myHand, selectedCard, onCardSelect, onCardDoubleTap],
  );
  const handlePlayDragged = useCallback(
    (idx: number) => {
      const card = myHand[idx];
      if (!card) return;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onCardDoubleTap?.(card);
    },
    [myHand, onCardDoubleTap],
  );
  const pickupHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);
  const armHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  // --- Gestures ---
  const tapGesture = Gesture.Tap()
    .maxDuration(260)
    .onEnd((e, success) => {
      "worklet";
      if (!success) return;
      let hit = -1;
      for (let i = slots.length - 1; i >= 0; i--) {
        const slot = slots[i];
        const dx = e.x - slot.x;
        const dy = e.y - slot.y;
        const cos = Math.cos(-slot.angle);
        const sin = Math.sin(-slot.angle);
        const lx = dx * cos - dy * sin;
        const ly = dx * sin + dy * cos;
        if (Math.abs(lx) <= handCardW / 2 && Math.abs(ly) <= handCardH / 2) {
          hit = i;
          break;
        }
      }
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
      let hit = -1;
      for (let i = slots.length - 1; i >= 0; i--) {
        const slot = slots[i];
        const dx = touchX.value - slot.x;
        const dy = touchY.value - slot.y;
        const cos = Math.cos(-slot.angle);
        const sin = Math.sin(-slot.angle);
        const lx = dx * cos - dy * sin;
        const ly = dx * sin + dy * cos;
        if (Math.abs(lx) <= handCardW / 2 && Math.abs(ly) <= handCardH / 2) {
          hit = i;
          break;
        }
      }
      if (hit !== -1 && myHand[hit]?.playable) {
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
      if (nextActive === 1 && dropZoneActive.value === 0) runOnJS(armHaptic)();
      dropZoneActive.value = nextActive;
    })
    .onEnd(() => {
      "worklet";
      const idx = draggedIndex.value;
      if (idx === -1) return;
      const played = dropZoneActive.value === 1;
      if (played) runOnJS(handlePlayDragged)(idx);
      dropZoneActive.value = 0;
      const cfg = { damping: 16, stiffness: 170 };
      dragTx.value = withSpring(0, cfg);
      dragTy.value = withSpring(0, cfg);
      dragLift.value = withSpring(0, cfg, (done) => {
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
    <View style={{ flex: 1, width: "100%" }} onLayout={onLayout}>
      {width > 0 && measured.height > 0 && (
        <GestureDetector gesture={composed}>
          <Canvas style={{ width, height }}>
            {showBattle && (
              <>
                {/* Empty-slot placeholders */}
                {opponentStack.length === 0 && (
                  <SlotPlaceholder
                    cx={slotX}
                    cy={opponentSlotY}
                    w={battleCardW}
                    h={battleCardH}
                  />
                )}
                {playerStack.length === 0 && (
                  <SlotPlaceholder
                    cx={slotX}
                    cy={playerSlotY}
                    w={battleCardW}
                    h={battleCardH}
                  />
                )}

                {/* Winner flash (driven by the trick burst) */}
                <BurstGlow progress={burst} x={burstX} y={burstY} size={battleCardW} />

                {/* Opponent stack (drops from top) */}
                {opponentStack.map((c, i) => (
                  <StackCardSkia
                    key={`opp-${i}-${c.suit}-${c.rank}`}
                    card={c}
                    index={i}
                    slotX={slotX}
                    slotY={opponentSlotY}
                    fromY={-battleCardH}
                    cardW={battleCardW}
                    cardH={battleCardH}
                    font={battleFont}
                  />
                ))}

                {/* Player stack (rises from the hand) */}
                {playerStack.map((c, i) => (
                  <StackCardSkia
                    key={`me-${i}-${c.suit}-${c.rank}`}
                    card={c}
                    index={i}
                    slotX={slotX}
                    slotY={playerSlotY}
                    fromY={handBaseY}
                    cardW={battleCardW}
                    cardH={battleCardH}
                    font={battleFont}
                  />
                ))}

                {/* Lead-suit hint between the slots */}
                {leadSuit && (
                  <LeadSuitMark
                    cx={slotX}
                    cy={(opponentSlotY + playerSlotY) / 2}
                    suit={leadSuit}
                    size={battleCardW * 0.34}
                  />
                )}

                <ParticleBurst progress={burst} originX={burstX} originY={burstY} />
              </>
            )}

            {/* Play line */}
            <PlayLineSkia
              width={width}
              y={playThresholdY}
              active={dropZoneActive}
              isDragging={isDragging}
            />

            {/* Hand — base layer */}
            {myHand.map((card, i) => (
              <HandCardSkia
                key={`base-${card.id}`}
                layer="base"
                index={i}
                slot={slots[i]}
                card={card}
                interactive={interactive}
                cardW={handCardW}
                cardH={handCardH}
                font={handFont}
                draggedIndex={draggedIndex}
                dragTx={dragTx}
                dragTy={dragTy}
                dragLift={dragLift}
                dropZoneActive={dropZoneActive}
                selectedIndex={selectedIndex}
                selectionLift={selectionLift}
              />
            ))}
            {/* Hand — drag layer */}
            {myHand.map((card, i) => (
              <HandCardSkia
                key={`drag-${card.id}`}
                layer="drag"
                index={i}
                slot={slots[i]}
                card={card}
                interactive={interactive}
                cardW={handCardW}
                cardH={handCardH}
                font={handFont}
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

// ───────────────────────── Card face (shared) ─────────────────────────
function CardFaceSkia({
  cardW,
  cardH,
  font,
  suit,
  rank,
}: {
  cardW: number;
  cardH: number;
  font: SkFont;
  suit: Suit;
  rank: Rank;
}) {
  const radius = cardW * 0.1;
  const suitPath = useMemo(() => makeSuitPath(suit), [suit]);
  const suitHi = useMemo(() => makeSuitHighlightPath(suit), [suit]);
  const suitColor = SUIT_COLORS[suit];
  const suitHiColor = SUIT_HIGHLIGHT[suit];
  const cornerSuitSize = cardW * 0.15;
  const centerSuitSize = cardW * 0.46;
  const padding = cardW * 0.07;
  const titleSize = Math.round(cardW * 0.2);

  return (
    <Group>
      <RoundedRect x={0} y={0} width={cardW} height={cardH} r={radius}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(cardW, cardH)}
          colors={["#FAF7F1", "#ECE6DA", "#E2DACB"]}
        />
      </RoundedRect>

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
      <RoundedRect
        x={0}
        y={0}
        width={cardW}
        height={cardH}
        r={radius}
        color="rgba(20,26,34,0.35)"
        style="stroke"
        strokeWidth={1.4}
      />

      <Group transform={[{ translateX: padding }, { translateY: padding }]}>
        <SkText x={0} y={titleSize * 0.9} text={rank} font={font} color={suitColor} />
        <Group transform={[{ translateY: titleSize + 3 }, { scale: cornerSuitSize / 100 }]}>
          <Path path={suitPath} color={suitColor} />
          <Path path={suitHi} color={suitHiColor} opacity={0.35} />
        </Group>
      </Group>

      <Group
        transform={[
          { translateX: cardW - padding },
          { translateY: cardH - padding },
          { rotate: Math.PI },
        ]}
      >
        <SkText x={0} y={titleSize * 0.9} text={rank} font={font} color={suitColor} />
        <Group transform={[{ translateY: titleSize + 3 }, { scale: cornerSuitSize / 100 }]}>
          <Path path={suitPath} color={suitColor} />
          <Path path={suitHi} color={suitHiColor} opacity={0.35} />
        </Group>
      </Group>

      <Group
        transform={[
          { translateX: cardW / 2 - centerSuitSize / 2 },
          { translateY: cardH / 2 - centerSuitSize / 2 },
          { scale: centerSuitSize / 100 },
        ]}
      >
        <Path path={suitPath} color={suitColor} />
        <Path path={suitHi} color={suitHiColor} opacity={0.4} />
      </Group>
    </Group>
  );
}

// ───────────────────────── Battle stack card ─────────────────────────
function StackCardSkia({
  card,
  index,
  slotX,
  slotY,
  fromY,
  cardW,
  cardH,
  font,
}: {
  card: PlayedCard;
  index: number;
  slotX: number;
  slotY: number;
  fromY: number;
  cardW: number;
  cardH: number;
  font: SkFont;
}) {
  // Stacked offset so multiple tricks fan out a little.
  const offX = (index - 0) * 12 - 6;
  const offRot = (index % 2 === 0 ? 1 : -1) * 0.05 * Math.min(index, 3);
  const targetX = slotX + offX;
  const targetY = slotY + index * -4;

  // Landing animation on mount.
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      40,
      withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transform = useDerivedValue(() => {
    const p = t.value;
    const x = targetX;
    const y = fromY + (targetY - fromY) * p;
    const scale = 1.25 - 0.25 * p;
    const rot = offRot * p;
    return [
      { translateX: x },
      { translateY: y },
      { rotate: rot },
      { scale },
      { translateX: -cardW / 2 },
      { translateY: -cardH / 2 },
    ];
  });
  const opacity = useDerivedValue(() => Math.min(1, t.value * 2));

  return (
    <Group transform={transform} opacity={opacity}>
      <RoundedRect
        x={0}
        y={6}
        width={cardW}
        height={cardH}
        r={cardW * 0.1}
        color="rgba(0,0,0,0.4)"
      >
        <BlurMask blur={8} style="normal" />
      </RoundedRect>
      <CardFaceSkia cardW={cardW} cardH={cardH} font={font} suit={card.suit} rank={card.rank} />
    </Group>
  );
}

// ───────────────────────── Empty slot + glow + lead suit ─────────────────────────
function SlotPlaceholder({
  cx,
  cy,
  w,
  h,
}: {
  cx: number;
  cy: number;
  w: number;
  h: number;
}) {
  return (
    <RoundedRect
      x={cx - w / 2}
      y={cy - h / 2}
      width={w}
      height={h}
      r={w * 0.1}
      color="rgba(166,130,88,0.3)"
      style="stroke"
      strokeWidth={1.5}
    />
  );
}

function BurstGlow({
  progress,
  x,
  y,
  size,
}: {
  progress: SharedValue<number>;
  x: SharedValue<number>;
  y: SharedValue<number>;
  size: number;
}) {
  // Flash that peaks early in the burst then fades.
  const opacity = useDerivedValue(() =>
    Math.sin(Math.min(progress.value, 1) * Math.PI) * 0.7,
  );
  const r = useDerivedValue(() => size * (0.6 + progress.value * 0.6));
  return (
    <Circle cx={x} cy={y} r={r} color={COLORS.or2} opacity={opacity}>
      <BlurMask blur={24} style="solid" />
    </Circle>
  );
}

function LeadSuitMark({
  cx,
  cy,
  suit,
  size,
}: {
  cx: number;
  cy: number;
  suit: Suit;
  size: number;
}) {
  const path = useMemo(() => makeSuitPath(suit), [suit]);
  const color = SUIT_COLORS[suit];
  return (
    <Group
      transform={[
        { translateX: cx - size / 2 },
        { translateY: cy - size / 2 },
        { scale: size / 100 },
      ]}
      opacity={0.55}
    >
      <Path path={path} color={color} />
    </Group>
  );
}

// ───────────────────────── Particles ─────────────────────────
function ParticleBurst({
  progress,
  originX,
  originY,
}: {
  progress: SharedValue<number>;
  originX: SharedValue<number>;
  originY: SharedValue<number>;
}) {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        angle: (i / PARTICLE_COUNT) * Math.PI * 2 + (i % 3) * 0.4,
        speed: 70 + (i % 5) * 26,
        size: 3 + (i % 3),
        color: i % 2 === 0 ? COLORS.or2 : COLORS.terre2,
      })),
    [],
  );
  return (
    <Group>
      {particles.map((p, i) => (
        <ParticleDot key={i} p={p} progress={progress} originX={originX} originY={originY} />
      ))}
    </Group>
  );
}

function ParticleDot({
  p,
  progress,
  originX,
  originY,
}: {
  p: { angle: number; speed: number; size: number; color: string };
  progress: SharedValue<number>;
  originX: SharedValue<number>;
  originY: SharedValue<number>;
}) {
  const cx = useDerivedValue(
    () => originX.value + Math.cos(p.angle) * p.speed * progress.value,
  );
  const cy = useDerivedValue(
    () =>
      originY.value +
      Math.sin(p.angle) * p.speed * progress.value +
      90 * progress.value * progress.value,
  );
  const r = useDerivedValue(() => Math.max(0, p.size * (1 - progress.value * 0.6)));
  const opacity = useDerivedValue(() =>
    progress.value > 0 && progress.value < 1 ? 1 - progress.value : 0,
  );
  return <Circle cx={cx} cy={cy} r={r} color={p.color} opacity={opacity} />;
}

// ───────────────────────── Play line ─────────────────────────
function PlayLineSkia({
  width,
  y,
  active,
  isDragging,
}: {
  width: number;
  y: number;
  active: SharedValue<number>;
  isDragging: SharedValue<number>;
}) {
  const inset = Math.min(40, width * 0.1);
  const lineW = width - inset * 2;
  const lineOpacity = useDerivedValue(
    () => isDragging.value * (0.3 + active.value * 0.6),
  );
  const lineHeight = useDerivedValue(() => 2 + active.value * 2);
  const glowOpacity = useDerivedValue(() => active.value * 0.8);
  const glowBlur = useDerivedValue(() => 10 + active.value * 16);
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

// ───────────────────────── Hand card ─────────────────────────
function HandCardSkia({
  layer,
  index,
  slot,
  card,
  interactive,
  cardW,
  cardH,
  font,
  draggedIndex,
  dragTx,
  dragTy,
  dragLift,
  dropZoneActive,
  selectedIndex,
  selectionLift,
}: {
  layer: "base" | "drag";
  index: number;
  slot: Slot;
  card: Card;
  interactive: boolean;
  cardW: number;
  cardH: number;
  font: SkFont;
  draggedIndex: SharedValue<number>;
  dragTx: SharedValue<number>;
  dragTy: SharedValue<number>;
  dragLift: SharedValue<number>;
  dropZoneActive: SharedValue<number>;
  selectedIndex: SharedValue<number>;
  selectionLift: SharedValue<number>;
}) {
  const dimmed = !interactive || !card.playable;

  const entrance = useSharedValue(layer === "base" ? 0 : 1);
  useEffect(() => {
    if (layer === "base") {
      entrance.value = withDelay(
        index * 55,
        withTiming(1, { duration: 340, easing: Easing.out(Easing.cubic) }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const opacity = useDerivedValue(() => {
    const isMe = draggedIndex.value === index;
    const base = dimmed ? 0.42 : 1;
    if (layer === "base") return (isMe ? 0 : base) * entrance.value;
    return isMe ? 1 : 0;
  }, [index, layer, dimmed]);

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
    const selLift = selectedIndex.value === index ? selectionLift.value * -34 : 0;
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
    if (layer === "drag") return dropZoneActive.value > 0.5 ? COLORS.or2 : COLORS.terre2;
    return COLORS.or2;
  }, [layer]);

  const selBorderOpacity = useDerivedValue(() => {
    return selectedIndex.value === index && layer === "base"
      ? selectionLift.value
      : 0;
  }, [index, layer]);

  const radius = cardW * 0.1;

  return (
    <Group transform={transform} opacity={opacity}>
      {/* Drop shadow */}
      <RoundedRect x={0} y={8} width={cardW} height={cardH} r={radius} color="rgba(0,0,0,0.5)">
        <BlurMask blur={12} style="normal" />
      </RoundedRect>
      {/* Glow */}
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
      <CardFaceSkia
        cardW={cardW}
        cardH={cardH}
        font={font}
        suit={card.suit}
        rank={card.rank}
      />
      {/* Selected border (animated via opacity) */}
      <RoundedRect
        x={0}
        y={0}
        width={cardW}
        height={cardH}
        r={radius}
        color={COLORS.or2}
        style="stroke"
        strokeWidth={3}
        opacity={selBorderOpacity}
      />
    </Group>
  );
}
