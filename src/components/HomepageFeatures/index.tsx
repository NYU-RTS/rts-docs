import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Heading from "@theme/Heading";
import ThemedImage from "@theme/ThemedImage";
import clsx from "clsx";
import { type ComponentProps } from "react";

import styles from "./styles.module.css";

interface FeatureItem {
  title: string;
  light_img_path: string;
  dark_img_path: string;
  description: React.ReactNode;
  to?: ComponentProps<typeof Link>["to"];
}

const FeatureList: FeatureItem[] = [
  {
    title: "High Performance Computing",
    light_img_path: "img/hpc.svg",
    dark_img_path: "img/hpc_dark.svg",
    description: (
      <>
        Seamless access to High Performance Computing resources, consultation
        services to enable your workflows and access to cloud-based bursting
        resources.
      </>
    ),
    to: "/docs/hpc/getting_started/intro/",
  },
  {
    title: "High Speed Research Network",
    light_img_path: "img/hsrn.svg",
    dark_img_path: "img/hsrn_dark.svg",
    description: (
      <>
        The High Speed Research Network (HSRN) is NYU&apos;s high-throughput,
        low-latency computer network dedicated to supporting data-intensive
        sciences.
      </>
    ),
    to: "https://hsrn.nyu.edu/docs/",
  },
  {
    title: "Pythia",
    light_img_path: "img/pythia.svg",
    dark_img_path: "img/pythia_dark.svg",
    description: (
      <>
        The Pythia GenAI Platform is a suite of tools for researchers to harness
        generative AI including a secure access to a chat portal, API access to
        LLMs. Currently in pilot phase, expect breaking changes.
      </>
    ),
    to: "/docs/genai/getting_started/intro/",
  },
  {
    title: "Cloud Computing",
    light_img_path: "img/cloud.svg",
    dark_img_path: "img/cloud_dark.svg",
    description: (
      <>
        We facilitate access to Google Cloud Platform and also host an on-prem
        OpenShift cluster called Research Technology Cloud.
      </>
    ),
    to: "/docs/cloud/getting_started/intro/",
  },
  {
    title: "SRDE",
    light_img_path: "img/srde.svg",
    dark_img_path: "img/srde_dark.svg",
    description: (
      <>
        The Secure Research Data Environment (SRDE) is a centralized secure
        computing platform designed to support research projects that require
        storage and computational resources specifically for sensitive data.
      </>
    ),
    to: "/docs/srde/getting_started/intro/",
  },
];

function Feature({
  title,
  light_img_path,
  dark_img_path,
  description,
  to,
}: FeatureItem) {
  const Wrapper = to ? Link : "div";

  return (
    <Wrapper className={clsx("col col--4", to && styles.featureLink)} to={to}>
      <div className="text--center">
        <ThemedImage
          alt="Docusaurus themed image"
          className={styles.featureSvg}
          sources={{
            light: useBaseUrl(light_img_path),
            dark: useBaseUrl(dark_img_path),
          }}
        />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </Wrapper>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, index) => <Feature
            key={index}
            {...props}
          />)}
        </div>
      </div>
    </section>
  );
}
