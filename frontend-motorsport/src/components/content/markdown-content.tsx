import type { ElementType, ReactNode } from "react";

import {
  parseMarkdown,
  safeMarkdownUrl,
  type MarkdownBlock,
} from "@/lib/markdown";
import { strapiConfig } from "@/lib/strapi/config";

type MarkdownContentProps = {
  value: string;
  className?: string;
};

const INLINE_RE =
  /(?:!\[([^\]]*)\]\((\S+?)(?:\s+["']([^"']*)["'])?\)|\[([^\]]+)\]\((\S+?)\)|(`[^`\n]+`)|(\*\*[^*\n]+\*\*|__[^_\n]+__)|(~~[^~\n]+~~)|(\*[^*\n]+\*|_[^_\n]+_))/;

function resolveContentUrl(value?: string) {
  const safeUrl = safeMarkdownUrl(value);
  if (!safeUrl) return undefined;

  // Strapi's editor can save a local absolute media URL when content is
  // authored in local development. Point that same asset at the configured
  // browser-facing CMS origin when the content is rendered elsewhere.
  try {
    const parsed = new URL(safeUrl);
    const cmsOrigin = new URL(strapiConfig.publicApiUrl);
    if (
      ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname) &&
      parsed.pathname.startsWith("/uploads/")
    ) {
      parsed.protocol = cmsOrigin.protocol;
      parsed.hostname = cmsOrigin.hostname;
      parsed.port = cmsOrigin.port;
      return parsed.href;
    }
  } catch {
    // Relative URLs and already-safe public URLs need no normalization.
  }

  return safeUrl;
}

function renderText(value: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let remaining = value;
  let key = 0;

  while (remaining) {
    const match = remaining.match(INLINE_RE);
    if (!match || match.index === undefined) {
      nodes.push(renderPlainText(remaining, `${keyPrefix}-${key}`));
      break;
    }

    if (match.index > 0) {
      nodes.push(
        renderPlainText(
          remaining.slice(0, match.index),
          `${keyPrefix}-text-${key}`,
        ),
      );
    }

    const token = match[0];
    if (match[1] !== undefined) {
      const src = match[2] ? resolveContentUrl(match[2]) : undefined;
      nodes.push(
        src ? (
          // Markdown images can come from a CMS host not known at build time.
          // Native lazy images keep the content portable across environments.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${keyPrefix}-image-${key}`}
            src={src}
            alt={match[1]}
            title={match[3]}
            loading="lazy"
            decoding="async"
          />
        ) : (
          renderPlainText(match[1] || token, `${keyPrefix}-image-alt-${key}`)
        ),
      );
    } else if (match[4] !== undefined) {
      const href = match[5] ? safeMarkdownUrl(match[5]) : undefined;
      nodes.push(
        href ? (
          <a
            key={`${keyPrefix}-link-${key}`}
            href={href}
            target={
              href.startsWith("/") || href.startsWith("#")
                ? undefined
                : "_blank"
            }
            rel={
              href.startsWith("/") || href.startsWith("#")
                ? undefined
                : "noreferrer"
            }
          >
            {renderText(match[4], `${keyPrefix}-link-label-${key}`)}
          </a>
        ) : (
          renderPlainText(match[4], `${keyPrefix}-link-label-${key}`)
        ),
      );
    } else if (match[6]) {
      nodes.push(
        <code key={`${keyPrefix}-code-${key}`}>{match[6].slice(1, -1)}</code>,
      );
    } else if (match[7]) {
      nodes.push(
        <strong key={`${keyPrefix}-strong-${key}`}>
          {renderText(
            match[7].slice(2, -2),
            `${keyPrefix}-strong-value-${key}`,
          )}
        </strong>,
      );
    } else if (match[8]) {
      nodes.push(
        <del key={`${keyPrefix}-del-${key}`}>
          {renderText(match[8].slice(2, -2), `${keyPrefix}-del-value-${key}`)}
        </del>,
      );
    } else if (match[9]) {
      nodes.push(
        <em key={`${keyPrefix}-em-${key}`}>
          {renderText(match[9].slice(1, -1), `${keyPrefix}-em-value-${key}`)}
        </em>,
      );
    }

    remaining = remaining.slice(match.index + token.length);
    key += 1;
  }

  return nodes;
}

function renderPlainText(value: string, keyPrefix: string): ReactNode {
  const lines = value.split("\n");
  return lines.map((line, index) => (
    <span key={`${keyPrefix}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

function MarkdownBlocks({ blocks }: { blocks: MarkdownBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        const key = `block-${index}`;
        switch (block.type) {
          case "heading": {
            const Heading = `h${block.depth}` as ElementType;
            return <Heading key={key}>{renderText(block.value, key)}</Heading>;
          }
          case "blockquote":
            return (
              <blockquote key={key}>
                <MarkdownBlocks blocks={parseMarkdown(block.value)} />
              </blockquote>
            );
          case "unordered-list":
            return (
              <ul key={key}>
                {block.items.map((item, itemIndex) => (
                  <li key={`${key}-item-${itemIndex}`}>
                    {renderText(item, `${key}-item-${itemIndex}`)}
                  </li>
                ))}
              </ul>
            );
          case "ordered-list":
            return (
              <ol key={key}>
                {block.items.map((item, itemIndex) => (
                  <li key={`${key}-item-${itemIndex}`}>
                    {renderText(item, `${key}-item-${itemIndex}`)}
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={key} className="ms-rich-text-table-wrap">
                <table>
                  <thead>
                    <tr>
                      {block.headers.map((header, columnIndex) => (
                        <th
                          key={`${key}-header-${columnIndex}`}
                          scope="col"
                          style={{ textAlign: block.alignments[columnIndex] }}
                        >
                          {renderText(header, `${key}-header-${columnIndex}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={`${key}-row-${rowIndex}`}>
                        {block.headers.map((_, columnIndex) => (
                          <td
                            key={`${key}-row-${rowIndex}-cell-${columnIndex}`}
                            style={{
                              textAlign: block.alignments[columnIndex],
                            }}
                          >
                            {renderText(
                              row[columnIndex] ?? "",
                              `${key}-row-${rowIndex}-cell-${columnIndex}`,
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "code":
            return (
              <pre key={key}>
                <code data-language={block.language}>{block.value}</code>
              </pre>
            );
          case "image": {
            const src = resolveContentUrl(block.src);
            return src ? (
              <figure key={key}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={block.alt}
                  title={block.title}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ) : null;
          }
          case "rule":
            return <hr key={key} />;
          case "paragraph":
            return <p key={key}>{renderText(block.value, key)}</p>;
        }
      })}
    </>
  );
}

export function MarkdownContent({ value, className }: MarkdownContentProps) {
  return (
    <div className={className}>
      <MarkdownBlocks blocks={parseMarkdown(value)} />
    </div>
  );
}
