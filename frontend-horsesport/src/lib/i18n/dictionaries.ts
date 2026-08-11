import type { Locale } from "./config";
export type HorseSportDictionary = {
  language: string;
  chooseLanguage: string;
  primaryNavigation: string;
  mobileNavigation: string;
  openMenu: string;
  closeMenu: string;
  home: string;
  skipToContent: string;
};
const dictionaries: Record<Locale, HorseSportDictionary> = {
  en: {
    language: "Language",
    chooseLanguage: "Choose language",
    primaryNavigation: "Primary navigation",
    mobileNavigation: "Mobile navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    home: "Sarga Horse Sport home",
    skipToContent: "Skip to content",
  },
  id: {
    language: "Bahasa",
    chooseLanguage: "Pilih bahasa",
    primaryNavigation: "Navigasi utama",
    mobileNavigation: "Navigasi seluler",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
    home: "Beranda Sarga Horse Sport",
    skipToContent: "Lewati ke konten",
  },
};
export function getDictionary(locale: Locale): HorseSportDictionary {
  return dictionaries[locale];
}
