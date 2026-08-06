"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Database,
  ExternalLink,
  Layers,
  Network,
  Play,
  RotateCw,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraphCanvas3D } from "@/components/visualizations/GraphCanvas3D";
import {
  fetch3DGraph,
  fetchMoaRankings,
  fetchComboRankings,
  executeCypherQuery,
} from "@/lib/api";
import {
  Graph3DTopology,
  Graph3DNode,
  MOARanking,
  ComboRanking,
  CypherQueryResponse,
} from "@/types/platform";

export default function Graph3DPage() {
  const [topology, setTopology] = useState<Graph3DTopology | null>(null);
  const [selectedNode, setSelectedNode] = useState<Graph3DNode | null>(null);
  const [moaRankings, setMoaRankings] = useState<MOARanking[]>([]);
  const [comboRankings, setComboRankings] = useState<ComboRanking[]>([]);
  const [activeTab, setActiveTab] = useState<"dossier" | "moa" | "combos" | "cypher">("dossier");
  const [cypherQuery, setCypherQuery] = useState<string>("MATCH (g:Gene)-[r:COMBINED_WITH]->(p:Gene) RETURN g, r, p");
  const [cypherResult, setCypherResult] = useState<CypherQueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [topo, moas, combos] = await Promise.all([
          fetch3DGraph(),
          fetchMoaRankings(),
          fetchComboRankings(),
        ]);
        setTopology(topo);
        setMoaRankings(moas);
        setComboRankings(combos);
        if (topo.nodes.length > 0) {
          const il6Node = topo.nodes.find((n: Graph3DNode) => n.id === "IL6") || topo.nodes[0];
          setSelectedNode(il6Node);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleRunCypher = async () => {
    try {
      const res = await executeCypherQuery(cypherQuery);
      setCypherResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/test-harness">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Overview
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>ARCH 3D Knowledge Graph & GTM Simulator</span>
              <Badge variant="purple">Neo4j / SQLite Graph Engine</Badge>
            </h1>
            <p className="text-xs text-slate-400">
              Interactive 3D molecular network, Graph Transformer link prediction, and Cypher query processor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/test-harness/extractor">
            <Button variant="secondary" size="sm" className="text-xs gap-1.5">
              <span>LangExtract Parser</span>
            </Button>
          </Link>
          <Badge variant="success">60 FPS Render Engine</Badge>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 7 COLUMNS: 3D GRAPH CANVAS */}
        <div className="lg:col-span-7 space-y-3">
          {topology && (
            <GraphCanvas3D
              topology={topology}
              selectedNode={selectedNode}
              onSelectNode={(node) => {
                setSelectedNode(node);
                setActiveTab("dossier");
              }}
            />
          )}

          {/* Quick Node Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto p-2 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider shrink-0">
              Quick Focus:
            </span>
            {["IL6", "TYK2", "mTORC1", "mTORC2", "Src_Kinase", "TNF", "A-1984701.0", "A-2208690.0"].map((id) => (
              <button
                key={id}
                onClick={() => {
                  const n = topology?.nodes.find((item) => item.id === id);
                  if (n) {
                    setSelectedNode(n);
                    setActiveTab("dossier");
                  }
                }}
                className={`px-2.5 py-1 rounded-lg transition-all font-mono text-xs ${
                  selectedNode?.id === id
                    ? "bg-blue-600 text-white font-bold shadow"
                    : "bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT 5 COLUMNS: INTERACTIVE DETAILS & RANKINGS TABS */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {[
              { id: "dossier", label: "Target Dossier" },
              { id: "moa", label: "MOA Rankings" },
              { id: "combos", label: "Combo Synergy" },
              { id: "cypher", label: "Cypher Query" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-all ${
                  activeTab === t.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: TARGET DOSSIER CARD */}
          {activeTab === "dossier" && selectedNode && (
            <Card className="flex-1 border-slate-800 bg-slate-900/90 shadow-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: selectedNode.color }}
                    />
                    <CardTitle className="text-lg font-bold text-white">
                      {selectedNode.label}
                    </CardTitle>
                  </div>
                  <Badge variant="outline">{selectedNode.type}</Badge>
                </div>
                <CardDescription className="font-mono text-xs text-slate-400">
                  Node ID: {selectedNode.id} • Status: {selectedNode.currentDevStatus || "Evaluated"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                {/* ARCH Score Grid */}
                <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 block">SWAG Composite</span>
                    <span className="text-base font-bold text-blue-400">
                      {selectedNode.swagScore ? selectedNode.swagScore.toFixed(2) : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">SWAG Strength</span>
                    <span className="text-base font-bold text-emerald-400">
                      {selectedNode.swagStrength ? `${(selectedNode.swagStrength * 100).toFixed(0)}%` : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Causal Alignment</span>
                    <span className="text-sm font-semibold text-slate-300">
                      {selectedNode.causalScore ? `${(selectedNode.causalScore * 100).toFixed(0)}%` : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Genetic Evidence</span>
                    <span className="text-sm font-semibold text-slate-300">
                      {selectedNode.geneticScore ? `${(selectedNode.geneticScore * 100).toFixed(0)}%` : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Spatial Coordinates & Network Topology */}
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 space-y-1 font-mono text-[11px] text-slate-400">
                  <p className="text-slate-300 font-semibold mb-1">Spatial 3D Coordinates:</p>
                  <p>X: {selectedNode.x} | Y: {selectedNode.y} | Z: {selectedNode.z}</p>
                  <p>Radius Size: {selectedNode.size}</p>
                </div>

                {/* Metadata Details */}
                {selectedNode.details && Object.keys(selectedNode.details).length > 0 && (
                  <div className="space-y-1.5">
                    <p className="font-semibold text-slate-300">Biological Annotations:</p>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1 text-slate-300">
                      {Object.entries(selectedNode.details).map(([k, v]) => (
                        <p key={k} className="flex justify-between">
                          <span className="text-slate-500 uppercase text-[10px]">{k}:</span>
                          <span className="font-mono text-slate-200">{String(v)}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* TAB 2: MOA RANKINGS */}
          {activeTab === "moa" && (
            <Card className="flex-1 border-slate-800 bg-slate-900/90 shadow-2xl p-4 overflow-y-auto">
              <CardTitle className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                <span>ARCH MOA Priority Rankings (Slide 11)</span>
                <Badge variant="purple">8 Targets</Badge>
              </CardTitle>
              <div className="space-y-2">
                {moaRankings.map((r) => (
                  <div
                    key={r.gene}
                    onClick={() => {
                      const n = topology?.nodes.find((item) => item.id === r.gene);
                      if (n) setSelectedNode(n);
                    }}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded text-[11px]">
                        #{r.rank}
                      </span>
                      <div>
                        <p className="font-bold text-white">{r.gene}</p>
                        <p className="text-[10px] text-slate-400">Status: {r.currentDevStatus}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400 font-mono">{r.swagScore.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-500">{(r.swagStrength * 100).toFixed(0)}% SWAG</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TAB 3: COMBO RANKINGS */}
          {activeTab === "combos" && (
            <Card className="flex-1 border-slate-800 bg-slate-900/90 shadow-2xl p-4 overflow-y-auto">
              <CardTitle className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                <span>GTM Combination Synergy Rankings (Slide 16)</span>
                <Badge variant="purple">11 Combos</Badge>
              </CardTitle>
              <div className="space-y-2">
                {comboRankings.map((c) => (
                  <div
                    key={`${c.moa1}-${c.moa2}`}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">
                        <span className="text-blue-400">{c.moa1}</span> + <span className="text-indigo-400">{c.moa2}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        sAB Intact: <span className="text-slate-200">{c.sabIntact.toFixed(2)}</span>
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <Badge
                        variant={
                          c.toxicityRisk === "Low"
                            ? "success"
                            : c.toxicityRisk === "Moderate"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {c.toxicityRisk}
                      </Badge>
                      <span className="font-bold font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        {c.compositeAiScore.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TAB 4: CYPHER QUERY CONSOLE */}
          {activeTab === "cypher" && (
            <Card className="flex-1 border-slate-800 bg-slate-900/90 shadow-2xl p-4 space-y-3">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>Cypher Query Console</span>
              </CardTitle>
              <div className="space-y-2">
                <textarea
                  value={cypherQuery}
                  onChange={(e) => setCypherQuery(e.target.value)}
                  className="w-full h-20 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Cypher query..."
                />
                <Button onClick={handleRunCypher} size="sm" className="w-full gap-1.5 text-xs bg-purple-600 hover:bg-purple-700">
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Cypher Query</span>
                </Button>
              </div>

              {cypherResult && (
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Engine: <strong className="text-white">{cypherResult.backend}</strong></span>
                    <span>Records: <strong className="text-emerald-400">{cypherResult.count}</strong></span>
                  </div>
                  <pre className="text-[10px] font-mono text-slate-300 max-h-40 overflow-y-auto custom-scroll">
                    {JSON.stringify(cypherResult.results, null, 2)}
                  </pre>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
