import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { usePluginData } from "@docusaurus/useGlobalData";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import lunr from "lunr";
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
  score: number;
}

interface LunrSearchResult {
  ref: string;
  score: number;
  matchData: {
    metadata: Record<
      string,
      {
        title?: { position: number[][] };
        content?: { position: number[][] };
        pageTitle?: { position: number[][] };
      }
    >;
  };
}

function useQuery(): URLSearchParams {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function extractExcerpt(
  content: string,
  matchPositions?: number[][],
  maxLength = 220,
): string {
  if (!content) return "";

  if (matchPositions && matchPositions.length > 0) {
    const firstMatch = matchPositions[0];
    const matchStart = firstMatch[0];
    const matchEnd = matchStart + firstMatch[1];

    const halfWindow = Math.floor((maxLength - firstMatch[1]) / 2);
    let excerptStart = Math.max(0, matchStart - halfWindow);
    let excerptEnd = Math.min(content.length, matchEnd + halfWindow);

    if (excerptStart > 0) {
      const spaceIndex = content.lastIndexOf(" ", excerptStart);
      if (spaceIndex > excerptStart - 20) {
        excerptStart = spaceIndex + 1;
      }
    }

    if (excerptEnd < content.length) {
      const spaceIndex = content.indexOf(" ", excerptEnd);
      if (spaceIndex > 0 && spaceIndex < excerptEnd + 20) {
        excerptEnd = spaceIndex;
      }
    }

    const excerpt = content.slice(excerptStart, excerptEnd);
    const prefix = excerptStart > 0 ? "…" : "";
    const suffix = excerptEnd < content.length ? "…" : "";

    return prefix + excerpt + suffix;
  }

  return content.slice(0, maxLength) + (content.length > maxLength ? "…" : "");
}

export default function SearchPage() {
  const params = useQuery();
  const rawQuery: string = params.get("q") ?? "";
  const query: string = rawQuery.trim();

  const { siteConfig } = useDocusaurusContext();
  const pluginData = usePluginData("docusaurus-lunr-search") as {
    fileNames?: { searchDoc?: string; lunrIndex?: string };
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
    const lunrIndexPath = pluginData?.fileNames?.lunrIndex ?? "lunr-index.json";

    Promise.all([
      fetch(`${siteConfig.baseUrl}${searchDocumentPath}`).then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load search index (${response.status})`);
        }
        return response.json() as Promise<{
          searchDocs?: SearchDocument[];
        }>;
      }),
      fetch(`${siteConfig.baseUrl}${lunrIndexPath}`).then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load lunr index (${response.status})`);
        }
        return response.json() as Promise<lunr.Index>;
      }),
    ])
      .then(([searchData, lunrIndexData]) => {
        const documents: SearchDocument[] = searchData.searchDocs ?? [];

        if (documents.length === 0) {
          throw new Error("No documents found in search index");
        }

        const index = lunr.Index.load(lunrIndexData);

        let lunrResults: LunrSearchResult[];
        try {
          lunrResults = index.query((q) => {
            const tokens = lunr.tokenizer(query);
            q.term(tokens, { boost: 10 });
            q.term(tokens, {
              wildcard: lunr.Query.wildcard.TRAILING,
            });
          }) as LunrSearchResult[];
        } catch {
          try {
            lunrResults = index.search(query) as LunrSearchResult[];
          } catch {
            lunrResults = [];
          }
        }

        const searchResults: SearchResult[] = lunrResults
          .slice(0, 50)
          .map((lunrResult) => {
            const documentIndex = Number.parseInt(lunrResult.ref, 10);
            const document = documents[documentIndex];
            if (!document) return null;

            let contentMatchPositions: number[][] | undefined;

            for (const term in lunrResult.matchData.metadata) {
              const termData = lunrResult.matchData.metadata[term];
              if (termData.content?.position) {
                contentMatchPositions = termData.content.position;
                break;
              }
            }

            const excerpt = extractExcerpt(
              document.content ?? "",
              contentMatchPositions,
            );

            return {
              title: document.pageTitle ?? document.title ?? document.url,
              route: document.url,
              excerpt,
              score: lunrResult.score,
            };
          })
          .filter((result): result is SearchResult => result !== null);

        setResults(searchResults);
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
