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
    link.setAttribute("download", "abbvie_arch_moa_rankings_slide11.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRowClick = (t: ARCHTarget) => {
    setSelectedTarget(t);
    if (onSelectTarget) onSelectTarget(t);
  };

  return (
    <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-2xl">
      {/* Top Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Slide 11
            </span>
            <h3 className="text-sm font-bold text-white">
              ARCH Target Prioritization & MOA Rankings
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Ranked by SWAG Score, association strength, and causal genetics in SLE
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search targets..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <Button
            onClick={exportToCsv}
            size="sm"
            variant="outline"
            className="text-xs gap-1.5 border-slate-700 hover:bg-slate-800 text-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Interactive Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-200">
          <thead className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
            <tr>
              <th className="p-2.5">Rank</th>
              <th className="p-2.5">Target Gene</th>
              <th className="p-2.5">Ensembl ID</th>
              <th className="p-2.5">SWAG Score</th>
              <th className="p-2.5">SWAG Strength</th>
              <th className="p-2.5">Causal Pathway</th>
              <th className="p-2.5">Genetic Score</th>
              <th className="p-2.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
            {filtered.map((t, idx) => (
              <tr
                key={t.gene}
                onClick={() => handleRowClick(t)}
                className={`cursor-pointer transition-colors ${
                  selectedTarget?.gene === t.gene
                    ? "bg-blue-950/70 border-l-4 border-l-blue-500"
                    : "hover:bg-slate-900/60"
                }`}
              >
                <td className="p-2.5 font-bold text-blue-400">#{idx + 1}</td>
                <td className="p-2.5 font-bold text-white font-sans flex items-center gap-1.5">
                  <span>{t.gene}</span>
                  {t.gene === "IL6" || t.gene === "TYK2" ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  ) : null}
                </td>
                <td className="p-2.5 text-slate-400 text-[10px]">{t.ensemblId}</td>
                <td className="p-2.5 font-bold text-emerald-400">{t.swagScore.toFixed(2)}</td>
                <td className="p-2.5 text-slate-300">{(t.swagStrength * 100).toFixed(0)}%</td>
                <td className="p-2.5 text-slate-300">{(t.pathwayCausal * 100).toFixed(0)}%</td>
                <td className="p-2.5 text-slate-300">{(t.genetic * 100).toFixed(0)}%</td>
                <td className="p-2.5 font-sans">
                  <Badge
                    variant={
                      t.currentDevStatus === "Launched"
                        ? "success"
                        : t.currentDevStatus === "Phase 3"
                        ? "purple"
                        : t.currentDevStatus === "Phase 2"
                        ? "default"
                        : "secondary"
                    }
                    className="text-[10px]"
                  >
                    {t.currentDevStatus}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Target Quick Dossier Preview */}
      {selectedTarget && (
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-white text-xs">
              Selected Target Dossier: <span className="text-blue-400 font-mono">{selectedTarget.gene}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{selectedTarget.disease}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono bg-slate-950 p-2 rounded-lg border border-slate-800">
            <div>SWAG Score: <strong className="text-emerald-400">{selectedTarget.swagScore}</strong></div>
            <div>No-Clin SWAG: <strong className="text-blue-400">{selectedTarget.swagScoreNoClin}</strong></div>
            <div>Genetics: <strong className="text-slate-200">{(selectedTarget.genetic * 100).toFixed(0)}%</strong></div>
            <div>Status: <strong className="text-purple-400">{selectedTarget.currentDevStatus}</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}
