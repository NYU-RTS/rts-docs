import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { usePluginData } from "@docusaurus/useGlobalData";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import { useEffect, useMemo, useState } from "react";

interface SearchDocument {
  url: string;
  title: string;
  pageTitle?: string;
  content?: string;
  type?: number;
}

interface SearchResult {
  title: string;
  route: string;
  excerpt: string;
}

function useQuery(): URLSearchParams {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function SearchPage() {
  const params = useQuery();
  const rawQuery: string = params.get("q") ?? "";
  const query: string = rawQuery.trim();

  const { siteConfig } = useDocusaurusContext();
  const pluginData = usePluginData("docusaurus-lunr-search") as {
    fileNames?: { searchDoc?: string };
  };

  const [isReady, setIsReady] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setIsReady(true);
      setResults([]);
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      setError(
        "Search is only available in production mode. Run 'pnpm build && pnpm serve' to test search.",
      );
      setIsReady(true);
      return;
    }

    const searchDocumentPath =
      pluginData?.fileNames?.searchDoc ?? "search-doc.json";

    fetch(`${siteConfig.baseUrl}${searchDocumentPath}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load search index (${response.status})`);
        }
        return response.json() as Promise<{
          searchDocs?: SearchDocument[];
        }>;
      })
      .then((searchData) => {
        const documents: SearchDocument[] = searchData.searchDocs ?? [];

        if (documents.length === 0) {
          throw new Error("No documents found in search index");
        }

        const filtered = documents
          .filter((document: SearchDocument) => {
            const searchText = (
              (document.title ?? "") +
              " " +
              (document.pageTitle ?? "") +
              " " +
              (document.content ?? "")
            ).toLowerCase();
            return searchText.includes(query.toLowerCase());
          })
          .slice(0, 50)
          .map((document: SearchDocument) => {
            const excerpt =
              (document.content ?? "").slice(0, 220) +
              ((document.content ?? "").length > 220 ? "…" : "");

            return {
              title: document.pageTitle ?? document.title ?? document.url,
              route: document.url,
              excerpt,
            };
          });

        setResults(filtered);
        setIsReady(true);
      })
      .catch((error_: Error) => {
        console.error("Search error:", error_);
        setError(error_.message);
        setIsReady(true);
      });
  }, [query, pluginData, siteConfig]);

  return (
    <Layout description="Search documentation results" title="Search Results">
      <main className="container margin-vert--lg">
        <Heading as="h1">Search Results</Heading>

        <form
          action={`${siteConfig.baseUrl}search/`}
          method="get"
          style={{ marginBottom: "1.5rem" }}
        >
          <input
            aria-label="Search docs"
            className="navbar__search-input"
            defaultValue={rawQuery}
            name="q"
            placeholder="Search docs"
            type="search"
            style={{
              width: "100%",
              maxWidth: 560,
              padding: "0.5rem 1rem",
              paddingLeft: "2.5rem",
              fontSize: "1rem",
            }}
          />
        </form>

        {error && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: "var(--ifm-color-warning-contrast-background)",
              borderLeft: "4px solid var(--ifm-color-warning)",
              marginBottom: "1rem",
            }}
          >
            <strong>Search unavailable:</strong> {error}
            <br />
            <small>
              The search index is only generated during production build. Run{" "}
              <code>pnpm build && pnpm serve</code> to test search
              functionality.
            </small>
          </div>
        )}

        {!query && !error && <p>Type a query above and press Enter.</p>}

        {query && isReady && results.length === 0 && !error && (
          <p>No results found for &quot;{query}&quot;.</p>
        )}

        {results.length > 0 && (
          <>
            <p
              style={{
                marginBottom: "1rem",
                color: "var(--ifm-color-emphasis-600)",
              }}
            >
              Found {results.length} result{results.length === 1 ? "" : "s"} for
              &quot;{query}&quot;
            </p>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {results.map((result) => (
                <li
                  key={result.route}
                  style={{
                    marginBottom: "1.5rem",
                    paddingBottom: "1.5rem",
                    borderBottom: "1px solid var(--ifm-color-emphasis-200)",
                  }}
                >
                  <Link
                    to={result.route}
                    style={{
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      textDecoration: "none",
                    }}
                  >
                    {result.title}
                  </Link>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--ifm-color-success)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {result.route}
                  </div>
                  {result.excerpt && (
                    <p
                      style={{
                        margin: "0.5rem 0 0 0",
                        color: "var(--ifm-color-emphasis-700)",
                      }}
                    >
                      {result.excerpt}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </Layout>
  );
}
