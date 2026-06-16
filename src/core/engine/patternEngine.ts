import type { MorphemePart } from "../types";

/**
 * Renders a MorphemePart[] breakdown as a single display string, with the
 * prefix/suffix wrapped in ** for highlight rendering.
 *
 * Example: [{ text: "umu", type: "prefix" }, { text: "gabo", type: "stem" }]
 *   → "**umu**gabo"
 *
 * The UI layer should replace **text** with a highlighted span.
 */
export function renderBreakdown(parts: MorphemePart[]): string {
  return parts
    .map((p) => {
      if (p.type === "prefix" || p.type === "suffix") {
        return `**${p.text}**`;
      }
      return p.text;
    })
    .join("");
}

/**
 * Returns the parts that are highlighted (prefix or suffix) from a breakdown.
 */
export function getHighlightedParts(parts: MorphemePart[]): MorphemePart[] {
  return parts.filter((p) => p.type === "prefix" || p.type === "suffix");
}

/**
 * Swaps a morpheme text segment in a word string.
 *
 * Used by prefix_swap exercises: swapPrefix("ndafite", "nda", "u") → "ufite"
 *
 * Only swaps the first occurrence (prefixes are at the start).
 */
export function swapPrefix(
  word: string,
  fromMorpheme: string,
  toMorpheme: string,
): string {
  if (word.toLowerCase().startsWith(fromMorpheme.toLowerCase())) {
    return toMorpheme + word.slice(fromMorpheme.length);
  }
  return word;
}

/**
 * Parses a **bold** marked string into segments for rendering.
 * Returns an array of { text, highlighted } objects.
 */
export function parseHighlightMarks(
  markedString: string,
): { text: string; highlighted: boolean }[] {
  const segments: { text: string; highlighted: boolean }[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(markedString)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: markedString.slice(lastIndex, match.index), highlighted: false });
    }
    segments.push({ text: match[1], highlighted: true });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < markedString.length) {
    segments.push({ text: markedString.slice(lastIndex), highlighted: false });
  }

  return segments;
}
