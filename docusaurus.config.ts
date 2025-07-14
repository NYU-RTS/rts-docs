import type * as Preset from "@docusaurus/preset-classic";
import { type Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

// Set the /<baseUrl>/ pathname under which your site is served
// For GitHub pages deployment, it is often '/<projectName>/'
let baseUrl = "/rts-docs-dev/";
if (process.env.PREVIEW_PATH) {
  baseUrl += process.env.PREVIEW_PATH;
}

const config: Config = {
  title: "Connecting researchers to computational resources.",
  favicon: "img/NYU.ico",

  // Set the production url of your site here
  url: "https://your-docusaurus-site.example.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: baseUrl,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "NYU-ITS", // Usually your GitHub org/user name.
  projectName: "rts-docs-dev", // Usually your repo name.
  deploymentBranch: "main",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  //https://docusaurus.io/docs/deployment#docusaurusconfigjs-settings
  trailingSlash: true,

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: ["docusaurus-lunr-search"],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/NYU-ITS/rts-docs-dev/blob/main/",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/NYU-ITS/rts-docs-dev/blob/main/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    docs: { sidebar: { hideable: true } },
    image: "img/NYU.svg",
    navbar: {
      title: "Research Technology Services",
      logo: {
        alt: "NYU torch logo",
        src: "img/NYU.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "genaiSidebar",
          position: "right",
          label: "Pythia",
        },
        {
          type: "docSidebar",
          sidebarId: "hpcSidebar",
          position: "right",
          label: "HPC",
        },
        {
          type: "docSidebar",
          sidebarId: "cloudSidebar",
          position: "right",
          label: "Cloud",
        },
        {
          type: "docSidebar",
          sidebarId: "srdeSidebar",
          position: "right",
          label: "SRDE",
        },
        {
          href: "https://hsrn.nyu.edu/docs/",
          position: "right",
          label: "HSRN",
        },
        { to: "/blog", label: "Announcements", position: "right" },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Contact",
          items: [
            {
              label: "Email HPC support",
              href: "mailto:hpc@nyu.edu",
            },
            {
              label: "Email HSRN support",
              href: "mailto:hsrn-support@nyu.edu",
            },
            {
              label: "Email research cloud support",
              href: "mailto:research-cloud-support@nyu.edu",
            },
            {
              label: "Email general GenAI support",
              href: "mailto:genai-support@nyu.edu",
            },
            {
              label: "Email GenAI for research support",
              href: "mailto:genai-research-support@nyu.edu",
             },
          ],
        },
        {
          title: "Links",
          items: [
            {
              label: "NYU Libraries Research Guides",
              href: "https://guides.nyu.edu/",
            },
            {
              label: "FORC camp",
              href: "https://sites.google.com/nyu.edu/forc-camp/home",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Announcements",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/NYU-ITS/rts-docs-dev",
            },
          ],
        },
      ],
      copyright: "Made with \u{1F49C} in NYC!",
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.palenight,
      additionalLanguages: ["bash", "shell-session", "lua", "sql", "julia"],
    },
  } satisfies Preset.ThemeConfig,

  future: {
    v4: true, // opt-in to v4 to ease transition in the future
    experimental_faster: {
      rspackBundler: true, // required flag
      rspackPersistentCache: true, // new flag
    },
  },
};

export default config;
