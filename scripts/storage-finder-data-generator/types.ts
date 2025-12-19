export type CsvRow = Record<string, string>;

export interface ServiceFieldDefinition {
  fieldKey: string;
  column: string;
  label: string;
  weight: number;
  formatter?: (value: string, row: CsvRow) => string;
}

export interface FacetMatcherDefinition {
  pattern: RegExp;
  choices: string[];
}

export interface FacetChoiceConfig {
  id: string;
  name: string;
  description?: string | null;
  weight: number;
}

export interface FacetConfig {
  id: string;
  name: string;
  description?: string | null;
  column: string;
  controlType: "radio" | "checkbox";
  choices: FacetChoiceConfig[];
  matchers: FacetMatcherDefinition[];
  fallback: "all" | string[];
  alwaysInclude?: string[];
  allowMultipleMatches?: boolean;
}

export interface ServiceField {
  value: string;
  label: string;
  weight: number;
}

export interface ServiceRecord {
  id: string;
  title: string;
  facet_matches: string[];
  summary: null;
  field_data: Record<string, ServiceField>;
}

export interface FacetTreeChoice {
  id: string;
  name: string;
  control_type: "radio" | "checkbox";
  parent: string;
  weight: string;
  selected: boolean;
  description: string | null;
}

export interface FacetTreeQuestion {
  id: string;
  name: string;
  control_type: "radio" | "checkbox";
  parent: string;
  weight: string;
  selected: boolean;
  description: string | null;
  choices: FacetTreeChoice[];
}
