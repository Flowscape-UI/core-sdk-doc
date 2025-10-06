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
import Konva from "konva";
import ColorPicker from "@flowscape-ui/design-system-kit";

export default function LiveCanvas() {
  const ref = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<any | null>(null);

  // UI state
  const [gridOn, setGridOn] = useState(true);
  const [selectionOn, setSelectionOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rulersOn, setRulersOn] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(false); // Start closed on mobile
  const [sceneNodes, setSceneNodes] = useState<any[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const updateTimerRef = useRef<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  
  // Selected node properties
  const [nodeProps, setNodeProps] = useState<any>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    radius: 0,
    fill: '#000000',
    stroke: '#000000',
    strokeWidth: 0,
    cornerRadius: 0,
    opacity: 1,
    zIndex: 0,
  });

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
    const centerX = 200; // Left margin for centering
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

    // Update scene nodes list
    updateSceneNodesList();

    // Setup automatic scene monitoring
    const setupSceneMonitoring = () => {
      const layer = engine.nodes.layer;
      const world = engine.nodes.world;
      
      // Update function with debounce
      const scheduleUpdate = () => {
        if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
        updateTimerRef.current = setTimeout(() => {
          updateSceneNodesList();
        }, 100);
      };
      
      // Listen to layer events for add/remove
      layer.on('add remove', scheduleUpdate);
      
      // Listen to world group events for children changes (grouping/ungrouping)
      world.on('add remove', scheduleUpdate);
      
      // Monitor all nodes for z-index changes and other modifications
      const monitorNode = (node: any) => {
        // Listen to dragmove to detect potential z-index changes
        node.on('dragend', scheduleUpdate);
        
        // Listen to any attribute changes (including zIndex)
        node.on('zIndexChange', scheduleUpdate);
        
        // Listen to hover events for left panel sync
        node.on('mouseenter', () => {
          if (node._id) {
            setHoveredNodeId(node._id);
          }
        });
        
        node.on('mouseleave', () => {
          setHoveredNodeId(null);
        });
        
        // Listen to click events for selection sync
        node.on('click', () => {
          if (node._id) {
            setSelectedNodeId(node._id);
          }
        });
        
        // Listen to destroy event and clear transformer
        node.on('destroy', () => {
          // Clear transformer if this node was selected
          const stage = engine.stage;
          const transformer = stage.findOne('Transformer') as any;
          if (transformer && typeof transformer.nodes === 'function') {
            const selectedNodes = transformer.nodes();
            if (selectedNodes.includes(node)) {
              transformer.nodes([]);
              engine.nodes.layer.batchDraw();
            }
          }
          
          // Clear UI selection state
          setSelectedNodeId(null);
          setHoveredNodeId(null);
          
          // Update the list
          scheduleUpdate();
        });
        
        // If it's a group, monitor its children
        if (node.nodeType === 'Group') {
          node.on('add remove', scheduleUpdate);
          const children = node.getChildren();
          children.forEach((child: any) => monitorNode(child));
        }
      };
      
      // Monitor existing nodes
      const monitorAllNodes = () => {
        const children = world.getChildren();
        children.forEach((child: any) => monitorNode(child));
      };
      
      monitorAllNodes();
      
      // Monitor new nodes when added
      world.on('add', (e: any) => {
        if (e.child) {
          monitorNode(e.child);
        }
      });
      
      // Also monitor stage-level events
      const stage = engine.stage;
      stage.on('dragend', scheduleUpdate);
      
      // Monitor layer order changes (moveUp, moveDown, moveToTop, moveToBottom)
      layer.on('draw', () => {
        // Check if order has changed by comparing current state
        const currentChildren = world.getChildren();
        if (currentChildren.length !== sceneNodes.length) {
          scheduleUpdate();
        }
      });
    };
    setupSceneMonitoring();

    // Setup click handler for deselection and selection sync
    const setupCanvasInteraction = () => {
      const stage = engine.stage;
      
      stage.on('click', (e: any) => {
        // Check if clicked on empty area (stage or layer, not a shape)
        const clickedOnEmpty = e.target === stage || e.target === engine.nodes.layer;
        
        if (clickedOnEmpty) {
          // Clear transformer selection
          const transformer = stage.findOne('Transformer') as any;
          if (transformer && typeof transformer.nodes === 'function') {
            transformer.nodes([]);
            engine.nodes.layer.batchDraw();
          }
          
          // Clear UI selection state
          setSelectedNodeId(null);
          setShowRightPanel(false);
        } else {
          // Clicked on a shape - sync selection to left panel and right panel
          const clickedNode = e.target;
          if (clickedNode && clickedNode._id) {
            setSelectedNodeId(clickedNode._id);
            loadNodeProperties(clickedNode);
            setShowRightPanel(true);
          }
        }
      });
      
      // Also listen to transformer changes
      stage.on('transformstart', (e: any) => {
        const node = e.target;
        if (node && node._id) {
          setSelectedNodeId(node._id);
          loadNodeProperties(node);
          setShowRightPanel(true);
        }
      });
      
      // Update properties during transform
      stage.on('transform', (e: any) => {
        const node = e.target;
        if (node && node._id === selectedNodeId) {
          loadNodeProperties(node);
        }
      });
      
      // Update properties after transform ends
      stage.on('transformend', (e: any) => {
        const node = e.target;
        if (node && node._id === selectedNodeId) {
          loadNodeProperties(node);
        }
      });
      
      // Listen to keyboard events for delete key (in addition to NodeHotkeysPlugin)
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          // NodeHotkeysPlugin will handle the deletion
          // Clear transformer and selection
          setTimeout(() => {
            const transformer = stage.findOne('Transformer') as any;
            if (transformer && typeof transformer.nodes === 'function') {
              transformer.nodes([]);
              engine.nodes.layer.batchDraw();
            }
            updateSceneNodesList();
            setSelectedNodeId(null);
            setShowRightPanel(false);
          }, 50);
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      
      // Cleanup
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    };
    const cleanupInteraction = setupCanvasInteraction();

    return () => {
      // cleanup interaction listeners
      if (cleanupInteraction) {
        cleanupInteraction();
      }
      
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
      
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
    };
  }, []);

  // Monitor selected node for property changes
  useEffect(() => {
    if (!selectedNodeId || !engineRef.current) return;
    
    const interval = setInterval(() => {
      const engine = engineRef.current;
      if (!engine) return;
      
      const world = engine.nodes.world;
      const children = world.getChildren();
      
      // Find the selected node
      let targetNode: any = null;
      children.forEach((child: any) => {
        if (child._id === selectedNodeId) {
          targetNode = child;
        } else if (child.nodeType === 'Group') {
          const groupChildren = child.getChildren();
          groupChildren.forEach((gc: any) => {
            if (gc._id === selectedNodeId) {
              targetNode = gc;
            }
          });
        }
      });
      
      if (targetNode) {
        // Check if z-index has changed
        const currentZIndex = targetNode.zIndex?.() || 0;
        if (currentZIndex !== nodeProps.zIndex) {
          loadNodeProperties(targetNode);
          updateSceneNodesList();
        }
      }
    }, 200); // Check every 200ms
    
    return () => clearInterval(interval);
  }, [selectedNodeId, nodeProps.zIndex]);

  // Detect mobile/tablet screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
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

  // Update scene nodes list
  const updateSceneNodesList = () => {
    const engine = engineRef.current;
    if (!engine) return;
    const world = engine.nodes.world;
    const children = world.getChildren();
    const nodesList: any[] = [];
    
    children.forEach((child: any, index: number) => {
      if (child.nodeType === 'Group') {
        const groupChildren = child.getChildren();
        nodesList.push({
          type: 'Group',
          index: index,
          zIndex: child.zIndex?.() || index,
          id: child._id,
          childrenCount: groupChildren.length,
          node: child,
          children: groupChildren.map((gc: any, gci: number) => ({
            type: gc.className,
            index: gci,
            zIndex: gc.zIndex?.() || gci,
            id: gc._id,
            name: gc.name() || gc.className,
            node: gc
          }))
        });
      } else {
        nodesList.push({
          type: child.className,
          index: index,
          zIndex: child.zIndex?.() || index,
          id: child._id,
          name: child.name() || child.className,
          node: child
        });
      }
    });
    setSceneNodes(nodesList);
  };

  // Select node in canvas
  const selectNodeInCanvas = (nodeId: string) => {
    const engine = engineRef.current;
    if (!engine) return;
    
    const world = engine.nodes.world;
    const children = world.getChildren();
    
    // Find the node by ID
    let targetNode: any = null;
    children.forEach((child: any) => {
      if (child._id === nodeId) {
        targetNode = child;
      } else if (child.nodeType === 'Group') {
        const groupChildren = child.getChildren();
        groupChildren.forEach((gc: any) => {
          if (gc._id === nodeId) {
            targetNode = gc;
          }
        });
      }
    });
    
    if (targetNode) {
      // Find or create transformer
      let transformer = engine.stage.findOne('Transformer');
      
      if (!transformer) {
        // If no transformer exists, create one
        transformer = new Konva.Transformer({
          rotateEnabled: true,
          borderStroke: '#3b82f6',
          borderStrokeWidth: 2,
          anchorStroke: '#3b82f6',
          anchorFill: '#ffffff',
          anchorSize: 8,
        });
        engine.nodes.layer.add(transformer);
      }
      
      // Set the transformer to the target node
      transformer.nodes([targetNode]);
      engine.nodes.layer.batchDraw();
      
      setSelectedNodeId(nodeId);
      loadNodeProperties(targetNode);
      setShowRightPanel(true);
    }
  };

  // Load properties of selected node
  const loadNodeProperties = (node: any) => {
    const props: any = {
      x: node.x?.() || 0,
      y: node.y?.() || 0,
      opacity: node.opacity?.() || 1,
      zIndex: node.zIndex?.() || 0,
    };
    
    // Shape-specific properties
    if (node.width) props.width = node.width();
    if (node.height) props.height = node.height();
    if (node.radius) props.radius = node.radius();
    if (node.fill) props.fill = node.fill();
    if (node.stroke) props.stroke = node.stroke();
    if (node.strokeWidth) props.strokeWidth = node.strokeWidth();
    if (node.cornerRadius) props.cornerRadius = node.cornerRadius();
    
    setNodeProps(props);
  };

  // Update node property
  const updateNodeProperty = (property: string, value: any) => {
    const engine = engineRef.current;
    if (!engine || !selectedNodeId) return;
    
    const world = engine.nodes.world;
    const children = world.getChildren();
    
    // Find the selected node
    let targetNode: any = null;
    children.forEach((child: any) => {
      if (child._id === selectedNodeId) {
        targetNode = child;
      } else if (child.nodeType === 'Group') {
        const groupChildren = child.getChildren();
        groupChildren.forEach((gc: any) => {
          if (gc._id === selectedNodeId) {
            targetNode = gc;
          }
        });
      }
    });
    
    if (targetNode && typeof targetNode[property] === 'function') {
      targetNode[property](value);
      engine.nodes.layer.batchDraw();
      
      // Update local state
      setNodeProps((prev: any) => ({ ...prev, [property]: value }));
    }
  };

  // Delete selected node
  const deleteNode = (nodeId: string) => {
    const engine = engineRef.current;
    if (!engine) return;
    
    const world = engine.nodes.world;
    const children = world.getChildren();
    
    // Clear transformer first
    const transformer = engine.stage.findOne('Transformer') as any;
    if (transformer && typeof transformer.nodes === 'function') {
      transformer.nodes([]);
    }
    
    // Find and delete the node
    children.forEach((child: any) => {
      if (child._id === nodeId) {
        child.destroy();
      } else if (child.nodeType === 'Group') {
        const groupChildren = child.getChildren();
        groupChildren.forEach((gc: any) => {
          if (gc._id === nodeId) {
            gc.destroy();
          }
        });
      }
    });
    
    setSelectedNodeId(null);
    engine.nodes.layer.draw();
    updateSceneNodesList();
  };

  // Handle keyboard events in left panel
  const handleNodeKeyDown = (e: React.KeyboardEvent, nodeId: string) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      deleteNode(nodeId);
    }
  };

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
    updateSceneNodesList();
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
    updateSceneNodesList();
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
    updateSceneNodesList();
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
    updateSceneNodesList();
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
        height: isFullscreen ? "100vh" : "calc(100vh - 200px)",
        minHeight: isFullscreen ? "100vh" : 600,
        display: "flex",
        flexDirection: "column",
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

      {/* Main content area with left panel and canvas */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        {/* Overlay for mobile */}
        {showLeftPanel && isMobile && (
          <div
            onClick={() => setShowLeftPanel(false)}
            style={{
              position: isFullscreen ? "fixed" : "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 998,
              backdropFilter: "blur(2px)",
            }}
          />
        )}

        {/* Left Panel */}
        {showLeftPanel && (
          <div
            style={{
              position: isFullscreen ? "fixed" : "absolute",
              left: 0,
              top: isFullscreen ? 56 : 0,
              bottom: 0,
              height: isFullscreen ? "calc(100% - 56px)" : "100%",
              width: 280,
              minWidth: 280,
              maxWidth: 280,
              background: "#0f172a",
              borderRight: "1px solid #1f2937",
              overflowY: "auto",
              overflowX: "hidden",
              padding: "12px",
              color: "#e5e7eb",
              fontSize: 13,
              zIndex: 999,
              boxShadow: "4px 0 12px rgba(0, 0, 0, 0.5)",
              transition: "transform 0.3s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <strong style={{ fontSize: 14 }}>Scene Nodes</strong>
              <button
                onClick={() => setShowLeftPanel(false)}
                style={{
                  ...btnStyle,
                  padding: "4px 8px",
                  fontSize: 16,
                  lineHeight: 1,
                }}
                title="Close panel"
              >
                ✕
              </button>
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 12, fontStyle: "italic" }}>
              Click to select • Del to delete
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>
              Total nodes: {sceneNodes.length}
            </div>
            {sceneNodes.length === 0 ? (
              <div style={{ color: "#64748b", fontStyle: "italic" }}>
                No nodes in scene
              </div>
            ) : (
              sceneNodes.map((node, idx) => (
                <div
                  key={node.id}
                  tabIndex={0}
                  onClick={() => selectNodeInCanvas(node.id)}
                  onKeyDown={(e) => handleNodeKeyDown(e, node.id)}
                  style={{
                    marginBottom: 8,
                    padding: 8,
                    background: selectedNodeId === node.id ? "#1e3a5f" : (hoveredNodeId === node.id ? "#2d3748" : "#1e293b"),
                    borderRadius: 6,
                    border: selectedNodeId === node.id ? "2px solid #3b82f6" : (hoveredNodeId === node.id ? "1px solid #60a5fa" : "1px solid #334155"),
                    cursor: "pointer",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {node.type === "Group" ? (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <div style={{ fontWeight: "bold", color: "#60a5fa" }}>
                          📁 Group #{idx}
                        </div>
                        <div style={{ fontSize: 10, color: "#64748b", background: "#1e293b", padding: "2px 6px", borderRadius: 3 }}>
                          z: {node.zIndex}
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>
                        Children: {node.childrenCount}
                      </div>
                      {node.children && node.children.length > 0 && (
                        <div style={{ marginTop: 6, marginLeft: 12 }}>
                          {node.children.map((child: any) => (
                            <div
                              key={child.id}
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                selectNodeInCanvas(child.id);
                              }}
                              onKeyDown={(e) => {
                                e.stopPropagation();
                                handleNodeKeyDown(e, child.id);
                              }}
                              style={{
                                fontSize: 11,
                                color: selectedNodeId === child.id ? "#60a5fa" : (hoveredNodeId === child.id ? "#93c5fd" : "#cbd5e1"),
                                padding: "4px 0",
                                borderLeft: selectedNodeId === child.id ? "2px solid #3b82f6" : (hoveredNodeId === child.id ? "2px solid #60a5fa" : "2px solid #334155"),
                                paddingLeft: 8,
                                marginBottom: 2,
                                cursor: "pointer",
                                outline: "none",
                                borderRadius: 3,
                                background: selectedNodeId === child.id ? "#1e3a5f" : (hoveredNodeId === child.id ? "#2d3748" : "transparent"),
                              }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span>├─ {child.type} #{child.index}</span>
                                <span style={{ fontSize: 9, color: "#64748b", background: "#0f172a", padding: "1px 4px", borderRadius: 2 }}>
                                  z: {child.zIndex}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <div style={{ fontWeight: "bold", color: "#34d399" }}>
                          {node.type === "Circle" && "⭕"}
                          {node.type === "Rect" && "▢"}
                          {node.type === "Text" && "📝"}
                          {![
                            "Circle",
                            "Rect",
                            "Text",
                          ].includes(node.type) && "🔷"}{" "}
                          {node.type} #{idx}
                        </div>
                        <div style={{ fontSize: 10, color: "#64748b", background: "#1e293b", padding: "2px 6px", borderRadius: 3 }}>
                          z: {node.zIndex}
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>
                        {node.name}
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Canvas area */}
        <div style={{ flex: 1, position: "relative" }}>
          {/* Hamburger button - always visible on mobile, only when panel closed on desktop */}
          {(!showLeftPanel || isMobile) && (
            <button
              onClick={() => setShowLeftPanel(!showLeftPanel)}
              style={{
                ...btnStyle,
                position: "absolute",
                top: 40,
                left: 40,
                zIndex: isMobile ? 997 : 10,
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#1e293b",
                borderColor: "#3b82f6",
              }}
            >
              <span style={{ fontSize: 18, marginBottom: 5 }}>☰</span>
              {!isMobile && <span>Nodes</span>}
            </button>
          )}
          <div
            style={{
              width: "100%",
              height: "100%",
            }}
            ref={ref}
          />
        </div>

        {/* Right Panel - Properties */}
        {showRightPanel && selectedNodeId && (
          <div
            style={{
              position: isFullscreen ? "fixed" : "absolute",
              right: 0,
              top: isFullscreen ? 56 : 0,
              bottom: 0,
              height: isFullscreen ? "calc(100% - 56px)" : "100%",
              width: 320,
              minWidth: 320,
              maxWidth: 320,
              background: "#0f172a",
              borderLeft: "1px solid #1f2937",
              overflowY: "auto",
              overflowX: "hidden",
              padding: "16px",
              color: "#e5e7eb",
              fontSize: 13,
              zIndex: 999,
              boxShadow: "-4px 0 12px rgba(0, 0, 0, 0.5)",
              transition: "transform 0.3s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <strong style={{ fontSize: 14 }}>Properties</strong>
              <button
                onClick={() => setShowRightPanel(false)}
                style={{
                  ...btnStyle,
                  padding: "4px 8px",
                  fontSize: 16,
                  lineHeight: 1,
                }}
                title="Close panel"
              >
                ✕
              </button>
            </div>

            {/* Position */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
                Position
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 4 }}>X</label>
                  <input
                    type="number"
                    value={Math.round(nodeProps.x)}
                    onChange={(e) => updateNodeProperty('x', parseFloat(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      background: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: 4,
                      color: "#e5e7eb",
                      fontSize: 12,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 4 }}>Y</label>
                  <input
                    type="number"
                    value={Math.round(nodeProps.y)}
                    onChange={(e) => updateNodeProperty('y', parseFloat(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      background: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: 4,
                      color: "#e5e7eb",
                      fontSize: 12,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Size (for Rect/Circle) */}
            {(nodeProps.width !== undefined || nodeProps.radius !== undefined) && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
                  Size
                </label>
                {nodeProps.width !== undefined && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                    <div>
                      <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 4 }}>Width</label>
                      <input
                        type="number"
                        value={Math.round(nodeProps.width)}
                        onChange={(e) => updateNodeProperty('width', parseFloat(e.target.value))}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          background: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: 4,
                          color: "#e5e7eb",
                          fontSize: 12,
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 4 }}>Height</label>
                      <input
                        type="number"
                        value={Math.round(nodeProps.height)}
                        onChange={(e) => updateNodeProperty('height', parseFloat(e.target.value))}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          background: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: 4,
                          color: "#e5e7eb",
                          fontSize: 12,
                        }}
                      />
                    </div>
                  </div>
                )}
                {nodeProps.radius !== undefined && (
                  <div>
                    <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 4 }}>Radius</label>
                    <input
                      type="number"
                      value={Math.round(nodeProps.radius)}
                      onChange={(e) => updateNodeProperty('radius', parseFloat(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        background: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: 4,
                        color: "#e5e7eb",
                        fontSize: 12,
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Corner Radius (for Rect) */}
            {nodeProps.cornerRadius !== undefined && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
                  Corner Radius
                </label>
                <input
                  type="number"
                  value={Math.round(nodeProps.cornerRadius)}
                  onChange={(e) => updateNodeProperty('cornerRadius', parseFloat(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: 4,
                    color: "#e5e7eb",
                    fontSize: 12,
                  }}
                />
              </div>
            )}

            {/* Fill Color */}
            {nodeProps.fill && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
                  Fill Color
                </label>
                <ColorPicker
                  value={nodeProps.fill}
                  onChange={(color) => updateNodeProperty('fill', color)}
                  width={288}
                  height={200}
                  hideGradientControls={true}
                  hideColorTypeBtns={true}
                />
              </div>
            )}

            {/* Stroke Color */}
            {nodeProps.stroke && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
                  Stroke Color
                </label>
                <ColorPicker
                  value={nodeProps.stroke}
                  onChange={(color) => updateNodeProperty('stroke', color)}
                  width={288}
                  height={200}
                  hideGradientControls={true}
                  hideColorTypeBtns={true}
                />
              </div>
            )}

            {/* Stroke Width */}
            {nodeProps.strokeWidth !== undefined && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
                  Stroke Width
                </label>
                <input
                  type="number"
                  min="0"
                  value={nodeProps.strokeWidth}
                  onChange={(e) => updateNodeProperty('strokeWidth', parseFloat(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: 4,
                    color: "#e5e7eb",
                    fontSize: 12,
                  }}
                />
              </div>
            )}

            {/* Opacity */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
                Opacity
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={nodeProps.opacity}
                onChange={(e) => updateNodeProperty('opacity', parseFloat(e.target.value))}
                style={{
                  width: "100%",
                  accentColor: "#3b82f6",
                }}
              />
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                {Math.round(nodeProps.opacity * 100)}%
              </div>
            </div>
          </div>
        )}
      </div>
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
