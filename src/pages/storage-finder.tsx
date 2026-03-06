/** @author Ka Pui (August) Cheung */

import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIntersection } from "react-use";

import DocumentFooter from "../components/DocumentFooter";
import InfoButton from "../components/InfoButton";
import SelectableButton from "../components/SelectableButton";
import Tooltip, { TooltipDisabledTarget } from "../components/Tooltip";
import TooltipProvider from "../components/TooltipProvider";
import facetTree from "../data/storage-finder/facet-tree.json";
import serviceList from "../data/storage-finder/service-list.json";
import styles from "./storage-finder.module.css";

interface Choice {
  id: string;
  name: string;
  control_type: string;
  parent: string;
  weight: string;
  selected: boolean;
  description: string | null;
}

interface Facet {
  id: string;
  name: string;
  control_type: string;
  parent: string;
  weight: string;
  selected: boolean;
  description: string | null;
  choices: Choice[];
}

interface FieldData {
  value?: string;
  label: string;
  weight: number;
}

interface ServiceFieldData {
  [key: string]: FieldData;
  field_eligibility: FieldData;
  field_limitations: FieldData;
  field_use_case: FieldData;
  field_storable_files: FieldData;
  field_permission_settings: FieldData;
  field_links: FieldData;
  field_synchronous_access: FieldData;
  field_alumni_access: FieldData;
  field_backup: FieldData;
}

interface Service {
  id: string;
  title: string;
  facet_matches: string[];
  summary: null;
  field_data: ServiceFieldData;
}

export default function StorageFinderPage() {
  const [selectedFacets, setSelectedFacets] = useState<
    Record<string, string[]>
  >({});
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [nonMatchingServiceDisplay, setNonMatchingServiceDisplay] =
    useState<string>("show-disabled");
  const comparisonSectionRef = useRef<HTMLDivElement>(null);
  const infoBarRef = useRef<HTMLDivElement>(null);
  const infoBarStickyDetectorRef = useRef<HTMLDivElement>(null);
  const [isInfoBarSticky, setIsInfoBarSticky] = useState(false);
  const [isComparisonSectionVisible, setIsComparisonSectionVisible] =
    useState(false);

  /**
   * An intersection observer that detects when the info bar should become
   * sticky.
   */
  const infoBarStickyDetectorIntersection = useIntersection(
    infoBarStickyDetectorRef as React.RefObject<HTMLDivElement>,
    {
      rootMargin: "-60px 0px 0px 0px", // Negative top margin triggers earlier
      threshold: 0,
    },
  );

  /**
   * An intersection observer that detects when the comparison section is
   * visible.
   */
  const comparisonSectionIntersection = useIntersection(
    comparisonSectionRef as React.RefObject<HTMLDivElement>,
    { threshold: 0.5 },
  );

  // Update sticky state based on intersection
  useEffect(() => {
    if (infoBarStickyDetectorIntersection) {
      setIsInfoBarSticky(!infoBarStickyDetectorIntersection.isIntersecting);
    }
  }, [infoBarStickyDetectorIntersection]);

  // Update comparison section visibility state
  useEffect(() => {
    if (comparisonSectionIntersection) {
      setIsComparisonSectionVisible(
        comparisonSectionIntersection.isIntersecting,
      );
    }
  }, [comparisonSectionIntersection]);

  // Filter services based on selected facet options
  const filteredServices = serviceList.filter((service: Service) => {
    if (Object.keys(selectedFacets).length === 0) return true;
    return Object.entries(selectedFacets).every(([, choiceIds]) =>
      // For each facet, at least one selected choice must match
      choiceIds.some((choiceId) => service.facet_matches.includes(choiceId)),
    );
  });

  // Get all unique attribute fields from the service list
  const attributeFields = useMemo(() => {
    const fields: { key: string; label: string }[] = [];
    const seenKeys = new Set();

    for (const service of serviceList as Service[]) {
      if (!service.field_data) continue;

      for (const [key, value] of Object.entries(service.field_data)) {
        if (!seenKeys.has(key) && value?.label) {
          seenKeys.add(key);
          fields.push({
            key,
            label: value.label,
          });
        }
      }
    }

    // Sort by weight if available
    return fields.sort((a, b) => {
      const serviceWithFieldA = (serviceList as Service[]).find(
        (s) => s.field_data && a.key in s.field_data,
      );
      const serviceWithFieldB = (serviceList as Service[]).find(
        (s) => s.field_data && b.key in s.field_data,
      );

      const weightA =
        serviceWithFieldA?.field_data[a.key as keyof ServiceFieldData]
          ?.weight ?? 999;
      const weightB =
        serviceWithFieldB?.field_data[b.key as keyof ServiceFieldData]
          ?.weight ?? 999;

      return weightA - weightB;
    });
  }, []);

  const visibleFacets = facetTree;

  // Handle facet change for checkbox-style radio buttons
  const handleFacetChange = useCallback(
    (facetId: string, choiceId: string, isChecked: boolean) => {
      // Get the current facet to determine its control type
      const currentFacet = visibleFacets.find(
        (facet: Facet) => facet.id === facetId,
      );
      const isRadioControl = currentFacet?.control_type === "radio";

      // Calculate the new filters
      const newFilters = { ...selectedFacets };

      if (isChecked) {
        // For radio buttons, replace any existing selection
        // For checkboxes, add to existing selections
        if (isRadioControl) {
          newFilters[facetId] = [choiceId];
        } else {
          if (!newFilters[facetId]) {
            newFilters[facetId] = [];
          }
          newFilters[facetId].push(choiceId);
        }
      } else {
        // For both types, remove the selection if unchecked
        if (newFilters[facetId]) {
          newFilters[facetId] = newFilters[facetId].filter(
            (id) => id !== choiceId,
          );
          if (newFilters[facetId].length === 0) {
            delete newFilters[facetId];
          }
        }
      }

      // Update selectedFacets
      setSelectedFacets(newFilters);

      // Only auto-deselect services if we're not in "show-enabled" mode
      if (nonMatchingServiceDisplay !== "show-enabled") {
        // Calculate which services are valid with the new filters
        const newFilteredServices = serviceList.filter((service: Service) => {
          if (Object.keys(newFilters).length === 0) return true;
          return Object.entries(newFilters).every(([, filterChoiceIds]) =>
            filterChoiceIds.some((filterChoiceId) =>
              service.facet_matches.includes(filterChoiceId),
            ),
          );
        });

        // Clear selections for services that are no longer valid using the functional form
        // This ensures we're working with the most up-to-date state
        setSelectedServices((previous) =>
          previous.filter((serviceId) =>
            newFilteredServices.some(
              (service: Service) => service.id === serviceId,
            ),
          ),
        );
      }
    },
    [selectedFacets, nonMatchingServiceDisplay, visibleFacets],
  );

  const toggleServiceSelection = useCallback((serviceId: string) => {
    setSelectedServices((previous) =>
      previous.includes(serviceId)
        ? previous.filter((id) => id !== serviceId)
        : [...previous, serviceId],
    );
  }, []);

  const clearAnswers = useCallback(() => {
    setSelectedFacets({});
  }, []);

  const selectAllServices = useCallback(() => {
    setSelectedServices(filteredServices.map((service) => service.id));
  }, [filteredServices]);

  const scrollToComparison = useCallback(() => {
    if (comparisonSectionRef.current) {
      comparisonSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const isServiceDisabled = useCallback(
    (serviceId: string) =>
      !filteredServices.some((service) => service.id === serviceId),
    [filteredServices],
  );

  const isClearAnswersDisabled = useMemo(
    () => Object.keys(selectedFacets).length === 0,
    [selectedFacets],
  );

  const isSelectAllDisabled = useMemo(() => {
    if (filteredServices.length === 0) return true;
    return filteredServices.every((service) =>
      selectedServices.includes(service.id),
    );
  }, [filteredServices, selectedServices]);

  const isClearSelectionsDisabled = useMemo(
    () => selectedServices.length === 0,
    [selectedServices],
  );

  return (
    <TooltipProvider>
      <Layout
        description="Find the right NYU storage service for your research data"
        title="Research Data Storage Finder"
      >
        {/* Main content container */}
        <main className="padding--lg remove-p-margin-bottom">
          {/* Title - Always above the info bar */}
          <Heading as="h1" className="text--center">
            Research Data Storage Finder
          </Heading>

          {/* Element for detecting when the info bar should become sticky */}
          <div
            ref={infoBarStickyDetectorRef}
            style={{
              position: "relative",
              height: "1px",
              width: "100%",
              marginBottom: "-1px",
            }}
          />

          {/* Sticky Info Bar - No container class when sticky */}
          <header
            ref={infoBarRef}
            className={`${styles.infoBar} ${
              isInfoBarSticky ? styles.sticky : ""
            }`}
          >
            {/* Animated title that appears when sticky */}
            <div
              className={`${styles.stickyTitle} ${
                isInfoBarSticky ? styles.visible : ""
              }`}
            >
              Storage Finder
            </div>

            <div className={styles.serviceStats}>
              <span>{serviceList.length} Services In Total</span>

              {/* Only show available count when filters are applied */}
              {Object.keys(selectedFacets).length > 0 && (
                <>
                  <span>•</span>
                  <span>
                    {filteredServices.length} Available Under Current Filters
                  </span>
                </>
              )}

              <span>•</span>
              <span>
                {selectedServices.length === 0
                  ? "None Selected"
                  : `${selectedServices.length} Selected`}
              </span>
            </div>

            <div>
              {/* Show scroll to details/comparison when services are selected and comparison section not visible */}
              {selectedServices.length > 0 &&
                (isComparisonSectionVisible ? (
                  <button
                    className="button button--secondary button--sm"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Scroll to Top
                  </button>
                ) : (
                  <button
                    className="button button--primary button--sm"
                    onClick={scrollToComparison}
                  >
                    {selectedServices.length === 1
                      ? "Scroll to Details"
                      : "Scroll to Comparison"}
                  </button>
                ))}
            </div>
          </header>

          <div className={styles.mainContent}>
            {/* Left Panel - Questionnaire */}
            <div className={`${styles.questionPanel} card shadow--md`}>
              <div className={`${styles.panelHeader} card__header`}>
                <Heading as="h2" className={`${styles.panelTitle}`}>
                  Answer these questions to filter services that are suitable
                  for your needs.
                </Heading>

                <div className={styles.buttonRow}>
                  {isClearAnswersDisabled ? (
                    <Tooltip
                      keepOpenOnActivate
                      content="No answers are currently selected"
                    >
                      <TooltipDisabledTarget>
                        <button
                          className="button button--outline button--primary button--sm"
                          disabled={true}
                        >
                          Clear Answers
                        </button>
                      </TooltipDisabledTarget>
                    </Tooltip>
                  ) : (
                    <button
                      className="button button--outline button--primary button--sm"
                      onClick={clearAnswers}
                    >
                      Clear Answers
                    </button>
                  )}
                </div>
              </div>
              <div className={`${styles.panelScrollContent} card__body`}>
                {visibleFacets.map((facet: Facet, index: number) => (
                  <div key={facet.id} className={styles.facet}>
                    <div className={styles.facetTitle}>
                      <span className={styles.facetNumber}>{index + 1}.</span>
                      {facet.name}
                      {facet.description && (
                        <InfoButton
                          content={facet.description}
                          title={facet.name}
                        />
                      )}
                    </div>
                    <div className={styles.choicesList}>
                      {facet.choices.map((choice) => {
                        const isChecked =
                          selectedFacets[facet.id]?.includes(choice.id) ??
                          false;

                        return (
                          <SelectableButton
                            key={choice.id}
                            checked={isChecked}
                            label={choice.name}
                            name={`facet-${facet.id}`}
                            value={choice.id}
                            type={
                              facet.control_type === "radio"
                                ? "radio"
                                : "checkbox"
                            }
                            onChange={(value, checked) =>
                              handleFacetChange(facet.id, value, checked)
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.scrollIndicator}>
                <ChevronLeft aria-hidden="true" size={16} />
                <span aria-live="polite" role="status">
                  Scroll to view more questions
                </span>
                <ChevronRight aria-hidden="true" size={16} />
              </div>
            </div>

            {/* Right Panel - Service Selection */}
            <div className={`${styles.servicesPanel} card shadow--md`}>
              <div className={`${styles.panelHeader} card__header`}>
                <div className={styles.servicesPanelHeader}>
                  <Heading as="h2" className={styles.panelTitle}>
                    Select service(s) you would like to view details or compare.
                  </Heading>

                  <div className={styles.filterOptions}>
                    <label htmlFor="non-matching-display">
                      For services that do not match current filters:
                    </label>
                    <select
                      className={styles.filterSelect}
                      id="non-matching-display"
                      value={nonMatchingServiceDisplay}
                      onChange={(event) => {
                        const newValue = event.target.value;
                        setNonMatchingServiceDisplay(newValue);

                        // Auto-deselect non-matching services when switching from "show-enabled" to more restrictive modes
                        if (
                          newValue !== "show-enabled" &&
                          nonMatchingServiceDisplay === "show-enabled"
                        ) {
                          // Get IDs of services that don't match current filters
                          const nonMatchingServiceIds = new Set(
                            serviceList
                              .filter((service: Service) =>
                                isServiceDisabled(service.id),
                              )
                              .map((service: Service) => service.id),
                          );

                          // Remove any non-matching services from the selection
                          setSelectedServices((previous) =>
                            previous.filter(
                              (id) => !nonMatchingServiceIds.has(id),
                            ),
                          );
                        }
                      }}
                    >
                      <option value="show-disabled">Show but Disable</option>
                      <option value="show-enabled">Show but Highlight</option>
                      <option value="hide">Hide</option>
                    </select>
                  </div>

                  <div className={styles.buttonRow}>
                    <div className={styles.serviceActionButtons}>
                      {isSelectAllDisabled ? (
                        <Tooltip
                          content={
                            filteredServices.length === 0
                              ? "No services available to select"
                              : "All available services are already selected"
                          }
                        >
                          <TooltipDisabledTarget>
                            <button
                              className="button button--outline button--primary button--sm"
                              disabled={true}
                            >
                              {isClearAnswersDisabled
                                ? "Select All"
                                : "Select All Available"}
                            </button>
                          </TooltipDisabledTarget>
                        </Tooltip>
                      ) : (
                        <button
                          className="button button--outline button--primary button--sm"
                          onClick={selectAllServices}
                        >
                          {isClearAnswersDisabled
                            ? "Select All"
                            : "Select All Available"}
                        </button>
                      )}

                      {isClearSelectionsDisabled ? (
                        <Tooltip
                          keepOpenOnActivate
                          content="No services are currently selected"
                        >
                          <TooltipDisabledTarget>
                            <button
                              className="button button--outline button--primary button--sm"
                              disabled={true}
                            >
                              Clear Selections
                            </button>
                          </TooltipDisabledTarget>
                        </Tooltip>
                      ) : (
                        <button
                          className="button button--outline button--primary button--sm"
                          onClick={() => setSelectedServices([])}
                        >
                          Clear Selections
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${styles.panelScrollContent} card__body`}>
                <div className={styles.serviceGrid}>
                  {serviceList.map((service: Service) => {
                    const isSelected = selectedServices.includes(service.id);
                    const isNonMatching = isServiceDisabled(service.id);

                    // Handle different display options for non-matching services
                    if (isNonMatching) {
                      // Hide non-matching services
                      if (nonMatchingServiceDisplay === "hide") return null;

                      // Show but disable non-matching services
                      if (nonMatchingServiceDisplay === "show-disabled") {
                        return (
                          <Tooltip
                            key={service.id}
                            keepOpenOnActivate
                            content="This service does not match your filter criteria"
                          >
                            <button
                              aria-disabled="true"
                              aria-label={`${service.title} (unavailable with current filters)`}
                              className={`${styles.serviceButton} ${styles.disabled}`}
                              disabled={true}
                            >
                              {service.title}
                            </button>
                          </Tooltip>
                        );
                      }

                      // Show but highlight non-matching services
                      if (nonMatchingServiceDisplay === "show-enabled") {
                        return (
                          <Tooltip
                            key={service.id}
                            content="This service is highlighted because it does not match your filter criteria"
                          >
                            <button
                              aria-pressed={isSelected}
                              aria-label={`${service.title}${
                                isSelected ? " (selected)" : ""
                              } (doesn't match filters)`}
                              className={`${styles.serviceButton} ${styles.nonMatching} ${
                                isSelected ? styles.selected : ""
                              }`}
                              onClick={() => toggleServiceSelection(service.id)}
                            >
                              {service.title}
                              {isSelected && (
                                <span
                                  aria-hidden="true"
                                  className={styles.checkmark}
                                >
                                  ✓
                                </span>
                              )}
                            </button>
                          </Tooltip>
                        );
                      }
                    }

                    // Regular matching services
                    return (
                      <button
                        key={service.id}
                        aria-pressed={isSelected}
                        aria-label={`${service.title}${
                          isSelected ? " (selected)" : ""
                        }`}
                        className={`${styles.serviceButton} ${
                          isSelected ? styles.selected : ""
                        }`}
                        onClick={() => toggleServiceSelection(service.id)}
                      >
                        {service.title}
                        {isSelected && (
                          <span aria-hidden="true" className={styles.checkmark}>
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className={styles.scrollIndicator}>
                <ChevronLeft aria-hidden="true" size={16} />
                <span aria-live="polite" role="status">
                  Scroll to view more services
                </span>
                <ChevronRight aria-hidden="true" size={16} />
              </div>
            </div>
          </div>

          {/* Comparison Section */}
          <div
            ref={comparisonSectionRef}
            className={styles.comparisonTableSection}
          >
            {selectedServices.length > 0 ? (
              <>
                <Heading as="h2" className="text--center margin-bottom--md">
                  {selectedServices.length === 1
                    ? "Service Details"
                    : "Service Details and Comparison"}
                </Heading>

                <div className={styles.tableScrollIndicator}>
                  <ChevronLeft aria-hidden="true" size={16} />
                  <span aria-live="polite" role="status">
                    Scroll to view more
                  </span>
                  <ChevronRight aria-hidden="true" size={16} />
                </div>

                <div
                  className={`${styles.comparisonTableWrapper} table-responsive`}
                >
                  <table
                    className={`${styles.comparisonTable} table table--striped`}
                  >
                    <thead>
                      <tr>
                        <th className={styles.attributeColumn}>Attribute</th>
                        {selectedServices.map((serviceId) => {
                          const service = serviceList.find(
                            (s) => s.id === serviceId,
                          );
                          return (
                            <th
                              key={serviceId}
                              className={`${styles.serviceColumn} ${
                                selectedServices.length === 1
                                  ? styles.singleServiceColumn
                                  : ""
                              }`}
                            >
                              {service?.title}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {attributeFields.map((field) => (
                        <tr key={field.key}>
                          <td className={styles.attributeName}>
                            {field.label}
                            {/* <Tooltip keepOpenOnActivate content="Learn more">
                              <InfoButton
                                content={`Information about ${field.label.toLowerCase()}`}
                                title={field.label}
                              />
                            </Tooltip> */}
                          </td>
                          {selectedServices.map((serviceId) => {
                            const service = serviceList.find(
                              (s) => s.id === serviceId,
                            );
                            // Create a safer way to access the field data
                            const fieldData = service?.field_data
                              ? ((
                                  service.field_data[
                                    field.key as keyof typeof service.field_data
                                  ] as FieldData | undefined
                                )?.value ?? "N/A")
                              : "N/A";

                            return (
                              <td
                                key={serviceId}
                                dangerouslySetInnerHTML={{
                                  __html: fieldData,
                                }}
                              />
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className={styles.noServicesSelected}>
                <Heading as="h2" className="text--center">
                  Select service(s) to view details or compare
                </Heading>
              </div>
            )}
          </div>

          {/* Footer */}
          <DocumentFooter
            editHref="https://github.com/NYU-ITS/rts-docs/blob/main/src/pages/storage-finder.tsx"
            lastUpdatedContent="by Ka Pui (August) Cheung"
          />
        </main>
      </Layout>
    </TooltipProvider>
  );
}
