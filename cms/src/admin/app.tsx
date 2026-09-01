import type { StrapiApp } from "@strapi/strapi/admin";
import { APPROVED_MOTORSPORT_PREVIEW_UIDS } from "../preview/preview-path";
import adminStyles from "./styles/admin.css?inline";

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
    // Shared Sarga admin palette: neutral CMS surfaces with restrained
    // Motorsport accents. The Content Studio stylesheet adds the semantic
    // editor tokens used by both Collection Types and Single Types.
    theme: {
      light: {
        colors: {
          // Primary: Sarga Red / Orange accent
          primary100: "#fde8eb",
          primary200: "#f5b8c0",
          primary500: "#e8192c",
          primary600: "#c41427",
          primary700: "#8f0d1b",

          // Secondary: Sarga Gold accent
          secondary100: "#e8eefb",
          secondary200: "#b8c8ec",
          secondary500: "#0033a0",
          secondary600: "#00277d",
          secondary700: "#001a52",

          // Neutral: Sarga dark/light scale
          neutral0: "#ffffff",
          neutral100: "#f7f3ec",
          neutral150: "#eee7dc",
          neutral200: "#e6ddd0",
          neutral300: "#d1c6b8",
          neutral400: "#a69b8e",
          neutral500: "#756d63",
          neutral600: "#4a4640",
          neutral700: "#2b2926",
          neutral800: "#1b1b1b",
          neutral900: "#111111",
          neutral1000: "#000000",

          // Semantic colors
          success100: "#e6f7e6",
          success200: "#b5e8b5",
          success500: "#2e8b2e",
          success600: "#236b23",
          success700: "#184a18",

          danger100: "#fde8eb",
          danger200: "#f5b8c0",
          danger500: "#e8192c",
          danger600: "#c41427",
          danger700: "#8f0d1b",

          warning100: "#fff4d1",
          warning200: "#f9dc7c",
          warning500: "#f5c800",
          warning600: "#c79f00",
          warning700: "#7a6100",

          // Alternative: Sarga dark-soft
          alternative100: "#e8e8ea",
          alternative200: "#c5c5ca",
          alternative500: "#434343",
          alternative600: "#333333",
          alternative700: "#222222",

          // Button overrides for brand consistency
          buttonPrimary500: "#e8192c",
          buttonPrimary600: "#c41427",
          buttonNeutral0: "#ffffff",
          buttonNeutral100: "#f3f3f3",
          buttonNeutral200: "#d9d9d9",
          buttonNeutral300: "#cccccc",
          buttonNeutral500: "#434343",
          buttonNeutral600: "#333333",
          buttonNeutral700: "#07111f",
          buttonNeutral800: "#000b1d",
          buttonDanger500: "#e8192c",
          buttonDanger600: "#c41427",
          buttonSuccess500: "#2e8b2e",
          buttonSuccess600: "#236b23",
          buttonSecondary500: "#0033a0",
          buttonSecondary600: "#00277d",
        },
      },

      dark: {
        colors: {
          // Primary: Sarga Red / Orange - glow brighter on dark
          primary100: "#35131a",
          primary200: "#541a25",
          primary500: "#e8192c",
          primary600: "#ff4b5b",
          primary700: "#f5b8c0",

          // Secondary: Sarga Gold - warmer on dark
          secondary100: "#101e40",
          secondary200: "#17316b",
          secondary500: "#4c7bd9",
          secondary600: "#82a5f0",
          secondary700: "#b8c8ec",

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

          danger100: "#35131a",
          danger200: "#541a25",
          danger500: "#e8192c",
          danger600: "#ff4b5b",
          danger700: "#f5b8c0",

          warning100: "#3a3110",
          warning200: "#5c4c12",
          warning500: "#f5c800",
          warning600: "#ffdc38",
          warning700: "#f9dc7c",

          // Alternative
          alternative100: "#1a1d24",
          alternative200: "#2a2e38",
          alternative500: "#5a6a80",
          alternative600: "#8899aa",
          alternative700: "#cccccc",

          // Button overrides for dark
          buttonPrimary500: "#e8192c",
          buttonPrimary600: "#ff4b5b",
          buttonNeutral0: "#ffffff",
          buttonNeutral100: "#cccccc",
          buttonNeutral200: "#666666",
          buttonNeutral300: "#434343",
          buttonNeutral500: "#07111f",
          buttonNeutral600: "#000b1d",
          buttonNeutral700: "#ffffff",
          buttonNeutral800: "#f3f3f3",
          buttonDanger500: "#e8192c",
          buttonDanger600: "#ff4b5b",
          buttonSuccess500: "#3da63d",
          buttonSuccess600: "#4fc84f",
          buttonSecondary500: "#82a5f0",
          buttonSecondary600: "#b8c8ec",
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
    // Strapi's production admin entry is loaded dynamically, so a normal CSS
    // side-effect import can be emitted as an unreferenced split asset. Install
    // the shared stylesheet from the bundled string to keep every editor route
    // consistently styled in production as well as development.
    const adminStyleId = "sarga-admin-shared-styles";
    if (!document.getElementById(adminStyleId)) {
      const style = document.createElement("style");
      style.id = adminStyleId;
      style.textContent = adminStyles;
      document.head.appendChild(style);
    }

    // Mark the active native Content Manager surface so the shared stylesheet
    // can target editor UX without leaking into custom admin pages or plugins.
    const updateAdminSurface = () => {
      document.documentElement.dataset.sargaAdminSurface =
        window.location.pathname.includes("/content-manager/")
          ? "content-manager"
          : "shell";
    };
    updateAdminSurface();
    if (!document.documentElement.dataset.sargaAdminSurfaceNavigationBound) {
      const historyMethods = ["pushState", "replaceState"] as const;
      historyMethods.forEach((method) => {
        const original = window.history[method];
        window.history[method] = function (...args) {
          const result = original.apply(this, args);
          window.dispatchEvent(new Event("sarga-admin-navigation"));
          return result;
        };
      });
      window.addEventListener("sarga-admin-navigation", updateAdminSurface);
      window.addEventListener("popstate", updateAdminSurface);
      document.documentElement.dataset.sargaAdminSurfaceNavigationBound =
        "true";
    }

    // Add a compact, native-layout-aware control for Strapi's secondary
    // navigation. It keeps the editor usable on smaller screens without
    // replacing Content Manager or plugin-provided navigation.
    let secondaryNavigationCollapsed = false;
    let secondaryNavigationFrame: number | null = null;
    const getSecondaryNavigations = () =>
      [...document.querySelectorAll<HTMLElement>("#strapi nav[aria-label]")].filter(
        (nav) => {
          if (nav.getAttribute("aria-label") === "Pagination") return false;
          const rect = nav.getBoundingClientRect();
          return rect.top <= 12 && rect.height >= window.innerHeight - 50;
        },
      );
    const syncSecondaryNavigation = () => {
      secondaryNavigationFrame = null;
      const secondaryNavigations = getSecondaryNavigations();
      if (!secondaryNavigations.length) {
        document.documentElement.dataset.sargaSecondaryNavigation = "";
        document.documentElement.dataset.sargaContentManagerSidebar = "";
        return;
      }

      secondaryNavigations.forEach((secondaryNavigation) => {
        secondaryNavigation.classList.add("sarga-secondary-navigation");
        secondaryNavigation.dataset.sargaSecondaryNavigation = "true";
        const navigationName =
          secondaryNavigation.getAttribute("aria-label") || "secondary";
        let header = secondaryNavigation.querySelector<HTMLElement>(
          ':scope > [data-sarga-secondary-navigation-header="true"]',
        );
        if (!header) {
          const firstChild = secondaryNavigation.firstElementChild;
          if (!(firstChild instanceof HTMLElement)) return;
          header = firstChild;
          header.dataset.sargaSecondaryNavigationHeader = "true";
        }

        let brand = secondaryNavigation.querySelector<HTMLElement>(
          ':scope > [data-sarga-secondary-navigation-brand="true"]',
        );
        if (!brand) {
          brand = document.createElement("div");
          brand.className = "sarga-secondary-navigation-brand";
          brand.dataset.sargaSecondaryNavigationBrand = "true";
          const logo = document.createElement("img");
          logo.src = "/uploads/logo-sarga-reverse.png";
          logo.alt = "Sarga.co";
          logo.width = 132;
          logo.height = 40;
          logo.decoding = "async";
          brand.append(logo);
          secondaryNavigation.insertBefore(brand, header);
        }

        let toggle = header.querySelector<HTMLButtonElement>(
          '[data-sarga-secondary-navigation-toggle="true"]',
        );
        if (!toggle) {
          toggle = document.createElement("button");
          toggle.type = "button";
          toggle.dataset.sargaSecondaryNavigationToggle = "true";
          toggle.className = "sarga-secondary-navigation-toggle";
          toggle.innerHTML = '<span aria-hidden="true">‹</span>';
          header.append(toggle);
          toggle.addEventListener("click", () => {
            secondaryNavigationCollapsed = !secondaryNavigationCollapsed;
            syncSecondaryNavigation();
          });
        }

        const state = secondaryNavigationCollapsed ? "collapsed" : "expanded";
        const label = secondaryNavigationCollapsed
          ? `Expand ${navigationName} navigation`
          : `Collapse ${navigationName} navigation`;
        toggle.setAttribute("aria-label", label);
        toggle.title = label;
        const glyph = secondaryNavigationCollapsed ? "›" : "‹";
        if (toggle.textContent !== glyph) {
          toggle.innerHTML = `<span aria-hidden="true">${glyph}</span>`;
        }
        secondaryNavigation.dataset.sargaSecondaryNavigationState = state;
      });

      document.documentElement.dataset.sargaSecondaryNavigation =
        secondaryNavigationCollapsed ? "collapsed" : "expanded";
      document.documentElement.dataset.sargaContentManagerSidebar =
        secondaryNavigationCollapsed ? "collapsed" : "expanded";
    };
    const scheduleSecondaryNavigationSync = () => {
      if (secondaryNavigationFrame !== null) return;
      secondaryNavigationFrame = window.requestAnimationFrame(
        syncSecondaryNavigation,
      );
    };
    scheduleSecondaryNavigationSync();
    const secondaryNavigationObserver = new MutationObserver(
      scheduleSecondaryNavigationSync,
    );
    secondaryNavigationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Add locale-aware presentation controls to existing Content Manager
    // editor pages. The controls intentionally live outside the native form:
    // they change inheritance metadata, never translated field values.
    const adminJsonHeaders = () => {
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      try {
        const storedToken = window.localStorage.getItem("jwtToken");
        const token = storedToken ? JSON.parse(storedToken) : null;
        if (typeof token === "string" && token.length > 0) {
          headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // The cookie-backed admin session is still sent below.
      }
      return headers;
    };

    const adminFetchJson = async (url: string, init: RequestInit = {}) => {
      let headers = { ...adminJsonHeaders(), ...(init.headers ?? {}) };
      let response = await fetch(url, {
        ...init,
        credentials: "include",
        headers,
      });
      if (response.status === 401) {
        const refreshResponse = await fetch("/admin/access-token", {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        const refreshPayload = (await refreshResponse
          .json()
          .catch(() => null)) as { data?: { token?: unknown } | null } | null;
        const token = refreshPayload?.data?.token;
        if (
          refreshResponse.ok &&
          typeof token === "string" &&
          token.length > 0
        ) {
          headers = { ...headers, Authorization: `Bearer ${token}` };
          try {
            window.localStorage.setItem("jwtToken", JSON.stringify(token));
          } catch {
            // Ignore storage restrictions; the current request is enough.
          }
          response = await fetch(url, {
            ...init,
            credentials: "include",
            headers,
          });
        }
      }
      const payload = (await response.json().catch(() => null)) as unknown;
      if (!response.ok) {
        const message =
          payload && typeof payload === "object" && "error" in payload
            ? String((payload as { error?: { message?: unknown } }).error?.message ?? "Request failed")
            : "Request failed";
        throw new Error(message);
      }
      return payload;
    };

    const getEditorContext = async () => {
      const match = window.location.pathname.match(
        /\/content-manager\/(single-types|collection-types)\/([^/]+)(?:\/([^/]+))?$/,
      );
      if (!match || window.location.pathname.endsWith("/create")) return null;

      const contentTypeUid = decodeURIComponent(match[2]);
      const localeParam = new URLSearchParams(window.location.search).get(
        "plugins[i18n][locale]",
      );
      const locale = localeParam === "id" ? "id" : "en";
      let documentId = match[3] ? decodeURIComponent(match[3]) : null;

      if (!documentId) {
        const params = new URLSearchParams({ locale });
        const endpoint =
          match[1] === "single-types"
            ? `/content-manager/single-types/${encodeURIComponent(contentTypeUid)}?${params.toString()}`
            : `/content-manager/collection-types/${encodeURIComponent(contentTypeUid)}?${params.toString()}`;
        try {
          const payload = await adminFetchJson(endpoint);
          const visit = (value: unknown): string | null => {
            if (!value || typeof value !== "object") return null;
            if (Array.isArray(value)) {
              for (const item of value) {
                const found = visit(item);
                if (found) return found;
              }
              return null;
            }
            const record = value as Record<string, unknown>;
            if (typeof record.documentId === "string") return record.documentId;
            for (const child of Object.values(record)) {
              const found = visit(child);
              if (found) return found;
            }
            return null;
          };
          documentId = visit(payload);
        } catch {
          return null;
        }
      }

      return documentId ? { contentTypeUid, documentId, locale } : null;
    };

    let presentationConfigFrame: number | null = null;
    const syncPresentationConfigControls = async () => {
      presentationConfigFrame = null;
      if (!window.location.pathname.includes("/content-manager/")) return;
      const context = await getEditorContext();
      if (!context) return;

      let status: {
        mode: "local" | "global" | "inherit";
        sourceLocale: "en" | "id" | null;
        globalLocale: "en" | "id" | null;
      };
      try {
        const params = new URLSearchParams(context);
        const payload = (await adminFetchJson(
          `/users-permissions/sarga-presentation-config?${params.toString()}`,
        )) as { data?: typeof status };
        if (!payload.data) return;
        status = payload.data;
      } catch {
        // Unsupported/non-localized editor pages simply have no control bar.
        return;
      }

      const main = document.querySelector<HTMLElement>("main");
      if (!main) return;
      let bar = document.querySelector<HTMLElement>(
        '[data-sarga-presentation-config="true"]',
      );
      if (!bar) {
        bar = document.createElement("section");
        bar.className = "sarga-presentation-config-bar";
        bar.dataset.sargaPresentationConfig = "true";
      }

      // Keep the controls at the top of the normal editor. The split-view
      // workspace hides this native card and mirrors its action in its own
      // toolbar instead.
      bar.classList.remove("is-sidebar");
      if (bar.parentElement !== main || main.firstElementChild !== bar) {
        main.prepend(bar);
      }

      const modeLabel =
        status.mode === "global"
          ? `Global source · ${context.locale.toUpperCase()}`
          : status.mode === "inherit"
            ? `Using global config · ${status.sourceLocale?.toUpperCase() ?? "—"}`
            : "Using locale-specific presentation";
      const badgeClass = `sarga-presentation-config-status is-${status.mode}`;
      const signature = `${context.contentTypeUid}:${context.documentId}:${context.locale}:${status.mode}:${status.globalLocale ?? ""}:${status.sourceLocale ?? ""}`;
      if (bar.dataset.sargaPresentationConfigSignature === signature) return;
      bar.dataset.sargaPresentationConfigSignature = signature;
      bar.innerHTML = `
          <div class="sarga-presentation-config-copy">
            <span class="sarga-presentation-config-kicker">Presentation sync</span>
            <strong>Shared visual settings</strong>
            <span class="${badgeClass}">${modeLabel}</span>
            <small>Visibility, media, and CTA destinations can follow one locale. Translated copy stays local.</small>
          </div>
          <div class="sarga-presentation-config-actions">
            ${status.mode !== "global" ? '<button type="button" data-sarga-presentation-action="set-global">Set as global config</button>' : ""}
            ${status.mode !== "global" && status.globalLocale ? '<button type="button" data-sarga-presentation-action="use-global">Use global config</button>' : ""}
            ${status.mode === "inherit" ? '<button type="button" class="is-quiet" data-sarga-presentation-action="reset-local">Use local config</button>' : ""}
          </div>`;

      bar.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
        button.addEventListener("click", async () => {
          const action = button.dataset.sargaPresentationAction;
          if (!action) return;
          button.disabled = true;
          try {
            await adminFetchJson(`/users-permissions/sarga-presentation-config/${action}`, {
              method: "POST",
              body: JSON.stringify({ data: context }),
            });
            window.dispatchEvent(new Event("sarga-presentation-config-updated"));

            // The Content Manager form is controlled by Strapi's React state,
            // so changing the entry through the side endpoint does not update
            // its inputs automatically. Refresh a clean editor to show the
            // persisted shared values immediately. Never discard unsaved
            // translated copy; a dirty editor stays in place and can be
            // refreshed after its own changes are saved.
            const saveButton = [...document.querySelectorAll<HTMLButtonElement>("button")].find(
              (candidate) => candidate.textContent?.trim() === "Save",
            );
            if (!saveButton || saveButton.disabled) {
              window.setTimeout(() => window.location.reload(), 0);
            }

            if (window.parent !== window) {
              window.parent.postMessage(
                { type: "sarga-presentation-config-updated", action },
                window.location.origin,
              );
            }
          } catch (error) {
            window.alert(
              error instanceof Error
                ? error.message
                : "The presentation configuration could not be updated.",
            );
          } finally {
            button.disabled = false;
          }
        });
      });
    };
    const schedulePresentationConfigSync = () => {
      if (presentationConfigFrame !== null) return;
      presentationConfigFrame = window.requestAnimationFrame(() => {
        void syncPresentationConfigControls();
      });
    };
    const schedulePresentationConfigAfterNavigation = () => {
      schedulePresentationConfigSync();
      // The Content Manager route changes before Strapi mounts the new editor
      // tree. Retry while the responsive Entry/Preview layout is mounting;
      // narrow layouts move the Preview aside outside the main element.
      [250, 750, 1500, 3000].forEach((delay) => {
        window.setTimeout(schedulePresentationConfigSync, delay);
      });
    };
    window.addEventListener(
      "sarga-admin-navigation",
      schedulePresentationConfigAfterNavigation,
    );
    window.addEventListener("popstate", schedulePresentationConfigAfterNavigation);
    window.addEventListener("sarga-presentation-config-updated", schedulePresentationConfigSync);
    schedulePresentationConfigAfterNavigation();

    // Strapi's native Preview card remains the entry point. Supported
    // Motorsport Single Types and collection entries open the dedicated
    // split-view workspace in a separate window, leaving the editor intact.
    const motorsportPreviewUids: ReadonlySet<string> = new Set(
      APPROVED_MOTORSPORT_PREVIEW_UIDS,
    );
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
            "border-radius: 0px",
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

    // Strapi v5 does not expose aria-current on the Media Library page
    // buttons. Track the page button selected by the editor and add a stable
    // semantic hook so the current page remains visually obvious after the
    // picker re-renders its asset grid.
    const mediaPaginationPages = new WeakMap<HTMLElement, string>();
    let mediaPaginationCurrentPage: string | null = null;
    const getMediaPageKey = (button: HTMLButtonElement) => {
      const label =
        button.querySelector("span:first-child")?.textContent?.trim() ??
        button.textContent?.trim() ??
        "";
      const match = label.match(/go to page\s+(.+)/i);
      return match?.[1]?.trim() ?? null;
    };
    const markMediaPagination = () => {
      const paginations = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[role="dialog"] nav[aria-label="pagination"]',
        ),
      );
      if (paginations.length === 0) {
        if (!document.querySelector('[role="dialog"]')) {
          mediaPaginationCurrentPage = null;
        }
        return;
      }

      paginations.forEach((pagination) => {
          const buttons = Array.from(
            pagination.querySelectorAll<HTMLButtonElement>("button"),
          ).filter((button) => getMediaPageKey(button) !== null);
          if (buttons.length === 0) return;

          const rememberedPage =
            mediaPaginationCurrentPage ?? mediaPaginationPages.get(pagination);
          const activePage =
            rememberedPage &&
            buttons.some((button) => getMediaPageKey(button) === rememberedPage)
              ? rememberedPage
              : getMediaPageKey(buttons[0]);
          if (!activePage) return;
          mediaPaginationPages.set(pagination, activePage);
          mediaPaginationCurrentPage = activePage;

          buttons.forEach((button) => {
            if (!button.dataset.sargaMediaPaginationHandler) {
              button.dataset.sargaMediaPaginationHandler = "true";
              button.addEventListener(
                "click",
                () => {
                  const page = getMediaPageKey(button);
                  if (!page) return;
                  mediaPaginationPages.set(pagination, page);
                  mediaPaginationCurrentPage = page;
                  scheduleMediaPagination();
                },
                true,
              );
            }
            if (getMediaPageKey(button) === activePage) {
              button.dataset.sargaMediaCurrentPage = "true";
            } else {
              delete button.dataset.sargaMediaCurrentPage;
            }
          });
        });
    };
    let mediaPaginationFrame: number | null = null;
    const scheduleMediaPagination = () => {
      if (mediaPaginationFrame !== null) return;
      mediaPaginationFrame = window.requestAnimationFrame(() => {
        mediaPaginationFrame = null;
        markMediaPagination();
      });
    };
    document.addEventListener(
      "click",
      (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const button = target.closest<HTMLButtonElement>(
          '[role="dialog"] nav[aria-label="pagination"] button',
        );
        if (!button) return;
        const page = getMediaPageKey(button);
        const pagination = button.closest<HTMLElement>(
          'nav[aria-label="pagination"]',
        );
        if (!page || !pagination) return;
        mediaPaginationPages.set(pagination, page);
        mediaPaginationCurrentPage = page;
        scheduleMediaPagination();
      },
      true,
    );
    scheduleMediaPagination();
    new MutationObserver(scheduleMediaPagination).observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Inject brand CSS for surfaces theme tokens can't reach
    // (login page background, scrollbars, typography refinements).
    const style = document.createElement("style");
    style.textContent = `
      /* ── Login page: dark premium background ─────────────── */
      [data-strapi-header="true"] {
        background-color: #07111f !important;
        background-image:
          radial-gradient(circle at 1px 1px, rgba(255, 249, 238, 0.13) 1px, transparent 1.5px),
          linear-gradient(118deg, transparent 0 64%, rgba(232, 25, 44, 0.2) 100%) !important;
        background-size: 22px 22px, 100% 100%;
      }
      .AuthBody {
        background-color: #000b1d !important;
        background-image:
          radial-gradient(circle at 1px 1px, rgba(255, 249, 238, 0.14) 1px, transparent 1.5px),
          linear-gradient(135deg, transparent 0%, rgba(232, 25, 44, 0.18) 100%),
          linear-gradient(135deg, #000b1d 0%, #07111f 40%, #0d1a2d 100%) !important;
        background-size: 22px 22px, 100% 100%, 100% 100%;
      }

      /* ── Login card: dark surface with subtle border ──────── */
      .AuthBox {
        background: rgba(7, 17, 31, 0.85) !important;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 0px !important;
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 249, 238, 0.06);
        overflow: hidden;
        position: relative;
      }
      .AuthBox::before {
        background-image: radial-gradient(circle at 1px 1px, rgba(255, 249, 238, 0.11) 1px, transparent 1.5px);
        background-size: 18px 18px;
        content: "";
        inset: 0;
        opacity: 0.7;
        pointer-events: none;
        position: absolute;
      }
      .AuthBox > * {
        position: relative;
        z-index: 1;
      }
      .AuthBox input {
        background: rgba(255, 255, 255, 0.96) !important;
        border: 1px solid rgba(255, 249, 238, 0.22) !important;
        border-radius: 0px !important;
        color: #1b1b1b !important;
        font-size: 15px !important;
        min-height: 48px !important;
      }
      .AuthBox input:focus {
        border-color: #f5c800 !important;
        box-shadow: 0 0 0 3px rgba(245, 200, 0, 0.2) !important;
        outline: none !important;
      }
      .AuthBox button[type="submit"] {
        border-radius: 0px !important;
        box-shadow: 0 10px 22px rgba(232, 25, 44, 0.24);
        font-size: 15px !important;
        font-weight: 800 !important;
        min-height: 48px !important;
      }
      .AuthBox a {
        color: #f5b8c0 !important;
      }

      /* ── Strapi v5 login layout: use semantic structure rather than
         generated styled-component class names. The first child of Main is
         the native LayoutContent card that contains the login form. */
      body:has(main input[type="password"]):not(:has(main[data-sarga-mail-settings="motorsport"])) main > div:first-child {
        background: #ffffff !important;
        border: 1px solid #e6ddd0 !important;
        border-radius: 0px !important;
        box-shadow: 0 18px 44px rgba(27, 27, 27, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
        overflow: hidden;
      }
      body:has(main input[type="password"]):not(:has(main[data-sarga-mail-settings="motorsport"])) main > div:first-child input:not([type="checkbox"]) {
        min-height: 54px !important;
        border: 1px solid #e6ddd0 !important;
        border-radius: 0px !important;
        background: #ffffff !important;
        color: #1b1b1b !important;
        font-size: 16px !important;
      }
      body:has(main input[type="password"]):not(:has(main[data-sarga-mail-settings="motorsport"])) main > div:first-child input:not([type="checkbox"]):focus {
        border-color: #0033a0 !important;
        box-shadow: 0 0 0 3px rgba(0, 51, 160, 0.14) !important;
        outline: none !important;
      }
      body:has(main input[type="password"]):not(:has(main[data-sarga-mail-settings="motorsport"])) main > div:first-child label {
        color: #1b1b1b !important;
        font-size: 14px !important;
        font-weight: 700 !important;
      }
      body:has(main input[type="password"]):not(:has(main[data-sarga-mail-settings="motorsport"])) main > div:first-child input[type="checkbox"] {
        width: 22px !important;
        height: 22px !important;
        border: 1px solid #b9ae9f !important;
        border-radius: 0px !important;
        accent-color: #e8192c;
      }
      body:has(main input[type="password"]):not(:has(main[data-sarga-mail-settings="motorsport"])) main > div:first-child button[type="submit"] {
        min-height: 52px !important;
        border: 1px solid #e8192c !important;
        border-radius: 0px !important;
        background: #e8192c !important;
        box-shadow: 0 12px 24px rgba(232, 25, 44, 0.2) !important;
        font-size: 16px !important;
        font-weight: 800 !important;
        transition: background-color 140ms ease, box-shadow 140ms ease,
          transform 140ms ease;
      }
      body:has(main input[type="password"]):not(:has(main[data-sarga-mail-settings="motorsport"])) main > div:first-child button[type="submit"]:hover {
        background: #c41427 !important;
        box-shadow: 0 14px 28px rgba(232, 25, 44, 0.28) !important;
        transform: translateY(-1px);
      }
      body:has(main input[type="password"]):not(:has(main[data-sarga-mail-settings="motorsport"])) main > div:last-child a {
        color: #c41427 !important;
        font-weight: 700 !important;
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
        border-radius: 0px;
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
        border-radius: 0px !important;
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
        border-radius: 0px;
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
