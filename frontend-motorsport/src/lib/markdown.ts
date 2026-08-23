export type MarkdownBlock =
  | { type: "paragraph"; value: string }
  | { type: "heading"; depth: number; value: string }
  | { type: "blockquote"; value: string }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | {
      type: "table";
      headers: string[];
      alignments: Array<"left" | "center" | "right" | undefined>;
      rows: string[][];
    }
  | { type: "code"; language?: string; value: string }
  | { type: "image"; alt: string; src: string; title?: string }
  | { type: "rule" };

const FENCE_RE = /^ {0,3}(```+|~~~+)\s*([^\s]*)\s*$/;
const HEADING_RE = /^ {0,3}(#{1,6})\s+(.+?)\s*#*\s*$/;
const UNORDERED_ITEM_RE = /^ {0,3}[-+*]\s+(.+)$/;
const ORDERED_ITEM_RE = /^ {0,3}\d+[.)]\s+(.+)$/;
const BLOCKQUOTE_RE = /^ {0,3}>\s?(.*)$/;
const IMAGE_RE = /^!\[([^\]]*)\]\((\S+?)(?:\s+["']([^"']*)["'])?\)$/;
const RULE_RE = /^ {0,3}([-*_])(?:\s*\1){2,}\s*$/;

function isBlank(line: string) {
  return line.trim() === "";
}

function startsBlock(line: string) {
  return (
    FENCE_RE.test(line) ||
    HEADING_RE.test(line) ||
    BLOCKQUOTE_RE.test(line) ||
    UNORDERED_ITEM_RE.test(line) ||
    ORDERED_ITEM_RE.test(line) ||
    IMAGE_RE.test(line.trim()) ||
    RULE_RE.test(line)
  );
}

function splitTableRow(line: string) {
  let value = line.trim();
  if (value.startsWith("|")) value = value.slice(1);
  if (value.endsWith("|") && !value.endsWith("\\|")) {
    value = value.slice(0, -1);
  }

  const cells: string[] = [];
  let cell = "";
  let escaped = false;
  for (const character of value) {
    if (escaped) {
      cell += character;
      escaped = false;
    } else if (character === "\\") {
      escaped = true;
    } else if (character === "|") {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += character;
    }
  }
  if (escaped) cell += "\\";
  cells.push(cell.trim());
  return cells;
}

function parseTableAt(
  lines: string[],
  start: number,
): {
  block: Extract<MarkdownBlock, { type: "table" }>;
  nextIndex: number;
} | null {
  if (start + 1 >= lines.length) return null;

  const headers = splitTableRow(lines[start]);
  const separators = splitTableRow(lines[start + 1]);
  if (
    headers.length < 2 ||
    headers.length !== separators.length ||
    separators.some((separator) => !/^:?-{3,}:?$/.test(separator))
  ) {
    return null;
  }

  const alignments = separators.map((separator) => {
    const starts = separator.startsWith(":");
    const ends = separator.endsWith(":");
    if (starts && ends) return "center" as const;
    if (ends) return "right" as const;
    if (starts) return "left" as const;
    return undefined;
  });

  const rows: string[][] = [];
  let nextIndex = start + 2;
  while (nextIndex < lines.length && !isBlank(lines[nextIndex])) {
    if (startsBlock(lines[nextIndex]) || parseTableAt(lines, nextIndex)) break;
    const cells = splitTableRow(lines[nextIndex]);
    if (cells.length < 2) break;
    rows.push(headers.map((_, columnIndex) => cells[columnIndex] ?? ""));
    nextIndex += 1;
  }

  return {
    block: { type: "table", headers, alignments, rows },
    nextIndex,
  };
}

/**
 * Parse the Markdown subset produced by Strapi's rich-text editor.
 * The result is an AST so the React renderer never needs to inject HTML.
 */
export function parseMarkdown(source: string): MarkdownBlock[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    if (isBlank(lines[index])) {
      index += 1;
      continue;
    }

    const fence = lines[index].match(FENCE_RE);
    if (fence) {
      const marker = fence[1];
      const codeLines: string[] = [];
      const language = fence[2] || undefined;
      index += 1;
      while (
        index < lines.length &&
        !new RegExp(`^ {0,3}${marker[0]}{${marker.length},}\\s*$`).test(
          lines[index],
        )
      ) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push({ type: "code", language, value: codeLines.join("\n") });
      continue;
    }

    const heading = lines[index].match(HEADING_RE);
    if (heading) {
      blocks.push({
        type: "heading",
        depth: heading[1].length,
        value: heading[2],
      });
      index += 1;
      continue;
    }

    const table = parseTableAt(lines, index);
    if (table) {
      blocks.push(table.block);
      index = table.nextIndex;
      continue;
    }

    if (BLOCKQUOTE_RE.test(lines[index])) {
      const quoteLines: string[] = [];
      while (index < lines.length) {
        const quoteLine = lines[index].match(BLOCKQUOTE_RE);
        if (!quoteLine) break;
        quoteLines.push(quoteLine[1]);
        index += 1;
      }
      blocks.push({ type: "blockquote", value: quoteLines.join("\n") });
      continue;
    }

    const unordered = lines[index].match(UNORDERED_ITEM_RE);
    if (unordered) {
      const items: string[] = [];
      while (index < lines.length) {
        const item = lines[index].match(UNORDERED_ITEM_RE);
        if (!item) break;
        items.push(item[1]);
        index += 1;
      }
      blocks.push({ type: "unordered-list", items });
      continue;
    }

    const ordered = lines[index].match(ORDERED_ITEM_RE);
    if (ordered) {
      const items: string[] = [];
      while (index < lines.length) {
        const item = lines[index].match(ORDERED_ITEM_RE);
        if (!item) break;
        items.push(item[1]);
        index += 1;
      }
      blocks.push({ type: "ordered-list", items });
      continue;
    }

    const image = lines[index].trim().match(IMAGE_RE);
    if (image) {
      blocks.push({
        type: "image",
        alt: image[1],
        src: image[2],
        ...(image[3] ? { title: image[3] } : {}),
      });
      index += 1;
      continue;
    }

    if (RULE_RE.test(lines[index])) {
      blocks.push({ type: "rule" });
      index += 1;
      continue;
    }

    const paragraphLines = [lines[index]];
    index += 1;
    while (
      index < lines.length &&
      !isBlank(lines[index]) &&
      !startsBlock(lines[index]) &&
      !parseTableAt(lines, index)
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    blocks.push({ type: "paragraph", value: paragraphLines.join("\n") });
  }

  return blocks;
}

/** Only allow links that cannot execute script or embed arbitrary protocols. */
export function safeMarkdownUrl(value?: string | null) {
  if (typeof value !== "string") return undefined;
  const url = value.trim();
  if ((url.startsWith("/") && !url.startsWith("//")) || url.startsWith("#")) {
    return url;
  }
  try {
    const parsed = new URL(url.startsWith("//") ? `https:${url}` : url);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.href
      : undefined;
  } catch {
    return undefined;
  }
}
