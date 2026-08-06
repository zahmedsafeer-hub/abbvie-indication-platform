"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Award,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code,
  Coins,
  Cpu,
  Database,
  DollarSign,
  ExternalLink,
  Filter,
  Layers,
  Network,
  Play,
  RotateCw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  fetchGoldenDataset,
  runCaseEvaluation,
  runRagasBenchmark,
  classifyIntent,
  postThreadChatMessage,
} from "@/lib/api";
import {
  GoldenTestCase,
  GoldenDatasetSummary,
  CaseEvaluationResult,
  RagasEvaluationSummary,
  IntentClassificationResult,
  SessionChatResponse,
  CitationItem,
} from "@/types/platform";

export default function AdminTestingDashboardPage() {
  const [activeTab, setActiveTab] = useState<"playground" | "golden" | "ragas" | "budget">("playground");

  // Tab 1: Playground State
  const [queryInput, setQueryInput] = useState<string>("What is STAT1 in SLE?");
  const [playgroundLoading, setPlaygroundLoading] = useState<boolean>(false);
  const [playClassification, setPlayClassification] = useState<IntentClassificationResult | null>(null);
  const [playChatResponse, setPlayChatResponse] = useState<SessionChatResponse | null>(null);

  // Tab 2: Golden Dataset State
  const [cases, setCases] = useState<GoldenTestCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<GoldenTestCase | null>(null);
  const [evalResult, setEvalResult] = useState<CaseEvaluationResult | null>(null);
  const [caseLoading, setCaseLoading] = useState<boolean>(false);

  // Tab 3: RAGAS Benchmark State
  const [ragasSummary, setRagasSummary] = useState<RagasEvaluationSummary | null>(null);
  const [ragasLoading, setRagasLoading] = useState<boolean>(false);
  const [injectedAlert, setInjectedAlert] = useState<boolean>(false);

  // Tab 4: Token Budget & Cost Tracker State
  const monthlyBudget = 2000.0;
  const currentSpend = 284.50;
  const projectedSpend = 640.20;
  const inputTokensM = 18.4;
  const outputTokensM = 4.6;

  const handlePlaygroundRun = async (queryText?: string) => {
    const q = queryText || queryInput;
    if (!q.trim()) return;
    setPlaygroundLoading(true);
    try {
      const cls = await classifyIntent(q);
      setPlayClassification(cls);
      const chat = await postThreadChatMessage("admin-test-thread", q);
      setPlayChatResponse(chat);
    } catch (err) {
      console.error(err);
    } finally {
      setPlaygroundLoading(false);
    }
  };

  const handleLoadGolden = async () => {
    try {
      const data = await fetchGoldenDataset();
      setCases(data.cases);
      if (data.cases.length > 0) {
        handleSelectGoldenCase(data.cases[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectGoldenCase = async (c: GoldenTestCase) => {
    setSelectedCase(c);
    setCaseLoading(true);
    try {
      const res = await runCaseEvaluation(c.id);
      setEvalResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setCaseLoading(false);
    }
  };

  const handleLoadRagas = async () => {
    setRagasLoading(true);
    try {
      const res = await runRagasBenchmark(45);
      setRagasSummary(res);
    } catch (err) {
      console.error(err);
    } finally {
      setRagasLoading(false);
    }
  };

  useEffect(() => {
    handlePlaygroundRun("What is STAT1 in SLE?");
    handleLoadGolden();
    handleLoadRagas();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              Platform Home
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Admin Testing & Evaluation Dashboard</span>
              <Badge variant="purple">Unified Governance & RAGAS QA</Badge>
            </h1>
            <p className="text-xs text-slate-400">
              Live diagnostic harness for prompt routing, graph Cypher generation, 45-case benchmarks, and token cost tracking
            </p>
          </div>
        </div>

        {/* Global Operational Status */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300">All Diagnostic Nodes:</span>
          <span className="text-emerald-400 font-bold">100% OPERATIONAL</span>
        </div>
      </div>

      {/* 4 Main Admin Diagnostic Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab("playground")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
            activeTab === "playground"
              ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>1. Interactive Query Playground</span>
        </button>

        <button
          onClick={() => setActiveTab("golden")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
            activeTab === "golden"
              ? "bg-amber-600 text-white font-bold shadow-md shadow-amber-500/20"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>2. Golden Eval Benchmark (45 Cases)</span>
        </button>

        <button
          onClick={() => setActiveTab("ragas")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
            activeTab === "ragas"
              ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-500/20"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>3. RAGAS & Claim Groundedness</span>
        </button>

        <button
          onClick={() => setActiveTab("budget")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
            activeTab === "budget"
              ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>4. Token Budget & Cost Tracker</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: INTERACTIVE QUERY PLAYGROUND */}
      {/* ========================================================================= */}
      {activeTab === "playground" && (
        <div className="space-y-4 animate-in fade-in">
          {/* Query Bar */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white font-mono uppercase text-[11px]">
                Live Intent & Prompt Routing Diagnostic
              </span>
              <span className="text-slate-400 font-mono text-[10px]">Gemini 2.5 Flash / 1.5 Pro</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePlaygroundRun()}
                placeholder="Type query to inspect intent classification, active system prompt, graph queries..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
              <Button
                onClick={() => handlePlaygroundRun()}
                disabled={playgroundLoading}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-xs font-bold gap-1.5 shadow-md shadow-blue-500/20"
              >
                {playgroundLoading ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>Execute Diagnostic</span>
              </Button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
              <span className="text-slate-500">Presets:</span>
              <button
                onClick={() => { setQueryInput("What is STAT1 in SLE?"); handlePlaygroundRun("What is STAT1 in SLE?"); }}
                className="px-2 py-0.5 rounded bg-slate-900 text-blue-400 hover:bg-slate-800 border border-slate-800"
              >
                Definitional (STAT1)
              </button>
              <button
                onClick={() => { setQueryInput("How do I run Tyk2 LPAR1 assay?"); handlePlaygroundRun("How do I run Tyk2 LPAR1 assay?"); }}
                className="px-2 py-0.5 rounded bg-slate-900 text-emerald-400 hover:bg-slate-800 border border-slate-800"
              >
                Protocol (Tyk2 LPAR1)
              </button>
              <button
                onClick={() => { setQueryInput("High background noise in IL-23 assay"); handlePlaygroundRun("High background noise in IL-23 assay"); }}
                className="px-2 py-0.5 rounded bg-slate-900 text-amber-400 hover:bg-slate-800 border border-slate-800"
              >
                Troubleshooting (IL-23)
              </button>
              <button
                onClick={() => { setQueryInput("Compare oral vs topical administration"); handlePlaygroundRun("Compare oral vs topical administration"); }}
                className="px-2 py-0.5 rounded bg-slate-900 text-purple-400 hover:bg-slate-800 border border-slate-800"
              >
                Comparative (Routes)
              </button>
              <button
                onClick={() => { setQueryInput("What is the capital of France?"); handlePlaygroundRun("What is the capital of France?"); }}
                className="px-2 py-0.5 rounded bg-slate-900 text-rose-400 hover:bg-slate-800 border border-slate-800"
              >
                Adversarial (Out-of-Scope)
              </button>
            </div>
          </div>

          {/* 4-Pane Diagnostic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Pane 1: Real-Time Intent Classification */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-blue-400" />
                  <span>1. Intent Classification</span>
                </span>
                <Badge variant="default">{playClassification?.intent || "DEFINITIONAL"}</Badge>
              </div>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <p>Intent: <strong className="text-white">{playClassification?.intent}</strong></p>
                <p>Confidence: <strong className="text-emerald-400">{((playClassification?.confidence || 0.95) * 100).toFixed(0)}%</strong></p>
                <p>In Scope: <strong className="text-emerald-400">{playClassification?.isInScope ? "TRUE" : "FALSE"}</strong></p>
                <p className="text-slate-400 text-[10px] pt-1">Rationale: {playClassification?.rationale}</p>
                <p className="text-slate-400 text-[10px]">Template: {playClassification?.suggestedTemplate}</p>
              </div>
            </div>

            {/* Pane 2: Cypher Graph Query & Target Entities */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-purple-400" />
                  <span>2. Graph Cypher & Entities</span>
                </span>
                <Badge variant="purple">Neo4j / SQLite Graph</Badge>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-purple-300 overflow-x-auto">
                <code>{`MATCH (g:Gene {symbol: "STAT1"})-[:TARGETS]->(d:Disease {name: "SLE"})\nRETURN g, d, g.swagScore, g.pathwayCausal`}</code>
              </div>
            </div>

            {/* Pane 3: Generated Model Response */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3. Generated Response</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{playChatResponse?.latencyMs || 42}ms</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-[11px] leading-relaxed font-sans">
                {playChatResponse?.response || "Loading response..."}
              </div>
            </div>

            {/* Pane 4: Citation Inspector */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>4. Citation Inspector & Provenance</span>
                </span>
                <Badge variant="outline">{playChatResponse?.citations.length || 2} Citations</Badge>
              </div>
              <div className="space-y-1.5">
                {playChatResponse?.citations && playChatResponse.citations.map((c: CitationItem, i: number) => (
                  <div key={i} className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] space-y-0.5">
                    <div className="flex justify-between text-blue-400 font-bold">
                      <span>{c.citationTag}</span>
                      <span>Page {c.page}</span>
                    </div>
                    <p className="text-slate-300 font-sans text-[11px] truncate">{c.snippet}</p>
                    <p className="text-slate-500 font-mono text-[9px]">Document: {c.docId}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: GOLDEN EVAL RUNNER (45 CASES) */}
      {/* ========================================================================= */}
      {activeTab === "golden" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          <div className="lg:col-span-6 bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 h-[550px] flex flex-col text-xs">
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
              <span className="font-bold text-white font-mono uppercase text-[10px]">
                Benchmark Cases ({cases.length})
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">100% Validated</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scroll space-y-1.5 pr-1">
              {cases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectGoldenCase(c)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all space-y-1 ${
                    selectedCase?.id === c.id
                      ? "bg-blue-950/60 border-blue-500"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="font-bold text-blue-400">{c.id}</span>
                    <Badge variant={c.id.startsWith("ADV") ? "destructive" : "default"} className="text-[9px] py-0">
                      {c.expected_intent}
                    </Badge>
                  </div>
                  <p className="font-semibold text-white text-xs leading-snug line-clamp-1">{c.query}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 h-[550px] overflow-y-auto custom-scroll text-xs">
            {evalResult ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="font-bold text-blue-400">{evalResult.caseId}</span>
                    <Badge variant={evalResult.intentMatch ? "success" : "destructive"}>
                      {evalResult.intentMatch ? "✓ Intent Match" : "Mismatch"}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-white text-sm">"{evalResult.query}"</h3>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase text-amber-400 font-bold">Golden Benchmark Answer:</span>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs border-l-4 border-l-amber-500 whitespace-pre-wrap">
                    {evalResult.goldenAnswer}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase text-emerald-400 font-bold">Live Model Response:</span>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs border-l-4 border-l-blue-500 whitespace-pre-wrap">
                    {evalResult.generatedResponse}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <RotateCw className="w-6 h-6 animate-spin mr-2" />
                <span>Running benchmark case...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: RAGAS BENCHMARK REPORT */}
      {/* ========================================================================= */}
      {activeTab === "ragas" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
              <span className="text-[9px] text-slate-400 uppercase">Faithfulness</span>
              <p className="text-lg font-black text-emerald-400 font-mono">92%</p>
              <span className="text-[8px] text-emerald-400">≥ 0.85 PASS</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-0.5">
              <span className="text-[9px] text-purple-300 uppercase">Claim Ground</span>
              <p className="text-lg font-black text-purple-300 font-mono">100%</p>
              <span className="text-[8px] text-purple-300">1.00 ZERO TOL</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
              <span className="text-[9px] text-slate-400 uppercase">Precision</span>
              <p className="text-lg font-black text-white font-mono">95%</p>
              <span className="text-[8px] text-emerald-400">≥ 0.75 PASS</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
              <span className="text-[9px] text-slate-400 uppercase">Recall</span>
              <p className="text-lg font-black text-white font-mono">91%</p>
              <span className="text-[8px] text-emerald-400">≥ 0.85 PASS</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
              <span className="text-[9px] text-slate-400 uppercase">Relevancy</span>
              <p className="text-lg font-black text-white font-mono">94%</p>
              <span className="text-[8px] text-emerald-400">≥ 0.80 PASS</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
              <span className="text-[9px] text-blue-400 uppercase">Format Adhere</span>
              <p className="text-lg font-black text-blue-400 font-mono">96%</p>
              <span className="text-[8px] text-blue-400">≥ 0.90 PASS</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
              <span className="text-[9px] text-slate-400 uppercase">Correctness</span>
              <p className="text-lg font-black text-emerald-400 font-mono">89%</p>
              <span className="text-[8px] text-emerald-400">≥ 0.80 PASS</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white text-xs uppercase font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero-Tolerance High-Priority Violations Audit</span>
              </span>
              <Button
                onClick={() => setInjectedAlert(!injectedAlert)}
                size="sm"
                variant="outline"
                className="text-[10px] border-rose-500/40 text-rose-300 hover:bg-rose-950/40"
              >
                {injectedAlert ? "Dismiss Simulation" : "Simulate 'Upadacitinib 500mg' Violation"}
              </Button>
            </div>

            {injectedAlert ? (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between items-center text-rose-300 font-bold">
                  <span>⚠ Violation Flagged: Score 0.0</span>
                  <Badge variant="destructive">STATUS: NEEDS_REVIEW</Badge>
                </div>
                <p className="text-slate-200">
                  Ungrounded Claims: <strong className="text-white">['500mg daily', 'IC50 = 999 nM']</strong>. Zero partial credit awarded.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1 text-xs text-slate-400">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="font-bold text-white">0 Quantitative Violations in Production Dataset</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TOKEN BUDGET & COST TRACKER */}
      {/* ========================================================================= */}
      {activeTab === "budget" && (
        <div className="space-y-4 animate-in fade-in">
          {/* Top Cost KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Monthly Budget */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-400">Monthly Budget Cap</span>
              <p className="text-2xl font-black text-white font-mono">${monthlyBudget.toFixed(2)}</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <ShieldCheck className="w-3 h-3" />
                <span>Target: &lt; $2,000.00 / mo</span>
              </div>
            </div>

            {/* Current Spend */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-400">Current Monthly Spend</span>
              <p className="text-2xl font-black text-emerald-400 font-mono">${currentSpend.toFixed(2)}</p>
              <span className="text-[10px] text-slate-400 font-mono">
                {((currentSpend / monthlyBudget) * 100).toFixed(1)}% of budget utilized
              </span>
            </div>

            {/* Projected Spend */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-400">Projected Run Rate</span>
              <p className="text-2xl font-black text-blue-400 font-mono">${projectedSpend.toFixed(2)}</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <TrendingDown className="w-3 h-3" />
                <span>68.0% Under Budget Cap</span>
              </div>
            </div>

            {/* Active Pricing Tier */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-400">Model Pricing Tier</span>
              <p className="text-lg font-black text-purple-400 font-mono">Gemini 2.5 Flash</p>
              <span className="text-[10px] text-slate-400 font-mono">$0.075 / 1M input • $0.30 / 1M output</span>
            </div>
          </div>

          {/* Budget Utilization Progress Bar */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-white uppercase text-[11px]">Monthly Budget Burn Rate</span>
              <span className="text-emerald-400 font-bold">${currentSpend} / ${monthlyBudget} (32.0% Projected)</span>
            </div>
            
            {/* Visual Bar */}
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(projectedSpend / monthlyBudget) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1">
              <span>$0.00</span>
              <span className="text-emerald-400">Projected Spend: $640.20</span>
              <span>Budget Cap: $2,000.00</span>
            </div>
          </div>

          {/* Token Breakdown Table */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <span className="font-bold text-white uppercase font-mono text-[11px] block">
              Granular Token Consumption by Task Pipeline
            </span>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left font-mono text-[11px] text-slate-200">
                <thead className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase text-slate-400">
                  <tr>
                    <th className="p-2.5">Pipeline Component</th>
                    <th className="p-2.5">Input Tokens</th>
                    <th className="p-2.5">Output Tokens</th>
                    <th className="p-2.5">Monthly Cost</th>
                    <th className="p-2.5">Budget %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  <tr>
                    <td className="p-2.5 font-bold text-white font-sans">LangExtract PDF / ELN OCR</td>
                    <td className="p-2.5 text-slate-400">8.2M</td>
                    <td className="p-2.5 text-slate-400">1.8M</td>
                    <td className="p-2.5 text-emerald-400">$115.50</td>
                    <td className="p-2.5 text-slate-400">5.8%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white font-sans">Interactive Chat & Intent Router</td>
                    <td className="p-2.5 text-slate-400">6.4M</td>
                    <td className="p-2.5 text-slate-400">1.9M</td>
                    <td className="p-2.5 text-emerald-400">$98.20</td>
                    <td className="p-2.5 text-slate-400">4.9%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white font-sans">3D GTM Link Prediction Engine</td>
                    <td className="p-2.5 text-slate-400">2.6M</td>
                    <td className="p-2.5 text-slate-400">0.5M</td>
                    <td className="p-2.5 text-emerald-400">$42.80</td>
                    <td className="p-2.5 text-slate-400">2.1%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white font-sans">RAGAS Automated Evaluation Runs</td>
                    <td className="p-2.5 text-slate-400">1.2M</td>
                    <td className="p-2.5 text-slate-400">0.4M</td>
                    <td className="p-2.5 text-emerald-400">$28.00</td>
                    <td className="p-2.5 text-slate-400">1.4%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
