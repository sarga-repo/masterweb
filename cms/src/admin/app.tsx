import type { StrapiApp } from "@strapi/strapi/admin";

export default {
  config: {
    // ── Brand logos ──────────────────────────────────────────────
    auth: {
      // Login page has dark background → use white reverse logo
      logo: "/uploads/logo-sarga-reverse.png",
    },
    menu: {
      // Top-left corner + collapsed sidebar → use black text logo
      logo: "/uploads/logo-sarga.png",
    },
    // NOTE: The browser-tab favicon is NOT set here. `config.head.favicon` is
    // not consumed by Strapi v5.49's admin. The favicon is served at
    // `/favicon.ico` by the `strapi::favicon` middleware from the project-root
    // `cms/favicon.png` (replaced with the Sarga mark). Restart Strapi after
    // changing that file so koa-favicon reloads it.

    // ── Locales ──────────────────────────────────────────────────
    locales: [
      // 'ar', 'fr', 'cs', 'de', 'da', 'es', 'he', 'id', 'it',
      // 'ja', 'ko', 'ms', 'nl', 'no', 'pl', 'pt-BR', 'pt',
      // 'ru', 'sk', 'sv', 'th', 'tr', 'uk', 'vi', 'zh-Hans', 'zh',
    ],

    // ── Custom translations (login page, greetings, etc.) ────────
    translations: {
      en: {
        "Auth.form.welcome.title": "Welcome to Sarga CMS",
        "Auth.form.welcome.subtitle": "Sign in to manage your content",
        "Auth.form.button.login.strapi": "Sign in",
        "app.components.LeftMenuHeader.title": "Sarga CMS",
        "app.components.HomePage.welcome": "Welcome to Sarga CMS",
        "app.components.HomePage.welcome.again": "Welcome back to Sarga CMS",
        "app.components.HomePage.ba.status.up":
          "Your Sarga CMS is running smoothly",
        "app.components.HomePage.ba.status.down":
          "Your Sarga CMS is experiencing issues",
      },
    },

    // ── Disable Strapi tutorials & release notifications ─────────
    tutorials: false,
    notifications: {
      releases: false,
    },

    // ── Design system theme tokens ───────────────────────────────
    // Sarga gateway brand colors:
    //   Red       #E2321E    Orange    #FF5032    Gold      #D9A441
    //   Black     #000B1D    Dark      #07111F    Dark-soft #434343
    //   White     #FFFFFF    Light     #F3F3F3    Muted     #CCCCCC
    theme: {
      light: {
        colors: {
          // Primary: Sarga Red / Orange accent
          primary100: "#fce8e6",
          primary200: "#f4c3bd",
          primary500: "#e2321e",
          primary600: "#c42b1a",
          primary700: "#8a1308",

          // Secondary: Sarga Gold accent
          secondary100: "#fbf3e2",
          secondary200: "#f4dfb5",
          secondary500: "#d9a441",
          secondary600: "#b8892a",
          secondary700: "#805e1c",

          // Neutral: Sarga dark/light scale
          neutral0: "#ffffff",
          neutral100: "#f3f3f3",
          neutral150: "#e8e8e8",
          neutral200: "#d9d9d9",
          neutral300: "#cccccc",
          neutral400: "#999999",
          neutral500: "#666666",
          neutral600: "#434343",
          neutral700: "#07111f",
          neutral800: "#000b1d",
          neutral900: "#000914",
          neutral1000: "#000000",

          // Semantic colors
          success100: "#e6f7e6",
          success200: "#b5e8b5",
          success500: "#2e8b2e",
          success600: "#236b23",
          success700: "#184a18",

          danger100: "#fce8e6",
          danger200: "#f4c3bd",
          danger500: "#e2321e",
          danger600: "#c42b1a",
          danger700: "#8a1308",

          warning100: "#fef3e2",
          warning200: "#fde0b5",
          warning500: "#d9a441",
          warning600: "#b8892a",
          warning700: "#805e1c",

          // Alternative: Sarga dark-soft
          alternative100: "#e8e8ea",
          alternative200: "#c5c5ca",
          alternative500: "#434343",
          alternative600: "#333333",
          alternative700: "#222222",

          // Button overrides for brand consistency
          buttonPrimary500: "#e2321e",
          buttonPrimary600: "#c42b1a",
          buttonNeutral0: "#ffffff",
          buttonNeutral100: "#f3f3f3",
          buttonNeutral200: "#d9d9d9",
          buttonNeutral300: "#cccccc",
          buttonNeutral500: "#434343",
          buttonNeutral600: "#333333",
          buttonNeutral700: "#07111f",
          buttonNeutral800: "#000b1d",
          buttonDanger500: "#e2321e",
          buttonDanger600: "#c42b1a",
          buttonSuccess500: "#2e8b2e",
          buttonSuccess600: "#236b23",
          buttonSecondary500: "#07111f",
          buttonSecondary600: "#000b1d",
        },
      },

      dark: {
        colors: {
          // Primary: Sarga Red / Orange — glow brighter on dark
          primary100: "#2a1513",
          primary200: "#3d1a16",
          primary500: "#e2321e",
          primary600: "#ff5032",
          primary700: "#f4c3bd",

          // Secondary: Sarga Gold — warmer on dark
          secondary100: "#2a2415",
          secondary200: "#3d3318",
          secondary500: "#d9a441",
          secondary600: "#e8b94d",
          secondary700: "#f4dfb5",

          // Neutral: inverted for dark surfaces
          neutral0: "#ffffff",
          neutral100: "#cccccc",
          neutral150: "#999999",
          neutral200: "#666666",
          neutral300: "#434343",
          neutral400: "#333333",
          neutral500: "#222222",
          neutral600: "#152238",
          neutral700: "#0d1a2d",
          neutral800: "#07111f",
          neutral900: "#000b1d",
          neutral1000: "#000000",

          // Semantic colors — dark variants
          success100: "#1a2e1a",
          success200: "#234623",
          success500: "#3da63d",
          success600: "#4fc84f",
          success700: "#b5e8b5",

          danger100: "#2a1513",
          danger200: "#3d1a16",
          danger500: "#e2321e",
          danger600: "#ff5032",
          danger700: "#f4c3bd",

          warning100: "#2a2415",
          warning200: "#3d3318",
          warning500: "#d9a441",
          warning600: "#e8b94d",
          warning700: "#f4dfb5",

          // Alternative
          alternative100: "#1a1d24",
          alternative200: "#2a2e38",
          alternative500: "#5a6a80",
          alternative600: "#8899aa",
          alternative700: "#cccccc",

          // Button overrides for dark
          buttonPrimary500: "#e2321e",
          buttonPrimary600: "#ff5032",
          buttonNeutral0: "#ffffff",
          buttonNeutral100: "#cccccc",
          buttonNeutral200: "#666666",
          buttonNeutral300: "#434343",
          buttonNeutral500: "#07111f",
          buttonNeutral600: "#000b1d",
          buttonNeutral700: "#ffffff",
          buttonNeutral800: "#f3f3f3",
          buttonDanger500: "#e2321e",
          buttonDanger600: "#ff5032",
          buttonSuccess500: "#3da63d",
          buttonSuccess600: "#4fc84f",
          buttonSecondary500: "#f3f3f3",
          buttonSecondary600: "#ffffff",
        },
      },
    },
  },

  bootstrap(app: StrapiApp) {
    // ── Rebrand the browser-tab title ────────────────────────────
    // Strapi hardcodes the document title as `${page} | Strapi` (and the
    // static shell title is "Strapi Admin"); neither is configurable via
    // theme/translations. Rewrite it at runtime so no "Strapi" leaks into the
    // tab / bookmarks / history.
    const BRAND = "Sarga CMS";
    const rebrandTitle = () => {
      const current = document.title;
      const next = current
        .replace(/\s*[|\-–]\s*Strapi\s*$/i, ` | ${BRAND}`)
        .replace(/^Strapi Admin$/i, BRAND)
        .replace(/^Strapi$/i, BRAND);
      if (next !== current) document.title = next;
    };
    rebrandTitle();
    const titleEl = document.querySelector("title");
    if (titleEl) {
      // Guarded rewrite (only changes when "Strapi" is present) so re-setting
      // the title inside the observer can't loop.
      new MutationObserver(rebrandTitle).observe(titleEl, { childList: true });
    }

    // Inject brand CSS for surfaces theme tokens can't reach
    // (login page background, scrollbars, typography refinements).
    const style = document.createElement("style");
    style.textContent = `
      /* ── Login page: dark premium background ─────────────── */
      [data-strapi-header="true"] {
        background: #07111f !important;
      }
      .AuthBody {
        background: linear-gradient(135deg, #000b1d 0%, #07111f 40%, #0d1a2d 100%) !important;
      }

      /* ── Login card: dark surface with subtle border ──────── */
      .AuthBox {
        background: rgba(7, 17, 31, 0.85) !important;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 16px !important;
      }

      /* ── Admin sidebar: dark surface with light text ───────── */
      [data-strapi-header="main-nav"] {
        background: #07111f !important;
        border-right: 1px solid rgba(255, 255, 255, 0.06) !important;
      }
      [data-strapi-header="main-nav"] a,
      [data-strapi-header="main-nav"] button,
      [data-strapi-header="main-nav"] span,
      [data-strapi-header="main-nav"] p {
        color: #cccccc !important;
      }

      /* ── Page header (incl. homepage "Hello {name}" greeting) ──────────
         Strapi renders every page header as a Box with data-strapi-header="true"
         (turned dark navy above). Its title <h1> (Typography variant="alpha")
         and subtitle <p> have no light color set, so they default to dark
         neutral tokens and vanish on the dark header. Force readable light text.
         The sticky-on-scroll header uses data-strapi-header-sticky with a white
         background, so it is intentionally left with its default dark text. */
      [data-strapi-header="true"] {
        border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
      }
      [data-strapi-header="true"] h1 {
        color: #ffffff !important;
      }
      [data-strapi-header="true"] p {
        color: #cccccc !important;
      }

      /* ── Custom scrollbar for premium feel ─────────────────── */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: rgba(226, 50, 30, 0.3);
        border-radius: 3px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(226, 50, 30, 0.6);
      }

      /* ── Typography: use system-ui for admin UI ────────────── */
      body {
        font-family: "Plus Jakarta Sans", "Inter", system-ui, -apple-system, sans-serif;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: "Zalando Sans Expanded", "Plus Jakarta Sans", system-ui, sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      /* ── Button polish ─────────────────────────────────────── */
      [data-strapi-button] {
        border-radius: 8px !important;
        font-weight: 600 !important;
      }

      /* ── Content card containers ────────────────────────────── */
      [data-strapi-card] {
        border-radius: 12px !important;
        border: 1px solid rgba(255, 255, 255, 0.06) !important;
      }
    `;
    document.head.appendChild(style);

    console.log("🎯 Sarga CMS admin panel booted");
  },
};
