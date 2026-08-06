"use client";

import React, { useState } from "react";
import { Activity, ExternalLink, Filter, Search, Sparkles, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ClinicalTrial } from "@/types/platform";
import { MOCK_DATABASE } from "@/lib/mock-data";

interface ClinicalTrialsTableProps {
  trials?: ClinicalTrial[];
  onSelectTrial?: (trial: ClinicalTrial) => void;
}

export function ClinicalTrialsTable({
  trials = MOCK_DATABASE.clinicalTrials,
  onSelectTrial,
}: ClinicalTrialsTableProps) {
  const [search, setSearch] = useState("");
  const [selectedTrial, setSelectedTrial] = useState<ClinicalTrial | null>(
    trials.find((t) => t.studyNumber === "M19-130") || trials[0] || null
  );

  const filtered = trials.filter((t) => {
    const s = search.toLowerCase();
    return (
      (t.studyNumber && t.studyNumber.toLowerCase().includes(s)) ||
      (t.compound && t.compound.toLowerCase().includes(s)) ||
      (t.drugName && t.drugName.toLowerCase().includes(s)) ||
      (t.phase && t.phase.toLowerCase().includes(s)) ||
      (t.indication && t.indication.toLowerCase().includes(s))
    );
  });

  const handleRowClick = (trial: ClinicalTrial) => {
    setSelectedTrial(trial);
    if (onSelectTrial) onSelectTrial(trial);
  };

  return (
    <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Slides 12-15
            </span>
            <h3 className="text-sm font-bold text-white">
              AbbVie Clinical Trials & Competitive Intelligence Registry
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            12 clinical trial assets across SLE and Autoimmune Indications
          </p>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search study number or compound..."
            className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Trials Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-200">
          <thead className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
            <tr>
              <th className="p-2.5">Study Number</th>
              <th className="p-2.5">Phase</th>
              <th className="p-2.5">Compound / Drug</th>
              <th className="p-2.5">Indication</th>
              <th className="p-2.5">Start Year</th>
              <th className="p-2.5">Bottom Line</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
            {filtered.map((t) => (
              <tr
                key={t.studyNumber}
                onClick={() => handleRowClick(t)}
                className={`cursor-pointer transition-colors ${
                  selectedTrial?.studyNumber === t.studyNumber
                    ? "bg-purple-950/70 border-l-4 border-l-purple-500"
                    : "hover:bg-slate-900/60"
                }`}
              >
                <td className="p-2.5 font-bold text-purple-400 font-sans flex items-center gap-1.5">
                  <span>{t.studyNumber}</span>
                  {t.studyNumber === "M19-130" ? (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[9px]">
                      Featured
                    </span>
                  ) : null}
                </td>
                <td className="p-2.5 text-slate-300 font-sans">
                  <Badge variant="outline" className="text-[10px]">{t.phase}</Badge>
                </td>
                <td className="p-2.5 font-semibold text-white font-sans">
                  {t.compound} {t.drugName ? `(${t.drugName})` : ""}
                </td>
                <td className="p-2.5 text-slate-400 text-[10px] font-sans">{t.indication}</td>
                <td className="p-2.5 text-blue-400">{t.startYear}</td>
                <td className="p-2.5 font-sans text-slate-300 text-[10px] max-w-xs truncate">
                  {t.bottomLine || t.mainFindings}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
