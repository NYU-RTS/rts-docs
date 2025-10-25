/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable unicorn/prevent-abbreviations */
import { useHistory } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { usePluginData } from "@docusaurus/useGlobalData";
import useIsBrowser from "@docusaurus/useIsBrowser";
import clsx from "clsx";
import { HighlightSearchResults } from "docusaurus-lunr-search/src/theme/SearchBar/HighlightSearchResults";
import { useCallback, useEffect, useRef, useState } from "react";

interface SearchBarProps {
  handleSearchBarToggle?: (expanded: boolean) => void;
  isSearchBarExpanded?: boolean;
  autoFocus?: boolean;
}

const Search = (props: SearchBarProps) => {
  const initialized = useRef(false);
  const searchBarRef = useRef<HTMLInputElement>(null);
  const [indexReady, setIndexReady] = useState(false);
  const history = useHistory();
  const { siteConfig } = useDocusaurusContext();
  const pluginConfig = ((siteConfig.plugins ?? []) as any[]).find(
    (plugin: any) =>
      Array.isArray(plugin) &&
      typeof plugin[0] === "string" &&
      plugin[0].includes("docusaurus-lunr-search"),
  );
  const isBrowser = useIsBrowser();
  const baseUrl = siteConfig.baseUrl ?? "/";
  const assetUrl = pluginConfig?.[1]?.assetUrl ?? baseUrl;

  const initAlgolia = (
    searchDocs: any,
    searchIndex: any,
    DocSearch: any,
    options: any,
  ) => {
    new DocSearch({
      searchDocs,
      searchIndex,
      baseUrl,
      inputSelector: "#search_input_react",
      handleSelected: (_input: any, _event: any) => {
        const query = _input.getVal();
        _input.setVal("");
        _event.target.blur();
        history.push(`/search?q=${encodeURIComponent(query)}`);
      },
      maxHits: options.maxHits,
    });
  };

  const pluginData = usePluginData("docusaurus-lunr-search") as any;
  const getSearchDoc = () =>
    process.env.NODE_ENV === "production"
      ? fetch(`${assetUrl}${pluginData.fileNames.searchDoc}`).then((content) =>
          content.json(),
        )
      : Promise.resolve({});

  const getLunrIndex = () =>
    process.env.NODE_ENV === "production"
      ? fetch(`${assetUrl}${pluginData.fileNames.lunrIndex}`).then((content) =>
          content.json(),
        )
      : Promise.resolve([]);

  const loadAlgolia = () => {
    if (!initialized.current) {
      Promise.all([
        getSearchDoc(),
        getLunrIndex(),
        import("docusaurus-lunr-search/src/theme/SearchBar/DocSearch"),
        import("docusaurus-lunr-search/src/theme/SearchBar/algolia.css"),
      ]).then(([searchDocFile, searchIndex, { default: DocSearch }]) => {
        const { searchDocs, options } = searchDocFile;
        if (!searchDocs || searchDocs.length === 0) {
          return;
        }
        initAlgolia(searchDocs, searchIndex, DocSearch, options);
        setIndexReady(true);
      });
      initialized.current = true;
    }
  };

  const toggleSearchIconClick = useCallback(
    (event: any) => {
      if (!searchBarRef.current?.contains(event.target)) {
        searchBarRef.current?.focus();
      }

      props.handleSearchBarToggle?.(!props.isSearchBarExpanded);
    },
    [props],
  );

  let placeholder;
  if (isBrowser) {
    loadAlgolia();
    placeholder = globalThis.navigator.platform.startsWith("Mac")
      ? "Search ⌘+K"
      : "Search Ctrl+K";
  }

  useEffect(() => {
    if (props.autoFocus && indexReady) {
      searchBarRef.current?.focus();
    }
  }, [indexReady, props.autoFocus]);

  return (
    <div key="search-box" className="navbar__search">
      <span
        aria-label="expand searchbar"
        role="button"
        tabIndex={0}
        className={clsx("search-icon", {
          "search-icon-hidden": props.isSearchBarExpanded,
        })}
        onClick={toggleSearchIconClick}
        onKeyDown={toggleSearchIconClick}
      />
      <input
        ref={searchBarRef}
        aria-label="Search"
        disabled={!indexReady}
        id="search_input_react"
        placeholder={indexReady ? placeholder : "Loading..."}
        type="search"
        className={clsx(
          "navbar__search-input",
          { "search-bar-expanded": props.isSearchBarExpanded },
          { "search-bar": !props.isSearchBarExpanded },
        )}
        onBlur={toggleSearchIconClick}
        onClick={loadAlgolia}
        onFocus={toggleSearchIconClick}
        onMouseOver={loadAlgolia}
      />
      <HighlightSearchResults />
    </div>
  );
};

export default Search;
