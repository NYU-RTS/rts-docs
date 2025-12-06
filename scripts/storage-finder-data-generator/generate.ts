import { mkdir, readFile, writeFile } from "node:fs/promises";

import { parse } from "csv-parse/sync";

import { FACET_CONFIGS, FIELD_DEFINITIONS } from "./config";
import {
  DEFAULT_STORAGE_FINDER_SHEET_URL,
  FACET_TREE_FILENAME,
  OUTPUT_DIRECTORY,
  SERVICE_LIST_FILENAME,
  STORAGE_FINDER_ENV_URL_KEY,
} from "./constants";
import { toHtmlBlocks } from "./html";
import {
  type CsvRow,
  type FacetConfig,
  type FacetTreeChoice,
  type FacetTreeQuestion,
  type ServiceField,
  type ServiceRecord,
} from "./types";

interface CliOptions {
  csvPath?: string;
  outputDir?: string;
  pretty: boolean;
  silent: boolean;
  showHelp: boolean;
}

interface Logger {
  log(message: string): void;
  warn(message: string): void;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    pretty: true,
    silent: false,
    showHelp: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument.includes("=")) {
      const [flag, explicitValue] = argument.split("=", 2);
      switch (flag) {
        case "--csv": {
          options.csvPath = explicitValue;
          break;
        }
        case "--output": {
          options.outputDir = explicitValue;
          break;
        }
        default: {
          throw new Error(
            `Unknown argument "${argument}". Use --help for usage.`,
          );
        }
      }
      continue;
    }
    switch (argument) {
      case "--csv": {
        options.csvPath = argv[index + 1];
        index += 1;
        break;
      }
      case "--output": {
        options.outputDir = argv[index + 1];
        index += 1;
        break;
      }
      case "--no-pretty": {
        options.pretty = false;
        break;
      }
      case "--silent": {
        options.silent = true;
        break;
      }
      case "--help": {
        options.showHelp = true;
        break;
      }
      default: {
        throw new Error(
          `Unknown argument "${argument}". Use --help for usage.`,
        );
      }
    }
  }
  return options;
}

function printHelp(): void {
  const lines = [
    "Usage: bun scripts/storage-finder-data-generator/generate.ts [options]",
    "",
    "--csv <path>           Use a local CSV file instead of downloading",
    "--output <dir>         Custom output directory (defaults to src/data/storage-finder/generated)",
    "--no-pretty            Write minified JSON",
    "--silent               Suppress informational logs",
    "--help                 Show this message",
    "",
    `Environment: ${STORAGE_FINDER_ENV_URL_KEY} overrides the CSV download URL.`,
  ];
  console.log(lines.join("\n"));
}

function createLogger(silent: boolean): Logger {
  if (silent) {
    const noop = (..._args: unknown[]) => {
      void _args;
    };
    return {
      log: noop,
      warn: noop,
    };
  }
  return {
    log(message: string) {
      console.log(message);
    },
    warn(message: string) {
      console.warn(message);
    },
  };
}

async function loadCsvSource(
  csvPath: string | undefined,
  logger: Logger,
): Promise<string> {
  if (csvPath) {
    logger.log(`Reading CSV from ${csvPath}`);
    return readFile(csvPath, "utf8");
  }
  const url =
    process.env[STORAGE_FINDER_ENV_URL_KEY] ?? DEFAULT_STORAGE_FINDER_SHEET_URL;
  logger.log(`Downloading CSV from ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to download CSV. HTTP ${response.status} ${response.statusText}`,
    );
  }
  return response.text();
}

function parseCsv(csvContent: string): CsvRow[] {
  const parsed = parse<CsvRow>(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return parsed.map((row) => mapUndefinedToEmptyStrings(row));
}

function mapUndefinedToEmptyStrings(row: CsvRow): CsvRow {
  const mapped: CsvRow = {};
  for (const key of Object.keys(row)) {
    const value = row[key];
    mapped[key] = value === undefined || value === null ? "" : String(value);
  }
  return mapped;
}

function buildServiceRecords(rows: CsvRow[], logger: Logger): ServiceRecord[] {
  const services: ServiceRecord[] = [];
  const seenIds = new Map<string, number>();
  for (const [index, row] of rows.entries()) {
    const title = (row.Title ?? "").trim();
    if (title.length === 0) {
      logger.warn(`Skipping row ${index + 1} because Title is missing.`);
      continue;
    }
    const baseId = slugify(title);
    const serviceId = resolveUniqueId(baseId, seenIds);
    services.push(createServiceRecord(serviceId, title, row));
  }
  return services;
}

function createServiceRecord(
  serviceId: string,
  title: string,
  row: CsvRow,
): ServiceRecord {
  const fieldData = buildFieldData(row);
  const facetMatches = collectFacetMatches(row, title);
  return {
    id: serviceId,
    title,
    facet_matches: facetMatches,
    summary: null,
    field_data: fieldData,
  };
}

function buildFieldData(row: CsvRow): Record<string, ServiceField> {
  const entries: [string, ServiceField][] = FIELD_DEFINITIONS.map(
    (definition) => {
      const rawValue = row[definition.column] ?? "";
      const value =
        definition.formatter?.(rawValue, row) ?? toHtmlBlocks(rawValue);
      return [
        definition.fieldKey,
        {
          value,
          label: definition.label,
          weight: definition.weight,
        },
      ];
    },
  );
  return Object.fromEntries(entries);
}

function collectFacetMatches(row: CsvRow, serviceTitle: string): string[] {
  const identifiers = new Set<string>();
  for (const config of FACET_CONFIGS) {
    const value = row[config.column] ?? "";
    const matches = matchFacetValue(value, config);
    if (
      config.controlType === "radio" &&
      !config.allowMultipleMatches &&
      matches.length > 1
    ) {
      throw new Error(
        `Service "${serviceTitle}" matched multiple options for radio facet "${config.name}": ${matches.join(", ")}`,
      );
    }
    for (const match of matches) {
      identifiers.add(match);
    }
    if (config.alwaysInclude) {
      for (const extra of config.alwaysInclude) {
        identifiers.add(extra);
      }
    }
  }
  return [...identifiers];
}

function matchFacetValue(value: string, config: FacetConfig): string[] {
  const matches = new Set<string>();
  for (const matcher of config.matchers) {
    if (matcher.pattern.test(value)) {
      for (const choice of matcher.choices) {
        matches.add(choice);
      }
    }
  }
  if (matches.size > 0) {
    return [...matches];
  }
  if (config.fallback === "all") {
    return config.choices.map((choice) => choice.id);
  }
  return [...config.fallback];
}

function resolveUniqueId(baseId: string, seen: Map<string, number>): string {
  if (!seen.has(baseId)) {
    seen.set(baseId, 1);
    return baseId;
  }
  const current = seen.get(baseId) ?? 1;
  const next = current + 1;
  seen.set(baseId, next);
  return `${baseId}-${next}`;
}

function buildFacetTree(): FacetTreeQuestion[] {
  return FACET_CONFIGS.map((config, index) => ({
    id: config.id,
    name: config.name,
    control_type: config.controlType,
    parent: "0",
    weight: String(index * 2),
    selected: false,
    description: config.description ?? null,
    choices: buildFacetChoices(config),
  }));
}

function buildFacetChoices(config: FacetConfig): FacetTreeChoice[] {
  return config.choices.map((choice) => ({
    id: choice.id,
    name: choice.name,
    control_type: config.controlType,
    parent: config.id,
    weight: String(choice.weight),
    selected: false,
    description: choice.description ?? null,
  }));
}

async function writeJson(
  path: string,
  data: unknown,
  pretty: boolean,
): Promise<void> {
  const spacing = pretty ? 2 : 0;
  const content = JSON.stringify(data, null, spacing);
  await writeFile(path, content + "\n", "utf8");
}

function slugify(value: string): string {
  const normalized = value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
  const trimmed = normalized.replaceAll(/^-+|-+$/g, "");
  if (trimmed.length === 0) {
    return "service";
  }
  return trimmed;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (options.showHelp) {
    printHelp();
    return;
  }
  const logger = createLogger(options.silent);
  const csvContent = await loadCsvSource(options.csvPath, logger);
  const rows = parseCsv(csvContent);
  if (rows.length === 0) {
    throw new Error("CSV file did not contain any data rows.");
  }
  const services = buildServiceRecords(rows, logger);
  const facetTree = buildFacetTree();
  const outputDirectory = options.outputDir ?? OUTPUT_DIRECTORY;
  await mkdir(outputDirectory, { recursive: true });
  const serviceOutputPath = `${outputDirectory}/${SERVICE_LIST_FILENAME}`;
  const facetOutputPath = `${outputDirectory}/${FACET_TREE_FILENAME}`;
  await writeJson(serviceOutputPath, services, options.pretty);
  await writeJson(facetOutputPath, facetTree, options.pretty);
  logger.log(`Wrote ${services.length} services to ${serviceOutputPath}`);
  logger.log(`Wrote ${facetTree.length} facets to ${facetOutputPath}`);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
void (async () => {
  try {
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
})();
