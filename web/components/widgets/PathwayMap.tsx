"use client";

import React, { useState } from "react";
import { Activity, ArrowRight, Info, Network, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PathwayNode {
  id: string;
  label: string;
  axis: "IL6" | "BAFF" | "mTORC" | "PATHOLOGY";
  x: number;
  y: number;
  color: string;
  description: string;
  targets: string[];
}

const PATHWAY_NODES: PathwayNode[] = [
  // Top: IL-23 / mTORC1 / Src Axis
  {
    id: "IL23",
    label: "IL-23 Cytokine",
    axis: "mTORC",
    x: 400,
    y: 40,
    color: "#14b8a6",
    description: "Upstream inflammatory cytokine driving pathogenic γδ17 T-cell priming.",
    targets: ["IL23R", "mTORC1", "TYK2"],
  },
  {
    id: "IL23R",
    label: "IL-23R / TYK2",
    axis: "mTORC",
    x: 320,
    y: 110,
    color: "#14b8a6",
    description: "Receptor complex transducing STAT3 phosphorylation and translational priming.",
    targets: ["mTORC1", "Src_Kinase"],
  },
  {
    id: "mTORC1",
    label: "mTORC1 / p-S6",
    axis: "mTORC",
    x: 480,
    y: 110,
    color: "#14b8a6",
    description: "Nutrient-sensing complex prime for IL-17A translational output; blocked by A-2208690.",
    targets: ["SLE_PATHOLOGY"],
  },
  {
    id: "Src_Kinase",
    label: "Src Kinases",
    axis: "mTORC",
    x: 400,
    y: 170,
    color: "#14b8a6",
    description: "Non-receptor tyrosine kinases regulating cytoskeletal rearrangement; blocked by A-1984701.",
    targets: ["SLE_PATHOLOGY"],
  },

  // Left: IL6 Axis
  {
    id: "IL6",
    label: "IL-6 Cytokine",
    axis: "IL6",
    x: 120,
    y: 180,
    color: "#3b82f6",
    description: "Primary driver of acute phase response and plasmablast differentiation (SWAG: 8.94).",
    targets: ["IL6R_gp130"],
  },
  {
    id: "IL6R_gp130",
    label: "IL-6R / gp130",
    axis: "IL6",
    x: 120,
    y: 260,
    color: "#3b82f6",
    description: "Hexameric signaling complex activating downstream JAK1/STAT3.",
    targets: ["STAT3_BCELL"],
  },
  {
    id: "STAT3_BCELL",
    label: "STAT3 Plasmablasts",
    axis: "IL6",
    x: 230,
    y: 310,
    color: "#3b82f6",
    description: "Transcriptional activation of antibody-secreting cell differentiation.",
    targets: ["SLE_PATHOLOGY"],
  },

  // Right: BAFF / TNFSF13B Axis
  {
    id: "TNFSF13B",
    label: "BAFF (TNFSF13B)",
    axis: "BAFF",
    x: 680,
    y: 180,
    color: "#a855f7",
    description: "B-cell activating factor essential for transitional and mature B-cell survival.",
    targets: ["TNFRSF13C"],
  },
  {
    id: "TNFRSF13C",
    label: "BAFFR / TACI",
    axis: "BAFF",
    x: 680,
    y: 260,
    color: "#a855f7",
    description: "Receptors initiating non-canonical NF-κB (p52/RelB) survival signaling.",
    targets: ["NFKB_PLASMA"],
  },
  {
    id: "NFKB_PLASMA",
    label: "NF-κB Survival Loop",
    axis: "BAFF",
    x: 570,
    y: 310,
    color: "#a855f7",
    description: "Prolongs survival of autoreactive long-lived plasma cells.",
    targets: ["SLE_PATHOLOGY"],
  },

  // Center: SLE Shared Pathology
  {
    id: "SLE_PATHOLOGY",
    label: "SLE Autoimmune Pathology",
    axis: "PATHOLOGY",
    x: 400,
    y: 360,
    color: "#ef4444",
    description: "Convergence hub: Anti-dsDNA immune complexes, tissue inflammation, and nephritis flares.",
    targets: [],
  },
];

export function PathwayMap() {
  const [activeNode, setActiveNode] = useState<PathwayNode>(PATHWAY_NODES[0]);

  return (
    <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-2xl">
      {/* Top Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30">
              Slide 19
            </span>
            <h3 className="text-sm font-bold text-white">
              Integrated Signaling Pathway Map: IL6, TNFSF13B & IL-23/mTORC1 in SLE
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Interactive multi-axis molecular cascade showing convergence onto SLE autoimmune pathology
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> IL6 Axis
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" /> BAFF Axis
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-teal-500" /> IL-23/mTOR Axis
          </span>
        </div>
      </div>

      {/* SVG Pathway Canvas */}
      <div className="relative h-[380px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-2">
        <svg
          viewBox="0 0 800 420"
          className="w-full h-full select-none"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="16"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
            </marker>
          </defs>

          {/* Edges */}
          {PATHWAY_NODES.map((node) =>
            node.targets.map((tgtId) => {
              const tgt = PATHWAY_NODES.find((n) => n.id === tgtId);
              if (!tgt) return null;
              const isHighlight = activeNode.id === node.id || activeNode.targets.includes(tgt.id);

              return (
                <line
                  key={`${node.id}-${tgt.id}`}
                  x1={node.x}
                  y1={node.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={isHighlight ? node.color : "#334155"}
                  strokeWidth={isHighlight ? 2.5 : 1.5}
                  strokeDasharray={node.axis === "PATHOLOGY" ? "4 4" : undefined}
                  markerEnd="url(#arrow)"
                  className="transition-all duration-300"
                />
              );
            })
          )}

          {/* Nodes */}
          {PATHWAY_NODES.map((node) => {
            const isSelected = activeNode.id === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setActiveNode(node)}
                className="cursor-pointer group"
              >
                <circle
                  r={node.axis === "PATHOLOGY" ? 34 : 26}
                  fill="#0f172a"
                  stroke={node.color}
                  strokeWidth={isSelected ? 3.5 : 2}
                  className="transition-all duration-200 group-hover:scale-110"
                />
                <circle
                  r={node.axis === "PATHOLOGY" ? 30 : 22}
                  fill={node.color}
                  fillOpacity={isSelected ? 0.35 : 0.15}
                />
                <text
                  textAnchor="middle"
                  dy={node.axis === "PATHOLOGY" ? 4 : 4}
                  fill="#ffffff"
                  fontSize={node.axis === "PATHOLOGY" ? 9 : 8}
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {node.label.length > 14 ? node.label.slice(0, 12) + ".." : node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Inspector */}
      {activeNode && (
        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-white text-xs flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: activeNode.color }}
              />
              <span>{activeNode.label}</span>
            </span>
            <Badge variant="outline" className="font-mono text-[10px]">
              Axis: {activeNode.axis}
            </Badge>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {activeNode.description}
          </p>
          <div className="text-[10px] text-slate-400 font-mono">
            Downstream Connections: {activeNode.targets.length > 0 ? activeNode.targets.join(" → ") : "Endpoint Pathology"}
          </div>
        </div>
      )}
    </div>
  );
}
