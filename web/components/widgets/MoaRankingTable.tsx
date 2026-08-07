"use client";

import React, { useState } from "react";
import { Download, ExternalLink, Filter, Search, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ARCHTarget } from "@/types/platform";
import { MOCK_DATABASE } from "@/lib/mock-data";

interface MoaRankingTableProps {
  targets?: ARCHTarget[];
  onSelectTarget?: (target: ARCHTarget) => void;
}

export function MoaRankingTable({
  targets = MOCK_DATABASE.archTargets,
  onSelectTarget,
}: MoaRankingTableProps) {
  const [search, setSearch] = useState("");
  const [selectedTarget, setSelectedTarget] = useState<ARCHTarget | null>(targets[0] || null);

  const filtered = targets.filter(
    (t) =>
      t.gene.toLowerCase().includes(search.toLowerCase()) ||
      t.currentDevStatus.toLowerCase().includes(search.toLowerCase()) ||
      t.disease.toLowerCase().includes(search.toLowerCase())
  );

  const exportToCsv = () => {
    const headers = "Gene,Ensembl ID,Disease,SWAG Score,SWAG Strength,Pathway Causal,Genetic Score,Development Status\n";
    const rows = targets
      .map(
        (t) =>
          `"${t.gene}","${t.ensemblId}","${t.disease}",${t.swagScore},${t.swagStrength},${t.pathwayCausal},${t.genetic},"${t.currentDevStatus}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "abbvie_arch_moa_rankings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRowClick = (t: ARCHTarget) => {
    setSelectedTarget(t);
    if (onSelectTarget) onSelectTarget(t);
  };

  return (
    <div className="space-y-3 bg-white dark:bg-slate-950 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl transition-colors duration-200">
      {/* Top Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
              ARCH Target Prioritization
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Target MOA Rankings & Multi-Omics Genetics
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Ranked by SWAG score, causal genetics, and experimental validation in autoimmune disease
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search target..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-36 sm:w-48"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={exportToCsv}
            className="text-xs h-7 gap-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Interactive Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800/80">
        <table className="w-full text-left text-xs border-collapse font-sans">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 font-mono text-[10px] uppercase">
              <th className="p-2.5 font-bold">Target Gene</th>
              <th className="p-2.5">Ensembl ID</th>
              <th className="p-2.5">Disease</th>
              <th className="p-2.5 text-right">SWAG Score</th>
              <th className="p-2.5 text-right">Association</th>
              <th className="p-2.5 text-right">Causal Path</th>
              <th className="p-2.5 text-right">Genetic</th>
              <th className="p-2.5 text-center">Dev Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {filtered.map((t) => {
              const isSelected = selectedTarget?.gene === t.gene;
              return (
                <tr
                  key={t.gene}
                  onClick={() => handleRowClick(t)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-50/80 dark:bg-blue-600/15 text-slate-900 dark:text-white font-medium"
                      : "hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <td className="p-2.5 font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>{t.gene}</span>
                  </td>
                  <td className="p-2.5 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                    {t.ensemblId}
                  </td>
                  <td className="p-2.5 text-slate-600 dark:text-slate-400">{t.disease}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                    {t.swagScore.toFixed(2)}
                  </td>
                  <td className="p-2.5 text-right font-mono text-slate-600 dark:text-slate-400">
                    {t.swagStrength.toFixed(2)}
                  </td>
                  <td className="p-2.5 text-right font-mono text-slate-600 dark:text-slate-400">
                    {t.pathwayCausal.toFixed(2)}
                  </td>
                  <td className="p-2.5 text-right font-mono text-slate-600 dark:text-slate-400">
                    {t.genetic.toFixed(2)}
                  </td>
                  <td className="p-2.5 text-center">
                    <Badge
                      variant={
                        t.currentDevStatus === "Launched"
                          ? "success"
                          : t.currentDevStatus === "Phase 2"
                          ? "purple"
                          : t.currentDevStatus === "Phase 3"
                          ? "default"
                          : "outline"
                      }
                    >
                      {t.currentDevStatus}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Target Dossier Summary */}
      {selectedTarget && (
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-slate-700 dark:text-slate-300">
              Selected Target: <strong className="text-slate-900 dark:text-white font-bold">{selectedTarget.gene}</strong> ({selectedTarget.disease})
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-slate-500">SWAG: <strong className="text-blue-600 dark:text-blue-400 font-bold">{selectedTarget.swagScore}</strong></span>
            <span className="text-slate-500">Status: <strong className="text-purple-600 dark:text-purple-400 font-bold">{selectedTarget.currentDevStatus}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
