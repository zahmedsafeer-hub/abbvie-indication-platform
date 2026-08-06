"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  Award,
  Beaker,
  CheckCircle2,
  Database,
  FileCheck2,
  GitBranch,
  Layers,
  Network,
  ShieldCheck,
  TrendingUp,
  FlaskConical,
  ExternalLink,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThreeTargetViewer } from "@/components/ThreeTargetViewer";
import { PreclinicalChart } from "@/components/PreclinicalChart";
import { fetchPlatformSummary } from "@/lib/api";
import {
  PlatformDatabase,
  ARCHTarget,
  ClinicalTrial,
  ComboMechanism,
  ProvenanceRecord,
} from "@/types/platform";
import { MOCK_DATABASE } from "@/lib/mock-data";

export default function TestHarnessPage() {
  const [data, setData] = useState<PlatformDatabase>(MOCK_DATABASE);
  const [selectedTarget, setSelectedTarget] = useState<ARCHTarget | null>(null);
  const [activeTab, setActiveTab] = useState<"targets" | "trials" | "combos" | "preclinical" | "provenance">("targets");
  const [apiStatus, setApiStatus] = useState<"loading" | "connected" | "fallback">("loading");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchPlatformSummary();
        setData(res);
        setApiStatus("connected");
        if (res.archTargets.length > 0) {
          setSelectedTarget(res.archTargets[0]);
        }
      } catch (e) {
        setData(MOCK_DATABASE);
        setApiStatus("fallback");
        if (MOCK_DATABASE.archTargets.length > 0) {
          setSelectedTarget(MOCK_DATABASE.archTargets[0]);
        }
      }
    }
    load();
  }, []);

  const verificationBannerText = `Data Engine Initialized: ${data.archTargets.length} ARCH Targets, ${data.clinicalTrials.length} Trials, ${data.comboMechanisms.length} Combos, 1 Repurposing Screen (${data.preclinicalSample.cellLine} / IL-23 / mTORC1/2)`;

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner with Required Verification String */}
      <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-indigo-950/80 p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Phase 1a Platform Active
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 border border-blue-500/20">
                ARCH Pipeline v2.4
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {verificationBannerText}
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl">
              Automated validation test harness verifying cross-modal integration of Target MOAs (Slide 11), Clinical Trials (Slide 14 & 15), IL-6 Combination Synergy (Slide 16), and the γδ17 T-cell / IL-23 / mTORC1/2 Repurposing Screen.
            </p>
          </div>
          <div className="flex flex-row md:flex-col items-end gap-2 shrink-0">
            <Link href="/admin/testing">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs gap-1.5 shadow-md shadow-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Testing Dashboard</span>
              </Button>
            </Link>
            <Link href="/test-harness/eval-runner">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs gap-1.5 shadow-md shadow-purple-500/20">
                <Award className="w-3.5 h-3.5" />
                <span>RAGAS Audit Runner</span>
              </Button>
            </Link>
            <Link href="/test-harness/golden-dataset">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-xs gap-1.5 shadow-md shadow-amber-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>45-Case Golden Eval</span>
              </Button>
            </Link>
            <Link href="/test-harness/session">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs gap-1.5 shadow-md shadow-blue-500/20">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Session State Manager</span>
              </Button>
            </Link>
            <Link href="/test-harness/intent">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs gap-1.5 shadow-md shadow-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Intent & Citations</span>
              </Button>
            </Link>
            <Link href="/test-harness/graph-3d">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs gap-1.5 shadow-md shadow-indigo-500/20">
                <Network className="w-3.5 h-3.5" />
                <span>3D Knowledge Graph</span>
              </Button>
            </Link>
            <Link href="/test-harness/extractor">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs gap-1.5 shadow-md shadow-purple-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open LangExtract Parser</span>
              </Button>
            </Link>
            <Badge variant={apiStatus === "connected" ? "success" : "secondary"}>
              {apiStatus === "connected" ? "FastAPI Backend Live" : "Local Mock Engine"}
            </Badge>
            <div className="text-xs text-slate-400">
              {data.indications.map((i) => i.name).join(" • ")}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400">ARCH Targets</p>
            <Database className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2">{data.archTargets.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">TLR7, IL6, TYK2, TNF, IL2...</p>
        </Card>

        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400">Clinical Trials</p>
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2">{data.clinicalTrials.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">M14-5521 to M20-186</p>
        </Card>

        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400">IL-6 Combos</p>
            <Network className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2">{data.comboMechanisms.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Top: TNFSF13B & TYK2</p>
        </Card>

        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400">Screen Compounds</p>
            <FlaskConical className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2">{data.preclinicalSample.compounds.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">IP, Oral & Topical arms</p>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: "targets", label: "ARCH Targets (Slide 11)", icon: Database },
          { id: "trials", label: "Clinical Trials (Slide 14/15)", icon: FileCheck2 },
          { id: "combos", label: "IL-6 Combos (Slide 16)", icon: Network },
          { id: "preclinical", label: "γδ17 / IL-23 Repurposing Screen", icon: Beaker },
          { id: "provenance", label: "Provenance & Ontology", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ARCH TARGETS */}
      {activeTab === "targets" && (
        <div className="space-y-6">
          <ThreeTargetViewer
            targets={data.archTargets}
            selectedTarget={selectedTarget}
            onSelectTarget={setSelectedTarget}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
              <table className="w-full text-left text-sm text-slate-200">
                <thead className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold uppercase text-slate-400">
                  <tr>
                    <th className="p-3">Gene</th>
                    <th className="p-3">SWAG Score</th>
                    <th className="p-3">SWAG (No Clin)</th>
                    <th className="p-3">Causal / Genetic</th>
                    <th className="p-3">Dev Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.archTargets.map((t) => (
                    <tr
                      key={t.gene}
                      onClick={() => setSelectedTarget(t)}
                      className={`cursor-pointer transition-colors ${
                        selectedTarget?.gene === t.gene ? "bg-blue-950/50" : "hover:bg-slate-800/40"
                      }`}
                    >
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <span>{t.gene}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{t.ensemblId}</span>
                      </td>
                      <td className="p-3 text-blue-400 font-semibold">{t.swagScore.toFixed(2)}</td>
                      <td className="p-3 text-slate-400">{t.swagScoreNoClin.toFixed(2)}</td>
                      <td className="p-3 text-slate-300">
                        {t.pathwayCausal.toFixed(2)} / {t.genetic.toFixed(2)}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            t.currentDevStatus === "Launched"
                              ? "success"
                              : t.currentDevStatus === "Phase 3"
                              ? "default"
                              : "warning"
                          }
                        >
                          {t.currentDevStatus}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTarget(t);
                          }}
                        >
                          Inspect
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Selected Target Deep Dive Card */}
            {selectedTarget && (
              <Card className="border-slate-800 bg-slate-900/90">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                      {selectedTarget.gene}
                      <Badge variant="outline">{selectedTarget.disease}</Badge>
                    </CardTitle>
                    <Badge variant="default">{selectedTarget.currentDevStatus}</Badge>
                  </div>
                  <CardDescription className="font-mono text-xs text-slate-400">
                    {selectedTarget.ensemblId} • ARCH {selectedTarget.archVersion}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div>
                      <p className="text-xs text-slate-500">SWAG Strength</p>
                      <p className="text-lg font-bold text-blue-400">{(selectedTarget.swagStrength * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Composite SWAG</p>
                      <p className="text-lg font-bold text-emerald-400">{selectedTarget.swagScore.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Pathway Causal</p>
                      <p className="text-sm font-semibold text-slate-200">{(selectedTarget.pathwayCausal * 100).toFixed(0)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Genetic Evidence</p>
                      <p className="text-sm font-semibold text-slate-200">{(selectedTarget.genetic * 100).toFixed(0)}%</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-2">Cross-Reference URIs</p>
                    <div className="space-y-1">
                      {selectedTarget.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs text-blue-400 hover:underline truncate"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{link}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CLINICAL TRIALS */}
      {activeTab === "trials" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.clinicalTrials.map((tr) => (
            <Card key={tr.studyNumber} className="border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                    {tr.studyNumber}
                  </span>
                  <Badge variant={tr.phase.includes("Phase 3") ? "success" : "default"}>
                    {tr.phase}
                  </Badge>
                </div>
                <CardTitle className="text-base font-semibold text-slate-100 mt-2 line-clamp-2">
                  {tr.drugName} ({tr.compound})
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  {tr.indication} • Start Year: {tr.startYear}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs flex-1">
                <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded border border-slate-800">
                  <strong className="text-slate-200">Main Findings:</strong> {tr.mainFindings}
                </p>
                <p className="text-emerald-400 font-medium">
                  <strong>Bottom Line:</strong> {tr.bottomLine}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 3: IL-6 COMBOS */}
      {activeTab === "combos" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-200">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold uppercase text-slate-400">
                <tr>
                  <th className="p-3">MOA Combination</th>
                  <th className="p-3">Composite AI Score</th>
                  <th className="p-3">sAB Intact</th>
                  <th className="p-3">Dual Activity</th>
                  <th className="p-3">Toxicity Risk</th>
                  <th className="p-3">Expected Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.comboMechanisms.map((c) => (
                  <tr key={`${c.moa1}-${c.moa2}`} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <span className="text-blue-400">{c.moa1}</span>
                      <span className="text-slate-500">+</span>
                      <span className="text-indigo-400">{c.moa2}</span>
                    </td>
                    <td className="p-3 font-extrabold text-emerald-400">{c.compositeAiScore.toFixed(2)}</td>
                    <td className="p-3 font-mono text-slate-300">{c.sabIntact.toFixed(2)}</td>
                    <td className="p-3 text-slate-300">{c.dualActivity.toFixed(2)}</td>
                    <td className="p-3">
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
                    </td>
                    <td className="p-3 text-xs text-slate-400 max-w-md">{c.expectedResult}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PRECLINICAL REPURPOSING SCREEN */}
      {activeTab === "preclinical" && (
        <div className="space-y-6">
          <Card className="border-slate-800 bg-slate-900/90">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="purple">{data.preclinicalSample.cellLine}</Badge>
                <Badge variant="default">{data.preclinicalSample.targetPathway}</Badge>
                <Badge variant="success">{data.preclinicalSample.validationStatus}</Badge>
              </div>
              <CardTitle className="text-lg font-bold text-slate-100 mt-2">
                Preclinical Study Abstract & Model System
              </CardTitle>
              <CardDescription className="text-slate-300 leading-relaxed text-sm">
                {data.preclinicalSample.abstract}
              </CardDescription>
            </CardHeader>
          </Card>

          <PreclinicalChart data={data.preclinicalSample} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.preclinicalSample.compounds.map((comp) => (
              <Card key={comp.compoundId} className="border-slate-800 bg-slate-900/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-white text-sm">{comp.compoundName}</p>
                  <span className="text-xs font-mono text-blue-400">{comp.compoundId}</span>
                </div>
                <p className="text-xs text-slate-400">{comp.mechanism}</p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-950 p-2 rounded border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 block">IP IC50</span>
                    <span className="font-bold text-blue-400">{comp.ic50Ip} nM</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Oral IC50</span>
                    <span className="font-bold text-emerald-400">{comp.ic50Oral} nM</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Topical IC50</span>
                    <span className="font-bold text-amber-400">{comp.ic50Topical} nM</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 italic">{comp.validationNotes}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PROVENANCE */}
      {activeTab === "provenance" && (
        <div className="space-y-4">
          {data.provenanceRecords.map((rec) => (
            <Card key={rec.sourceDocId} className="border-slate-800 bg-slate-900/80 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{rec.docType}</Badge>
                  <span className="text-sm font-semibold text-white">{rec.docTitle}</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  Page {rec.pageNumber} • Conf: {(rec.confidenceScore * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded border border-slate-800 italic">
                "{rec.snippet}"
              </p>
              <div className="mt-2 text-[10px] font-mono text-slate-500">
                Bounding Box: [{rec.boundingBox.x1}, {rec.boundingBox.y1}, {rec.boundingBox.x2}, {rec.boundingBox.y2}]
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
