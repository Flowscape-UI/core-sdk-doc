---
sidebar_position: 1
slug: /
---

# Welcome to Flowscape Core SDK

**Flowscape Core SDK** is a powerful, framework-agnostic canvas library built on top of [Konva.js](https://konvajs.org/). It provides a clean, TypeScript-first API for building interactive 2D graphics applications.

## Why Flowscape Core SDK?

- 🎯 Framework-agnostic — works with React, Vue, Svelte, Angular or vanilla JS
- 🧩 Plugin system — extensible architecture with ready-to-use plugins
- 📐 Complete toolset — grid, rulers, guides, area selection
- ⌨️ Hotkeys — Ctrl+C/V/X, Delete, Ctrl+G for grouping
- 🎨 Rich shapes — rectangles, circles, text, images, arrows, stars
- 🔄 Transformations — rotation, scaling, movement with aspect ratio lock
- 📦 TypeScript-first — full typing out of the box
- 🚀 Optimized — tree-shaking, ESM + CJS, source maps

## Key Features

### Core Engine

The heart of the SDK - manages the canvas, layers, and coordinates all managers and plugins.

### Node System

Create and manipulate various types of nodes:

- 🎨 Shapes - Custom vector shapes
- 📝 Text - Rich text rendering
- 📸 Images - Image nodes with loading support
- 📊 Geometric - Circles, ellipses, arcs, arrows, stars, rings, polygons
- 📦 Groups - Organize nodes hierarchically

### Managers

Specialized managers handle different aspects:

- 📦 NodeManager - Create, update, and delete nodes
- 📊 CameraManager - Pan, zoom, and navigate the canvas
- 📦 VirtualizationManager - Optimize rendering for large scenes
- 📦 LODManager - Adjust detail based on zoom level

### Plugin System

Extend functionality with plugins:

- 📊 Grid, rulers, and guides
- 📦 Selection and area selection
- 📦 Keyboard shortcuts
- 📦 Custom plugins

## Quick Example

```typescript
import { CoreEngine, CircleNode } from "@flowscape-ui/core-sdk";

// Create the engine
const engine = new CoreEngine({
  container: document.getElementById("canvas-container"),
  width: 800,
  height: 600,
});

// Add a circle
const circle = engine.nodes.addCircle({
  x: 400,
  y: 300,
  radius: 50,
  fill: "#3b82f6",
});

// Listen to events
engine.eventBus.on("node:created", (node) => {
  console.log("Node created:", node.id);
});
```

## What's Next?

<div className="row">
  <div className="col col--6">
    <h3>🚀 Get Started</h3>
    <p>Learn how to install and set up Flowscape Core SDK in your project.</p>
    <a href="/docs/getting-started/installation">Installation Guide →</a>
  </div>
  <div className="col col--6">
    <h3>📚 Core Concepts</h3>
    <p>Understand the architecture and fundamental concepts.</p>
    <a href="/docs/core-concepts/architecture">Learn the Basics →</a>
  </div>
</div>

## Community & Support

- 📦 GitHub: [Flowscape-UI/core-sdk](https://github.com/Flowscape-UI/core-sdk)
- 📦 Issues: [Report bugs or request features](https://github.com/Flowscape-UI/core-sdk/issues)
- 📦 License: MIT
