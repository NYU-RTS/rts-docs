# Storage Finder README

## Overview

The Storage Finder is an interactive web application that helps users choose the most appropriate NYU storage service for their research data based on their specific requirements. Users answer a series of questions about their data characteristics, usage patterns, and compliance needs, and the application filters and highlights suitable storage options.

## Data Sources

### Current Implementation

The storage finder uses static JSON files located in `src/data/storage-finder/`:

-   `facet-tree.json` - Contains the questions (facets) and their answer choices
-   `service-list.json` - Contains the storage services and their characteristics

### Original Data Source

The data structure is designed to be compatible with Drupal-based content management systems. Ideally, this data would be downloaded from a Drupal endpoint that provides:

-   **Facets taxonomy** - A two-level hierarchy representing questions and answer choices
-   **Services content type** - Storage services with their matching criteria and detailed information
-   **Service paragraphs** - Structured data fields for service comparison

For organizations wanting to use a Drupal instance to manage this data:

1. Set up the Finder module in Drupal following the original Cornell documentation
2. Configure your questions, answer choices, and services through the Drupal admin interface
3. Download the data from the Drupal REST API endpoints:
   -   **Facet Tree**: `http://your-drupal-site.com/rest/facettree`
   -   **Service List**: `http://your-drupal-site.com/rest/servicelist`
4. Save the downloaded JSON files to `src/data/storage-finder/`:
   -   Save facet tree data as `facet-tree.json`
   -   Save service list data as `service-list.json`

## Adding or Modifying Data

> [!IMPORTANT]
> Adding services and questions through the Drupal interface may be easier and provides a better user experience. If you have access to a Drupal instance with the Finder module, it is recommended to manage your data there. However, if you must modify the JSON files directly, follow the steps below carefully.

### Adding a New Question (Facet)

To add a new question to the storage finder:

1. **Edit `facet-tree.json`**:

   ```json
   {
     "id": "unique-id",                    // Must be globally unique across all facets and choices
     "name": "Your new question text?",    // The question displayed to users
     "control_type": "radio",              // "radio" (exclusive selection) or "checkbox" (multiple selections)
     "parent": "0",                        // Always "0" for top-level questions
     "weight": "order-number",             // Controls display order; lower numbers appear first (e.g., "-1" appears before "0")
     "selected": false,                    // Always false for new questions
     "description": "Optional HTML description with help text",  // If provided, an info button appears next to the question; clicking it opens a dialog with this content
     "choices": [
       {
         "id": "choice-id-1",              // Must be globally unique across all facets and choices
         "name": "First answer choice",    // The answer text displayed to users
         "control_type": "radio",          // Should match parent's control_type
         "parent": "unique-id",            // Must match the parent question's id
         "weight": "0",                    // Controls display order within the question; lower numbers appear first
         "selected": false,                // Always false for new choices
         "description": null               // Optional: HTML description for this specific choice
       },
       {
         "id": "choice-id-2",
         "name": "Second answer choice",
         "control_type": "radio",
         "parent": "unique-id",
         "weight": "1",
         "selected": false,
         "description": null
       }
     ]
   }
   ```

2. **Update existing services** in `service-list.json` by adding the appropriate choice IDs to their `facet_matches` arrays.

> [!WARNING]
> When you add a new question, **all existing services** must be updated to include at least one choice ID from the new question in their `facet_matches` arrays. Otherwise, those services will be filtered out and hidden when users answer the new question.

#### Control Types

-   **`radio`** - Only one choice can be selected (exclusive). Users can select a different option by clicking it.
-   **`checkbox`** - Multiple choices can be selected (inclusive). Users can select multiple options from the same question.

### Adding a New Storage Service

To add a new storage service:

1. **Edit `service-list.json`**:

   ```json
   {
     "id": "unique-service-id",           // Must be unique across all services
     "title": "Service Name",             // The service name displayed to users
     "facet_matches": ["choice-id-1", "choice-id-2"],  // Array of choice IDs this service matches
     "summary": null,                     // Currently unused, set to null
     "field_data": {                      // Service details displayed in comparison table
       "field_eligibility": {
         "value": "Who can use this service",  // HTML content displayed in the table
         "label": "Eligibility",               // Column header text
         "weight": 1                           // Controls row display order; lower numbers appear first
       },
       "field_limitations": {
         "value": "Any limitations or restrictions",
         "label": "Limitations",
         "weight": 2
       },
       "field_use_case": {
         "value": "Typical use cases",
         "label": "Use Case",
         "weight": 3
       },
       "field_storable_files": {
         "value": "Types of files that can be stored",
         "label": "Storable Files",
         "weight": 4
       },
       "field_permission_settings": {
         "value": "Permission and access control info",
         "label": "Permission Settings",
         "weight": 5
       },
       "field_links": {
         "value": "Relevant links and resources",
         "label": "Links",
         "weight": 6
       },
       "field_synchronous_access": {
         "value": "Real-time access capabilities",
         "label": "Synchronous Access",
         "weight": 7
       },
       "field_alumni_access": {
         "value": "Access after graduation/leaving",
         "label": "Alumni Access",
         "weight": 8
       },
       "field_backup": {
         "value": "Backup and recovery information",
         "label": "Backup",
         "weight": 9
       }
     }
   }
   ```

2. **Ensure facet_matches accuracy**: The `facet_matches` array must contain at least one choice ID from each question the user answers.

   **Example**: If a service is for "Public/Low Risk" data (ID "5"), "Faculty" users (ID "28"), and can be used for any purpose from "For what purpose will you be using this storage?" (IDs "33", "32", "35", "34", "36"), then include: `["5", "28", "33", "32", "35", "34", "36"]`. This example is not comprehensive—you must also add choice IDs from all other questions in `facet-tree.json` to ensure the service remains available regardless of what users select.

> [!WARNING]
> For each question in `facet-tree.json`, you must include at least one matching choice ID in `facet_matches`, otherwise the service will be filtered out and hidden when users answer that question.

### Modifying Service Fields

To add, remove, or modify the fields shown in the service comparison table:

1. **Update the field structure** in `service-list.json` for all services
2. **Modify the TypeScript interface** in `storage-finder.tsx`:

   ```typescript
   interface ServiceFieldData {
     [key: string]: FieldData;
     field_your_new_field: FieldData;
     // ... other fields
   }
   ```

> [!TIP]
> All services must have the same `field_data` structure for the comparison table to display correctly. If you add a new field, make sure to add it to every service in `service-list.json`.

### Data Structure Details

#### Facet Structure

-   **id**: Unique identifier for the question
-   **name**: The question text displayed to users
-   **control_type**: "radio" or "checkbox"
-   **parent**: "0" for top-level questions
-   **weight**: Controls display order
-   **description**: Optional HTML help text
-   **choices**: Array of possible answers

#### Choice Structure

-   **id**: Unique identifier for the choice
-   **name**: Answer text displayed to users
-   **parent**: ID of the parent question
-   **weight**: Controls display order within the question

#### Service Structure

-   **id**: Unique identifier for the service
-   **title**: Service name
-   **facet_matches**: Array of choice IDs this service is compatible with
-   **field_data**: Object containing service details for comparison table

## Troubleshooting

### Common Issues

**Services not filtering correctly:**

-   Verify `facet_matches` arrays contain correct choice IDs
-   Check that choice IDs in questions match those referenced in services

**New questions not appearing:**

-   Ensure the question has a unique ID
-   Verify `parent` is set to "0" for top-level questions
-   Check `weight` for proper ordering

**Comparison table missing data:**

-   Confirm all services have the same `field_data` structure
-   Verify field names match the TypeScript interfaces
-   Check for JSON syntax errors

## Inspiration

This storage finder was inspired by the **Finder Module** originally created by:

> Cornell Data Management Service Group and Cornell Information Technologies Custom Development Group (2018). Finder Module. Drupal 8. [https://github.com/CU-CommunityApps/CD-finder](https://github.com/CU-CommunityApps/CD-finder)

---

Last updated: October 2025
