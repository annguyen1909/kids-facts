import { isNavigableInternalPath } from "@/lib/routes";

export type FaqAnswerSegment =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string };

const markdownLinkPattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export function parseFaqAnswer(answer: string): FaqAnswerSegment[] {
  const segments: FaqAnswerSegment[] = [];
  let cursor = 0;

  for (const match of answer.matchAll(markdownLinkPattern)) {
    const index = match.index ?? 0;
    const [raw, label, href] = match;

    if (index > cursor) {
      segments.push({ type: "text", value: answer.slice(cursor, index) });
    }

    const safeHref = normalizeFaqHref(href);
    if (safeHref) {
      segments.push({ type: "link", label, href: safeHref });
    } else {
      segments.push({ type: "text", value: label });
    }

    cursor = index + raw.length;
  }

  if (cursor < answer.length) {
    segments.push({ type: "text", value: answer.slice(cursor) });
  }

  return segments.length > 0 ? segments : [{ type: "text", value: answer }];
}

export function stripFaqMarkdown(answer: string) {
  return parseFaqAnswer(answer)
    .map((segment) => (segment.type === "text" ? segment.value : segment.label))
    .join("");
}

function normalizeFaqHref(href: string) {
  if (href.startsWith("/")) {
    return isNavigableInternalPath(href) ? href : null;
  }

  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
