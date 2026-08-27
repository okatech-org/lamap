import { COLORS } from "@/design";
import { PAPER_TEXTURE_SOURCE } from "./paper-texture";
import {
  BlurMask,
  Canvas,
  Group,
  Image as SkImage,
  LinearGradient,
  Path,
  RoundedRect,
  Skia,
  Text as SkText,
  matchFont,
  rect,
  rrect,
  useFont,
  useImage,
  vec,
} from "@shopify/react-native-skia";
import React, { useEffect, useMemo } from "react";
import { Platform, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Rank = "3" | "4" | "5" | "6" | "7" | "8" | "9";
type CardState = "playable" | "disabled" | "selected" | "played";
type CardFace = "front" | "back";

interface PlayingCardSkiaProps {
  suit: Suit;
  rank: Rank;
  state: CardState;
  face?: CardFace;
  onPress?: () => void;
  size?: "small" | "medium" | "large" | "xl" | "xxl" | "2xl";
}

const CARD_ASPECT_RATIO = 5 / 7;

const CARD_WIDTHS: Record<NonNullable<PlayingCardSkiaProps["size"]>, number> = {
  small: 60,
  medium: 80,
  large: 100,
  xl: 120,
  xxl: 140,
  "2xl": 160,
};

export const SUIT_COLORS: Record<Suit, string> = {
  spades: COLORS.ink,
  clubs: COLORS.ink,
  hearts: COLORS.terre2,
  diamonds: COLORS.terre2,
};

export const SUIT_HIGHLIGHT: Record<Suit, string> = {
  spades: "#3A3A3A",
  clubs: "#3A3A3A",
  hearts: "#9A314A",
  diamonds: "#9A314A",
};

// Suit paths normalized to a 100×100 viewBox (origin top-left, matches the
// SVG assets in assets/images/suit_*.svg with their translate baked in).
export function makeSuitPath(suit: Suit) {
  switch (suit) {
    case "spades": {
      const p = Skia.Path.MakeFromSVGString(
        "M50 10 C38 28 18 40 18 64 C18 80 33 88 50 76 C67 88 82 80 82 64 C82 40 62 28 50 10 Z M50 72 L38 98 Q50 88 62 98 Z",
      );
      return p ?? Skia.Path.Make();
    }
    case "hearts": {
      const p = Skia.Path.MakeFromSVGString(
        "M50 42 C44 22 15 22 15 48 C15 72 50 95 50 95 C50 95 85 72 85 48 C85 22 56 22 50 42 Z",
      );
      return p ?? Skia.Path.Make();
    }
    case "diamonds": {
      const p = Skia.Path.MakeFromSVGString("M50 5 L78 50 L50 95 L22 50 Z");
      return p ?? Skia.Path.Make();
    }
    case "clubs": {
      const p = Skia.Path.Make();
      p.addCircle(50, 25, 18);
      p.addCircle(33, 49, 18);
      p.addCircle(67, 49, 18);
      const tail = Skia.Path.MakeFromSVGString("M50 60 L38 93 Q50 83 62 93 Z");
      if (tail) p.addPath(tail);
      return p;
    }
  }
}

export function makeSuitHighlightPath(suit: Suit) {
  // Subtle "reflet" — mirrors the small ellipse/circle highlights in the SVG assets.
  switch (suit) {
    case "spades":
    case "hearts": {
      // ellipse cx=-10/−12 cy=-5/-10 — we approximate with a path.
      const p = Skia.Path.Make();
      p.addOval(Skia.XYWHRect(30, 30, 18, 22));
      return p;
    }
    case "diamonds": {
      const p = Skia.Path.MakeFromSVGString("M50 20 L35 50 L50 58 Z");
      return p ?? Skia.Path.Make();
    }
    case "clubs": {
      const p = Skia.Path.Make();
      p.addCircle(46, 20, 6);
      p.addCircle(29, 45, 5);
      p.addCircle(63, 45, 5);
      return p;
    }
  }
}

// Lightweight system font fallback so the POC works without bundling extra TTFs.
const SYSTEM_FONT_FAMILY = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

export const PlayingCardSkia = React.memo(function PlayingCardSkia({
  suit,
  rank,
  state,
  face = "front",
  onPress,
  size = "xl",
}: PlayingCardSkiaProps) {
  const cardWidth = CARD_WIDTHS[size];
  const cardHeight = cardWidth / CARD_ASPECT_RATIO;
  const radius = cardWidth * 0.1;
  const padding = cardWidth * 0.06;

  // Halo padding — the Canvas extends beyond the card so the blur can spill out.
  const HALO_PAD = Math.round(cardWidth * 0.35);
  const canvasW = cardWidth + HALO_PAD * 2;
  const canvasH = cardHeight + HALO_PAD * 2;

  const isPlayable = state === "playable" || state === "selected";
  const isSelected = state === "selected";
  const isFront = face === "front";

  // --- Fonts ---
  const titleFontSize = Math.round(cardWidth * 0.22);
  const titleFont = useFont(
    require("@expo-google-fonts/crimson-pro/700Bold/CrimsonPro_700Bold.ttf"),
    titleFontSize,
  );
  const fallbackFont = useMemo(
    () =>
      matchFont({
        fontFamily: SYSTEM_FONT_FAMILY,
        fontSize: titleFontSize,
        fontWeight: "700",
      }),
    [titleFontSize],
  );
  const font = titleFont ?? fallbackFont;
  const paperTexture = useImage(PAPER_TEXTURE_SOURCE);

  // --- Animated values ---
  const tiltX = useSharedValue(0); // −1 .. 1 (touch X normalized)
  const tiltY = useSharedValue(0);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(isPlayable ? 1 : 0);
  const glowRadius = useSharedValue(isSelected ? 24 : 14);
  const flipProgress = useSharedValue(isFront ? 0 : 180);
  const entranceY = useSharedValue(40);
  const entranceOpacity = useSharedValue(0);

  // Entrance
  useEffect(() => {
    entranceOpacity.value = withTiming(1, { duration: 250 });
    entranceY.value = withSpring(0, { damping: 18, stiffness: 160 });
  }, [entranceOpacity, entranceY]);

  // State → glow + scale
  useEffect(() => {
    cancelAnimation(glowOpacity);
    cancelAnimation(glowRadius);
    cancelAnimation(scale);

    if (isSelected) {
      scale.value = withSpring(1.06, { damping: 14, stiffness: 200 });
      glowOpacity.value = withTiming(1, { duration: 180 });
      glowRadius.value = withTiming(28, { duration: 220 });
    } else if (state === "playable") {
      scale.value = withSpring(1, { damping: 16, stiffness: 180 });
      // breathing pulse on glow
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.55, {
            duration: 1100,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
      );
      glowRadius.value = withRepeat(
        withSequence(
          withTiming(12, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
          withTiming(22, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
      );
    } else {
      scale.value = withSpring(1, { damping: 18, stiffness: 200 });
      glowOpacity.value = withTiming(0, { duration: 200 });
      glowRadius.value = withTiming(10, { duration: 200 });
    }
  }, [isSelected, state, scale, glowOpacity, glowRadius]);

  // Flip face changes
  useEffect(() => {
    flipProgress.value = withTiming(isFront ? 0 : 180, {
      duration: 520,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [isFront, flipProgress]);

  // --- 3D wrapper transform ---
  const wrapperStyle = useAnimatedStyle(() => {
    const rotY = tiltX.value * 12 + flipProgress.value;
    const rotX = -tiltY.value * 12;
    return {
      opacity: entranceOpacity.value,
      transform: [
        { perspective: 900 },
        { translateY: entranceY.value },
        { scale: scale.value },
        { rotateX: `${rotX}deg` },
        { rotateY: `${rotY}deg` },
      ],
    };
  });

  // Hide the face when flipped past 90° (and reveal back via separate sibling).
  const frontVisibility = useAnimatedStyle(() => ({
    opacity: flipProgress.value <= 90 ? 1 : 0,
  }));
  const backVisibility = useAnimatedStyle(() => ({
    opacity: flipProgress.value > 90 ? 1 : 0,
    transform: [{ rotateY: "180deg" }],
  }));

  // --- Skia-derived values for the holographic sheen ---
  const sheenStart = useDerivedValue(() =>
    vec(
      HALO_PAD + cardWidth * (0.5 + tiltX.value * 0.55),
      HALO_PAD + cardHeight * (0.5 + tiltY.value * 0.55),
    ),
  );
  const sheenEnd = useDerivedValue(() =>
    vec(
      HALO_PAD + cardWidth * (0.5 - tiltX.value * 0.55),
      HALO_PAD + cardHeight * (0.5 - tiltY.value * 0.55),
    ),
  );

  // --- Gesture (free tilt) ---
  const tiltGesture = Gesture.Pan()
    .onChange((e) => {
      "worklet";
      const nx = (e.x - cardWidth / 2) / (cardWidth / 2);
      const ny = (e.y - cardHeight / 2) / (cardHeight / 2);
      tiltX.value = Math.max(-1, Math.min(1, nx));
      tiltY.value = Math.max(-1, Math.min(1, ny));
    })
    .onFinalize(() => {
      "worklet";
      tiltX.value = withSpring(0, { damping: 12, stiffness: 90 });
      tiltY.value = withSpring(0, { damping: 12, stiffness: 90 });
    });

  // Suit paths (memoized)
  const suitPath = useMemo(() => makeSuitPath(suit), [suit]);
  const suitHighlightPath = useMemo(() => makeSuitHighlightPath(suit), [suit]);
  const suitColor = SUIT_COLORS[suit];
  const suitHighlight = SUIT_HIGHLIGHT[suit];

  const glowColor = isSelected ? COLORS.or2 : COLORS.terre2;

  // Card body rect inside the canvas (offset by halo padding)
  const bodyX = HALO_PAD;
  const bodyY = HALO_PAD;

  // Corner element sizes
  const cornerSuitSize = cardWidth * 0.16;
  const centerSuitSize = cardWidth * 0.55;
  const rankText = rank;

  const wrapper = (
    <Animated.View
      style={[
        {
          width: cardWidth,
          height: cardHeight,
        },
        wrapperStyle,
      ]}
    >
      {/* FRONT */}
      <Animated.View
        style={[
          {
            position: "absolute",
            left: -HALO_PAD,
            top: -HALO_PAD,
            width: canvasW,
            height: canvasH,
            backfaceVisibility: "hidden",
          },
          frontVisibility,
        ]}
      >
        <Canvas style={{ width: canvasW, height: canvasH }}>
          {/* Outer glow halo */}
          <RoundedRect
            x={bodyX - 4}
            y={bodyY - 4}
            width={cardWidth + 8}
            height={cardHeight + 8}
            r={radius + 4}
            color={glowColor}
            opacity={glowOpacity}
          >
            <BlurMask blur={glowRadius} style="solid" />
          </RoundedRect>

          {/* Drop shadow under the card body */}
          <RoundedRect
            x={bodyX}
            y={bodyY + 6}
            width={cardWidth}
            height={cardHeight}
            r={radius}
            color="rgba(0,0,0,0.55)"
          >
            <BlurMask blur={14} style="normal" />
          </RoundedRect>

          {/* Card body — cream gradient */}
          <RoundedRect
            x={bodyX}
            y={bodyY}
            width={cardWidth}
            height={cardHeight}
            r={radius}
          >
            <LinearGradient
              start={vec(bodyX, bodyY)}
              end={vec(bodyX + cardWidth, bodyY + cardHeight)}
              colors={[COLORS.cream, COLORS.cream2, "#CBB99F"]}
            />
          </RoundedRect>

          {/* Cotton-paper grain + holographic sheen (moves with tilt) */}
          <Group
            clip={rrect(
              rect(bodyX, bodyY, cardWidth, cardHeight),
              radius,
              radius,
            )}
          >
            {paperTexture && (
              <SkImage
                image={paperTexture}
                x={bodyX}
                y={bodyY}
                width={cardWidth}
                height={cardHeight}
                fit="cover"
                opacity={0.32}
              />
            )}
            <RoundedRect
              x={bodyX}
              y={bodyY}
              width={cardWidth}
              height={cardHeight}
              r={radius}
            >
              <LinearGradient
                start={sheenStart}
                end={sheenEnd}
                colors={[
                  "rgba(255,255,255,0)",
                  "rgba(255,255,255,0.45)",
                  "rgba(125,30,50,0.18)",
                  "rgba(201,165,95,0.32)",
                  "rgba(255,255,255,0)",
                ]}
                positions={[0, 0.35, 0.5, 0.65, 1]}
              />
            </RoundedRect>
          </Group>

          {/* Inner gold accent border */}
          <RoundedRect
            x={bodyX + 3}
            y={bodyY + 3}
            width={cardWidth - 6}
            height={cardHeight - 6}
            r={radius - 2}
            color="rgba(201,165,95,0.45)"
            style="stroke"
            strokeWidth={1}
          />

          {/* Outer border */}
          <RoundedRect
            x={bodyX}
            y={bodyY}
            width={cardWidth}
            height={cardHeight}
            r={radius}
            color={isSelected ? COLORS.or2 : "rgba(33,23,18,0.35)"}
            style="stroke"
            strokeWidth={isSelected ? 2.5 : 1.2}
          />

          {/* TOP-LEFT corner */}
          <Group
            transform={[
              { translateX: bodyX + padding },
              { translateY: bodyY + padding },
            ]}
          >
            <SkText
              x={0}
              y={titleFontSize * 0.9}
              text={rankText}
              font={font}
              color={suitColor}
            />
            <Group
              transform={[
                { translateY: titleFontSize + 2 },
                { scale: cornerSuitSize / 100 },
              ]}
            >
              <Path path={suitPath} color={suitColor} />
              <Path
                path={suitHighlightPath}
                color={suitHighlight}
                opacity={0.35}
              />
            </Group>
          </Group>

          {/* BOTTOM-RIGHT corner (rotated 180°) */}
          <Group
            transform={[
              { translateX: bodyX + cardWidth - padding },
              { translateY: bodyY + cardHeight - padding },
              { rotate: Math.PI },
            ]}
          >
            <SkText
              x={0}
              y={titleFontSize * 0.9}
              text={rankText}
              font={font}
              color={suitColor}
            />
            <Group
              transform={[
                { translateY: titleFontSize + 2 },
                { scale: cornerSuitSize / 100 },
              ]}
            >
              <Path path={suitPath} color={suitColor} />
              <Path
                path={suitHighlightPath}
                color={suitHighlight}
                opacity={0.35}
              />
            </Group>
          </Group>

          {/* CENTER large suit */}
          <Group
            transform={[
              { translateX: bodyX + cardWidth / 2 - centerSuitSize / 2 },
              { translateY: bodyY + cardHeight / 2 - centerSuitSize / 2 },
              { scale: centerSuitSize / 100 },
            ]}
          >
            <Path path={suitPath} color={suitColor} />
            <Path
              path={suitHighlightPath}
              color={suitHighlight}
              opacity={0.4}
            />
          </Group>
        </Canvas>
      </Animated.View>

      {/* BACK */}
      <Animated.View
        style={[
          {
            position: "absolute",
            left: -HALO_PAD,
            top: -HALO_PAD,
            width: canvasW,
            height: canvasH,
            backfaceVisibility: "hidden",
          },
          backVisibility,
        ]}
      >
        <Canvas style={{ width: canvasW, height: canvasH }}>
          {/* Same drop shadow */}
          <RoundedRect
            x={bodyX}
            y={bodyY + 6}
            width={cardWidth}
            height={cardHeight}
            r={radius}
            color="rgba(0,0,0,0.55)"
          >
            <BlurMask blur={14} style="normal" />
          </RoundedRect>

          {/* Deep burgundy body */}
          <RoundedRect
            x={bodyX}
            y={bodyY}
            width={cardWidth}
            height={cardHeight}
            r={radius}
          >
            <LinearGradient
              start={vec(bodyX, bodyY)}
              end={vec(bodyX + cardWidth, bodyY + cardHeight)}
              colors={["#7D1E32", "#5B1525", "#3A0D18"]}
            />
          </RoundedRect>

          {/* Diagonal sheen */}
          <Group
            clip={rrect(
              rect(bodyX, bodyY, cardWidth, cardHeight),
              radius,
              radius,
            )}
          >
            {paperTexture && (
              <SkImage
                image={paperTexture}
                x={bodyX}
                y={bodyY}
                width={cardWidth}
                height={cardHeight}
                fit="cover"
                opacity={0.12}
              />
            )}
            <RoundedRect
              x={bodyX}
              y={bodyY}
              width={cardWidth}
              height={cardHeight}
              r={radius}
            >
              <LinearGradient
                start={sheenStart}
                end={sheenEnd}
                colors={[
                  "rgba(255,255,255,0)",
                  "rgba(201,165,95,0.4)",
                  "rgba(255,255,255,0)",
                ]}
              />
            </RoundedRect>
          </Group>

          {/* Gold border */}
          <RoundedRect
            x={bodyX + 4}
            y={bodyY + 4}
            width={cardWidth - 8}
            height={cardHeight - 8}
            r={radius - 3}
            color="rgba(201,165,95,0.6)"
            style="stroke"
            strokeWidth={1.5}
          />
        </Canvas>
      </Animated.View>
    </Animated.View>
  );

  const composedGesture = onPress
    ? Gesture.Simultaneous(
        tiltGesture,
        Gesture.Tap().onEnd((_e, success) => {
          if (success) onPress();
        }),
      )
    : tiltGesture;

  return (
    <View style={{ width: cardWidth, height: cardHeight }}>
      <GestureDetector gesture={composedGesture}>{wrapper}</GestureDetector>
    </View>
  );
});
