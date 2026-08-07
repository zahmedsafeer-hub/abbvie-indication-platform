"use client";

import React, { useState } from "react";
import { Award, ChevronRight, Download, Filter, Search, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ComboMechanism } from "@/types/platform";
import { MOCK_DATABASE } from "@/lib/mock-data";

interface ComboRankTableProps {
  combos?: ComboMechanism[];
  onSelectCombo?: (combo: ComboMechanism) => void;
}

export function ComboRankTable({
  combos = MOCK_DATABASE.comboMechanisms,
  onSelectCombo,
}: ComboRankTableProps) {
  const [search, setSearch] = useState("");
  const [selectedCombo, setSelectedCombo] = useState<ComboMechanism | null>(combos[0] || null);

  const filtered = combos.filter((c) => {
    const s = search.toLowerCase();
    return (
      (c.moa1 && c.moa1.toLowerCase().includes(s)) ||
      (c.moa2 && c.moa2.toLowerCase().includes(s)) ||
      (c.expectedResult && c.expectedResult.toLowerCase().includes(s)) ||
      (c.disease && c.disease.toLowerCase().includes(s))
    );
  });

  const handleRowClick = (c: ComboMechanism) => {
    setSelectedCombo(c);
    if (onSelectCombo) onSelectCombo(c);
  };

  return (
    <div className="space-y-3 bg-white dark:bg-slate-950 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl transition-colors duration-200">
      {/* Top Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
              Synergy Pair Discovery
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              IL-6 Combination Synergy & GTM Link Prediction Rankings
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Top computational combination mechanisms for IL-6 ranked by sAB Intact & AI score
          </p>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search combo partner..."
            className="pl-8 pr-3 py-1 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500 w-44 sm:w-56"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800/80">
        <table className="w-full text-left text-xs border-collapse font-sans">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 font-mono text-[10px] uppercase">
              <th className="p-2.5 font-bold">Rank</th>
              <th className="p-2.5 font-bold">MOA Pair</th>
              <th className="p-2.5">Target 1</th>
              <th className="p-2.5">Target 2</th>
              <th className="p-2.5 text-right font-bold">Composite AI</th>
              <th className="p-2.5 text-right font-bold">sAB Intact</th>
              <th className="p-2.5 text-right">Causal Score</th>
              <th className="p-2.5 text-right">Strength</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {filtered.map((c, idx) => {
              const isSelected = selectedCombo?.moa2 === c.moa2;
              const isTop = idx === 0;
              return (
                <tr
                  key={c.moa2 + idx}
                  onClick={() => handleRowClick(c)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-purple-50/80 dark:bg-purple-600/15 text-slate-900 dark:text-white font-medium"
                      : "hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <td className="p-2.5 font-mono font-bold text-slate-400 dark:text-slate-500">
                    #{idx + 1}
                  </td>
                  <td className="p-2.5 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {isTop && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                    <span>{c.moa1} + {c.moa2}</span>
                  </td>
                  <td className="p-2.5 text-slate-600 dark:text-slate-400">{c.moa1}</td>
                  <td className="p-2.5 font-bold text-purple-600 dark:text-purple-400">{c.moa2}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-purple-600 dark:text-purple-400">
                    {c.compositeAiScore.toFixed(2)}
                  </td>
                  <td className="p-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {c.sabIntact.toFixed(2)}
                  </td>
                  <td className="p-2.5 text-right font-mono text-slate-600 dark:text-slate-400">
                    {c.swag1.toFixed(2)}
                  </td>
                  <td className="p-2.5 text-right font-mono text-slate-600 dark:text-slate-400">
                    {c.swag2.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Pair Insight */}
      {selectedCombo && (
        <div className="p-3 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-slate-800 dark:text-slate-200">
              Selected Pair: <strong className="text-purple-700 dark:text-purple-300">{selectedCombo.moa1} + {selectedCombo.moa2}</strong> (sAB Intact: {selectedCombo.sabIntact})
            </span>
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 italic">
            {selectedCombo.expectedResult || "Non-redundant downstream cascade disruption in SLE"}
          </span>
        </div>
      )}
    </div>
  );
}
