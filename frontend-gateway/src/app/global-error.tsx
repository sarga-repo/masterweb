"use client";

/**
 * Global error boundary for Sarga.co gateway.
 * Catches errors that bubble up from the root `layout.tsx` itself.
 * Must include its own <html>/<body> and be a Client Component.
 *
 * Design: minimal dark screen — the global-error page should never
 * compete with the main site visually but should still feel on-brand.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#10141b",
          color: "#ffffff",
          fontFamily:
            '"Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: 560 }}>
          {/* Error code */}
          <p
            style={{
              fontSize: "0.62rem",
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#e2321e",
              marginBottom: "1.5rem",
            }}
          >
            Critical failure
          </p>

          {/* Giant number */}
          <p
            aria-hidden="true"
            style={{
              fontSize: "clamp(6rem, 18vw, 14rem)",
              fontWeight: 900,
              lineHeight: 0.82,
              letterSpacing: "-0.04em",
              background:
                "linear-gradient(to bottom right, #ff5032, #e2321e, rgba(255,255,255,0.1))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              userSelect: "none",
            }}
          >
            500
          </p>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginTop: "1rem",
            }}
          >
            System malfunction.
          </h1>

          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "0.95rem",
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            A critical error has occurred in the Sarga network. Our engineers
            are investigating the issue. Please try refreshing or return to the
            homepage.
          </p>

          {error.digest ? (
            <p
              style={{
                marginTop: "1rem",
                fontSize: "0.7rem",
                fontFamily: "monospace",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              Error ID: {error.digest}
            </p>
          ) : null}

          {/* Actions */}
          <div
            style={{
              marginTop: "2.5rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                padding: "0.85rem 2rem",
                background: "#e2321e",
                color: "#ffffff",
                border: "none",
                fontSize: "0.66rem",
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                padding: "0.85rem 2rem",
                border: "1px solid rgba(255,255,255,0.16)",
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                fontSize: "0.66rem",
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              Return home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
