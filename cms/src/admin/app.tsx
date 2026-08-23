import type { StrapiApp } from "@strapi/strapi/admin";
import { APPROVED_MOTORSPORT_PREVIEW_UIDS } from "../preview/preview-path";

function WorkspaceIcon() {
  return (
    <img
      src="/uploads/logo-sarga-motorsport-symbol-sport.png"
      alt=""
      width="20"
      height="20"
      style={{ display: "block", objectFit: "contain" }}
    />
  );
}

function MotorsportWorkspaceIcon() {
  return (
    <img
      src="/admin-assets/logo-sarga-motorsport-full.png"
      alt=""
      width="20"
      height="20"
      style={{ display: "block", objectFit: "contain" }}
    />
  );
}

function SargaWorkspaceIcon() {
  return (
    <img
      src="/admin-assets/logo-sarga-icon.png"
      alt=""
      width="28"
      height="28"
      style={{ display: "block", objectFit: "contain" }}
    />
  );
}

function MotorsportMailIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Z" />
      <path d="m4 6 8 6 8-6" />
      <path d="M8 16h8" />
    </svg>
  );
}

export default {
  config: {
    // ── Brand logos ──────────────────────────────────────────────
    auth: {
      // Login page has dark background → use white reverse logo
      logo: "/uploads/logo-sarga.png",
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
          // Primary: Sarga Red / Orange - glow brighter on dark
          primary100: "#2a1513",
          primary200: "#3d1a16",
          primary500: "#e2321e",
          primary600: "#ff5032",
          primary700: "#f4c3bd",

          // Secondary: Sarga Gold - warmer on dark
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

          // Semantic colors - dark variants
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

  register(app: StrapiApp) {
    const workspaces = [
      {
        slug: "gateway",
        label: "Sarga Gateway",
        position: 1,
        action: "admin::sarga-workspaces.access-gateway",
      },
      {
        slug: "motorsport",
        label: "Sarga Motorsport",
        position: 2,
        action: "admin::sarga-workspaces.access-motorsport",
      },
      {
        slug: "horsesport",
        label: "Sarga Horse Sport",
        position: 3,
        action: "admin::sarga-workspaces.access-horsesport",
      },
      {
        slug: "shared",
        label: "Shared Library",
        position: 4,
        action: "admin::sarga-workspaces.access-shared",
      },
    ];

    for (const workspace of workspaces) {
      app.addMenuLink({
        to: `sarga-workspaces/${workspace.slug}`,
        icon:
          workspace.slug === "motorsport"
            ? MotorsportWorkspaceIcon
            : SargaWorkspaceIcon,
        intlLabel: {
          id: `sarga-workspaces.${workspace.slug}.label`,
          defaultMessage: workspace.label,
        },
        Component: () => import("./extensions/sarga-workspaces/WorkspacePage"),
        permissions: [{ action: workspace.action, subject: null }],
        position: workspace.position,
      });
    }

    app.addMenuLink({
      to: "sarga-motorsport-mail-settings",
      icon: MotorsportMailIcon,
      intlLabel: {
        id: "sarga-mail-settings.motorsport.label",
        defaultMessage: "Motorsport SMTP Mail",
      },
      Component: () =>
        import("./extensions/sarga-mail-settings/MotorsportMailSettingsPage"),
      permissions: [
        {
          action: "admin::sarga-mail-settings.read",
          subject: null,
        },
      ],
      position: 5,
    });

    app.router.addRoute({
      path: "sarga-motorsport-live-preview/*",
      lazy: async () => {
        const module = await import(
          "./extensions/motorsport-live-preview/MotorsportLivePreviewPage"
        );
        return { Component: module.default };
      },
    });
  },

  bootstrap(app: StrapiApp) {
    // Strapi's native Preview card remains the entry point. Supported
    // Motorsport Single Types and collection entries open the dedicated
    // split-view workspace in a separate window, leaving the editor intact.
    const motorsportPreviewUids = new Set(APPROVED_MOTORSPORT_PREVIEW_UIDS);
    const getPreviewTarget = (href: string | null) => {
      if (!href) return null;

      const url = new URL(href, window.location.origin);
      const match = url.pathname.match(
        /\/content-manager\/(single-types|collection-types)\/([^/]+)(?:\/([^/]+))?\/preview$/,
      );
      if (!match) return null;

      const contentType = match[1];
      const uid = decodeURIComponent(match[2]);
      const documentId = match[3] ? decodeURIComponent(match[3]) : null;
      if (!motorsportPreviewUids.has(uid)) return null;
      if (contentType === "collection-types" && !documentId) return null;

      const locale = url.searchParams.get("plugins[i18n][locale]") ?? "en";
      const destinationParams = new URLSearchParams({
        uid,
        locale,
        // Strapi admin HTML can be cached by the staging edge. Give each
        // preview session a fresh URL so an updated CSP is not hidden behind
        // an older cached response that cannot frame the CMS editor.
        previewSession: Date.now().toString(36),
      });
      if (documentId) destinationParams.set("documentId", documentId);
      return {
        uid,
        locale,
        documentId,
        destination: `/admin/sarga-motorsport-live-preview?${destinationParams.toString()}`,
      };
    };
    const openPreviewInCurrentTab = (destination: string) => {
      window.location.assign(destination);
    };
    const wireMotorsportPreviewLinks = () => {
      document
        .querySelectorAll<HTMLAnchorElement>(
          'a[href*="/content-manager/"][href*="/preview"]',
        )
        .forEach((link) => {
          const target = getPreviewTarget(link.getAttribute("href"));
          if (!target) return;

          // Replace Strapi's native anchor so its own preview action cannot
          // navigate the editor in parallel with the custom workspace.
          const previewControl = document.createElement("button");
          previewControl.type = "button";
          previewControl.className = link.className;
          previewControl.style.cssText = link.style.cssText;
          previewControl.innerHTML = link.innerHTML;
          link.replaceWith(previewControl);
          previewControl.dataset.sargaIntegratedPreview = "true";
          previewControl.dataset.sargaIntegratedPreviewDestination =
            target.destination;
          previewControl.setAttribute(
            "aria-label",
            `Open side-by-side preview for ${target.uid}`,
          );
          if (!previewControl.dataset.sargaPreviewTargetHandlerBound) {
            const handleTargetActivation = (event: Event) => {
              event.preventDefault();
              event.stopImmediatePropagation();

              if (event.type === "click") {
                openPreviewInCurrentTab(target.destination);
                return;
              }

              if (
                event.type === "keydown" &&
                ((event as KeyboardEvent).key === "Enter" ||
                  (event as KeyboardEvent).key === " ")
              ) {
                openPreviewInCurrentTab(target.destination);
              }
            };
            for (const eventType of [
              "pointerdown",
              "mousedown",
              "pointerup",
              "mouseup",
              "click",
              "auxclick",
              "contextmenu",
              "keydown",
            ] as const) {
              previewControl.addEventListener(
                eventType,
                handleTargetActivation,
                true,
              );
            }
            previewControl.dataset.sargaPreviewTargetHandlerBound = "true";
          }
        });
    };
    const previewLinkObserver = new MutationObserver(wireMotorsportPreviewLinks);
    previewLinkObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href"],
    });
    wireMotorsportPreviewLinks();
    if (!document.documentElement.dataset.sargaPreviewInterceptorBound) {
      const interceptPreviewActivation = (event: Event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;

        const link = target.closest<HTMLAnchorElement>(
          'a[data-sarga-integrated-preview="true"]',
        );
        const destination = link?.dataset.sargaIntegratedPreviewDestination;
        if (!destination) return;

        if (
          event.type === "pointerdown" ||
          event.type === "mousedown" ||
          event.type === "pointerup" ||
          event.type === "mouseup" ||
          event.type === "auxclick" ||
          event.type === "contextmenu" ||
          event.type === "click"
        ) {
          event.preventDefault();
          event.stopImmediatePropagation();
          if (event.type === "click") {
            openPreviewInCurrentTab(destination);
          }
          return;
        }

        if (event.type === "keydown") {
          const keyboardActivation =
            (event as KeyboardEvent).key === "Enter" ||
            (event as KeyboardEvent).key === " ";
          if (!keyboardActivation) return;

          event.preventDefault();
          event.stopImmediatePropagation();
          openPreviewInCurrentTab(destination);
          return;
        }
      };

      for (const eventType of [
        "pointerdown",
        "mousedown",
        "pointerup",
        "mouseup",
        "click",
        "auxclick",
        "contextmenu",
        "keydown",
      ] as const) {
        window.addEventListener(eventType, interceptPreviewActivation, true);
      }
      document.documentElement.dataset.sargaPreviewInterceptorBound = "true";
    }

    // Keep admin shell mode consistent across users and device preferences.
    // Strapi resolves "system" from prefers-color-scheme during initialization.
    if (window.localStorage.getItem("STRAPI_THEME") !== "light") {
      window.localStorage.setItem("STRAPI_THEME", "light");
      window.location.reload();
      return;
    }

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

    // Strapi opens an asset's details when its preview is clicked, while the
    // small checkbox is the control that actually selects an existing asset.
    // Keep the shared Media Library least-privilege and make that distinction
    // explicit inside every Content Manager media picker.
    let mediaPickerFrame: number | null = null;
    const addMediaPickerGuidance = () => {
      mediaPickerFrame = null;
      document
        .querySelectorAll<HTMLElement>('[role="dialog"]')
        .forEach((dialog) => {
          // Use structural hooks only. Text matching breaks localized admin UI.
          const tabList = dialog.querySelector('[role="tablist"]');
          const anchor = tabList?.parentElement;
          const hasUploadControl = dialog.querySelector(
            'input[type="file"], [data-strapi-upload="true"]',
          );
          if (
            !anchor ||
            !hasUploadControl ||
            dialog.querySelector('[data-sarga-media-picker-help="true"]')
          ) {
            return;
          }

          const guidance = document.createElement("div");
          guidance.dataset.sargaMediaPickerHelp = "true";
          guidance.setAttribute("role", "note");
          guidance.style.cssText = [
            "margin: 0 2rem",
            "padding: 0.85rem 1rem",
            "border: 1px solid #f4c3bd",
            "border-left: 4px solid #e2321e",
            "border-radius: 0.5rem",
            "background: #fff7f5",
            "color: #32324d",
            "font-size: 0.875rem",
            "line-height: 1.5",
          ].join(";");
          const strong = document.createElement("strong");
          strong.textContent = "Selecting an existing asset: ";
          guidance.append(strong);
          guidance.append(
            "use the checkbox at the upper-left of its card, then choose Finish. Clicking the preview opens asset details only.",
          );
          anchor.after(guidance);
        });
    };
    const scheduleMediaPickerGuidance = () => {
      if (mediaPickerFrame !== null) return;
      mediaPickerFrame = window.requestAnimationFrame(addMediaPickerGuidance);
    };
    scheduleMediaPickerGuidance();
    new MutationObserver(scheduleMediaPickerGuidance).observe(document.body, {
      childList: true,
      subtree: true,
    });

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
      .sarga-workspace-page h1,
      .sarga-workspace-page h2,
      .sarga-workspace-page h3 {
        font-family: "Zalando Sans Expanded", "Plus Jakarta Sans", system-ui, sans-serif;
        letter-spacing: 0.04em;
      }

      /* ── Button polish ─────────────────────────────────────── */
      [data-strapi-button] {
        border-radius: 8px !important;
        font-weight: 600 !important;
      }

      /* ── Motorsport workspace foundation ───────────────────── */
      .sarga-workspace-page {
        --ms-workspace-canvas: #fff9ee;
        --ms-workspace-subtle: #f6efe3;
        --ms-workspace-raised: #ffffff;
        --ms-workspace-inverse: #1b1b1b;
        --ms-workspace-inverse-text: #fff9ee;
        --ms-workspace-text: #1b1b1b;
        --ms-workspace-secondary: #47433d;
        --ms-workspace-muted: #625e56;
        --ms-workspace-border: #e8decf;
        --ms-workspace-strong-border: #716c64;
        --ms-workspace-action: #c41427;
        --ms-workspace-action-hover: #a81022;
        --ms-workspace-on-action: #fff9ee;
        --ms-workspace-focus: #f5c800;
        --ms-workspace-status: #f5c800;
        --ms-workspace-structure: #0033a0;
        font-family: "Noto Sans", "Plus Jakarta Sans", system-ui, sans-serif;
        scroll-behavior: smooth;
      }
      .sarga-workspace-page[data-workspace-scope="motorsport"] {
        border-top: 4px solid var(--ms-workspace-structure);
      }
      .sarga-workspace-scroll-shell {
        background: #fff9ee !important;
      }
      .sarga-workspace-masthead {
        display: flex;
        align-items: center;
        gap: 16px;
        min-height: 92px;
        padding: 16px 20px;
        border-radius: 10px;
        background: var(--ms-workspace-inverse);
        color: var(--ms-workspace-inverse-text);
        box-shadow: inset 0 -3px 0 var(--ms-workspace-action);
      }
      .sarga-workspace-masthead-light {
        background: var(--ms-workspace-raised);
        color: var(--ms-workspace-text);
        border: 1px solid var(--ms-workspace-border);
        box-shadow: inset 0 -3px 0 var(--ms-workspace-structure);
      }
      .sarga-workspace-masthead-light h1 {
        color: var(--ms-workspace-text) !important;
      }
      .sarga-workspace-masthead-light .sarga-workspace-eyebrow {
        color: var(--ms-workspace-muted);
      }
      .sarga-workspace-masthead-logo {
        display: block;
        width: 74px;
        height: 74px;
        object-fit: contain;
        flex: 0 0 auto;
      }
      .sarga-workspace-masthead .sarga-workspace-eyebrow {
        color: #e8decf;
      }
      .sarga-workspace-masthead h1 {
        margin-top: 6px !important;
        color: #fff9ee !important;
      }
      .sarga-workspace-masthead-light h1 {
        color: var(--ms-workspace-text) !important;
      }
      .sarga-workspace-masthead-light .sarga-workspace-eyebrow {
        color: var(--ms-workspace-muted) !important;
      }
      .sarga-workspace-page a:focus-visible,
      .sarga-workspace-page button:focus-visible {
        outline: 3px solid var(--ms-workspace-focus) !important;
        outline-offset: 3px;
      }
      .sarga-workspace-page .sarga-workspace-subnav-link:hover,
      .sarga-workspace-page .sarga-workspace-subnav-link:focus-visible {
        background: var(--ms-workspace-structure);
        color: #ffffff;
        transform: translateX(2px);
      }
      .sarga-workspace-page .sarga-workspace-subnav-link.is-active {
        background: var(--ms-workspace-structure);
        color: #ffffff;
        box-shadow: inset 3px 0 0 var(--ms-workspace-focus);
      }
      .sarga-workspace-page[data-workspace-scope="gateway"] .sarga-workspace-subnav-link.is-active,
      .sarga-workspace-page[data-workspace-scope="horsesport"] .sarga-workspace-subnav-link.is-active,
      .sarga-workspace-page[data-workspace-scope="shared"] .sarga-workspace-subnav-link.is-active {
        background: var(--ms-workspace-structure) !important;
        color: #ffffff !important;
        box-shadow: inset 3px 0 0 var(--ms-workspace-status) !important;
      }
      .sarga-workspace-page[data-workspace-scope="gateway"] .sarga-workspace-subnav-link:hover,
      .sarga-workspace-page[data-workspace-scope="gateway"] .sarga-workspace-subnav-link:focus-visible,
      .sarga-workspace-page[data-workspace-scope="horsesport"] .sarga-workspace-subnav-link:hover,
      .sarga-workspace-page[data-workspace-scope="horsesport"] .sarga-workspace-subnav-link:focus-visible,
      .sarga-workspace-page[data-workspace-scope="shared"] .sarga-workspace-subnav-link:hover,
      .sarga-workspace-page[data-workspace-scope="shared"] .sarga-workspace-subnav-link:focus-visible {
        background: var(--ms-workspace-structure) !important;
        color: #ffffff !important;
      }
      .sarga-workspace-page summary::-webkit-details-marker {
        display: none;
      }
      .sarga-workspace-page summary:focus-visible {
        outline: 3px solid var(--ms-workspace-focus);
        outline-offset: -3px;
      }
      .sarga-workspace-page details[open] .sarga-guidance-arrow {
        transform: rotate(180deg);
        background: var(--ms-workspace-border) !important;
        color: var(--ms-workspace-muted);
      }
      .sarga-workspace-page .sarga-guidance-arrow::before {
        content: "";
        display: block;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 7px solid currentColor;
      }
      .sarga-workspace-page .sarga-workspace-task-surface {
        overflow: hidden;
        background-color: var(--ms-workspace-inverse);
        box-shadow: 0 14px 28px rgba(27, 27, 27, 0.16);
      }
      .sarga-workspace-page .sarga-workspace-primary-action:hover,
      .sarga-workspace-page .sarga-workspace-primary-action:focus-visible {
        background: var(--ms-workspace-action-hover);
        color: var(--ms-workspace-on-action);
        transform: translateY(-1px);
      }
      .sarga-workspace-page .sarga-workspace-secondary-action:hover,
      .sarga-workspace-page .sarga-workspace-secondary-action:focus-visible {
        border-color: var(--ms-workspace-structure);
        color: var(--ms-workspace-structure);
        transform: translateY(-1px);
      }
      .sarga-workspace-page .sarga-workspace-primary-action:active,
      .sarga-workspace-page .sarga-workspace-secondary-action:active {
        transform: translateY(1px);
      }
      .sarga-workspace-page .sarga-workspace-task:hover,
      .sarga-workspace-page .sarga-workspace-task:focus-visible {
        border-color: var(--ms-workspace-focus);
        background: rgba(245, 200, 0, 0.12);
        color: var(--ms-workspace-inverse-text);
        transform: translateY(-2px);
      }
      .sarga-workspace-page .sarga-workspace-task:active {
        transform: translateY(1px);
      }
      .sarga-workspace-page .sarga-workspace-card {
        transition: border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
      }
      .sarga-workspace-page .sarga-workspace-card:hover {
        border-color: #c9bba8;
        box-shadow: 0 8px 20px rgba(27, 27, 27, 0.08);
        transform: translateY(-2px);
      }
      .sarga-workspace-page .sarga-workspace-card.is-active:hover {
        border-color: var(--ms-workspace-action);
        box-shadow: 0 0 0 3px rgba(196, 20, 39, .2), inset 4px 0 0 var(--ms-workspace-action), 0 8px 20px rgba(27, 27, 27, .08);
      }
      .sarga-workspace-page .sarga-workspace-page-entry:hover,
      .sarga-workspace-page .sarga-workspace-page-entry:focus-visible {
        border-color: var(--ms-workspace-action);
        box-shadow: 0 0 0 2px rgba(196, 20, 39, .16);
        transform: translateY(-2px);
      }
      @media (prefers-reduced-motion: reduce) {
        .sarga-workspace-page,
        .sarga-workspace-page * {
          scroll-behavior: auto !important;
          transition-duration: 0.01ms !important;
        }
      }
      .sarga-workspace-page[data-workspace-scope="motorsport"],
      .sarga-workspace-scroll-shell-motorsport {
        --ms-workspace-canvas: #111113;
        --ms-workspace-subtle: #1b1b1b;
        --ms-workspace-raised: #242426;
        --ms-workspace-inverse: #050505;
        --ms-workspace-inverse-text: #fff9ee;
        --ms-workspace-text: #fff9ee;
        --ms-workspace-secondary: #e8decf;
        --ms-workspace-muted: #c2b9aa;
        --ms-workspace-border: rgba(255, 249, 238, 0.16);
        --ms-workspace-strong-border: rgba(255, 249, 238, 0.34);
        --ms-workspace-action: #e8192c;
        --ms-workspace-action-hover: #ff6b00;
        --ms-workspace-on-action: #fff9ee;
      }
      .sarga-workspace-scroll-shell-motorsport {
        background: #111113 !important;
      }
      .sarga-workspace-page details[open] .sarga-guidance-arrow {
        background: var(--ms-workspace-border) !important;
        color: var(--ms-workspace-muted) !important;
        transform: rotate(180deg) !important;
      }
      @media (prefers-color-scheme: dark) {
        .sarga-workspace-scroll-shell {
          background: #fff9ee !important;
        }
      }
      .sarga-workspace-scroll-shell-motorsport {
        background: #111113 !important;
      }

      /* ── Workspace nested navigation responsiveness ───────── */
      @media (max-width: 860px) {
        .sarga-workspace-layout {
          grid-template-columns: 1fr !important;
        }
        .sarga-workspace-layout > nav {
          position: static !important;
        }
        .sarga-workspace-masthead {
          align-items: flex-start;
          padding: 14px 16px;
        }
        .sarga-workspace-masthead-logo {
          width: 58px;
          height: 58px;
        }
      }
    `;
    document.head.appendChild(style);

    console.log("🎯 Sarga CMS admin panel booted");
  },
};
