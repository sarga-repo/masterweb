import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { APPROVED_MOTORSPORT_PREVIEW_UIDS } from "../../../preview/preview-path";

type Locale = "en" | "id";
type PreviewStatus = "draft" | "published";
type EditorAction = "Save" | "Publish";
type BusyAction = EditorAction | "status" | null;

type EditorActionState = {
  saveDisabled: boolean;
  publishDisabled: boolean;
};

type ToastState = {
  kind: "success" | "error" | "info";
  message: string;
};

type PreviewDevice = "desktop" | "mobile";

type PageOption = {
  label: string;
  uid: string;
};

const SUPPORTED_PREVIEW_UIDS: ReadonlySet<string> = new Set(
  APPROVED_MOTORSPORT_PREVIEW_UIDS,
);

const PAGE_OPTIONS: PageOption[] = [
  {
    label: "Homepage",
    uid: "api::motorsport-home-page.motorsport-home-page",
  },
  {
    label: "About",
    uid: "api::motorsport-about-page.motorsport-about-page",
  },
  {
    label: "Events",
    uid: "api::motorsport-events-page.motorsport-events-page",
  },
  {
    label: "News",
    uid: "api::motorsport-news-page.motorsport-news-page",
  },
  {
    label: "Gallery",
    uid: "api::motorsport-gallery-page.motorsport-gallery-page",
  },
  {
    label: "Merchandise",
    uid: "api::motorsport-merchandise-page.motorsport-merchandise-page",
  },
  {
    label: "Tickets",
    uid: "api::motorsport-tickets-page.motorsport-tickets-page",
  },
  {
    label: "Contact",
    uid: "api::motorsport-contact-page.motorsport-contact-page",
  },
  {
    label: "Partners",
    uid: "api::motorsport-partners-page.motorsport-partners-page",
  },
  {
    label: "Experience",
    uid: "api::motorsport-experience-page.motorsport-experience-page",
  },
];

const firstPage = PAGE_OPTIONS[0];
const SINGLE_TYPE_UIDS = new Set(PAGE_OPTIONS.map((page) => page.uid));
const ADMIN_BASE_PATH = "/admin";
const EDITOR_CHROME_HEIGHT = 220;
const PREVIEW_MIN_ZOOM = 0.4;
const PREVIEW_MAX_ZOOM = 1.5;
const PREVIEW_ZOOM_STEP = 0.05;
const PREVIEW_DEVICE_WIDTHS: Record<PreviewDevice, number> = {
  desktop: 1440,
  mobile: 390,
};

const ENTRY_TITLES: Record<string, string> = {
  "api::motorsport-home-page.motorsport-home-page":
    "Sarga Motorsport Homepage",
  "api::motorsport-about-page.motorsport-about-page": "About Sarga",
  "api::motorsport-events-page.motorsport-events-page": "Motorsport Events",
  "api::motorsport-news-page.motorsport-news-page": "Motorsport News",
  "api::motorsport-gallery-page.motorsport-gallery-page": "Motorsport Gallery",
  "api::motorsport-merchandise-page.motorsport-merchandise-page":
    "Motorsport Merchandise",
  "api::motorsport-tickets-page.motorsport-tickets-page": "Motorsport Tickets",
  "api::motorsport-contact-page.motorsport-contact-page": "Contact Sarga",
  "api::motorsport-partners-page.motorsport-partners-page":
    "Motorsport Partners",
  "api::motorsport-experience-page.motorsport-experience-page":
    "Motorsport Experience",
  "api::news-article.news-article": "News Article",
  "api::motorsport-news-article.motorsport-news-article":
    "Motorsport News Article",
  "api::event.event": "Event",
  "api::motorsport-event.motorsport-event": "Motorsport Event",
  "api::partner.partner": "Partner",
  "api::motorsport-partner.motorsport-partner": "Motorsport Partner",
  "api::media-gallery.media-gallery": "Media Gallery",
  "api::motorsport-program.motorsport-program": "Motorsport Program",
  "api::motorsport-regulation.motorsport-regulation": "Motorsport Regulation",
  "api::motorsport-rider.motorsport-rider": "Motorsport Rider",
  "api::motorsport-standing.motorsport-standing": "Motorsport Standing",
  "api::ticket-cta.ticket-cta": "Ticket CTA",
  "api::motorsport-ticket-cta.motorsport-ticket-cta": "Motorsport Ticket CTA",
  "api::top-navigation-item.top-navigation-item": "Top Navigation",
  "api::motorsport-top-navigation-item.motorsport-top-navigation-item":
    "Motorsport Top Navigation",
  "api::site.site": "Site",
  "api::leadership-person.leadership-person": "Leadership Person",
  "api::motorsport-leadership-person.motorsport-leadership-person":
    "Motorsport Leadership Person",
};

function entryLabel(uid: string) {
  return ENTRY_TITLES[uid] ?? uid.split(".").at(-1) ?? "Motorsport entry";
}

const styles: Record<string, CSSProperties> = {
  page: {
    display: "flex",
    flexDirection: "column",
    height: "100dvh",
    minHeight: 620,
    position: "relative",
    overflow: "hidden",
    background: "#eef0f2",
    color: "#07111f",
    fontFamily: '"Noto Sans", system-ui, sans-serif',
  },
  pageNarrow: {
    height: "auto",
    minHeight: "100dvh",
    overflow: "auto",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    minHeight: 114,
    boxSizing: "border-box",
    padding: "16px 24px",
    borderBottom: "1px solid #d9dde2",
    background: "#ffffff",
    flexShrink: 0,
  },
  headingGroup: { marginRight: "auto", minWidth: 300 },
  headingGroupNarrow: { minWidth: 0 },
  eyebrow: {
    margin: 0,
    color: "#e8192c",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
  },
  title: {
    margin: "3px 0 0",
    fontSize: 20,
    fontWeight: 800,
    letterSpacing: "-0.03em",
  },
  hint: { margin: "4px 0 0", color: "#64707c", fontSize: 12 },
  controlGroup: { display: "grid", gap: 4 },
  controlLabel: {
    color: "#64707c",
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  select: {
    minWidth: 210,
    height: 31,
    padding: "0 34px 0 10px",
    border: "1px solid #c5cbd1",
    borderRadius: 6,
    background: "#ffffff",
    color: "rgb(40 51 64)",
    font: "inherit",
    fontSize: 13,
    fontWeight: 700,
  },
  openLink: {
    display: "inline-flex",
    width: 150,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1px solid rgb(168 217 158)",
    borderRadius: 6,
    color: "rgb(60 139 57)",
    background: "#eef9eb",
    fontSize: 12,
    fontWeight: 800,
    textDecoration: "none",
  },
  backButton: {
    display: "inline-flex",
    width: 130,
    height: 31,
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1px solid rgb(168 217 158)",
    borderRadius: 6,
    background: "rgb(238 249 235)",
    color: "rgb(60 139 57)",
    cursor: "pointer",
    font: "inherit",
    fontSize: 12,
    fontWeight: 800,
    lineHeight: 1,
  },
  panes: {
    display: "grid",
    gridTemplateColumns: "minmax(420px, 1fr) minmax(420px, 1fr)",
    minHeight: 0,
    flex: 1,
    gap: 1,
    background: "#c5cbd2",
  },
  panesNarrow: {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    flex: "1 1 auto",
  },
  pane: {
    display: "flex",
    minWidth: 0,
    minHeight: 0,
    flexDirection: "column",
    background: "#ffffff",
  },
  paneNarrow: { minHeight: 640 },
  paneHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 50,
    boxSizing: "border-box",
    padding: "0 14px",
    borderBottom: "1px solid #d9dde2",
    background: "#f8f9fa",
    color: "#273340",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  paneStatus: {
    color: "#16825d",
    fontSize: 10,
    letterSpacing: "0.08em",
  },
  editorToolbar: {
    display: "flex",
    alignItems: "center",
    minHeight: 47,
    boxSizing: "border-box",
    borderBottom: "1px solid #d9dde2",
    background: "#ffffff",
    color: "#273340",
    overflow: "hidden",
  },
  editorToolbarNarrow: {
    display: "grid",
    gridTemplateColumns: "54px minmax(0, 1fr) auto",
    gridTemplateRows: "47px auto auto",
    alignItems: "stretch",
    minHeight: 141,
    overflow: "visible",
  },
  editorClose: {
    width: 54,
    height: 47,
    flex: "0 0 54px",
    border: 0,
    borderRight: "1px solid #e2e5e8",
    background: "#ffffff",
    color: "#69737d",
    cursor: "pointer",
    fontSize: 28,
    fontWeight: 300,
    lineHeight: 1,
  },
  editorCloseNarrow: {
    gridColumn: "1",
    gridRow: "1",
  },
  editorEntryTitle: {
    minWidth: 0,
    maxWidth: 260,
    padding: "0 14px",
    overflow: "hidden",
    color: "#273340",
    fontSize: 15,
    fontWeight: 800,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  editorEntryTitleNarrow: {
    gridColumn: "2",
    gridRow: "1",
    maxWidth: "none",
    padding: "0 10px",
  },
  publishedBadge: {
    flex: "0 0 auto",
    marginRight: 16,
    padding: "5px 8px",
    border: "1px solid #a8d99f",
    borderRadius: 5,
    background: "#eef9eb",
    color: "#3c8c39",
    fontSize: 12,
    fontWeight: 800,
  },
  publishedBadgeNarrow: {
    gridColumn: "3",
    gridRow: "1",
    marginRight: 8,
    alignSelf: "center",
  },
  editorStatusTabs: {
    display: "flex",
    alignSelf: "stretch",
    alignItems: "stretch",
    borderLeft: "1px solid #e2e5e8",
  },
  editorStatusTabsNarrow: {
    gridColumn: "1 / -1",
    gridRow: "2",
    minHeight: 47,
    borderTop: "1px solid #e2e5e8",
    borderLeft: 0,
  },
  editorStatusTab: {
    minWidth: 78,
    padding: "0 14px",
    border: 0,
    borderBottom: "3px solid transparent",
    background: "#ffffff",
    color: "#59636e",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
  },
  editorStatusTabActive: {
    borderBottomColor: "#e2321e",
    color: "#a82a1d",
  },
  editorToolbarSpacer: { flex: 1, minWidth: 8 },
  editorToolbarSpacerNarrow: { display: "none" },
  editorToolbarActionGroup: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
  },
  editorToolbarActionGroupNarrow: {
    gridColumn: "1 / -1",
    gridRow: "3",
    justifyContent: "flex-end",
    minHeight: 47,
    boxSizing: "border-box",
    padding: "8px 8px 0",
    borderTop: "1px solid #e2e5e8",
  },
  editorIconButton: {
    display: "grid",
    width: 42,
    height: 31,
    placeItems: "center",
    marginRight: 8,
    border: "1px solid #d5d9dd",
    borderRadius: 5,
    background: "#ffffff",
    color: "#69737d",
    cursor: "pointer",
  },
  editorActionButton: {
    minWidth: 84,
    height: 31,
    marginRight: 8,
    border: "1px solid #d5d9dd",
    borderRadius: 5,
    background: "#eceeef",
    color: "#59636e",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 800,
  },
  editorActionButtonActive: {
    borderColor: "#e2321e",
    background: "#fce8e6",
    color: "#a82a1d",
  },
  actionSpinner: {
    display: "inline-block",
    width: 12,
    height: 12,
    marginRight: 6,
    border: "2px solid currentColor",
    borderRightColor: "transparent",
    borderRadius: "50%",
    verticalAlign: "-2px",
  },
  toast: {
    position: "fixed",
    right: 24,
    bottom: 24,
    zIndex: 30,
    maxWidth: 360,
    padding: "12px 16px",
    border: "1px solid #d5d9dd",
    borderRadius: 6,
    background: "#ffffff",
    boxShadow: "0 8px 24px rgba(7, 17, 31, 0.16)",
    color: "#273340",
    fontSize: 13,
    fontWeight: 700,
  },
  toastSuccess: { borderColor: "#a8d99f", color: "#3c8c39" },
  toastError: { borderColor: "#e2321e", color: "#a82a1d" },
  toastInfo: { borderColor: "#c5cbd2", color: "#59636e" },
  frame: { width: "100%", height: "100%", border: 0, background: "#ffffff" },
  editorViewport: {
    position: "relative",
    minHeight: 0,
    flex: 1,
    overflow: "hidden",
  },
  previewControls: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  previewDeviceToolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 47,
    boxSizing: "border-box",
    padding: "8px 14px",
    borderBottom: "1px solid #d9dde2",
    background: "#ffffff",
  },
  previewDeviceSelect: {
    minWidth: 150,
    height: 31,
    padding: "0 30px 0 10px",
    border: "1px solid #c5cbd2",
    borderRadius: 5,
    background: "#ffffff",
    color: "#273340",
    font: "inherit",
    fontSize: 12,
    fontWeight: 700,
  },
  previewStage: {
    position: "relative",
    display: "flex",
    minHeight: 0,
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    overflow: "auto",
    boxSizing: "border-box",
    padding: 16,
    background: "#e9ecef",
  },
  previewDeviceFrame: {
    position: "relative",
    flex: "0 0 auto",
    overflow: "hidden",
    border: "1px solid #c5cbd2",
    borderRadius: 6,
    background: "#ffffff",
    boxShadow: "0 10px 28px rgba(7, 17, 31, 0.12)",
  },
  previewDeviceCanvas: {
    transformOrigin: "top left",
  },
  previewLoading: {
    display: "grid",
    minHeight: 180,
    placeItems: "center",
    color: "#59636e",
    fontSize: 12,
    fontWeight: 700,
  },
  zoomButton: {
    display: "grid",
    width: 30,
    height: 30,
    padding: 0,
    placeItems: "center",
    border: "1px solid #d5d9dd",
    borderRadius: 5,
    background: "#ffffff",
    color: "#59636e",
    cursor: "pointer",
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1,
  },
  zoomValue: {
    minWidth: 52,
    height: 30,
    padding: "0 8px",
    border: "1px solid #d5d9dd",
    borderRadius: 5,
    background: "#ffffff",
    color: "#59636e",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 800,
  },
  editorFrame: {
    width: "100%",
    height: "100%",
    border: 0,
    background: "#ffffff",
  },
  note: {
    padding: "8px 14px",
    borderTop: "1px solid #d9dde2",
    background: "#fff9ee",
    color: "#5d513f",
    fontSize: 11,
    lineHeight: 1.4,
  },
};

function isCollectionTypeUid(uid: string) {
  return !SINGLE_TYPE_UIDS.has(uid);
}

function contentManagerUrl(
  uid: string,
  locale: Locale,
  documentId?: string | null,
  previewSession?: string | null,
) {
  const params = new URLSearchParams({ "plugins[i18n][locale]": locale });
  if (previewSession) params.set("previewSession", previewSession);
  const collectionEntryPath =
    isCollectionTypeUid(uid) && documentId
      ? `collection-types/${uid}/${encodeURIComponent(documentId)}`
      : `single-types/${uid}`;
  return `${ADMIN_BASE_PATH}/content-manager/${collectionEntryPath}?${params.toString()}`;
}

function previewUrlEndpoint(
  uid: string,
  locale: Locale,
  status: PreviewStatus,
  documentId: string,
) {
  const params = new URLSearchParams({ locale, status, documentId });
  return `/content-manager/preview/url/${uid}?${params.toString()}`;
}

function contentManagerDataEndpoint(
  uid: string,
  locale: Locale,
  documentId?: string | null,
) {
  const params = new URLSearchParams({ locale });
  const collectionEntryPath =
    isCollectionTypeUid(uid) && documentId
      ? `collection-types/${uid}/${encodeURIComponent(documentId)}`
      : `single-types/${uid}`;
  return `/content-manager/${collectionEntryPath}?${params.toString()}`;
}

function getDocumentIdFromResponse(payload: unknown) {
  const visit = (value: unknown): string | null => {
    if (!value || typeof value !== "object") return null;
    if (Array.isArray(value)) {
      for (const item of value) {
        const documentId = visit(item);
        if (documentId) return documentId;
      }
      return null;
    }

    const record = value as Record<string, unknown>;
    if (
      typeof record.documentId === "string" &&
      record.documentId.length > 0
    ) {
      return record.documentId;
    }

    for (const child of Object.values(record)) {
      const documentId = visit(child);
      if (documentId) return documentId;
    }
    return null;
  };

  return visit(payload);
}

function getEntryTitleFromResponse(payload: unknown) {
  const preferredFields = [
    "title",
    "name",
    "label",
    "internalName",
    "slug",
  ];
  const visit = (value: unknown): string | null => {
    if (!value || typeof value !== "object") return null;
    if (Array.isArray(value)) {
      for (const item of value) {
        const title = visit(item);
        if (title) return title;
      }
      return null;
    }

    const record = value as Record<string, unknown>;
    for (const field of preferredFields) {
      const candidate = record[field];
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }
    for (const child of Object.values(record)) {
      const title = visit(child);
      if (title) return title;
    }
    return null;
  };

  return visit(payload);
}

function adminJsonHeaders() {
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
    // A cookie-backed session can still be sent through credentials below.
  }

  return headers;
}

async function adminGetJson(url: string) {
  let headers = adminJsonHeaders();
  let response = await fetch(url, {
    cache: "no-store",
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
      .catch(() => null)) as {
      data?: { token?: unknown } | null;
    } | null;
    const token = refreshPayload?.data?.token;
    if (refreshResponse.ok && typeof token === "string" && token.length > 0) {
      headers = { ...headers, Authorization: `Bearer ${token}` };
      response = await fetch(url, {
        cache: "no-store",
        credentials: "include",
        headers,
      });
    }
  }

  const payload = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    throw new Error("The CMS preview request could not be completed.");
  }
  return payload;
}

function getPreviewUrlFromResponse(payload: unknown) {
  if (typeof payload === "string") return payload;
  if (!payload || typeof payload !== "object") return null;

  const response = payload as {
    url?: unknown;
    data?: { url?: unknown } | null;
  };
  if (typeof response.url === "string") return response.url;
  if (typeof response.data?.url === "string") return response.data.url;
  return null;
}

function fitPreviewZoom(device: PreviewDevice, viewportWidth: number) {
  if (device === "mobile") {
    return viewportWidth > 0
      ? Math.min(1, Math.max(0.65, (viewportWidth - 32) / 390))
      : 1;
  }

  return viewportWidth > 0
    ? Math.min(0.75, Math.max(0.45, (viewportWidth - 32) / 1440))
    : 0.65;
}

function editorSelectionFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const requestedUid = params.get("uid");
  const requestedLocale = params.get("locale");
  const requestedDocumentId = params.get("documentId")?.trim() || null;
  const previewSession = params.get("previewSession")?.trim() || null;

  return {
    uid: SUPPORTED_PREVIEW_UIDS.has(requestedUid ?? "")
      ? requestedUid!
      : firstPage.uid,
    locale: requestedLocale === "id" ? ("id" as Locale) : ("en" as Locale),
    documentId: requestedDocumentId,
    previewSession,
  };
}

function compactEmbeddedEditor(frame: HTMLIFrameElement) {
  const document = frame.contentDocument;
  if (!document || document.getElementById("sarga-compact-editor-style")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "sarga-compact-editor-style";
  style.textContent = `
    /* The parent split workspace already provides the Preview context. Keep
       only the Content Manager form inside the embedded left pane. */
    [data-strapi-header="main-nav"],
    nav,
    header,
    aside,
    footer,
    [role="complementary"] {
      display: none !important;
    }
    /* Content Manager cleanup must not remove Strapi's media picker chrome.
       Its tabs, Add folder, and Finish controls live in modal header/footer
       elements inside the embedded document. */
    [role="dialog"] nav,
    [role="dialog"] header,
    [role="dialog"] aside,
    [role="dialog"] footer,
    [role="dialog"] [role="complementary"] {
      display: revert !important;
    }
    @media (max-width: 600px) {
      /* Keep the media-picker tabs and actions inside a phone-width dialog. */
      [role="dialog"] div:has(> [role="tablist"]) {
        flex-wrap: wrap !important;
      }
      [role="dialog"] div:has(> [role="tablist"]) > [role="tablist"],
      [role="dialog"] div:has(> [role="tablist"]) > [role="tablist"] + div {
        flex: 1 1 100% !important;
        width: 100% !important;
      }
      [role="dialog"] div:has(> [role="tablist"]) > [role="tablist"] + div {
        justify-content: flex-end !important;
      }
    }
    main,
    #main-content {
      width: 100% !important;
      max-width: none !important;
      margin-left: 0 !important;
    }
  `;
  document.head.appendChild(style);

  const hideDuplicateActionBar = () => {
    const viewportHeight = document.documentElement.clientHeight;
    const actionButtons = Array.from(
      document.querySelectorAll<HTMLButtonElement>("button"),
    ).filter((button) => {
      const label = button.textContent?.trim();
      const rect = button.getBoundingClientRect();
      return (
        (label === "Save" || label === "Publish") &&
        rect.top > viewportHeight - 150
      );
    });

    actionButtons.forEach((button) => {
      let candidate: HTMLElement = button;
      let parent = button.parentElement;

      while (parent && parent !== document.body) {
        const rect = parent.getBoundingClientRect();
        const position = document.defaultView?.getComputedStyle(parent).position;
        if (
          position === "fixed" ||
          position === "sticky" ||
          (rect.top > viewportHeight - 150 && rect.height <= 150)
        ) {
          candidate = parent;
        }
        parent = parent.parentElement;
      }

      candidate.style.display = "none";
    });
  };

  hideDuplicateActionBar();
  window.setTimeout(hideDuplicateActionBar, 250);
  new MutationObserver(hideDuplicateActionBar).observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function findEmbeddedButtons(
  frame: HTMLIFrameElement | null,
  label: string,
) {
  return Array.from(
    frame?.contentDocument?.querySelectorAll<HTMLButtonElement>("button") ??
      [],
  ).filter((candidate) => candidate.textContent?.trim() === label);
}

function findEmbeddedButton(
  frame: HTMLIFrameElement | null,
  label: string,
) {
  const buttons = findEmbeddedButtons(frame, label);
  return buttons.find((button) => !button.disabled) ?? buttons[0];
}

function readEmbeddedActionState(
  frame: HTMLIFrameElement | null,
): EditorActionState {
  const saveButtons = findEmbeddedButtons(frame, "Save");
  const publishButtons = findEmbeddedButtons(frame, "Publish");

  return {
    saveDisabled:
      saveButtons.length === 0 || saveButtons.every((button) => button.disabled),
    publishDisabled:
      publishButtons.length === 0 ||
      publishButtons.every((button) => button.disabled),
  };
}

function observeEmbeddedEditorActions(
  frame: HTMLIFrameElement,
  onChange: () => void,
  onPotentialDirty: () => void,
) {
  let observer: MutationObserver | null = null;
  let observedDocument: Document | null = null;
  let dirtyEventHandler: (() => void) | null = null;
  let dirtyClickHandler: ((event: Event) => void) | null = null;

  const attachDocumentObserver = () => {
    observer?.disconnect();
    observedDocument?.removeEventListener("input", onChange, true);
    observedDocument?.removeEventListener("change", onChange, true);
    if (dirtyEventHandler) {
      observedDocument?.removeEventListener("beforeinput", dirtyEventHandler, true);
      observedDocument?.removeEventListener("input", dirtyEventHandler, true);
      observedDocument?.removeEventListener("change", dirtyEventHandler, true);
    }
    if (dirtyClickHandler) {
      observedDocument?.removeEventListener("click", dirtyClickHandler, true);
    }

    const document = frame.contentDocument;
    if (!document) return;

    observedDocument = document;
    observer = new MutationObserver(onChange);
    observer.observe(document, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["disabled", "aria-disabled"],
    });

    dirtyEventHandler = () => {
      onPotentialDirty();

      // Let Strapi reconcile its own button state immediately after its form
      // reducer has processed the same editor event.
      window.setTimeout(onChange, 0);
      window.requestAnimationFrame(onChange);
    };
    document.addEventListener("beforeinput", dirtyEventHandler, true);
    document.addEventListener("input", dirtyEventHandler, true);
    document.addEventListener("change", dirtyEventHandler, true);
    dirtyClickHandler = (event) => {
      const target = event.target as Element | null;
      if (
        target?.closest(
          "input, textarea, select, [contenteditable=\"true\"]",
        )
      ) {
        dirtyEventHandler?.();
      }
    };
    document.addEventListener("click", dirtyClickHandler, true);
    onChange();
  };

  attachDocumentObserver();
  frame.addEventListener("load", attachDocumentObserver);

  // Keep a low-frequency fallback for state changes that happen outside the
  // DOM mutations/events exposed by the embedded Content Manager.
  const fallbackTimer = window.setInterval(onChange, 1000);

  return () => {
    observer?.disconnect();
    frame.removeEventListener("load", attachDocumentObserver);
    window.clearInterval(fallbackTimer);

    if (dirtyEventHandler) {
      observedDocument?.removeEventListener("beforeinput", dirtyEventHandler, true);
      observedDocument?.removeEventListener("input", dirtyEventHandler, true);
      observedDocument?.removeEventListener("change", dirtyEventHandler, true);
    }
    if (dirtyClickHandler) {
      observedDocument?.removeEventListener("click", dirtyClickHandler, true);
    }
  };
}

function triggerEmbeddedEditorAction(
  frame: HTMLIFrameElement | null,
  label: EditorAction,
) {
  const button = findEmbeddedButton(frame, label);
  if (!button || button.disabled) return false;
  button.click();
  return true;
}

function triggerEmbeddedStatusTab(
  frame: HTMLIFrameElement | null,
  status: PreviewStatus,
) {
  const tab = Array.from(
    frame?.contentDocument?.querySelectorAll<HTMLElement>(
      '[role="tab"], button',
    ) ?? [],
  ).find((candidate) => candidate.textContent?.trim().toLowerCase() === status);
  if (!tab) return false;

  tab.focus();
  tab.dispatchEvent(
    new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      view: frame?.contentWindow ?? undefined,
    }),
  );
  tab.dispatchEvent(
    new MouseEvent("mouseup", {
      bubbles: true,
      cancelable: true,
      view: frame?.contentWindow ?? undefined,
    }),
  );
  tab.click();
  return true;
}

function embeddedActionError(frame: HTMLIFrameElement | null) {
  return Array.from(
    frame?.contentDocument?.querySelectorAll<HTMLElement>(
      '[role="alert"], [role="status"]',
    ) ?? [],
  ).some((candidate) =>
    /error|failed|unable|invalid/i.test(candidate.textContent ?? ""),
  );
}

function waitForEmbeddedAction(
  frame: HTMLIFrameElement | null,
  action: EditorAction,
) {
  return new Promise<boolean>((resolve) => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      if (embeddedActionError(frame)) {
        window.clearInterval(timer);
        resolve(false);
        return;
      }

      const state = readEmbeddedActionState(frame);
      const isDisabled =
        action === "Save" ? state.saveDisabled : state.publishDisabled;
      if (isDisabled && Date.now() - startedAt > 350) {
        window.clearInterval(timer);
        resolve(true);
        return;
      }

      if (Date.now() - startedAt > 15000) {
        window.clearInterval(timer);
        resolve(false);
      }
    }, 100);
  });
}

function LinkIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 32 32"
      fill="currentColor"
      focusable="false"
      aria-hidden="true"
    >
      <path d="M17.046 23.441a1.5 1.5 0 0 1 0 2.125l-.742.743a7.502 7.502 0 1 1-10.61-10.61l3.015-3.014A7.5 7.5 0 0 1 19 12.375a1.506 1.506 0 0 1-2 2.25 4.5 4.5 0 0 0-6.171.184l-3.013 3.01a4.5 4.5 0 0 0 6.365 6.365l.743-.743a1.5 1.5 0 0 1 2.122 0m9.26-17.75a7.51 7.51 0 0 0-10.61 0l-.742.743a1.503 1.503 0 1 0 2.125 2.125l.742-.743a4.5 4.5 0 0 1 6.365 6.365l-3.014 3.015a4.5 4.5 0 0 1-6.172.179 1.506 1.506 0 1 0-2 2.25 7.5 7.5 0 0 0 10.288-.304l3.014-3.014a7.51 7.51 0 0 0 .004-10.613z" />
    </svg>
  );
}

export default function MotorsportLivePreviewPage() {
  const [selection] = useState(editorSelectionFromUrl);
  const [uid] = useState(selection.uid);
  const [locale, setLocale] = useState<Locale>(
    () => selection.locale,
  );
  const [documentId] = useState<string | null>(selection.documentId);
  const [zoom, setZoom] = useState(0.65);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [previewViewportWidth, setPreviewViewportWidth] = useState(0);
  const [isNarrow, setIsNarrow] = useState(false);
  const [activeStatus, setActiveStatus] = useState<PreviewStatus>("draft");
  const [actionState, setActionState] = useState<EditorActionState>({
    saveDisabled: true,
    publishDisabled: true,
  });
  const [busyAction, setBusyAction] = useState<BusyAction>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [previewReloadKey, setPreviewReloadKey] = useState(0);
  const [directPreviewSrc, setDirectPreviewSrc] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isEditorDialogOpen, setIsEditorDialogOpen] = useState(false);
  const selectedPage = {
    label: entryLabel(uid),
    uid,
  };
  const editorFrameRef = useRef<HTMLIFrameElement>(null);
  const previewFrameRef = useRef<HTMLIFrameElement>(null);
  const previewStageRef = useRef<HTMLDivElement>(null);
  const zoomInitializedRef = useRef(false);
  const previousPreviewDeviceRef = useRef<PreviewDevice>(previewDevice);
  const [entryTitle, setEntryTitle] = useState(
    ENTRY_TITLES[uid] ?? selectedPage.label,
  );
  const editorSrc = useMemo(
    () => contentManagerUrl(uid, locale, documentId, selection.previewSession),
    [documentId, locale, selection.previewSession, uid],
  );
  const previewDeviceWidth = PREVIEW_DEVICE_WIDTHS[previewDevice];

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(
      "[data-sarga-live-preview-shell]",
    );
    const contentColumn = root?.parentElement;
    const adminLayout = contentColumn?.parentElement;
    const navigation = adminLayout?.firstElementChild;
    if (
      !(contentColumn instanceof HTMLElement) ||
      !(navigation instanceof HTMLElement) ||
      navigation.tagName !== "NAV"
    ) {
      return;
    }

    const previousNavigationDisplay = navigation.style.display;
    const previousContentWidth = contentColumn.style.width;
    const previousContentFlex = contentColumn.style.flex;
    navigation.style.display = "none";
    contentColumn.style.width = "100%";
    contentColumn.style.flex = "1 1 auto";

    return () => {
      navigation.style.display = previousNavigationDisplay;
      contentColumn.style.width = previousContentWidth;
      contentColumn.style.flex = previousContentFlex;
    };
  }, []);

  useEffect(() => {
    const stage = previewStageRef.current;
    const updateViewport = () => {
      setPreviewViewportWidth(stage?.clientWidth ?? window.innerWidth);
      setIsNarrow(window.innerWidth < 980);
    };

    updateViewport();
    const observer = stage ? new ResizeObserver(updateViewport) : null;
    observer?.observe(stage);
    window.addEventListener("resize", updateViewport);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (previewViewportWidth <= 0 || zoomInitializedRef.current) return;
    setZoom(fitPreviewZoom(previewDevice, previewViewportWidth));
    zoomInitializedRef.current = true;
  }, [previewDevice, previewViewportWidth]);

  useEffect(() => {
    const frame = editorFrameRef.current;
    if (!frame) return;

    let observer: MutationObserver | null = null;
    const syncDialogState = () => {
      setIsEditorDialogOpen(
        Boolean(frame.contentDocument?.querySelector('[role="dialog"]')),
      );
    };
    const attachDialogObserver = () => {
      observer?.disconnect();
      const document = frame.contentDocument;
      if (!document?.body) return;

      observer = new MutationObserver(syncDialogState);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      syncDialogState();
    };

    attachDialogObserver();
    frame.addEventListener("load", attachDialogObserver);

    return () => {
      observer?.disconnect();
      frame.removeEventListener("load", attachDialogObserver);
      setIsEditorDialogOpen(false);
    };
  }, [editorSrc]);

  useEffect(() => {
    if (previousPreviewDeviceRef.current === previewDevice) return;
    previousPreviewDeviceRef.current = previewDevice;
    setZoom(fitPreviewZoom(previewDevice, previewViewportWidth));
  }, [previewDevice, previewViewportWidth]);

  useEffect(() => {
    let cancelled = false;

    setPreviewLoading(true);
    setPreviewError(null);
    setDirectPreviewSrc(null);

    void adminGetJson(contentManagerDataEndpoint(uid, locale, documentId))
      .then((payload) => {
        const resolvedDocumentId =
          documentId ?? getDocumentIdFromResponse(payload);
        const resolvedTitle = getEntryTitleFromResponse(payload);
        if (resolvedTitle) setEntryTitle(resolvedTitle);
        if (!resolvedDocumentId) {
          throw new Error("The CMS document identifier was not returned.");
        }
        return resolvedDocumentId;
      })
      .then((documentId) =>
        adminGetJson(previewUrlEndpoint(uid, locale, activeStatus, documentId)),
      )
      .then((payload) => {
        const url = getPreviewUrlFromResponse(payload);
        if (!url) throw new Error("The preview URL response was empty.");
        return url;
      })
      .then((url) => {
        if (!cancelled) setDirectPreviewSrc(url);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setPreviewError(
            error instanceof Error
              ? error.message
              : "The custom live preview could not be loaded.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setPreviewLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeStatus, documentId, locale, previewReloadKey, uid]);

  useEffect(() => {
    const refreshActionState = () => {
      setActionState(readEmbeddedActionState(editorFrameRef.current));
    };

    const frame = editorFrameRef.current;
    if (!frame) return;

    return observeEmbeddedEditorActions(frame, refreshActionState, () => {
      if (findEmbeddedButtons(frame, "Save").length === 0) return;

      setActionState((current) => ({
        ...current,
        saveDisabled: false,
        publishDisabled: false,
      }));
    });
  }, [editorSrc]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleStatusChange = (status: PreviewStatus) => {
    if (busyAction) return;

    setActiveStatus(status);
    triggerEmbeddedStatusTab(editorFrameRef.current, status);
  };

  const handleEditorAction = async (action: EditorAction) => {
    if (busyAction) return;

    const disabled =
      action === "Save" ? actionState.saveDisabled : actionState.publishDisabled;
    if (disabled) return;

    setBusyAction(action);
    setToast({
      kind: "info",
      message: `${action === "Save" ? "Saving" : "Publishing"} Motorsport content…`,
    });

    const triggered = triggerEmbeddedEditorAction(
      editorFrameRef.current,
      action,
    );
    if (!triggered) {
      setBusyAction(null);
      setToast({
        kind: "error",
        message: `${action} could not be started.`,
      });
      return;
    }

    const success = await waitForEmbeddedAction(editorFrameRef.current, action);
    setBusyAction(null);
    setActionState(readEmbeddedActionState(editorFrameRef.current));

    if (success) {
      setPreviewReloadKey((current) => current + 1);
      setToast({
        kind: "success",
        message: `${action} completed successfully.`,
      });
    } else {
      setToast({
        kind: "error",
        message: `${action} failed or timed out.`,
      });
    }
  };

  const saveActive = !actionState.saveDisabled;
  const publishActive = !actionState.publishDisabled;
  const closePreviewWindow = () => {
    window.close();
    window.setTimeout(() => {
      if (!window.closed) window.location.assign(editorSrc);
    }, 80);
  };

  return (
    <main
      data-sarga-live-preview-shell="true"
      style={{ ...styles.page, ...(isNarrow ? styles.pageNarrow : {}) }}
    >
      <style>{`@keyframes sarga-preview-spin { to { transform: rotate(360deg); } }`}</style>
      <header style={{ ...styles.toolbar, ...(isNarrow ? { padding: "12px 14px" } : {}) }}>
        <button
          type="button"
          style={styles.backButton}
          onClick={closePreviewWindow}
        >
          ← Back to editor
        </button>
        <div
          style={{
            ...styles.headingGroup,
            ...(isNarrow ? styles.headingGroupNarrow : {}),
          }}
        >
          <p style={styles.eyebrow}>Sarga Motorsport CMS</p>
          <h1 style={styles.title}>Side-by-side Preview</h1>
          <p style={styles.hint}>
            Edit on the left, Save, and review the custom live preview on the right.
          </p>
        </div>
        <label style={styles.controlGroup}>
          <span style={styles.controlLabel}>Locale</span>
          <select
            aria-label="Preview locale"
            value={locale}
            style={styles.select}
            onChange={(event) => {
              setLocale(event.target.value as Locale);
              setActiveStatus("draft");
              setZoom(fitPreviewZoom(previewDevice, previewViewportWidth));
            }}
          >
            <option value="en">English</option>
            <option value="id">Bahasa Indonesia</option>
          </select>
        </label>
      </header>

      <section
        style={{ ...styles.panes, ...(isNarrow ? styles.panesNarrow : {}) }}
        aria-label={`${selectedPage.label} preview`}
      >
        <section
          style={{ ...styles.pane, ...(isNarrow ? styles.paneNarrow : {}) }}
          aria-label="CMS editor"
        >
          <div style={styles.paneHeader}>
            <span>CMS Editor · {selectedPage.label}</span>
            <span style={styles.paneStatus}>Draft capable</span>
          </div>
          <div
            style={{
              ...styles.editorToolbar,
              ...(isNarrow ? styles.editorToolbarNarrow : {}),
            }}
            aria-label="CMS entry actions"
          >
            <button
              type="button"
              aria-label="Close editor"
              style={{
                ...styles.editorClose,
                ...(isNarrow ? styles.editorCloseNarrow : {}),
              }}
              onClick={closePreviewWindow}
            >
              ×
            </button>
            <span
              style={{
                ...styles.editorEntryTitle,
                ...(isNarrow ? styles.editorEntryTitleNarrow : {}),
              }}
              title={entryTitle}
            >
              {entryTitle}
            </span>
            <span
              style={{
                ...styles.publishedBadge,
                ...(isNarrow ? styles.publishedBadgeNarrow : {}),
              }}
            >
              Published
            </span>
            <div
              style={{
                ...styles.editorStatusTabs,
                ...(isNarrow ? styles.editorStatusTabsNarrow : {}),
              }}
              role="tablist"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeStatus === "draft"}
                style={{
                  ...styles.editorStatusTab,
                  ...(activeStatus === "draft"
                    ? styles.editorStatusTabActive
                    : {}),
                }}
                onClick={() => handleStatusChange("draft")}
              >
                Draft
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeStatus === "published"}
                style={{
                  ...styles.editorStatusTab,
                  ...(activeStatus === "published"
                    ? styles.editorStatusTabActive
                    : {}),
                }}
                onClick={() => handleStatusChange("published")}
              >
                Published
              </button>
            </div>
            <span
              style={{
                ...styles.editorToolbarSpacer,
                ...(isNarrow ? styles.editorToolbarSpacerNarrow : {}),
              }}
            />
            <div
              style={{
                ...styles.editorToolbarActionGroup,
                ...(isNarrow ? styles.editorToolbarActionGroupNarrow : {}),
              }}
            >
              <button
                type="button"
                aria-label="Open preview link"
                title="Open preview link"
                style={styles.editorIconButton}
                disabled={!directPreviewSrc}
                onClick={() => {
                  if (directPreviewSrc) {
                    window.open(directPreviewSrc, "_blank", "noopener");
                  }
                }}
              >
                <LinkIcon />
              </button>
              <button
                type="button"
                disabled={actionState.saveDisabled || busyAction !== null}
                aria-busy={busyAction === "Save"}
                style={{
                  ...styles.editorActionButton,
                  ...(saveActive ? styles.editorActionButtonActive : {}),
                }}
                onClick={() => handleEditorAction("Save")}
              >
                {busyAction === "Save" ? (
                  <>
                    <span
                      aria-hidden="true"
                      style={{
                        ...styles.actionSpinner,
                        animation: "sarga-preview-spin 0.8s linear infinite",
                      }}
                    />
                    Saving…
                  </>
                ) : (
                  "Save"
                )}
              </button>
              <button
                type="button"
                disabled={actionState.publishDisabled || busyAction !== null}
                aria-busy={busyAction === "Publish"}
                style={{
                  ...styles.editorActionButton,
                  ...(publishActive ? styles.editorActionButtonActive : {}),
                }}
                onClick={() => handleEditorAction("Publish")}
              >
                {busyAction === "Publish" ? (
                  <>
                    <span
                      aria-hidden="true"
                      style={{
                        ...styles.actionSpinner,
                        animation: "sarga-preview-spin 0.8s linear infinite",
                      }}
                    />
                    Publishing…
                  </>
                ) : (
                  "Publish"
                )}
              </button>
            </div>
          </div>
          <div style={styles.editorViewport}>
            <iframe
              key={editorSrc}
              ref={editorFrameRef}
              title={`${selectedPage.label} CMS editor`}
              src={editorSrc}
              style={{
                ...styles.editorFrame,
                height: isEditorDialogOpen
                  ? "100%"
                  : `calc(100% + ${EDITOR_CHROME_HEIGHT}px)`,
                transform: isEditorDialogOpen
                  ? "translateY(0)"
                  : `translateY(-${EDITOR_CHROME_HEIGHT}px)`,
              }}
              onLoad={(event) => compactEmbeddedEditor(event.currentTarget)}
            />
          </div>
        </section>

        <section
          style={{ ...styles.pane, ...(isNarrow ? styles.paneNarrow : {}) }}
          aria-label="Frontend preview"
        >
          <div style={styles.paneHeader}>
            <span>Frontend Preview · {locale.toUpperCase()}</span>
            <div style={styles.previewControls}>
              <span style={styles.paneStatus}>
                {activeStatus === "draft" ? "Private draft" : "Published"}
              </span>
              <button
                type="button"
                aria-label="Zoom out frontend preview"
                title="Zoom out"
                style={styles.zoomButton}
                onClick={() =>
                  setZoom((current) =>
                    Math.max(
                      PREVIEW_MIN_ZOOM,
                      Number((current - PREVIEW_ZOOM_STEP).toFixed(2)),
                    ),
                  )
                }
              >
                −
              </button>
              <button
                type="button"
                aria-label="Reset frontend preview zoom"
                title="Reset zoom"
                style={styles.zoomValue}
                onClick={() =>
                  setZoom(fitPreviewZoom(previewDevice, previewViewportWidth))
                }
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                aria-label="Zoom in frontend preview"
                title="Zoom in"
                style={styles.zoomButton}
                onClick={() =>
                  setZoom((current) =>
                    Math.min(
                      PREVIEW_MAX_ZOOM,
                      Number((current + PREVIEW_ZOOM_STEP).toFixed(2)),
                    ),
                  )
                }
              >
                +
              </button>
            </div>
          </div>
          <div style={styles.previewDeviceToolbar}>
            <label style={styles.controlGroup}>
              {/*<span style={styles.controlLabel}>Device layout</span>*/}
              <select
                aria-label="Preview device layout"
                value={previewDevice}
                style={styles.previewDeviceSelect}
                onChange={(event) =>
                  setPreviewDevice(event.target.value as PreviewDevice)
                }
              >
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
              </select>
            </label>
          </div>
          <div
            ref={previewStageRef}
            style={styles.previewStage}
            aria-label={`${previewDevice} preview viewport`}
          >
            {previewLoading ? (
              <div style={styles.previewLoading}>Loading custom live preview…</div>
            ) : previewError ? (
              <div style={{ ...styles.previewLoading, color: "#a82a1d" }}>
                {previewError}
              </div>
            ) : directPreviewSrc ? (
              <div
                style={{
                  ...styles.previewDeviceFrame,
                  width: `${previewDeviceWidth * zoom}px`,
                  height: "100%",
                }}
              >
                <div
                  style={{
                    ...styles.previewDeviceCanvas,
                    width: `${previewDeviceWidth}px`,
                    height: `calc(100% / ${zoom})`,
                    transform: `scale(${zoom})`,
                  }}
                >
                  <iframe
                    key={`${directPreviewSrc}-${previewReloadKey}`}
                    ref={previewFrameRef}
                    title={`${selectedPage.label} custom live preview`}
                    src={directPreviewSrc}
                    style={styles.frame}
                  />
                </div>
              </div>
            ) : null}
          </div>
          <p style={styles.note}>
            The right pane stays private. Save changes in the left editor; the
            Preview session refreshes automatically. Publish only when the
            content is ready for the public website.
          </p>
        </section>
      </section>
      {toast ? (
        <div
          role="status"
          style={{
            ...styles.toast,
            ...(toast.kind === "success"
              ? styles.toastSuccess
              : toast.kind === "error"
                ? styles.toastError
                : styles.toastInfo),
          }}
        >
          {toast.message}
        </div>
      ) : null}
    </main>
  );
}
