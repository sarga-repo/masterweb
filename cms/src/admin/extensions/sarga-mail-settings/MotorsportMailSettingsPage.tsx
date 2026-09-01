import { Page, useFetchClient } from "@strapi/strapi/admin";
import { useEffect, useState, type CSSProperties, type FormEvent } from "react";

type MailSettings = {
  enabled: boolean;
  notificationsEnabled: boolean;
  smtpUser: string;
  fromAddress: string;
  fromName: string;
  defaultReplyTo: string;
  recipient: string;
  tenantId: string;
  clientId: string;
  clientSecretConfigured: boolean;
  host: string;
  port: number;
  requireTls: boolean;
  scope: string;
};

type EditableSettings = MailSettings & {
  clientSecret: string;
  clearClientSecret: boolean;
};

const endpoint = "/users-permissions/sarga-motorsport-mail-settings";
const READ_PERMISSION = "admin::sarga-mail-settings.read";

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100dvh",
    boxSizing: "border-box",
    width: "100%",
    padding: "32px clamp(20px, 4vw, 72px) 72px",
    background: "#111113",
    color: "#fff9ee",
    fontFamily: '"Noto Sans", "Plus Jakarta Sans", system-ui, sans-serif',
  },
  shell: { maxWidth: 1040, margin: "0 auto" },
  eyebrow: {
    margin: 0,
    color: "#f5c800",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
  },
  title: {
    margin: "12px 0 0",
    fontFamily: '"Zalando Sans Expanded", "Plus Jakarta Sans", system-ui, sans-serif',
    fontSize: "clamp(34px, 5vw, 64px)",
    lineHeight: 1,
    letterSpacing: "-0.04em",
  },
  intro: {
    maxWidth: 720,
    margin: "18px 0 0",
    color: "#c2b9aa",
    fontSize: 16,
    lineHeight: 1.7,
  },
  notice: {
    marginTop: 24,
    padding: "14px 18px",
    border: "1px solid rgba(0,196,204,.35)",
    borderLeft: "4px solid #00c4cc",
    background: "#1b1b1b",
    color: "#e8decf",
    lineHeight: 1.6,
  },
  card: {
    margin: 0,
    marginBottom: "30px",
    padding: "24px clamp(18px, 3vw, 34px)",
    boxSizing: "border-box",
    border: "1px solid rgba(255,249,238,.16)",
    borderRadius: 0,
    background: "#242426",
    boxShadow: "0 18px 36px rgba(0,0,0,.16)",
  },
  form: {
    display: "grid",
    gap: 22,
    marginTop: 22,
  },
  cardTitle: {
    margin: 0,
    color: "#fff9ee",
    fontSize: 22,
    fontWeight: 800,
  },
  cardDescription: {
    margin: "8px 0 22px",
    color: "#c2b9aa",
    lineHeight: 1.55,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 18,
    alignItems: "start",
  },
  field: { display: "grid", gap: 8, minWidth: 0, alignSelf: "start" },
  label: {
    color: "#fff9ee",
    fontSize: 13,
    fontWeight: 750,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: 44,
    padding: "11px 12px",
    border: "1px solid rgba(255,249,238,.24)",
    borderRadius: 0,
    background: "#111113",
    color: "#fff9ee",
    font: "inherit",
  },
  help: { margin: 0, color: "#a79f92", fontSize: 12, lineHeight: 1.5 },
  toggleRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minHeight: 44,
    alignSelf: "start",
    color: "#fff9ee",
  },
  readOnly: {
    display: "flex",
    alignItems: "center",
    minHeight: 44,
    boxSizing: "border-box",
    padding: "11px 12px",
    border: "1px dashed rgba(255,249,238,.24)",
    borderRadius: 0,
    color: "#c2b9aa",
    background: "rgba(17,17,19,.55)",
    overflowWrap: "anywhere",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
    marginTop: 26,
    paddingTop: 22,
    paddingBottom: 4,
    borderTop: "1px solid rgba(255,249,238,.14)",
  },
  actions: { display: "flex", gap: 10, flexWrap: "wrap", marginLeft: "auto" },
  button: {
    padding: "11px 18px",
    border: "1px solid #e8192c",
    borderRadius: 0,
    background: "#e8192c",
    color: "#fff9ee",
    font: "inherit",
    fontWeight: 800,
    cursor: "pointer",
  },
  secondaryButton: {
    borderColor: "#00c4cc",
    background: "transparent",
    color: "#00c4cc",
  },
  status: { margin: 0, color: "#f5c800", fontSize: 13, fontWeight: 700 },
};

function emptySettings(): EditableSettings {
  return {
    enabled: false,
    notificationsEnabled: false,
    smtpUser: "",
    fromAddress: "",
    fromName: "Sarga Motorsport",
    defaultReplyTo: "",
    recipient: "",
    tenantId: "",
    clientId: "",
    clientSecretConfigured: false,
    clientSecret: "",
    clearClientSecret: false,
    host: "smtp.office365.com",
    port: 587,
    requireTls: true,
    scope: "https://outlook.office365.com/.default",
  };
}

export default function MotorsportMailSettingsPage() {
  const { get, put, post } = useFetchClient();
  const [settings, setSettings] = useState<EditableSettings>(emptySettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Strapi's admin content shell keeps its own viewport-height surface. Set
    // the document backdrop as well so the page remains dark below that shell
    // when the settings form is taller than the viewport.
    const root = document.documentElement;
    const body = document.body;
    const previousRootBackground = root.style.getPropertyValue("background-color");
    const previousRootPriority = root.style.getPropertyPriority("background-color");
    const previousBodyBackground = body.style.getPropertyValue("background-color");
    const previousBodyPriority = body.style.getPropertyPriority("background-color");
    root.style.setProperty("background-color", "#111113", "important");
    body.style.setProperty("background-color", "#111113", "important");

    const pageElement = document.querySelector<HTMLElement>(
      '[data-sarga-mail-settings="motorsport"]',
    );
    const pageRect = pageElement?.getBoundingClientRect();
    const surface = pageElement && pageRect ? pageElement.parentElement : null;
    let scrollSurface: HTMLElement | null = null;
    let previousSurfaceBackground = "";
    let previousSurfacePriority = "";
    let ancestor = surface;
    while (ancestor && ancestor !== body && pageRect) {
      const rect = ancestor.getBoundingClientRect();
      const computed = getComputedStyle(ancestor);
      if (
        Math.abs(rect.left - pageRect.left) <= 2 &&
        rect.width >= pageRect.width - 2 &&
        (computed.overflowY === "auto" || computed.overflowY === "scroll" || ancestor.scrollHeight > ancestor.clientHeight)
      ) {
        scrollSurface = ancestor;
        previousSurfaceBackground = ancestor.style.getPropertyValue("background-color");
        previousSurfacePriority = ancestor.style.getPropertyPriority("background-color");
        ancestor.style.setProperty("background-color", "#111113", "important");
        break;
      }
      ancestor = ancestor.parentElement;
    }

    return () => {
      if (scrollSurface) {
        if (previousSurfaceBackground) scrollSurface.style.setProperty("background-color", previousSurfaceBackground, previousSurfacePriority);
        else scrollSurface.style.removeProperty("background-color");
      }
      if (previousRootBackground) root.style.setProperty("background-color", previousRootBackground, previousRootPriority);
      else root.style.removeProperty("background-color");
      if (previousBodyBackground) body.style.setProperty("background-color", previousBodyBackground, previousBodyPriority);
      else body.style.removeProperty("background-color");
    };
  }, [isLoading]);

  useEffect(() => {
    let cancelled = false;
    get(endpoint)
      .then((response: { data?: { data?: MailSettings } }) => {
        if (cancelled || !response.data?.data) return;
        setSettings({ ...response.data.data, clientSecret: "", clearClientSecret: false });
      })
      .catch((requestError: any) => {
        if (!cancelled) setError(requestError?.response?.data?.error?.message || "Unable to load mail settings.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [get]);

  const update = <K extends keyof EditableSettings>(key: K, value: EditableSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setStatus("");
    setError("");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus("");
    setError("");
    try {
      const { clientSecret, clientSecretConfigured, clearClientSecret, host, port, requireTls, scope, ...data } = settings;
      const response = await put(endpoint, {
        data: {
          ...data,
          ...(clientSecret ? { clientSecret } : {}),
          ...(clearClientSecret ? { clearClientSecret: true } : {}),
        },
      });
      const saved = response.data?.data as MailSettings | undefined;
      if (saved) setSettings({ ...saved, clientSecret: "", clearClientSecret: false });
      setStatus("Motorsport mail settings saved. The environment remains the fallback for blank fields.");
    } catch (requestError: any) {
      setError(requestError?.response?.data?.error?.message || "Unable to save mail settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const verify = async () => {
    setIsVerifying(true);
    setStatus("");
    setError("");
    try {
      await post(`${endpoint}/verify`);
      setStatus("SMTP connection verified successfully. No email was sent.");
    } catch (requestError: any) {
      setError(requestError?.response?.data?.error?.message || "SMTP verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return <main style={styles.page} data-sarga-mail-settings="motorsport"><div style={styles.shell}>Loading Motorsport mail settings…</div></main>;
  }

  return (
    <Page.Protect permissions={[{ action: READ_PERMISSION, subject: null }]}>
      <main style={styles.page} data-sarga-mail-settings="motorsport">
        <div style={styles.shell}>
          <p style={styles.eyebrow}>Sarga Motorsport · Admin settings</p>
          <h1 style={styles.title}>SMTP Mail Settings</h1>
          <p style={styles.intro}>
            Configure the Microsoft 365 OAuth SMTP sender used by Motorsport inquiry notifications.
            Values saved here override the matching environment variable; blank values continue to use the environment fallback.
          </p>
          <div style={styles.notice} role="note">
            Access is restricted to Motorsport Admin and Super Admin. OAuth client secrets are encrypted before they are stored and are never returned to this screen.
          </div>

          <form onSubmit={submit} style={styles.form}>
            <section style={styles.card} aria-labelledby="mail-status-title">
              <h2 id="mail-status-title" style={styles.cardTitle}>Delivery status</h2>
              <p style={styles.cardDescription}>The host, port, TLS requirement, and OAuth scope are fixed to the approved Exchange Online transport.</p>
              <div style={styles.grid}>
                <label style={styles.toggleRow}>
                  <input type="checkbox" checked={settings.enabled} onChange={(event) => update("enabled", event.target.checked)} />
                  <span>Enable SMTP transport</span>
                </label>
                <label style={styles.toggleRow}>
                  <input type="checkbox" checked={settings.notificationsEnabled} onChange={(event) => update("notificationsEnabled", event.target.checked)} />
                  <span>Enable Motorsport inquiry notifications</span>
                </label>
              </div>
            </section>

            <section style={styles.card} aria-labelledby="mail-identity-title">
              <h2 id="mail-identity-title" style={styles.cardTitle}>Sender identity</h2>
              <p style={styles.cardDescription}>The sender address must match the OAuth SMTP mailbox.</p>
              <div style={styles.grid}>
                <Field label="SMTP mailbox" value={settings.smtpUser} onChange={(value) => update("smtpUser", value)} type="email" />
                <Field label="From address" value={settings.fromAddress} onChange={(value) => update("fromAddress", value)} type="email" />
                <Field label="From name" value={settings.fromName} onChange={(value) => update("fromName", value)} />
                <Field label="Default Reply-To" value={settings.defaultReplyTo} onChange={(value) => update("defaultReplyTo", value)} type="email" />
                <Field label="Motorsport notification recipient" value={settings.recipient} onChange={(value) => update("recipient", value)} type="email" />
              </div>
            </section>

            <section style={styles.card} aria-labelledby="oauth-title">
              <h2 id="oauth-title" style={styles.cardTitle}>Microsoft OAuth</h2>
              <p style={styles.cardDescription}>Leave the secret blank to keep the currently stored secret. A secret from the environment is used when no CMS secret is stored.</p>
              <div style={styles.grid}>
                <Field label="Tenant ID" value={settings.tenantId} onChange={(value) => update("tenantId", value)} />
                <Field label="Client ID" value={settings.clientId} onChange={(value) => update("clientId", value)} />
                <Field label="Client secret" value={settings.clientSecret} onChange={(value) => { update("clientSecret", value); if (value) update("clearClientSecret", false); }} type="password" placeholder={settings.clientSecretConfigured ? "Leave blank to keep the current secret" : "Enter secret value"} help={settings.clientSecretConfigured ? "A secret is configured. It is never displayed." : "No CMS secret is stored; the environment fallback will be used."} />
                <label style={{ ...styles.toggleRow, gridColumn: "1 / -1" }}>
                  <input type="checkbox" checked={settings.clearClientSecret} onChange={(event) => { update("clearClientSecret", event.target.checked); if (event.target.checked) update("clientSecret", ""); }} />
                  <span>Clear the stored secret and use the environment fallback</span>
                </label>
                <ReadOnly label="SMTP host" value={`${settings.host}:${settings.port}`} />
                <ReadOnly label="TLS" value={settings.requireTls ? "STARTTLS required" : "Disabled"} />
                <ReadOnly label="OAuth scope" value={settings.scope} />
              </div>

              <div style={styles.footer}>
                <p style={styles.status} role="status">{status || error}</p>
                <div style={styles.actions}>
                  <button type="button" style={{ ...styles.button, ...styles.secondaryButton }} onClick={verify} disabled={isVerifying || isSaving}>
                    {isVerifying ? "Verifying…" : "Verify connection"}
                  </button>
                  <button type="submit" style={styles.button} disabled={isSaving || isVerifying}>
                    {isSaving ? "Saving…" : "Save settings"}
                  </button>
                </div>
              </div>
            </section>
          </form>
        </div>
      </main>
    </Page.Protect>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  help,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  help?: string;
}) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      <input style={styles.input} type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      {help ? <p style={styles.help}>{help}</p> : null}
    </label>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.field}>
      <span style={styles.label}>{label}</span>
      <div style={styles.readOnly}>{value}</div>
    </div>
  );
}
