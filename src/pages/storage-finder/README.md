# Storage Finder README

## Overview

The Storage Finder is an interactive web application that helps users choose the most appropriate NYU storage service for their research data. Users answer a series of questions about their data's risk classification, access needs, and usage patterns. The application filters storage services in real time and lets users select one or more services to view their details side by side in a comparison table.

## How the Application Works

The page has three main sections:

1. **Question panel (left)** — A scrollable list of questions. Each question is either single-choice (radio) or multi-choice (checkbox). Answering a question immediately filters the service list on the right.
2. **Service panel (right)** — A grid of storage service buttons. Services that match all answered questions are enabled. Services that do not match can be shown as disabled, highlighted, or hidden — controlled by a dropdown in the panel header. Click a service button to select it for comparison.
3. **Comparison table (bottom)** — Appears when at least one service is selected. Shows each selected service's details in columns. Selecting a single service shows its details; selecting multiple services enables side-by-side comparison.

A sticky info bar at the top of the page always shows the total number of services, how many match the current filters, and how many are selected. When services are selected, the bar provides a "Scroll to Details / Scroll to Comparison" button.

## Data Sources

All data comes from a shared Google Sheet that content editors maintain. A code generator script reads the sheet (or a local CSV export of it), applies matching rules defined in TypeScript configuration, and writes two JSON files consumed by the frontend.

| File | Purpose |
|------|---------|
| `src/data/storage-finder/facet-tree.json` | The questions and answer choices shown in the left panel |
| `src/data/storage-finder/service-list.json` | The storage services, their filter matches, and their detail fields |

**Do not edit these JSON files directly.** They are generated output. Changes must be made either in the Google Sheet (for service data) or in `scripts/storage-finder-data-generator/config.ts` (for questions, choices, and matching rules), followed by running the generator script.

## Automated Data Sync

The JSON data files are kept up to date automatically by a GitHub Actions workflow defined in `.github/workflows/storage-finder-sync.yml`. The workflow runs **every Saturday at midnight UTC** and can also be triggered manually from the GitHub Actions tab.

When it runs, the workflow:

1. Checks out the repository
2. Installs dependencies
3. Runs the generator script against the Google Sheet (`--output src/data/storage-finder`)
4. Lints and formats the output
5. Commits any changes with the message `chore: sync storage finder data from sheet`

This means **content editors only need to update the Google Sheet** — the next scheduled run (or a manual trigger) will automatically pull those changes into the site without any developer involvement.

> [!NOTE]
> The workflow only commits when the generated output differs from what is already in the repository. If the sheet has not changed since the last run, no commit is made.

### Triggering a manual sync

If you need changes to appear immediately rather than waiting for Saturday's scheduled run:

1. Go to the repository on GitHub
2. Navigate to **Actions → Sync Storage Finder Data**
3. Click **Run workflow**

## Regenerating the Data Locally

Run the generator any time you need to verify output locally or after editing `config.ts`:

```sh
bun scripts/storage-finder-data-generator/generate.ts \
  --output src/data/storage-finder
```

To use a locally downloaded CSV export instead of fetching the sheet automatically:

```sh
bun scripts/storage-finder-data-generator/generate.ts \
  --csv "Datafinder Data - Sheet1.csv" \
  --output src/data/storage-finder
```

If you do not have Bun installed, get it from [https://bun.sh/](https://bun.sh/), or run the script with `pnpm dlx tsx` instead of `bun`.

### Environment variable

The default Google Sheet URL is baked into `scripts/storage-finder-data-generator/constants.ts`. To override it without modifying the source, set the `STORAGE_FINDER_SHEET_URL` environment variable before running the script:

```sh
STORAGE_FINDER_SHEET_URL="https://..." bun scripts/storage-finder-data-generator/generate.ts \
  --output src/data/storage-finder
```

### CLI flags summary

| Flag | Description |
|------|-------------|
| `--csv <path>` | Use a local CSV file instead of downloading from the sheet |
| `--output <dir>` | Write JSON files to a custom directory (default: `src/data/storage-finder/generated`) |
| `--no-pretty` | Write minified JSON |
| `--silent` | Suppress informational log output |
| `--help` | Show usage information |

## Current Questions

Questions are defined in `scripts/storage-finder-data-generator/config.ts` as entries in the `FACET_CONFIGS` array. They appear in the left panel in the order they are listed. The current questions are:

| # | Question | Type | Sheet column used for matching |
|---|----------|------|-------------------------------|
| 1 | What is the risk classification of your data? | Radio | Storable Files |
| 2 | What is your University affiliation? | Radio | Eligibility |
| 3 | Who needs access to your data? | Checkbox | Permission Settings |
| 4 | Do you need backups, snapshots or replication of your data? | Radio | Backup |
| 5 | Do you need synchronous or simultaneous access to your data? | Radio | Synchronous Access |
| 6 | Do you need alumni to have access to your data? | Radio | Alumni Access |
| 7 | What is your storage duration need? | Radio | Use Case |
| 8 | What is the primary purpose for your storage? | Checkbox | Use Case |
| 9 | What is your budget for storage? | Radio | Limitations |
| 10 | What storage capacity do you need? | Radio | Limitations |
| 11 | From where will the data be accessed? | Checkbox | Access locations |
| 12 | Do you have any special requirements or restrictions? | Checkbox | Limitations |
| 13 | What additional features do you need? | Checkbox | Additional capabilities |

## Current Service Detail Fields

When a service is selected, the following fields appear as rows in the comparison table. They come from named columns in the Google Sheet and are defined in `FIELD_DEFINITIONS` in `config.ts`.

| Field key | Sheet column | Display label |
|-----------|-------------|---------------|
| `field_links` | Links | Links |
| `field_storable_files` | Storable Files | Storable Files |
| `field_use_case` | Use Case | Use Case |
| `field_limitations` | Limitations | Limitations |
| `field_permission_settings` | Permission Settings | Permission Settings |
| `field_eligibility` | Eligibility | Eligibility |
| `field_access_location` | Access locations (VPN, Public Cloud, Off Campus, Browser GUI) | Access Locations |
| `field_synchronous_access` | Synchronous Access | Synchronous Access |
| `field_alumni_access` | Alumni Access | Alumni Access |
| `field_backup` | Backup | Backup |
| `field_additional_features` | Additional capabilities | Additional Features |

## Making Changes

### Updating service information

Edit the corresponding row in the Google Sheet, then regenerate the data. Service IDs are automatically generated as URL-safe slugs from the `Title` column. If a title is duplicated, subsequent entries get a numeric suffix (e.g., `my-service-2`).

### Adding a new service

Add a new row to the Google Sheet with a unique value in the `Title` column and fill in all relevant columns. Then regenerate the data.

> [!WARNING]
> Every cell in a row should be filled in accurately. The generator uses regex patterns to map cell text to facet choices. A blank cell causes the generator to apply the fallback behavior for that question (usually matching all choices for that facet, keeping the service visible regardless of what users select for that question).

### Adding or changing a question

1. If the question requires a new signal, add a column to the Google Sheet and populate it for all services.
2. In `scripts/storage-finder-data-generator/config.ts`, add a new entry to the `FACET_CONFIGS` array (or modify an existing one):
   - `id` — a stable kebab-case slug (never change this once data is published, as it affects URL state if used)
   - `name` — the question text displayed to users
   - `controlType` — `"radio"` (single answer) or `"checkbox"` (multiple answers)
   - `column` — the exact column header from the Google Sheet
   - `choices` — array of `{ id, name, weight }` entries for each answer option
   - `matchers` — array of `{ pattern, choices }` entries mapping regex patterns on the cell text to choice IDs
   - `fallback` — `"all"` to keep the service visible if nothing matches, or an array of specific choice IDs to match by default
   - `allowMultipleMatches: true` — required on radio facets that legitimately match more than one choice
3. Regenerate and verify in the app.

### Adding or changing a service detail field

1. Ensure the column exists in the Google Sheet and is populated.
2. In `scripts/storage-finder-data-generator/config.ts`, add or modify an entry in `FIELD_DEFINITIONS`:
   - `fieldKey` — the key used in the generated JSON (e.g., `field_my_new_field`)
   - `column` — the exact column header in the Google Sheet
   - `label` — the row label shown in the comparison table
   - `weight` — controls the row order (lower numbers appear first)
   - `formatter` — optional function to transform the raw cell text; defaults to converting newlines into HTML paragraphs
3. Regenerate the data.

> [!TIP]
> Blank cells are rendered as `<p>Not Available</p>` by the default formatter. Use this intentionally in the sheet to signal that a feature is unavailable rather than leaving cells blank accidentally.

## How Facet Matching Works

The generator reads each service row from the CSV and, for each facet question, looks at the specified sheet column. It runs each configured regex pattern against the cell text. If a pattern matches, the associated choice IDs are added to the service's `facet_matches` array.

- If **no pattern matches** and `fallback` is `"all"`, all choice IDs for that facet are added — the service remains visible regardless of what the user picks for that question.
- If **no pattern matches** and `fallback` is a specific array, only those choice IDs are added.
- Radio facets throw an error during generation if more than one choice matches, unless `allowMultipleMatches: true` is set.

On the frontend, a service is shown as matching when, for every answered question, at least one of the user's selected choices appears in the service's `facet_matches` array.

## Troubleshooting

**Services not filtering correctly**

- Check that the regex matchers in `config.ts` for the relevant facet correctly match the cell text in the sheet. Run the generator locally with `--csv` and inspect the output JSON.
- Confirm that the fallback setting is appropriate — `"all"` keeps services visible when unmatched, which may be intentional or may mask a missing pattern.

**A new question is not appearing**

- Verify the entry was added to `FACET_CONFIGS` in `config.ts` and the data was regenerated.
- Confirm the `column` value exactly matches the column header in the sheet, including capitalization and whitespace.

**Comparison table showing "N/A" or missing rows**

- Ensure the field is defined in `FIELD_DEFINITIONS` in `config.ts` with the correct `column` value.
- Regenerate the data and verify the field appears in the generated `service-list.json`.

**Generator fails with "matched multiple options for radio facet"**

- A radio facet matched more than one choice for a service. Either fix the sheet data so only one regex pattern applies, or add `allowMultipleMatches: true` to the facet config if multiple matches are valid.

**Generator fails with "CSV file did not contain any data rows"**

- The sheet URL may be incorrect or the CSV export format may have changed. Check the URL in `constants.ts` or provide a local CSV via `--csv`.

## Inspiration

This storage finder was inspired by the **Finder Module** originally created by:

> Cornell Data Management Service Group and Cornell Information Technologies Custom Development Group (2018). Finder Module. Drupal 8. [https://github.com/CU-CommunityApps/CD-finder](https://github.com/CU-CommunityApps/CD-finder)

---

Last updated: March 2026
