/**
 * Theme provider — owns the active palette and persists the user's choice.
 *
 * Starts on DEFAULT_THEME_ID (ember-royal, ≈ the legacy static palette) so the
 * very first frame matches the old look while AsyncStorage resolves. Screens
 * read the live palette via `useTheme()`.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_THEME_ID,
  THEMES,
  type Theme,
  type ThemeId,
} from "./themes";

const STORAGE_KEY = "@lamap:theme";

interface ThemeContextValue {
  theme: Theme;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  /** False until the persisted choice has been read from storage. */
  ready: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(DEFAULT_THEME_ID);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (active && stored && stored in THEMES) {
          setThemeIdState(stored as ThemeId);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const setThemeId = useCallback((id: ThemeId) => {
    setThemeIdState(id);
    AsyncStorage.setItem(STORAGE_KEY, id).catch(() => {});
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: THEMES[themeId], themeId, setThemeId, ready }),
    [themeId, setThemeId, ready],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx.theme;
}

/** Full context (theme + setter) for the settings picker. */
export function useThemeControls(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeControls must be used within a ThemeProvider");
  }
  return ctx;
}
