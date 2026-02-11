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
      {
        id: "affiliation.faculty",
        name: "Faculty or research principal investigator (PI)",
        weight: 0,
      },
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
  {
    id: "synchronous-access",
    name: "Do you need synchronous or simultaneous access to your data?",
    description: null,
    column: "Synchronous Access",
    controlType: "radio",
    allowMultipleMatches: true,
    choices: [
      {
        id: "synchronous-access.yes",
        name: "Yes",
        weight: 0,
      },
      {
        id: "synchronous-access.no",
        name: "No",
        weight: 1,
      },
    ],
    matchers: [
      {
        pattern: /\b(yes|users can edit|simultaneously)\b/i,
        choices: ["synchronous-access.yes"],
      },
      {
        pattern: /\bnot available\b/i,
        choices: ["synchronous-access.no"],
      },
    ],
    fallback: "all",
  },
  {
    id: "alumni-access",
    name: "Do you need alumni to have access to your data?",
    description: null,
    column: "Alumni Access",
    controlType: "radio",
    choices: [
      { id: "alumni-access.yes", name: "Yes", weight: 0 },
      { id: "alumni-access.no", name: "No", weight: 1 },
    ],
    matchers: [
      {
        pattern: /\bNot Available\b/i,
        choices: ["alumni-access.no"],
      },
      {
        pattern: /^Available$/i,
        choices: ["alumni-access.yes"],
      },
    ],
    fallback: "all",
  },
  {
    id: "storage-duration",
    name: "What is your storage duration need?",
    description: null,
    column: "Use Case",
    controlType: "radio",
    allowMultipleMatches: true,
    choices: [
      {
        id: "storage-duration.long-term",
        name: "Long-term or archival",
        weight: 0,
      },
      {
        id: "storage-duration.temporary",
        name: "Temporary or short-term",
        weight: 1,
      },
    ],
    matchers: [
      {
        pattern: /\b(long.?term|archive|archival|preservation)\b/i,
        choices: ["storage-duration.long-term"],
      },
      {
        pattern: /\btemporary\b/i,
        choices: ["storage-duration.temporary"],
      },
    ],
    fallback: "all",
  },
  {
    id: "use-case-purpose",
    name: "What is the primary purpose for your storage?",
    description: null,
    column: "Use Case",
    controlType: "checkbox",
    choices: [
      {
        id: "use-case-purpose.archive",
        name: "Archive and preservation",
        weight: 0,
      },
      {
        id: "use-case-purpose.active-research",
        name: "Active research and analysis",
        weight: 1,
      },
      {
        id: "use-case-purpose.collaboration",
        name: "Collaboration and file sharing",
        weight: 2,
      },
      {
        id: "use-case-purpose.surveys",
        name: "Surveys and data collection",
        weight: 3,
      },
      {
        id: "use-case-purpose.media",
        name: "Video and audio",
        weight: 4,
      },
      {
        id: "use-case-purpose.repository",
        name: "Data repository and publishing",
        weight: 5,
      },
    ],
    matchers: [
      {
        pattern: /\b(archive|archival|preservation)\b/i,
        choices: ["use-case-purpose.archive"],
      },
      {
        pattern: /\b(research|analysis|hpc|analyze)\b/i,
        choices: ["use-case-purpose.active-research"],
      },
      {
        pattern: /\b(collaboration|collaborat|share|sharing)\b/i,
        choices: ["use-case-purpose.collaboration"],
      },
      {
        pattern: /\b(survey|surveys)\b/i,
        choices: ["use-case-purpose.surveys"],
      },
      {
        pattern: /\b(video|audio|media)\b/i,
        choices: ["use-case-purpose.media"],
      },
      {
        pattern: /\b(repository|geospatial|deposit|publication)\b/i,
        choices: ["use-case-purpose.repository"],
      },
    ],
    fallback: "all",
  },
  {
    id: "cost-model",
    name: "What is your budget for storage?",
    description: null,
    column: "Limitations",
    controlType: "radio",
    allowMultipleMatches: true,
    choices: [
      {
        id: "cost-model.free",
        name: "Free or included services",
        weight: 0,
      },
      {
        id: "cost-model.paid",
        name: "Willing to pay or use chargeback",
        weight: 1,
      },
    ],
    matchers: [
      {
        pattern: /\b(chargeback|available for a fee)\b/i,
        choices: ["cost-model.paid"],
      },
      {
        pattern: /\b(free|no cost|included)\b/i,
        choices: ["cost-model.free"],
      },
    ],
    fallback: "all",
  },
  {
    id: "storage-capacity",
    name: "What storage capacity do you need?",
    description: null,
    column: "Limitations",
    controlType: "radio",
    allowMultipleMatches: true,
    choices: [
      {
        id: "storage-capacity.small",
        name: "Small (< 50 GB)",
        weight: 0,
      },
      {
        id: "storage-capacity.medium",
        name: "Medium (50 GB - 2 TB)",
        weight: 1,
      },
      {
        id: "storage-capacity.large",
        name: "Large (> 2 TB or unlimited)",
        weight: 2,
      },
    ],
    matchers: [
      {
        pattern: /\b20\s*GB\b/i,
        choices: ["storage-capacity.small"],
      },
      {
        pattern: /\b(50\s*GB|2TB|2\s*TB)\b/i,
        choices: ["storage-capacity.small", "storage-capacity.medium"],
      },
      {
        pattern: /\b(5TB|5\s*TB|no limit|unlimited)\b/i,
        choices: [
          "storage-capacity.small",
          "storage-capacity.medium",
          "storage-capacity.large",
        ],
      },
      {
        pattern: /\b(not available)\b/i,
        choices: [
          "storage-capacity.small",
          "storage-capacity.medium",
          "storage-capacity.large",
        ],
      },
    ],
    fallback: "all",
  },
  {
    id: "special-requirements",
    name: "Do you have any special requirements or restrictions?",
    description: null,
    column: "Limitations",
    controlType: "checkbox",
    choices: [
      {
        id: "special-requirements.none",
        name: "No special requirements",
        weight: 0,
      },
      {
        id: "special-requirements.active-directory",
        name: "Can use Active Directory",
        weight: 1,
      },
      {
        id: "special-requirements.faculty-sponsorship",
        name: "Have faculty sponsorship",
        weight: 2,
      },
      {
        id: "special-requirements.data-stewardship",
        name: "Have data stewardship knowledge",
        weight: 3,
      },
      {
        id: "special-requirements.project-approval",
        name: "Can get project approval",
        weight: 4,
      },
    ],
    matchers: [
      {
        pattern: /\bactive directory\b/i,
        choices: ["special-requirements.active-directory"],
      },
      {
        pattern: /\b(faculty sponsorship|faculty sponsored)\b/i,
        choices: ["special-requirements.faculty-sponsorship"],
      },
      {
        pattern: /\b(data stewardship|stewardship knowledge)\b/i,
        choices: ["special-requirements.data-stewardship"],
      },
      {
        pattern: /\b(project.*approval|approved by.*staff)\b/i,
        choices: ["special-requirements.project-approval"],
      },
      {
        pattern: /\b(not available|no limit)\b/i,
        choices: ["special-requirements.none"],
      },
    ],
    fallback: "all",
  },
];
