import argparse
import os
import re
import sys
from pathlib import Path

IN_GITHUB_ACTIONS = os.environ.get("GITHUB_ACTIONS") == "true"


def emit(path, line, message):
    print(f"{path}:{line}: {message}")
    if IN_GITHUB_ACTIONS:
        print(f"::error file={path},line={line}::{message}")

SMALL_WORDS = {
    "a", "an", "the",
    "and", "or", "but", "nor", "so", "yet",
    "as", "at", "by", "for", "from", "in", "into",
    "of", "on", "onto", "over", "per", "to", "up", "via", "with",
}

ATX_HEADING_RE = re.compile(r"^(#{1,6})\s+(.*?)\s*$")
FENCE_RE = re.compile(r"^\s*(```|~~~)")
FRONTMATTER_DELIM_RE = re.compile(r"^---\s*$")
HEADING_ANCHOR_RE = re.compile(r"\s*\{#[\w-]+\}\s*$")
INLINE_CODE_RE = re.compile(r"`[^`]*`")


TOKEN_RE = re.compile(r"[A-Za-z0-9'’]+|[^A-Za-z0-9'’]+")


def split_words_preserving_delims(text):
    tokens = []
    for part in TOKEN_RE.findall(text):
        is_word = part[0].isalpha()
        tokens.append((part, is_word))
    return tokens


def title_case_word(word, is_first, is_last):
    lower = word.lower()
    if not is_first and not is_last and lower in SMALL_WORDS:
        return lower
    if word[0].isupper():
        return word
    return word[0].upper() + word[1:]


def check_and_fix_heading(text):
    tokens = split_words_preserving_delims(text)
    word_positions = [i for i, (_, is_word) in enumerate(tokens) if is_word]
    if not word_positions:
        return False, text

    first_idx = word_positions[0]
    last_idx = word_positions[-1]

    new_tokens = list(tokens)
    changed = False
    for i, (tok, is_word) in enumerate(tokens):
        if not is_word:
            continue
        fixed = title_case_word(tok, i == first_idx, i == last_idx)
        if fixed != tok:
            changed = True
        new_tokens[i] = (fixed, True)

    suggestion = "".join(t for t, _ in new_tokens)
    return changed, suggestion


def extract_headings(lines):
    in_frontmatter = False
    in_fence = False
    results = []

    for i, line in enumerate(lines):
        if i == 0 and FRONTMATTER_DELIM_RE.match(line):
            in_frontmatter = True
            continue
        if in_frontmatter:
            if FRONTMATTER_DELIM_RE.match(line):
                in_frontmatter = False
            continue

        if FENCE_RE.match(line):
            in_fence = not in_fence
            continue
        if in_fence:
            continue

        m = ATX_HEADING_RE.match(line)
        if not m:
            continue

        hashes, raw_text = m.groups()
        text_for_check = HEADING_ANCHOR_RE.sub("", raw_text)
        code_spans = INLINE_CODE_RE.findall(text_for_check)
        placeholder_text = INLINE_CODE_RE.sub("\x00", text_for_check)

        results.append((i, hashes, raw_text, placeholder_text, code_spans))

    return results


def restore_code_spans(text, code_spans):
    for span in code_spans:
        text = text.replace("\x00", span, 1)
    return text


def process_file(path, fix=False):
    lines = path.read_text(encoding="utf-8").splitlines()
    headings = extract_headings(lines)
    issues = []

    for lineno, hashes, raw_text, placeholder_text, code_spans in headings:
        changed, suggestion = check_and_fix_heading(placeholder_text)
        if not changed:
            continue
        suggestion = restore_code_spans(suggestion, code_spans)
        issues.append((lineno, hashes, raw_text, suggestion))

        if fix:
            lines[lineno] = f"{hashes} {suggestion}"

    if fix and issues:
        path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    return issues


def main():
    parser = argparse.ArgumentParser(description="Check Markdown ATX heading title case")
    parser.add_argument("paths", nargs="+")
    parser.add_argument("--fix", action="store_true")
    args = parser.parse_args()

    md_files = []
    for p in args.paths:
        root = Path(p)
        if not root.exists():
            continue
        md_files.extend(root.rglob("*.md"))
        md_files.extend(root.rglob("*.mdx"))

    total_issues = 0
    for path in sorted(md_files):
        issues = process_file(path, fix=args.fix)
        for lineno, hashes, raw_text, suggestion in issues:
            total_issues += 1
            message = f"Heading case: '{hashes} {raw_text}' should be '{hashes} {suggestion}'"
            emit(str(path), lineno + 1, message)

    if total_issues == 0:
        print("All headings pass title case check.")
        return 0

    print(f"\n{total_issues} heading case issue(s) found.")
    if args.fix:
        print("Files were auto-fixed. Please review the diff.")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
