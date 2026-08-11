import type { Locale } from "./config";

export type MotorsportDictionary = {
  language: string;
  chooseLanguage: string;
  primaryNavigation: string;
  mobileNavigation: string;
  openNavigation: string;
  closeNavigation: string;
  current: string;
  open: string;
  home: string;
  skipToContent: string;
};

const dictionaries: Record<Locale, MotorsportDictionary> = {
  en: {
    language: "Language",
    chooseLanguage: "Choose language",
    primaryNavigation: "Primary navigation",
    mobileNavigation: "Mobile navigation",
    openNavigation: "Open navigation",
    closeNavigation: "Close navigation",
    current: "Current",
    open: "Open",
    home: "Sarga Motorsport home",
    skipToContent: "Skip to content",
  },
  id: {
    language: "Bahasa",
    chooseLanguage: "Pilih bahasa",
    primaryNavigation: "Navigasi utama",
    mobileNavigation: "Navigasi seluler",
    openNavigation: "Buka navigasi",
    closeNavigation: "Tutup navigasi",
    current: "Aktif",
    open: "Buka",
    home: "Beranda Sarga Motorsport",
    skipToContent: "Lewati ke konten",
  },
};

export function getDictionary(locale: Locale): MotorsportDictionary {
  return dictionaries[locale];
}
