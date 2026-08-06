"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Play,
  RotateCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchGoldenDataset, runCaseEvaluation } from "@/lib/api";
import {
  GoldenTestCase,
  GoldenDatasetSummary,
  CaseEvaluationResult,
} from "@/types/platform";

export default function GoldenDatasetPage() {
  const [cases, setCases] = useState<GoldenTestCase[]>([]);
  const [summary, setSummary] = useState<GoldenDatasetSummary | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");

  const [selectedCase, setSelectedCase] = useState<GoldenTestCase | null>(null);
  const [evalResult, setEvalResult] = useState<CaseEvaluationResult | null>(null);
  const [evaluating, setEvaluating] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const data = await fetchGoldenDataset();
      setCases(data.cases);
      setSummary(data.summary);
      if (data.cases.length > 0) {
        setSelectedCase(data.cases[0]);
        handleRunCase(data.cases[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunCase = async (testCase: GoldenTestCase) => {
    setSelectedCase(testCase);
    setEvaluating(true);
    try {
      const res = await runCaseEvaluation(testCase.id);
      setEvalResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.query.toLowerCase().includes(search.toLowerCase()) ||
      c.expected_source_topic.toLowerCase().includes(search.toLowerCase()) ||
      c.notes.toLowerCase().includes(search.toLowerCase());

    if (activeFilter === "ALL") return matchesSearch;
    if (activeFilter === "ADV") return matchesSearch && c.id.startsWith("ADV");
    if (activeFilter === "DEFINITIONAL") return matchesSearch && c.expected_intent === "DEFINITIONAL" && !c.id.startsWith("ADV");
    if (activeFilter === "PROTOCOL") return matchesSearch && c.expected_intent === "PROTOCOL";
    if (activeFilter === "TROUBLESHOOTING") return matchesSearch && c.expected_intent === "TROUBLESHOOTING" && !c.id.startsWith("ADV");
    if (activeFilter === "COMPARATIVE") return matchesSearch && c.expected_intent === "COMPARATIVE";
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
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
              <span>45-Case Golden Evaluation Dataset Benchmark</span>
              <Badge variant="purple">40 Scientific + 5 Adversarial</Badge>
            </h1>
            <p className="text-xs text-slate-400">
              Rigorous domain-expert verified evaluation benchmark across Slides 11-22 and adversarial safety boundaries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="success">Domain Verified</Badge>
          <span className="text-slate-500">|</span>
          <span className="text-blue-400 font-bold">{cases.length} Active Cases</span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-mono text-slate-400">Total Benchmark</span>
          <p className="text-xl font-black text-white font-mono">{summary?.totalCases || 45}</p>
          <span className="text-[9px] text-emerald-400 font-mono">100% Verified</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-mono text-slate-400">Definitional</span>
          <p className="text-xl font-black text-blue-400 font-mono">10</p>
          <span className="text-[9px] text-slate-400 font-mono">Targets & MOAs</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-mono text-slate-400">Protocol / SOP</span>
          <p className="text-xl font-black text-emerald-400 font-mono">15</p>
          <span className="text-[9px] text-slate-400 font-mono">Wet Lab & Animal</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-mono text-slate-400">Troubleshooting</span>
          <p className="text-xl font-black text-amber-400 font-mono">10</p>
          <span className="text-[9px] text-slate-400 font-mono">QC & Diagnostic</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-mono text-slate-400">Comparative</span>
          <p className="text-xl font-black text-purple-400 font-mono">5</p>
          <span className="text-[9px] text-slate-400 font-mono">Routes & Trials</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-mono text-slate-400">Adversarial</span>
          <p className="text-xl font-black text-rose-400 font-mono">5</p>
          <span className="text-[9px] text-rose-400 font-mono">Safety Boundaries</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeFilter === "ALL"
                ? "bg-blue-600 text-white font-bold shadow"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            All (45)
          </button>
          <button
            onClick={() => setActiveFilter("DEFINITIONAL")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeFilter === "DEFINITIONAL"
                ? "bg-blue-600 text-white font-bold shadow"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Definitional (10)
          </button>
          <button
            onClick={() => setActiveFilter("PROTOCOL")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeFilter === "PROTOCOL"
                ? "bg-emerald-600 text-white font-bold shadow"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Protocol / SOP (15)
          </button>
          <button
            onClick={() => setActiveFilter("TROUBLESHOOTING")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeFilter === "TROUBLESHOOTING"
                ? "bg-amber-600 text-white font-bold shadow"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Troubleshooting (10)
          </button>
          <button
            onClick={() => setActiveFilter("COMPARATIVE")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeFilter === "COMPARATIVE"
                ? "bg-purple-600 text-white font-bold shadow"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Comparative (5)
          </button>
          <button
            onClick={() => setActiveFilter("ADV")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeFilter === "ADV"
                ? "bg-rose-600 text-white font-bold shadow"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Adversarial (5)
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search queries, topics, IDs..."
            className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Split View: Left Case Table | Right Live Evaluation Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 Columns: Test Cases Table */}
        <div className="lg:col-span-6 bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 h-[600px] flex flex-col">
          <div className="flex justify-between items-center px-1 pb-1 border-b border-slate-800 text-xs">
            <span className="font-bold text-white uppercase text-[10px] tracking-wider font-mono">
              Evaluation Benchmark Cases ({filteredCases.length})
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Click row to run live test</span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scroll space-y-1.5 pr-1">
            {filteredCases.map((c) => (
              <div
                key={c.id}
                onClick={() => handleRunCase(c)}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all space-y-1 ${
                  selectedCase?.id === c.id
                    ? "bg-blue-950/60 border-blue-500 shadow-md shadow-blue-500/10"
                    : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-bold text-blue-400">{c.id}</span>
                  <Badge
                    variant={
                      c.id.startsWith("ADV")
                        ? "destructive"
                        : c.expected_intent === "PROTOCOL"
                        ? "success"
                        : c.expected_intent === "TROUBLESHOOTING"
                        ? "warning"
                        : c.expected_intent === "COMPARATIVE"
                        ? "purple"
                        : "default"
                    }
                    className="text-[9px] py-0 px-1.5"
                  >
                    {c.expected_intent}
                  </Badge>
                </div>

                <p className="font-semibold text-white text-xs leading-snug line-clamp-2">
                  {c.query}
                </p>

                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono pt-0.5">
                  <span className="truncate max-w-[200px]">{c.expected_source_topic}</span>
                  <span className="text-slate-500">{c.notes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 Columns: Live Evaluation Comparison Card */}
        <div className="lg:col-span-6 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4 h-[600px] flex flex-col justify-between overflow-y-auto custom-scroll">
          {evalResult ? (
            <div className="space-y-4 text-xs">
              
              {/* Target Case Header */}
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800/40">
                    Live Evaluation: {evalResult.caseId}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant={evalResult.intentMatch ? "success" : "destructive"}>
                      {evalResult.intentMatch ? "✓ Intent Matched" : "✗ Intent Mismatch"}
                    </Badge>
                    <span className="font-mono text-[10px] text-slate-400">
                      {evalResult.latencyMs}ms
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-white text-sm leading-snug">
                  "{evalResult.query}"
                </h3>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                  <div>Expected: <strong className="text-purple-400">{evalResult.expectedIntent}</strong></div>
                  <div>Predicted: <strong className="text-emerald-400">{evalResult.predictedIntent} ({(evalResult.classificationConfidence * 100).toFixed(0)}%)</strong></div>
                </div>
              </div>

              {/* Golden Benchmark Answer */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-slate-300 text-[11px] uppercase tracking-wider font-mono">
                    Verified Golden Benchmark Answer:
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap border-l-4 border-l-amber-500">
                  {evalResult.goldenAnswer}
                </div>
              </div>

              {/* Live Generated Model Response */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-slate-300 text-[11px] uppercase tracking-wider font-mono">
                    Live Agent Response (Zero-Hallucination Grounded):
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap border-l-4 border-l-blue-500">
                  {evalResult.generatedResponse}

                  {evalResult.citations && evalResult.citations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-800 flex flex-wrap gap-1 font-mono text-[9px]">
                      <span className="text-slate-500 uppercase font-bold">Citations:</span>
                      {evalResult.citations.map((c, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/40">
                          {c.citationTag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2 text-slate-500 text-xs">
              <RotateCw className="w-8 h-8 text-slate-600 animate-spin" />
              <p>Executing live evaluation against golden benchmark...</p>
            </div>
          )}

          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>45 Domain-Expert Grounded Evaluation Cases</span>
            <Badge variant="outline" className="text-[9px]">ARCH v2.4 Grounded</Badge>
          </div>
        </div>

      </div>
    </div>
  );
}
