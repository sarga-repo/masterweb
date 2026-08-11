import type { Locale } from "@/lib/i18n/config";

export type GatewayDictionary = {
  localeName: string;
  otherLocaleName: string;
  shell: Record<
    | "skipToContent"
    | "groupGateway"
    | "primaryNavigation"
    | "mobileNavigation"
    | "openMenu"
    | "menu"
    | "close"
    | "switchLanguage",
    string
  >;
  footer: Record<
    | "title"
    | "description"
    | "brandDescription"
    | "ecosystemMap"
    | "publications"
    | "newsletter"
    | "newsletterDescription"
    | "privacy"
    | "terms"
    | "location",
    string
  >;
  form: Record<
    | "emailAddress"
    | "subscribe"
    | "subscribing"
    | "subscribed"
    | "invalidEmail"
    | "unavailable"
    | "consent"
    | "name"
    | "email"
    | "phone"
    | "company"
    | "inquiryType"
    | "chooseDesk"
    | "message"
    | "messageHint"
    | "protection"
    | "routing"
    | "send"
    | "retry"
    | "inquiryUnavailable",
    string
  >;
  error: Record<
    | "notFoundEyebrow"
    | "notFoundTitle"
    | "notFoundDescription"
    | "home"
    | "errorEyebrow"
    | "errorTitle"
    | "errorDescription"
    | "retry",
    string
  >;
};

const en = {
  localeName: "English",
  otherLocaleName: "Bahasa Indonesia",
  shell: {
    skipToContent: "Skip to content",
    groupGateway: "Group Gateway",
    primaryNavigation: "Primary navigation",
    mobileNavigation: "Mobile navigation",
    openMenu: "Open menu",
    menu: "Menu",
    close: "Close",
    switchLanguage: "Switch language to Bahasa Indonesia",
  },
  footer: {
    title: "One network. Many ways in.",
    description:
      "Follow the sport, enter the venue, read the signal, or start a partnership. Sarga is designed as one connected gateway.",
    brandDescription:
      "A shared gateway for Sarga's integrated sport and entertainment ecosystem.",
    ecosystemMap: "Ecosystem Map",
    publications: "Publications",
    newsletter: "Newsletter",
    newsletterDescription:
      "Receive priority email alerts concerning championship ticket launches, stable entries, and corporate reports.",
    privacy: "Privacy",
    terms: "Terms",
    location: "Jakarta / Indonesia",
  },
  form: {
    emailAddress: "Email address",
    subscribe: "Subscribe to the newsletter",
    subscribing: "Subscribing…",
    subscribed: "You are subscribed.",
    invalidEmail: "Please enter a valid email address.",
    unavailable: "Subscription is temporarily unavailable.",
    consent:
      "I agree to receive Sarga news and event updates. Optional; you can unsubscribe at any time.",
    name: "Name",
    email: "Email",
    phone: "Phone",
    company: "Company",
    inquiryType: "Inquiry type",
    chooseDesk: "Choose the most relevant desk",
    message: "Message",
    messageHint:
      "Share enough context for us to route your inquiry accurately.",
    protection:
      "Protected by rate limiting, a timing check, and a honeypot. An approved reCAPTCHA adapter can be enabled through server configuration.",
    routing: "Routing inquiry…",
    send: "Send inquiry",
    retry: "Please try again.",
    inquiryUnavailable: "The inquiry desk is temporarily unavailable.",
  },
  error: {
    notFoundEyebrow: "Route not found",
    notFoundTitle: "This page has left the grid.",
    notFoundDescription:
      "The destination may have moved, or the link is no longer active.",
    home: "Return home",
    errorEyebrow: "Temporary interruption",
    errorTitle: "The signal dropped.",
    errorDescription: "Please retry the page or return to the Sarga gateway.",
    retry: "Try again",
  },
} satisfies GatewayDictionary;

const id = {
  localeName: "Bahasa Indonesia",
  otherLocaleName: "English",
  shell: {
    skipToContent: "Lewati ke konten",
    groupGateway: "Gerbang Grup",
    primaryNavigation: "Navigasi utama",
    mobileNavigation: "Navigasi seluler",
    openMenu: "Buka menu",
    menu: "Menu",
    close: "Tutup",
    switchLanguage: "Ganti bahasa ke English",
  },
  footer: {
    title: "Satu jaringan. Banyak jalan masuk.",
    description:
      "Ikuti olahraga, masuki venue, baca kabar terbaru, atau mulai kemitraan. Sarga dirancang sebagai satu gerbang yang terhubung.",
    brandDescription:
      "Gerbang bersama untuk ekosistem olahraga dan hiburan terpadu Sarga.",
    ecosystemMap: "Peta Ekosistem",
    publications: "Publikasi",
    newsletter: "Buletin",
    newsletterDescription:
      "Terima pemberitahuan prioritas tentang peluncuran tiket kejuaraan, entri stable, dan laporan perusahaan.",
    privacy: "Privasi",
    terms: "Ketentuan",
    location: "Jakarta / Indonesia",
  },
  form: {
    emailAddress: "Alamat email",
    subscribe: "Berlangganan buletin",
    subscribing: "Mendaftarkan…",
    subscribed: "Anda telah berlangganan.",
    invalidEmail: "Masukkan alamat email yang valid.",
    unavailable: "Layanan berlangganan sementara tidak tersedia.",
    consent:
      "Saya setuju menerima berita dan informasi acara Sarga. Opsional; Anda dapat berhenti berlangganan kapan saja.",
    name: "Nama",
    email: "Email",
    phone: "Telepon",
    company: "Perusahaan",
    inquiryType: "Jenis pertanyaan",
    chooseDesk: "Pilih bagian yang paling sesuai",
    message: "Pesan",
    messageHint:
      "Berikan konteks yang cukup agar pertanyaan dapat kami arahkan dengan tepat.",
    protection:
      "Dilindungi pembatasan permintaan, pemeriksaan waktu, dan honeypot. Adaptor reCAPTCHA yang disetujui dapat diaktifkan melalui konfigurasi server.",
    routing: "Mengirim pertanyaan…",
    send: "Kirim pertanyaan",
    retry: "Silakan coba lagi.",
    inquiryUnavailable: "Layanan pertanyaan sementara tidak tersedia.",
  },
  error: {
    notFoundEyebrow: "Halaman tidak ditemukan",
    notFoundTitle: "Halaman ini telah meninggalkan lintasan.",
    notFoundDescription:
      "Tujuan mungkin telah dipindahkan atau tautan sudah tidak aktif.",
    home: "Kembali ke beranda",
    errorEyebrow: "Gangguan sementara",
    errorTitle: "Sinyal terputus.",
    errorDescription:
      "Silakan muat ulang halaman atau kembali ke gerbang Sarga.",
    retry: "Coba lagi",
  },
} satisfies GatewayDictionary;

export function getDictionary(locale: Locale): GatewayDictionary {
  return locale === "id" ? id : en;
}
