import React, { useEffect, useRef, useState } from "react";
import {
  CoreEngine,
  GridPlugin,
  SelectionPlugin,
  LogoPlugin,
  CameraHotkeysPlugin,
  AreaSelectionPlugin,
  NodeHotkeysPlugin,
  RulerPlugin,
  RulerGuidesPlugin,
  RulerHighlightPlugin,
  RulerManagerPlugin,
} from "@flowscape-ui/core-sdk";

export default function LiveCanvas() {
  const ref = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<any | null>(null);

  // UI state
  const [gridOn, setGridOn] = useState(true);
  const [selectionOn, setSelectionOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rulersOn, setRulersOn] = useState(false);

  // Plugin instances
  const gridPluginRef = useRef<any | null>(null);
  const selectionPluginRef = useRef<any | null>(null);
  const logoPluginRef = useRef<any | null>(null);
  const cameraHotkeysRef = useRef<any | null>(null);
  const areaSelectionRef = useRef<any | null>(null);
  const nodeHotkeysRef = useRef<any | null>(null);
  const rulerPluginRef = useRef<any | null>(null);
  const rulerGuidesRef = useRef<any | null>(null);
  const rulerHighlightRef = useRef<any | null>(null);
  const rulerManagerRef = useRef<any | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Prepare default plugins (same as SDK playground)
    logoPluginRef.current = new LogoPlugin({
      src: "/img/logo.svg", // using docs static asset
      width: 220,
      height: 220,
      opacity: 0.5,
    });
    cameraHotkeysRef.current = new CameraHotkeysPlugin({});
    nodeHotkeysRef.current = new NodeHotkeysPlugin({});
    selectionPluginRef.current = new SelectionPlugin({});
    gridPluginRef.current = new GridPlugin({
      color: "#3d3d3d",
      minScaleToShow: 15,
      enableSnap: true,
    });

    areaSelectionRef.current = new AreaSelectionPlugin();

    // Initialize engine with default plugins attached (rulers disabled by default)
    const engine = new CoreEngine({
      container: ref.current,
      autoResize: true,
      backgroundColor: "#111827",
      plugins: [
        logoPluginRef.current,
        cameraHotkeysRef.current,
        gridPluginRef.current,
        selectionPluginRef.current,
        areaSelectionRef.current,
        nodeHotkeysRef.current,
      ],
    });
    engineRef.current = engine;
    // Ensure correct initial sizing
    const rect0 = ref.current.getBoundingClientRect();
    engine.stage.width(rect0.width);
    engine.stage.height(rect0.height);
    engine.nodes.layer.draw();

    // Demo content - Landing page mockup (centered)
    const centerX = 30; // Left margin for centering
    const centerY = 30; // Top margin

    // Create a main group for all mockup elements
    const mockupGroup = engine.nodes.addGroup({
      x: 0,
      y: 0,
      draggable: true,
    });

    // Header section
    const headerBg = engine.nodes.addShape({
      x: centerX,
      y: centerY,
      width: 900,
      height: 80,
      cornerRadius: 12,
      fill: "#1e293b",
      stroke: "#334155",
      strokeWidth: 1,
    });
    headerBg.getNode().moveTo(mockupGroup.getNode());

    const logoCircle = engine.nodes.addCircle({
      x: centerX + 40,
      y: centerY + 40,
      radius: 20,
      fill: "#206eff",
    });
    logoCircle.getNode().moveTo(mockupGroup.getNode());

    const logoText = engine.nodes.addText({
      x: centerX + 75,
      y: centerY + 30,
      text: "Flowscape SDK",
      fontSize: 20,
      fontStyle: "bold",
      fill: "#f1f5f9",
      fontFamily: "Inter, ui-sans-serif, system-ui",
    });
    logoText.getNode().moveTo(mockupGroup.getNode());

    // Navigation items
    const navItems = ["Docs", "Examples", "API", "GitHub"];
    navItems.forEach((item, i) => {
      const navText = engine.nodes.addText({
        x: centerX + 600 + i * 75,
        y: centerY + 30,
        text: item,
        fontSize: 15,
        fill: "#94a3b8",
        fontFamily: "Inter, ui-sans-serif, system-ui",
      });
      navText.getNode().moveTo(mockupGroup.getNode());
    });

    // Hero section
    const heroTitle = engine.nodes.addText({
      x: centerX + 200,
      y: centerY + 130,
      text: "Build Interactive Canvas",
      fontSize: 48,
      fontStyle: "bold",
      fill: "#f8fafc",
      fontFamily: "Inter, ui-sans-serif, system-ui",
    });
    heroTitle.getNode().moveTo(mockupGroup.getNode());

    const heroSubtitle = engine.nodes.addText({
      x: centerX + 290,
      y: centerY + 190,
      text: "Framework-agnostic 2D engine",
      fontSize: 28,
      fill: "#1afff4",
      fontFamily: "Inter, ui-sans-serif, system-ui",
    });
    heroSubtitle.getNode().moveTo(mockupGroup.getNode());

    // CTA Buttons
    const ctaButton1 = engine.nodes.addShape({
      x: centerX + 310,
      y: centerY + 248,
      width: 160,
      height: 50,
      cornerRadius: 8,
      fill: "#206eff",
      stroke: "#1afff4",
      strokeWidth: 2,
    });
    ctaButton1.getNode().moveTo(mockupGroup.getNode());

    const ctaText1 = engine.nodes.addText({
      x: centerX + 340,
      y: centerY + 265,
      text: "Get Started",
      fontSize: 18,
      fontStyle: "bold",
      fill: "#ffffff",
      fontFamily: "Inter, ui-sans-serif, system-ui",
    });
    ctaText1.getNode().moveTo(mockupGroup.getNode());

    const ctaButton2 = engine.nodes.addShape({
      x: centerX + 505,
      y: centerY + 248,
      width: 160,
      height: 50,
      cornerRadius: 8,
      fill: "transparent",
      stroke: "#64748b",
      strokeWidth: 2,
    });
    ctaButton2.getNode().moveTo(mockupGroup.getNode());

    const ctaText2 = engine.nodes.addText({
      x: centerX + 540,
      y: centerY + 265,
      text: "View Demo",
      fontSize: 18,
      fontStyle: "bold",
      fill: "#cbd5e1",
      fontFamily: "Inter, ui-sans-serif, system-ui",
    });
    ctaText2.getNode().moveTo(mockupGroup.getNode());

    // Feature cards
    const cardData = [
      { x: centerX + 30, title: "TypeScript", icon: "TS", color: "#3178c6" },
      {
        x: centerX + 310,
        title: "Plugin System",
        icon: "🔌",
        color: "#10b981",
      },
      {
        x: centerX + 590,
        title: "High Performance",
        icon: "⚡",
        color: "#f59e0b",
      },
    ];

    cardData.forEach((card, index) => {
      // Card background
      const cardBg = engine.nodes.addShape({
        x: card.x,
        y: centerY + 330,
        width: 240,
        height: 180,
        cornerRadius: 12,
        fill: "#1e293b",
        stroke: "#334155",
        strokeWidth: 1,
      });
      cardBg.getNode().moveTo(mockupGroup.getNode());

      // Icon circle
      const iconCircle = engine.nodes.addCircle({
        x: card.x + 120,
        y: centerY + 380,
        radius: 30,
        fill: card.color,
      });
      iconCircle.getNode().opacity(0.2);
      iconCircle.getNode().moveTo(mockupGroup.getNode());

      // Icon text - centered for each card
      const iconXPositions = [
        card.x + 105, // TypeScript "TS"
        card.x + 105, // Plugin System emoji
        card.x + 103, // High Performance emoji
      ];
      const iconText = engine.nodes.addText({
        x: iconXPositions[index],
        y: centerY + 365,
        text: card.icon,
        fontSize: 28,
        fill: card.color,
        fontFamily: "Inter, ui-sans-serif, system-ui",
      });
      iconText.getNode().moveTo(mockupGroup.getNode());

      // Card title - centered for each card
      const titleXPositions = [
        card.x + 65, // TypeScript
        card.x + 55, // Plugin System
        card.x + 35, // High Performance
      ];
      const cardTitle = engine.nodes.addText({
        x: titleXPositions[index],
        y: centerY + 430,
        text: card.title,
        fontSize: 20,
        fontStyle: "bold",
        fill: "#f1f5f9",
        fontFamily: "Inter, ui-sans-serif, system-ui",
      });
      cardTitle.getNode().moveTo(mockupGroup.getNode());

      // Card description - centered for each card
      const descriptions = [
        "Full type safety\nwith TypeScript",
        "Extensible via\nplugins",
        "Optimized for\nsmooth rendering",
      ];
      const descXPositions = [
        card.x + 68, // TypeScript description
        card.x + 80, // Plugin System description
        card.x + 70, // High Performance description
      ];
      const cardDesc = engine.nodes.addText({
        x: descXPositions[index],
        y: centerY + 460,
        text: descriptions[index],
        fontSize: 14,
        fill: "#94a3b8",
        fontFamily: "Inter, ui-sans-serif, system-ui",
        align: "center",
      });
      cardDesc.getNode().moveTo(mockupGroup.getNode());
    });

    // Code snippet visualization
    const codeBox = engine.nodes.addShape({
      x: centerX + 30,
      y: centerY + 550,
      width: 840,
      height: 140,
      cornerRadius: 8,
      fill: "#0f172a",
      stroke: "#1e293b",
      strokeWidth: 1,
    });
    codeBox.getNode().moveTo(mockupGroup.getNode());

    const codeLines = [
      'import { CoreEngine } from "@flowscape-ui/core-sdk";',
      "",
      "const engine = new CoreEngine({ container });",
      "engine.nodes.addCircle({ x: 100, y: 100, radius: 50 });",
    ];

    codeLines.forEach((line, i) => {
      const codeLine = engine.nodes.addText({
        x: centerX + 50,
        y: centerY + 570 + i * 28,
        text: line,
        fontSize: 14,
        fill: i === 0 ? "#1afff4" : i === 3 ? "#10b981" : "#cbd5e1",
        fontFamily: "Fira Code, monospace",
      });
      codeLine.getNode().moveTo(mockupGroup.getNode());
    });

    // Decorative elements
    const decorCircle1 = engine.nodes.addCircle({
      x: centerX + 900,
      y: centerY + 170,
      radius: 40,
      fill: "#206eff",
    });
    decorCircle1.getNode().opacity(0.15);
    decorCircle1.getNode().moveTo(mockupGroup.getNode());

    const decorCircle2 = engine.nodes.addCircle({
      x: centerX - 20,
      y: centerY + 450,
      radius: 25,
      fill: "#1afff4",
    });
    decorCircle2.getNode().opacity(0.15);
    decorCircle2.getNode().moveTo(mockupGroup.getNode());

    return () => {
      // dispose Konva stage
      if (engineRef.current) {
        engineRef.current.stage.destroy();
        engineRef.current = null;
      }
      // clear plugin refs
      logoPluginRef.current = null;
      cameraHotkeysRef.current = null;
      nodeHotkeysRef.current = null;
      selectionPluginRef.current = null;
      gridPluginRef.current = null;
      areaSelectionRef.current = null;
      rulerPluginRef.current = null;
      rulerGuidesRef.current = null;
      rulerHighlightRef.current = null;
      rulerManagerRef.current = null;
    };
  }, []);

  // Track native fullscreen changes (ESC, browser UI)
  useEffect(() => {
    const updateEngineSize = () => {
      const engine = engineRef.current;
      const el = ref.current;
      if (!engine || !el) return;
      const r = el.getBoundingClientRect();
      engine.stage.width(r.width);
      engine.stage.height(r.height);
      engine.nodes.layer.draw();
    };

    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Resize on next frame to reflect new layout
      requestAnimationFrame(() => updateEngineSize());
      // And once more after CSS settles
      setTimeout(updateEngineSize, 60);
    };
    const onResize = () => updateEngineSize();

    document.addEventListener("fullscreenchange", onFsChange);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Handlers
  const addCircle = () => {
    const engine = engineRef.current;
    if (!engine) return;
    const c = engine.nodes.addCircle({
      x: 120 + Math.random() * 600,
      y: 100 + Math.random() * 250,
      radius: 40 + Math.random() * 40,
      fill: "#3b82f6",
      stroke: "#60a5fa",
      strokeWidth: 2,
    });
    c.getNode().draggable(true);
  };

  const addRect = () => {
    const engine = engineRef.current;
    if (!engine) return;
    const r = engine.nodes.addShape({
      x: 120 + Math.random() * 600,
      y: 100 + Math.random() * 250,
      width: 120 + Math.random() * 120,
      height: 80 + Math.random() * 80,
      cornerRadius: 8,
      fill: "#10b981",
      stroke: "#34d399",
      strokeWidth: 2,
    });
    r.getNode().draggable(true);
  };

  const addText = () => {
    const engine = engineRef.current;
    if (!engine) return;
    const t = engine.nodes.addText({
      x: 120 + Math.random() * 600,
      y: 100 + Math.random() * 250,
      text: "Hello Flowscape",
      fontSize: 22,
      fill: "#e5e7eb",
      fontFamily: "Inter, ui-sans-serif, system-ui",
    });
    t.getNode().draggable(true);
  };

  const zoomIn = () => {
    const engine = engineRef.current;
    if (!engine) return;
    const stage = engine.stage;
    const rect = stage.container().getBoundingClientRect();
    engine.camera.zoomTo((stage.scaleX?.() ?? 1) * 1.2, {
      x: rect.width / 2,
      y: rect.height / 2,
    });
  };

  const zoomOut = () => {
    const engine = engineRef.current;
    if (!engine) return;
    const stage = engine.stage;
    const rect = stage.container().getBoundingClientRect();
    engine.camera.zoomTo((stage.scaleX?.() ?? 1) / 1.2, {
      x: rect.width / 2,
      y: rect.height / 2,
    });
  };

  const resetView = () => {
    const engine = engineRef.current;
    if (!engine) return;
    if (engine.camera.reset) engine.camera.reset();
    else engine.camera.setScale?.(1);
  };

  const toggleGrid = () => {
    const engine = engineRef.current;
    if (!engine) return;
    if (!gridOn) {
      gridPluginRef.current = new GridPlugin();
      gridPluginRef.current.attach(engine);
      setGridOn(true);
    } else {
      gridPluginRef.current?.detach(engine);
      gridPluginRef.current = null;
      setGridOn(false);
    }
  };

  const toggleSelection = () => {
    const engine = engineRef.current;
    if (!engine) return;
    if (!selectionOn) {
      selectionPluginRef.current = new SelectionPlugin();
      selectionPluginRef.current.attach(engine);
      setSelectionOn(true);
    } else {
      selectionPluginRef.current?.detach(engine);
      selectionPluginRef.current = null;
      setSelectionOn(false);
    }
  };

  const toggleRulers = () => {
    const engine = engineRef.current;
    if (!engine) return;
    if (!rulersOn) {
      // Enable rulers
      rulerPluginRef.current = new RulerPlugin();
      rulerGuidesRef.current = new RulerGuidesPlugin({
        snapToGrid: true,
        gridStep: 1,
      });
      rulerHighlightRef.current = new RulerHighlightPlugin({
        highlightColor: "#2b83ff",
        highlightOpacity: 0.3,
      });
      rulerManagerRef.current = new RulerManagerPlugin({ enabled: true });

      rulerPluginRef.current.attach(engine);
      rulerGuidesRef.current.attach(engine);
      rulerHighlightRef.current.attach(engine);
      rulerManagerRef.current.attach(engine);
      setRulersOn(true);
    } else {
      // Disable rulers
      rulerPluginRef.current?.detach(engine);
      rulerGuidesRef.current?.detach(engine);
      rulerHighlightRef.current?.detach(engine);
      rulerManagerRef.current?.detach(engine);

      rulerPluginRef.current = null;
      rulerGuidesRef.current = null;
      rulerHighlightRef.current = null;
      rulerManagerRef.current = null;
      setRulersOn(false);
    }
    engine.nodes.layer.draw();
  };

  const clearScene = () => {
    const engine = engineRef.current;
    if (!engine) return;
    // remove all children from world group
    const world = engine.nodes.world;
    const children = [...world.getChildren()];
    children.forEach((c: any) => c.destroy());
    engine.nodes.layer.draw();
  };

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        await containerRef.current?.requestFullscreen?.();
        // ensure size after entering FS
        requestAnimationFrame(() => {
          const engine = engineRef.current;
          const el = ref.current;
          if (!engine || !el) return;
          const r = el.getBoundingClientRect();
          engine.stage.width(r.width);
          engine.stage.height(r.height);
          engine.nodes.layer.draw();
        });
      } else {
        await document.exitFullscreen?.();
        // ensure size after exiting FS
        requestAnimationFrame(() => {
          const engine = engineRef.current;
          const el = ref.current;
          if (!engine || !el) return;
          const r = el.getBoundingClientRect();
          engine.stage.width(r.width);
          engine.stage.height(r.height);
          engine.nodes.layer.draw();
        });
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: 12,
        border: "1px solid #334155",
        overflow: "hidden",
        background: "#0b1220",
        height: isFullscreen ? "100vh" : undefined,
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          padding: "8px 10px",
          borderBottom: "1px solid #1f2937",
          background: "#0f172a",
          color: "#e5e7eb",
          flexWrap: "wrap",
        }}
      >
        <strong style={{ marginRight: 8 }}>
          🎨 Interactive Landing Page Mockup
        </strong>
        <button onClick={addCircle} style={btnStyle}>
          + Circle
        </button>
        <button onClick={addRect} style={btnStyle}>
          + Rect
        </button>
        <button onClick={addText} style={btnStyle}>
          + Text
        </button>
        <span
          style={{
            width: 1,
            height: 22,
            background: "#334155",
            margin: "0 6px",
          }}
        />
        <button onClick={toggleRulers} style={btnStyle}>
          {rulersOn ? "Hide Rulers" : "Show Rulers"}
        </button>
        <button onClick={toggleSelection} style={btnStyle}>
          {selectionOn ? "Disable Selection" : "Enable Selection"}
        </button>
        <span style={{ flex: 1 }} />
        <button onClick={toggleFullscreen} style={btnStyle}>
          {isFullscreen ? "Close Fullscreen (Esc)" : "Fullscreen"}
        </button>
        <button
          onClick={clearScene}
          style={{ ...btnStyle, color: "#fca5a5", borderColor: "#7f1d1d" }}
        >
          Clear
        </button>
      </div>

      {/* Canvas area */}
      <div
        style={{
          width: "100%",
          height: isFullscreen ? "calc(100vh - 56px)" : 820,
        }}
        ref={ref}
      />
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  appearance: "none",
  background: "transparent",
  color: "#e5e7eb",
  border: "1px solid #374151",
  borderRadius: 6,
  padding: "6px 10px",
  fontSize: 13,
  cursor: "pointer",
};
