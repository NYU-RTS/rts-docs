import { toHtmlBlocks, toLinkHtml } from "./html";
import { type FacetConfig, type ServiceFieldDefinition } from "./types";

export const FIELD_DEFINITIONS: ServiceFieldDefinition[] = [
  {
    fieldKey: "field_links",
    column: "Links",
    label: "Links",
    weight: 2,
    formatter: (value, row) => toLinkHtml(value, row.Title ?? ""),
  },
  {
    fieldKey: "field_storable_files",
    column: "Storable Files",
    label: "Storable Files",
    weight: 3,
    formatter: (value) => toHtmlBlocks(value),
  },
  {
    fieldKey: "field_use_case",
    column: "Use Case",
    label: "Use Case",
    weight: 4,
    formatter: (value) => toHtmlBlocks(value),
  },
  {
    fieldKey: "field_limitations",
    column: "Limitations",
    label: "Limitations",
    weight: 5,
    formatter: (value) => toHtmlBlocks(value),
  },
  {
    fieldKey: "field_permission_settings",
    column: "Permission Settings",
    label: "Permission Settings",
    weight: 6,
    formatter: (value) => toHtmlBlocks(value),
  },
  {
    fieldKey: "field_eligibility",
    column: "Eligibility",
    label: "Eligibility",
    weight: 7,
    formatter: (value) => toHtmlBlocks(value),
  },
  {
    fieldKey: "field_synchronous_access",
    column: "Synchronous Access",
    label: "Synchronous Access",
    weight: 9,
    formatter: (value) => toHtmlBlocks(value),
  },
  {
    fieldKey: "field_alumni_access",
    column: "Alumni Access",
    label: "Alumni Access",
    weight: 10,
    formatter: (value) => toHtmlBlocks(value),
  },
  {
    fieldKey: "field_backup",
    column: "Backup",
    label: "Backup",
    weight: 11,
    formatter: (value) => toHtmlBlocks(value),
  },
];

export const FACET_CONFIGS: FacetConfig[] = [
  {
    id: "risk-classification",
    name: "What is the risk classification of your data?",
    description: null,
    column: "Storable Files",
    controlType: "radio",
    allowMultipleMatches: true,
    choices: [
      {
        id: "risk-classification.public-low",
        name: "Public / Low Risk",
        weight: 0,
      },
      {
        id: "risk-classification.sensitive-moderate",
        name: "Sensitive / Moderate Risk",
        weight: 1,
      },
      {
        id: "risk-classification.confidential-high",
        name: "Confidential or Restricted / High Risk",
        weight: 2,
      },
      {
        id: "risk-classification.hipaa",
        name: "HIPAA-Regulated",
        weight: 3,
      },
    ],
    matchers: [
      { pattern: /\bhipaa\b/i, choices: ["risk-classification.hipaa"] },
      {
        pattern: /\b(confidential|restricted)\b/i,
        choices: ["risk-classification.confidential-high"],
      },
      {
        pattern: /\bhigh\b/i,
        choices: [
          "risk-classification.public-low",
          "risk-classification.sensitive-moderate",
          "risk-classification.confidential-high",
        ],
      },
      {
        pattern: /\bmoderate\b/i,
        choices: [
          "risk-classification.public-low",
          "risk-classification.sensitive-moderate",
        ],
      },
      {
        pattern: /\blow\b/i,
        choices: ["risk-classification.public-low"],
      },
    ],
    fallback: "all",
  },
  {
    id: "affiliation",
    name: "What is your University affiliation?",
    description: null,
    column: "Eligibility",
    controlType: "radio",
    allowMultipleMatches: true,
    choices: [
      { id: "affiliation.faculty", name: "Faculty or PI", weight: 0 },
      { id: "affiliation.staff", name: "University staff", weight: 1 },
      { id: "affiliation.student", name: "Student", weight: 2 },
    ],
    matchers: [
      { pattern: /\bfaculty\b/i, choices: ["affiliation.faculty"] },
      {
        pattern: /\bprincipal investigator\b/i,
        choices: ["affiliation.faculty"],
      },
      { pattern: /\bstaff\b/i, choices: ["affiliation.staff"] },
      { pattern: /\bstudent\b/i, choices: ["affiliation.student"] },
    ],
    fallback: "all",
  },
  {
    id: "access-needs",
    name: "Who needs access to your data?",
    description: null,
    column: "Permission Settings",
    controlType: "checkbox",
    choices: [
      { id: "access-needs.individual", name: "No sharing", weight: 0 },
      { id: "access-needs.public", name: "Public access", weight: 1 },
      {
        id: "access-needs.shared-link",
        name: "Shared link collaborators",
        weight: 2,
      },
      {
        id: "access-needs.netid-collaborators",
        name: "Affiliated collaborators with NetIDs",
        weight: 3,
      },
      {
        id: "access-needs.external-collaborators",
        name: "Collaborators external to NYU",
        weight: 4,
      },
    ],
    matchers: [
      { pattern: /\bpublic\b/i, choices: ["access-needs.public"] },
      {
        pattern: /\bno sharing\b/i,
        choices: ["access-needs.individual"],
      },
      {
        pattern: /\bindividual use\b/i,
        choices: ["access-needs.individual"],
      },
      {
        pattern: /\bshared link\b/i,
        choices: ["access-needs.shared-link"],
      },
      {
        pattern: /\bexternal\b/i,
        choices: ["access-needs.external-collaborators"],
      },
      {
        pattern: /\bnetid\b/i,
        choices: ["access-needs.netid-collaborators"],
      },
      {
        pattern: /\bgroup\b/i,
        choices: ["access-needs.netid-collaborators"],
      },
    ],
    fallback: "all",
  },
  {
    id: "backup-availability",
    name: "Do you need backups, snapshots or replication of your data?",
    description: null,
    column: "Backup",
    controlType: "radio",
    choices: [
      { id: "backup-availability.yes", name: "Yes", weight: 0 },
      { id: "backup-availability.no", name: "No", weight: 1 },
    ],
    matchers: [
      {
        pattern: /\b(yes|available)\b/i,
        choices: ["backup-availability.yes"],
      },
      {
        pattern: /\b(no|not available)\b/i,
        choices: ["backup-availability.no"],
      },
    ],
    fallback: "all",
  },
];
