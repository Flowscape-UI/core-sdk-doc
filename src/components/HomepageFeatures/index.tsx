import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "TypeScript First",
    Svg: require("@site/static/img/typescript_icon.svg").default,
    description: (
      <>
        Built with TypeScript from the ground up. Enjoy full type safety,
        IntelliSense support, and a superior developer experience with
        comprehensive type definitions for all APIs.
      </>
    ),
  },
  {
    title: "Plugin Architecture",
    Svg: require("@site/static/img/plugin_icon.svg").default,
    description: (
      <>
        Extend functionality with a powerful plugin system. Grid, selection,
        rulers, hotkeys, and more—all modular and composable. Build your own
        plugins to customize behavior.
      </>
    ),
  },
  {
    title: "Framework Agnostic",
    Svg: require("@site/static/img/framework_icon.svg").default,
    description: (
      <>
        Works seamlessly with React, Vue, Angular, Svelte, or vanilla
        JavaScript. Built on Konva.js for high-performance 2D canvas rendering
        with a clean, modern API.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
