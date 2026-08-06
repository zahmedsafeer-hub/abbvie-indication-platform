"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Beaker,
  CheckCircle2,
  Cpu,
  FileCode2,
  FileSearch,
  FileText,
  FlaskConical,
  Layers,
  Network,
  Scan,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { extractDocument, fetchSampleDoc } from "@/lib/api";
import { ExtractionResult, BoundingBox } from "@/types/platform";

export default function ExtractorHarnessPage() {
  const [sampleKey, setSampleKey] = useState<"slide22_eln" | "gd17_pubmed">("slide22_eln");
  const [docText, setDocText] = useState<string>("");
  const [docMetadata, setDocMetadata] = useState<{ documentId: string; title: string; docType: string }>({
    documentId: "EL-2026-00002538",
    title: "High-Throughput Repurposing Screen & Dose-Response Analysis of A-1984701.0 and A-2208690.0 in γδ17 T-Cell Lines",
    docType: "ELN",
  });
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedBbox, setSelectedBbox] = useState<BoundingBox | null>(null);
  const [activeViewTab, setActiveViewTab] = useState<"summary" | "matrix" | "triples" | "json">("summary");

  // Load sample on mount or sample switch
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const doc = await fetchSampleDoc(sampleKey);
        setDocText(doc.rawText);
        setDocMetadata({ documentId: doc.documentId, title: doc.title, docType: doc.docType });
        const ext = await extractDocument({ sampleDocKey: sampleKey });
        setResult(ext);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [sampleKey]);

  const handleRunExtraction = async (key: "slide22_eln" | "gd17_pubmed") => {
    setSampleKey(key);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
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
              <span>LangExtract Scientific Document Parsing Engine</span>
              <Badge variant="purple">Gemini 2.5 Flash / 1.5 Pro</Badge>
            </h1>
            <p className="text-xs text-slate-400">
              Extracts structured triples, quantitative fold-change matrices, and bounding-box coordinates from ELNs & literature
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleRunExtraction("slide22_eln")}
            variant={sampleKey === "slide22_eln" ? "default" : "secondary"}
            size="sm"
            className="text-xs gap-1.5"
            disabled={isLoading}
          >
            <FileText className="w-3.5 h-3.5 text-blue-300" />
            <span>Run Sample EL-2026-00002538 Extraction</span>
          </Button>

          <Button
            onClick={() => handleRunExtraction("gd17_pubmed")}
            variant={sampleKey === "gd17_pubmed" ? "default" : "secondary"}
            size="sm"
            className="text-xs gap-1.5"
            disabled={isLoading}
          >
            <Beaker className="w-3.5 h-3.5 text-emerald-300" />
            <span>Run γδ17 T-cell IL-23 Extraction</span>
          </Button>
        </div>
      </div>

      {/* Extraction Status Ribbon */}
      {result && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Extraction Complete</span>
            </div>
            <div className="text-slate-400 font-mono">
              Doc ID: <strong className="text-slate-200">{result.documentId}</strong>
            </div>
            <div className="text-slate-400">
              Classification: <Badge variant="outline">{result.docType}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Confidence Score:</span>
              <Badge variant="success">{(result.confidenceScore * 100).toFixed(1)}%</Badge>
            </div>
            <div className="flex items-center gap-1 text-slate-400 font-mono">
              <Scan className="w-3.5 h-3.5 text-blue-400" />
              <span>{result.boundingBoxes.length} Bounding Boxes</span>
            </div>
          </div>
        </div>
      )}

      {/* SPLIT SCREEN VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[680px]">
        {/* LEFT COLUMN: Document Canvas with Interactive Bounding Box Overlays */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
                Document Canvas & Bounding Overlays
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Page 1 of 1</span>
          </div>

          <Card className="flex-1 border-slate-800 bg-slate-950 p-4 relative overflow-hidden flex flex-col font-sans shadow-2xl">
            {/* Visual Simulated Document Sheet */}
            <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/60 relative flex-1 flex flex-col justify-between overflow-y-auto space-y-4">
              {/* Document Header */}
              <div
                onClick={() => setSelectedBbox(result?.boundingBoxes[0] || null)}
                className={`p-2.5 rounded border transition-all cursor-pointer ${
                  selectedBbox?.label?.includes("Header")
                    ? "border-blue-500 bg-blue-950/40 ring-2 ring-blue-500/50"
                    : "border-slate-800 hover:border-slate-700 bg-slate-950/70"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-1">
                  <span>{docMetadata.documentId}</span>
                  <span>CONFIDENTIAL</span>
                </div>
                <h3 className="text-xs font-bold text-slate-100">{docMetadata.title}</h3>
              </div>

              {/* Document Compounds Section */}
              <div
                onClick={() => setSelectedBbox(result?.boundingBoxes[1] || null)}
                className={`p-2.5 rounded border transition-all cursor-pointer ${
                  selectedBbox?.label?.includes("Compound")
                    ? "border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/50"
                    : "border-slate-800 hover:border-slate-700 bg-slate-950/70"
                }`}
              >
                <p className="text-[11px] font-bold text-emerald-400 mb-1">
                  1. Compound Inventory & Characterization
                </p>
                <div className="text-[11px] text-slate-300 font-mono space-y-1">
                  <p>• A-1984701.0 | Lot: 2669264 | Root: 1984701 (TYK2/Src Inhibitor)</p>
                  <p>• A-2208690.0 | Lot: 1883921 | Root: 2208690 (mTORC1/2 Inhibitor)</p>
                </div>
              </div>

              {/* Document Pathways & Assays */}
              <div
                onClick={() => setSelectedBbox(result?.boundingBoxes[2] || null)}
                className={`p-2.5 rounded border transition-all cursor-pointer ${
                  selectedBbox?.label?.includes("Assay") || selectedBbox?.label?.includes("Pathway")
                    ? "border-purple-500 bg-purple-950/40 ring-2 ring-purple-500/50"
                    : "border-slate-800 hover:border-slate-700 bg-slate-950/70"
                }`}
              >
                <p className="text-[11px] font-bold text-purple-400 mb-1">
                  2. Assays & Target Pathways
                </p>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <p>• Assay: γδ17 T-cell line IL-23 assay (p-STAT3 / p-S6)</p>
                  <p>• Model: imiquimod-induced skin inflammation</p>
                  <p>• Pathways: mTORC1, mTORC2, Src family kinases</p>
                  <p>• Routes: intraperitoneal, oral, topical</p>
                </div>
              </div>

              {/* Document Quantitative Matrix */}
              <div
                onClick={() => setSelectedBbox(result?.boundingBoxes[3] || null)}
                className={`p-2.5 rounded border transition-all cursor-pointer ${
                  selectedBbox?.label?.includes("Quantitative") || selectedBbox?.label?.includes("Matrix")
                    ? "border-amber-500 bg-amber-950/40 ring-2 ring-amber-500/50"
                    : "border-slate-800 hover:border-slate-700 bg-slate-950/70"
                }`}
              >
                <p className="text-[11px] font-bold text-amber-400 mb-1">
                  3. Quantitative Experimental Matrix
                </p>
                <div className="text-[10px] font-mono text-slate-300 space-y-0.5">
                  <p>• LPAR1000: log2FC = -3.85 | p = 0.00012 | IP: 12.4 nM</p>
                  <p>• Tyk200: log2FC = -3.52 | p = 0.00034 | IP: 16.8 nM</p>
                  <p>• Combo: log2FC = -4.92 | p = 0.00004 | IP: 6.2 nM</p>
                </div>
              </div>

              {/* Document Conclusion */}
              <div
                onClick={() => setSelectedBbox(result?.boundingBoxes[4] || null)}
                className={`p-2.5 rounded border transition-all cursor-pointer ${
                  selectedBbox?.label?.includes("Conclusion")
                    ? "border-rose-500 bg-rose-950/40 ring-2 ring-rose-500/50"
                    : "border-slate-800 hover:border-slate-700 bg-slate-950/70"
                }`}
              >
                <p className="text-[11px] font-bold text-rose-400 mb-1">4. Primary Cell Validation</p>
                <p className="text-[10px] text-slate-400 italic">
                  Synergistic suppression verified in primary dermal γδ T subsets without cytotoxicity.
                </p>
              </div>
            </div>

            {/* Bounding Box Detail Legend */}
            {selectedBbox && (
              <div className="mt-3 p-2 bg-slate-900 border border-slate-800 rounded text-xs flex items-center justify-between">
                <span className="font-semibold text-blue-400">{selectedBbox.label}</span>
                <span className="font-mono text-slate-500">
                  [{selectedBbox.x1}, {selectedBbox.y1}, {selectedBbox.x2}, {selectedBbox.y2}]
                </span>
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT COLUMN: Extracted Structured Intelligence */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
                Structured Parsing Outputs
              </h2>
            </div>

            {/* View switcher tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              {[
                { id: "summary", label: "Entities & Pathways" },
                { id: "matrix", label: "Quantitative Matrix" },
                { id: "triples", label: "Knowledge Triples" },
                { id: "json", label: "Raw JSON" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveViewTab(t.id as any)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeViewTab === t.id
                      ? "bg-blue-600 text-white font-medium shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <Card className="flex-1 border-slate-800 bg-slate-900/90 p-5 overflow-y-auto shadow-2xl">
            {isLoading && (
              <div className="h-64 flex flex-col items-center justify-center space-y-3 text-slate-400">
                <Sparkles className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-sm">Running LangExtract scientific parsing pipeline...</p>
              </div>
            )}

            {!isLoading && result && activeViewTab === "summary" && (
              <div className="space-y-6">
                {/* 1. Compounds */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-emerald-400" />
                      <span>Extracted Compounds ({result.compounds.length})</span>
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.compounds.map((c) => (
                      <div
                        key={c.compoundId}
                        className="bg-slate-950 p-3 rounded-lg border border-slate-800 hover:border-emerald-500/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-white text-sm">{c.compoundId}</span>
                          {c.lotNumber && (
                            <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800/40">
                              Lot: {c.lotNumber}
                            </span>
                          )}
                        </div>
                        {c.rootNumber && (
                          <p className="text-xs text-slate-400 font-mono mb-1">
                            Root: <span className="text-slate-200">{c.rootNumber}</span>
                          </p>
                        )}
                        <p className="text-xs text-slate-400">{c.mechanism}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Pathways */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Network className="w-4 h-4 text-purple-400" />
                    <span>Target Pathways ({result.pathways.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.pathways.map((p) => (
                      <div
                        key={p.pathwayName}
                        className="bg-slate-950 p-3 rounded-lg border border-slate-800 hover:border-purple-500/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white text-sm">{p.pathwayName}</span>
                          {p.targetFamily && <Badge variant="purple">{p.targetFamily}</Badge>}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{p.biologicalRole}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Assays & Models */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-blue-400" />
                    <span>Assays & Models ({result.assayModels.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {result.assayModels.map((a, i) => (
                      <div
                        key={i}
                        className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-white text-xs">{a.assayName}</p>
                          <p className="text-[11px] text-slate-400">{a.system}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={a.modelType === "in vivo" ? "warning" : "default"}>
                            {a.modelType}
                          </Badge>
                          {a.validationStatus && (
                            <Badge variant="success">{a.validationStatus}</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!isLoading && result && activeViewTab === "matrix" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Quantitative Matrix & Dosage Arms
                  </h3>
                  <div className="flex items-center gap-1.5">
                    {result.routesOfAdmin.map((r) => (
                      <Badge key={r} variant="outline" className="capitalize text-[10px]">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs text-slate-200">
                    <thead className="border-b border-slate-800 bg-slate-900 text-[11px] uppercase font-semibold text-slate-400">
                      <tr>
                        <th className="p-2.5">Entity / Label</th>
                        <th className="p-2.5">Metric Type</th>
                        <th className="p-2.5">Condition / Route</th>
                        <th className="p-2.5">log2FC</th>
                        <th className="p-2.5">p-value</th>
                        <th className="p-2.5">IC50 (nM)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {result.quantitativeMatrix.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                          <td className="p-2.5 font-bold text-white">{m.entity}</td>
                          <td className="p-2.5 font-mono text-blue-400">{m.metricType}</td>
                          <td className="p-2.5 text-slate-400">{m.condition || "-"}</td>
                          <td className="p-2.5 font-semibold text-emerald-400">
                            {m.log2FC !== null && m.log2FC !== undefined ? m.log2FC.toFixed(2) : "-"}
                          </td>
                          <td className="p-2.5 font-mono text-slate-300">
                            {m.pValue !== null && m.pValue !== undefined ? m.pValue.toString() : "-"}
                          </td>
                          <td className="p-2.5 font-bold text-amber-400">
                            {m.ic50 !== null && m.ic50 !== undefined ? `${m.ic50} nM` : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!isLoading && result && activeViewTab === "triples" && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Extracted Knowledge Triples ({result.triples.length})
                </h3>
                <div className="space-y-2.5">
                  {result.triples.map((t, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 font-bold border border-blue-800/40">
                          {t.subject}
                        </span>
                        <span className="font-mono text-slate-400 text-[11px]">→ [{t.predicate}] →</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 font-bold border border-indigo-800/40">
                          {t.object}
                        </span>
                        <span className="ml-auto text-[10px] text-emerald-400 font-mono">
                          Conf: {(t.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      {t.provenance && (
                        <p className="text-[11px] text-slate-400 italic bg-slate-900 p-2 rounded border border-slate-800/60">
                          "{t.provenance.snippet}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isLoading && result && activeViewTab === "json" && (
              <pre className="text-[11px] font-mono text-emerald-400 bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
