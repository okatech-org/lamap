const BAD_WORDS_FR_EN: readonly string[] = [
  // FR slurs / harassment
  "nègre",
  "negre",
  "négresse",
  "negresse",
  "bougnoule",
  "bicot",
  "youpin",
  "pédé",
  "pede",
  "pédale",
  "pedale",
  "tapette",
  "enculé",
  "encule",
  "salope",
  "pute",
  "putain",
  "connard",
  "connasse",
  "ntm",
  "fdp",
  "violer",
  "viol",
  "tuer",
  "crever",
  // EN slurs / harassment
  "nigger",
  "nigga",
  "faggot",
  "fag",
  "tranny",
  "retard",
  "retarded",
  "kike",
  "spic",
  "chink",
  "kys",
  "rape",
  "rapist",
  "whore",
  "slut",
  "bitch",
  "cunt",
  "motherfucker",
  "fuck you",
];

const NORMALIZED_BAD_WORDS = BAD_WORDS_FR_EN.map((w) => w.toLowerCase());

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const NORMALIZED_LIST = NORMALIZED_BAD_WORDS.map(normalize);

export function containsBadWord(text: string): boolean {
  if (!text) return false;
  const haystack = normalize(text);
  for (const term of NORMALIZED_LIST) {
    const re = new RegExp(`(^|[^\\p{L}])${escapeRegex(term)}([^\\p{L}]|$)`, "u");
    if (re.test(haystack)) return true;
  }
  return false;
}

export function maskBadWords(text: string): string {
  if (!text) return text;
  let out = text;
  for (const term of NORMALIZED_LIST) {
    const re = new RegExp(escapeRegex(term), "giu");
    out = out.replace(re, (m) => "*".repeat(m.length));
  }
  return out;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
