# Storage Finder CSV Importer: Maintainer Guide

This approach aims to balance user-friendliness (content editors update the Google Sheet) with functionality (developers tune `config.ts` so the JSON stays in sync).

## What the CLI does

- Reads a CSV export of the shared Google Sheet (either via `STORAGE_FINDER_SHEET_URL` or `--csv <path>`).
- Applies the questions/choices/matchers defined in `scripts/storage-finder-data-generator/config.ts`.
- Generates `facet-tree.json` and `service-list.json` with slug-based IDs.

## How to regenerate data

```sh
bun scripts/storage-finder-data-generator/generate.ts \
  --csv "Datafinder Data - Sheet1.csv" \
  --output src/data/storage-finder
```

- Omit `--csv` to download from `STORAGE_FINDER_SHEET_URL`.
- Use `--output` to write elsewhere (defaults to `src/data/storage-finder/generated` in the code).
- If you do not have Bun, install it from <https://bun.sh/> or run with `pnpm dlx tsx scripts/storage-finder-data-generator/generate.ts ...`. Node does not run TypeScript by default; `tsx` provides the TypeScript loader.

## How to add or change a question

1. Add a column to the sheet that contains the signals you want to match.
2. In `scripts/storage-finder-data-generator/config.ts`, add a new facet entry to `FACET_CONFIGS`:
   - Set `id` (slug), `name`, `controlType` (`radio` or `checkbox`), `column` (sheet column name), and `choices` (labels the app should show).
   - Add `matchers`: regex patterns that map cell text to choice IDs. Include `allowMultipleMatches: true` if a radio question legitimately matches more than one choice.
   - If no regex matches, `fallback: "all"` keeps the service visible; otherwise supply an explicit array of choice IDs.
3. Regenerate with the CLI and verify in the app.

## Service fields

Field definitions live in `scripts/storage-finder-data-generator/config.ts` (`FIELD_DEFINITIONS`). They map sheet columns to service detail rows (Links, Use Case, Limitations, Permission Settings, Eligibility, Synchronous Access, Alumni Access, Backup). Adjust labels or formatters there if the sheet schema changes.

## Naming and IDs

- Services are slugged from the `Title` column; duplicates get `-2`, `-3`, etc.
- Facet and choice IDs are slugs defined in `config.ts`; keep them stable to avoid breaking references.

## Validation rules

- Radio facets throw if more than one choice matches unless `allowMultipleMatches` is set.
- Blank cells render as “Not Available” in service fields.
- Regexes match against raw cell text; use clear keywords in the sheet for deterministic mapping.
