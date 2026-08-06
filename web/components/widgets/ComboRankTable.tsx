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
    <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-2xl">
      {/* Top Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Slide 16
            </span>
            <h3 className="text-sm font-bold text-white">
              IL-6 Combination Synergy & GTM Rankings
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Top computational combination mechanisms for IL-6 ranked by sAB Intact & AI score
          </p>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search combo partner..."
            className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-200">
          <thead className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
            <tr>
              <th className="p-2.5">Rank</th>
              <th className="p-2.5">Primary Target</th>
              <th className="p-2.5">Partner Target</th>
              <th className="p-2.5">AI Score</th>
              <th className="p-2.5">sAB Intact</th>
              <th className="p-2.5">Risk Profile</th>
              <th className="p-2.5">Expected Biological Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
            {filtered.map((c, idx) => (
              <tr
                key={`${c.moa1}-${c.moa2}-${idx}`}
                onClick={() => handleRowClick(c)}
                className={`cursor-pointer transition-colors ${
                  selectedCombo?.moa2 === c.moa2
                    ? "bg-purple-950/70 border-l-4 border-l-purple-500"
                    : "hover:bg-slate-900/60"
                }`}
              >
                <td className="p-2.5 font-bold text-purple-400">#{idx + 1}</td>
                <td className="p-2.5 font-bold text-white font-sans">{c.moa1}</td>
                <td className="p-2.5 font-bold text-emerald-400 font-sans flex items-center gap-1">
                  <span>{c.moa2}</span>
                  {idx === 0 ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  ) : null}
                </td>
                <td className="p-2.5 font-bold text-white">{c.compositeAiScore.toFixed(2)}</td>
                <td className="p-2.5 font-bold text-blue-400">
                  {c.sabIntact ? c.sabIntact.toFixed(2) : "0.75"}
                </td>
                <td className="p-2.5 font-sans">
                  <Badge
                    variant={
                      c.toxicityRisk === "Low"
                        ? "success"
                        : c.toxicityRisk === "Moderate"
                        ? "warning"
                        : "destructive"
                    }
                    className="text-[10px]"
                  >
                    {c.toxicityRisk} Risk
                  </Badge>
                </td>
                <td className="p-2.5 font-sans text-slate-300 max-w-xs truncate text-[11px]">
                  {c.expectedResult}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Combo Detail Card */}
      {selectedCombo && (
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-white text-xs">
              Selected Combination:{" "}
              <span className="text-purple-400 font-mono">
                {selectedCombo.moa1} + {selectedCombo.moa2}
              </span>
            </span>
            <Badge variant="success">SWAG1: {selectedCombo.swag1} • SWAG2: {selectedCombo.swag2}</Badge>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {selectedCombo.expectedResult}
          </p>
        </div>
      )}
    </div>
  );
}
