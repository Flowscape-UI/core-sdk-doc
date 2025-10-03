import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    "intro",
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: [
        "getting-started/installation",
        "getting-started/quick-start",
        "getting-started/configuration",
      ],
    },
    {
      type: "category",
      label: "Core Concepts",
      collapsed: false,
      items: [
        "core-concepts/architecture",
        "core-concepts/core-engine",
        "core-concepts/event-bus",
        "core-concepts/lifecycle",
      ],
    },
    {
      type: "category",
      label: "Managers",
      items: [
        "managers/node-manager",
        "managers/camera-manager",
        "managers/virtualization-manager",
        "managers/lod-manager",
      ],
    },
    {
      type: "category",
      label: "Nodes",
      items: [
        "nodes/overview",
        "nodes/base-node",
        "nodes/shape-node",
        "nodes/text-node",
        "nodes/image-node",
        "nodes/geometric-nodes",
        "nodes/group-node",
      ],
    },
    {
      type: "category",
      label: "Plugins",
      items: [
        "plugins/overview",
        "plugins/creating-plugins",
        "plugins/grid-plugin",
        "plugins/ruler-plugin",
        "plugins/selection-plugin",
        "plugins/hotkeys-plugins",
        "plugins/area-selection-plugin",
      ],
    },
    {
      type: "category",
      label: "Guides",
      items: [
        "guides/transformations",
        "guides/copy-paste",
        "guides/grouping",
        "guides/performance",
        "guides/testing",
        "guides/interactive-demo",
      ],
    },
    {
      type: "category",
      label: "API Reference",
      items: ["api/reference"],
    },
  ],
};

export default sidebars;
