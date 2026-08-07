"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function RiskTable() {
  const riskCategories = [
    {
      category: "Severe Infection Risk",
      level: "Moderate",
      badgeVariant: "warning" as const,
      mechanism: "Dual blockade of plasma cell survival (BAFF) and acute phase response (IL-6).",
      mitigation: "Screen for latent TB/HBV; routine CBC monitoring and prophylactic immunization.",
    },
    {
      category: "Hepatic Enzyme Elevation",
      level: "Low",
      badgeVariant: "secondary" as const,
      mechanism: "Transient ALT/AST fluctuations observed with IL-6R antagonists.",
      mitigation: "Monthly LFT monitoring during induction phase (Weeks 0-12).",
    },
    {
      category: "Cytopenias (Neutropenia)",
      level: "Moderate",
      badgeVariant: "warning" as const,
      mechanism: "Dose-dependent absolute neutrophil count (ANC) decrease without opportunistic sepsis.",
      mitigation: "Dose withhold protocol if ANC < 1.0 x 10^9 / L.",
    },
    {
      category: "Autoimmunity Rebound Flare",
      level: "Low / Mitigated",
      badgeVariant: "success" as const,
      mechanism: "Simultaneous BAFF inhibition prevents paradoxical B-cell hyperactivation upon IL-6 withdrawal.",
      mitigation: "Dual pathway coverage maintains immune homeostasis.",
    },
    {
      category: "Gastrointestinal Risk",
      level: "Low",
      badgeVariant: "secondary" as const,
      mechanism: "Rare diverticular perforation risk associated with long-term IL-6 inhibition.",
      mitigation: "Exclude patients with active diverticulitis or severe ulcer disease.",
    },
  ];

  return (
    <div className="space-y-3 bg-white dark:bg-slate-950 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl transition-colors duration-200">
      {/* Top Ribbon */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
              Safety Profile Assessment
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              IL6 + TNFSF13B (BAFF) Toxicological & Safety Risk Matrix
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Systematic adverse event profile and clinical risk mitigation protocols
          </p>
        </div>

        <Badge variant="outline" className="text-emerald-400 font-mono text-[10px]">
          Overall Profile: Manageable
        </Badge>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-200">
          <thead className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
            <tr>
              <th className="p-2.5">Risk Category</th>
              <th className="p-2.5">Severity</th>
              <th className="p-2.5">Biological Mechanism</th>
              <th className="p-2.5">Clinical Mitigation Protocol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
            {riskCategories.map((r, i) => (
              <tr key={i} className="hover:bg-slate-900/60 transition-colors">
                <td className="p-2.5 font-bold text-white font-sans">{r.category}</td>
                <td className="p-2.5 font-sans">
                  <Badge variant={r.badgeVariant} className="text-[10px]">
                    {r.level}
                  </Badge>
                </td>
                <td className="p-2.5 text-slate-300 font-sans text-[11px] max-w-xs leading-relaxed">
                  {r.mechanism}
                </td>
                <td className="p-2.5 text-emerald-400 font-sans text-[11px] leading-relaxed">
                  {r.mitigation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
