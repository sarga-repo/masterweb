"use client";

/**
 * Global error boundary. Replaces the entire document (including the layout),
 * so it renders its own <html>/<body> with inline styling only.
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
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          color: "#fff8e8",
          fontFamily:
            "'Plus Jakarta Sans Variable', system-ui, -apple-system, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "34rem" }}>
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#ff6b00",
            }}
          >
            Sarga Horse Sport
          </p>
          <h1
            style={{
              margin: "1.25rem 0 0",
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              lineHeight: 1.05,
              textTransform: "uppercase",
              fontWeight: 800,
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              margin: "1.25rem 0 0",
              lineHeight: 1.7,
              color: "rgba(255,248,232,0.6)",
            }}
          >
            An unexpected error interrupted the page. Please try again.
          </p>
          {error.digest ? (
            <p
              style={{
                margin: "0.75rem 0 0",
                fontFamily: "monospace",
                fontSize: "0.75rem",
                color: "rgba(255,248,232,0.3)",
              }}
            >
              Error ID: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              cursor: "pointer",
              border: "none",
              background: "#ed1b2f",
              color: "#ffffff",
              padding: "1rem 1.75rem",
              fontSize: "0.7rem",
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
