/** Converts text into HTML paragraphs with preserved line breaks. */
export function toHtmlBlocks(value: string): string {
  const normalized = normalizeValue(value);
  if (normalized.length === 0) {
    return "<p>Not Available</p>";
  }
  const paragraphs = normalized.split(/\n{2,}/).map((paragraph) =>
    paragraph
      .split(/\n+/)
      .map((line) => escapeHtml(line))
      .join("<br>"),
  );
  return paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
}

/** Converts a URL and label into a single HTML link paragraph. */
export function toLinkHtml(url: string, label: string): string {
  const normalizedUrl = normalizeValue(url);
  const normalizedLabel = normalizeValue(label);
  if (normalizedUrl.length === 0 && normalizedLabel.length === 0) {
    return "<p>Not Available</p>";
  }
  if (normalizedUrl.length === 0) {
    return `<p>${escapeHtml(normalizedLabel)}</p>`;
  }
  const safeUrl = escapeAttribute(normalizedUrl);
  const safeLabel =
    normalizedLabel.length === 0 ? normalizedUrl : escapeHtml(normalizedLabel);
  return `<p><a href="${safeUrl}">${safeLabel}</a></p>`;
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(input: string): string {
  return escapeHtml(input).replaceAll("`", "&#96;");
}

function normalizeValue(value: string): string {
  return value.replaceAll("\r\n", "\n").trim();
}
