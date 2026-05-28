import { FONT_WEIGHTS, THEME_META, useThemeControls } from "@/design";
import { Pressable, StyleSheet, Text, View } from "react-native";

/**
 * 2×2 palette picker — mirrors `ThemeSwatches` from `LaMap Arcade.html`.
 * Tapping a card switches (and persists) the active theme app-wide.
 */
export function ThemePicker() {
  const { themeId, setThemeId, theme } = useThemeControls();

  return (
    <View style={styles.grid}>
      {THEME_META.map((meta) => {
        const active = meta.id === themeId;
        return (
          <Pressable
            key={meta.id}
            onPress={() => setThemeId(meta.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Thème ${meta.label}`}
            style={[
              styles.card,
              {
                borderColor: active ? theme.goldBright : "rgba(255,255,255,0.08)",
                backgroundColor: active
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.02)",
              },
            ]}
          >
            <View style={styles.swatches}>
              {meta.swatches.map((c, i) => (
                <View key={i} style={[styles.swatch, { backgroundColor: c }]} />
              ))}
            </View>
            <View>
              <Text style={styles.label}>{meta.label}</Text>
              <Text style={styles.sub}>{meta.sub}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  card: {
    flexBasis: "47%",
    flexGrow: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  swatches: {
    flexDirection: "row",
    gap: 4,
  },
  swatch: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  label: {
    fontFamily: FONT_WEIGHTS.display.semibold,
    fontSize: 13,
    color: "#fff",
    lineHeight: 16,
  },
  sub: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
  },
});
