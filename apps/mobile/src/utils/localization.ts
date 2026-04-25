import { getLocales } from 'expo-localization';

/**
 * Auto-detect user's country from their device settings
 * @returns The ISO country code (e.g., "FR", "CM", "US")
 */
export function getAutoDetectedCountry(): string {
  const locales = getLocales();
  return locales[0]?.regionCode || 'FR'; // Fallback to France if unavailable
}

/**
 * Auto-detect user's locale from their device settings
 * @returns The locale string (e.g., "fr-FR", "en-US")
 */
export function getAutoDetectedLocale(): string {
  const locales = getLocales();
  return locales[0]?.languageTag || 'fr-FR'; // Fallback to French
}
