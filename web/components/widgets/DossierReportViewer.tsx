"use client";

import React, { useState } from "react";
import {
  Activity,
  Award,
  CheckCircle2,
  FileText,
  Layers,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DossierReportViewer() {
  const [activeTab, setActiveTab] = useState<"M19-130" | "STAT1" | "IL6">("M19-130");

  return (
    <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-2xl">
      {/* Top Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Slides 13-15
            </span>
            <h3 className="text-sm font-bold text-white">
              Competitive Intelligence & Clinical Dossier Viewer
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Deep-dive clinical efficacy, SRI-4 endpoints, and target CI reports
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("M19-130")}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              activeTab === "M19-130"
                ? "bg-purple-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            M19-130 (ABBV-599)
          </button>
          <button
            onClick={() => setActiveTab("STAT1")}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              activeTab === "STAT1"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            STAT1 CI Report
          </button>
          <button
            onClick={() => setActiveTab("IL6")}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              activeTab === "IL6"
                ? "bg-emerald-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            IL6 CI Report
          </button>
        </div>
      </div>

      {/* TAB 1: M19-130 / ABBV-599 PHASE 2 STUDY */}
      {activeTab === "M19-130" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* SRI-4 Card */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Primary Endpoint (Week 24)
              </span>
              <h4 className="text-base font-extrabold text-white">SRI-4 Response Rate</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-400">68.2%</span>
                <span className="text-xs text-slate-400">vs 41.5% Placebo</span>
              </div>
              <Badge variant="success" className="text-[9px]">p = 0.003 • Statistically Significant</Badge>
            </div>

            {/* BICLA Card */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Secondary Endpoint (Week 24)
              </span>
              <h4 className="text-base font-extrabold text-white">BICLA Response Rate</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-400">58.4%</span>
                <span className="text-xs text-slate-400">vs 34.1% Placebo</span>
              </div>
              <Badge variant="purple" className="text-[9px]">p = 0.008 • Statistically Significant</Badge>
            </div>

            {/* Dose Cohort Card */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Asset Architecture
              </span>
              <h4 className="text-base font-extrabold text-white">ABBV-599 Fixed Combo</h4>
              <p className="text-xs text-slate-300">
                Elsubrutinib 60 mg (BTK) + Upadacitinib 30 mg (JAK1) QD
              </p>
              <div className="text-[10px] text-blue-400 font-mono">
                NCT03978520 • Completed (N=341)
              </div>
            </div>
          </div>

          {/* Safety & Tolerability Breakdown */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
            <span className="font-bold text-white uppercase text-[10px] tracking-wider block font-mono">
              Safety & Biomarker Observations:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Dual BTK/JAK1 inhibition demonstrated synergistic suppression of autoantibody titres (anti-dsDNA reduction &gt;45%).</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Mild Herpes Zoster rate 3.8% in high dose cohort; no opportunistic deep fungal infections reported.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STAT1 CI REPORT */}
      {activeTab === "STAT1" && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="font-bold text-white text-sm">STAT1 Target Competitive Intelligence Report (Slide 14)</span>
            <Badge variant="outline">ARCH Score: 7.92</Badge>
          </div>
          <p className="text-slate-300 leading-relaxed">
            STAT1 mediates downstream Type I/II Interferon signaling in SLE. Overexpressed in 78% of active SLE PBMC transcriptomes. Direct catalytic inhibition has proven challenging; upstream JAK1/TYK2 inhibition represents the primary clinical strategy.
          </p>
          <div className="grid grid-cols-3 gap-2 font-mono text-[10px] bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <div>Genetic Causal: <strong className="text-blue-400">0.82</strong></div>
            <div>Pathway Causal: <strong className="text-emerald-400">0.89</strong></div>
            <div>Competitive Phase: <strong className="text-purple-400">Phase 2/3</strong></div>
          </div>
        </div>
      )}

      {/* TAB 3: IL6 CI REPORT */}
      {activeTab === "IL6" && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="font-bold text-white text-sm">IL6 Target Competitive Intelligence Report (Slide 15)</span>
            <Badge variant="success">ARCH Score: 8.94 (Top Rank)</Badge>
          </div>
          <p className="text-slate-300 leading-relaxed">
            IL6 drives follicular helper T-cell priming, plasmablast differentiation, and acute phase reactants in SLE and Lupus Nephritis. High baseline serum IL-6 correlates with BILAG renal flares. Combination with BAFF/TNFSF13B inhibition provides the highest predicted synergy score (7.58).
          </p>
          <div className="grid grid-cols-3 gap-2 font-mono text-[10px] bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <div>Genetic Causal: <strong className="text-blue-400">0.92</strong></div>
            <div>SWAG Strength: <strong className="text-emerald-400">0.96</strong></div>
            <div>Combo Rank: <strong className="text-purple-400">#1 (sAB = 0.80)</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}
