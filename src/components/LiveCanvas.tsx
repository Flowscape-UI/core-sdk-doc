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
  const engineRef = useRef<any | null>(null);

  // UI state
  const [gridOn, setGridOn] = useState(true);
  const [selectionOn, setSelectionOn] = useState(true);

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

    areaSelectionRef.current = new AreaSelectionPlugin();

    // Initialize engine with default plugins attached
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
        rulerPluginRef.current,
        rulerGuidesRef.current, // must be after RulerPlugin
        rulerHighlightRef.current, // must be after RulerPlugin
        rulerManagerRef.current,
      ],
    });
    engineRef.current = engine;

    // Demo content
    const circle = engine.nodes.addCircle({
      x: 240,
      y: 180,
      radius: 60,
      fill: "#2563eb",
    });
    circle.getNode().draggable(true);

    const text = engine.nodes.addText({
      x: 340,
      y: 320,
      text: "Drag the circle",
      fontSize: 24,
      fill: "#fff",
    });
    text.getNode().draggable(true);

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

  const clearScene = () => {
    const engine = engineRef.current;
    if (!engine) return;
    // remove all children from world group
    const world = engine.nodes.world;
    const children = [...world.getChildren()];
    children.forEach((c: any) => c.destroy());
    engine.nodes.layer.draw();
  };

  return (
    <div
      style={{
        borderRadius: 12,
        border: "1px solid #334155",
        overflow: "hidden",
        background: "#0b1220",
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
        <strong style={{ marginRight: 8 }}>Demo</strong>
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
        <button onClick={zoomIn} style={btnStyle}>
          Zoom In
        </button>
        <button onClick={zoomOut} style={btnStyle}>
          Zoom Out
        </button>
        <button onClick={resetView} style={btnStyle}>
          Reset View
        </button>
        <span
          style={{
            width: 1,
            height: 22,
            background: "#334155",
            margin: "0 6px",
          }}
        />
        <button onClick={toggleGrid} style={btnStyle}>
          {gridOn ? "Hide Grid" : "Show Grid"}
        </button>
        <button onClick={toggleSelection} style={btnStyle}>
          {selectionOn ? "Disable Selection" : "Enable Selection"}
        </button>
        <span style={{ flex: 1 }} />
        <button
          onClick={clearScene}
          style={{ ...btnStyle, color: "#fca5a5", borderColor: "#7f1d1d" }}
        >
          Clear
        </button>
      </div>

      {/* Canvas area */}
      <div style={{ width: "100%", height: 420 }} ref={ref} />
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
