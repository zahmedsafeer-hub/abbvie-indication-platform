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
    <div className="space-y-3 bg-white dark:bg-slate-950 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
              Clinical Pipeline Intelligence
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              AbbVie Clinical Trial Assets & Competitive Intelligence
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            12 clinical trial assets across SLE and Autoimmune Indications
          </p>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search study, drug, phase..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500 w-48 sm:w-60"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800/80">
        <table className="w-full text-left text-xs border-collapse font-sans">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 font-mono text-[10px] uppercase">
              <th className="p-2.5 font-bold">Study #</th>
              <th className="p-2.5">Compound / Asset</th>
              <th className="p-2.5">Phase</th>
              <th className="p-2.5">Primary Indication</th>
              <th className="p-2.5">Dose & Route</th>
              <th className="p-2.5 text-center">NCT Identifier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {filtered.map((t) => {
              const isSelected = selectedTrial?.studyNumber === t.studyNumber;
              const isFeatured = t.studyNumber === "M19-130";
              return (
                <tr
                  key={t.studyNumber}
                  onClick={() => handleRowClick(t)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-purple-50/80 dark:bg-purple-600/15 text-slate-900 dark:text-white font-medium"
                      : "hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <td className="p-2.5 font-mono font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
                    {isFeatured && <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                    <span>{t.studyNumber}</span>
                  </td>
                  <td className="p-2.5">
                    <span className="font-bold text-slate-900 dark:text-white">{t.drugName || t.compound}</span>
                    {t.drugName && t.compound && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">({t.compound})</span>
                    )}
                  </td>
                  <td className="p-2.5">
                    <Badge variant={t.phase.includes("Phase 2") ? "purple" : "outline"}>
                      {t.phase}
                    </Badge>
                  </td>
                  <td className="p-2.5 text-slate-600 dark:text-slate-400">{t.indication}</td>
                  <td className="p-2.5 font-mono text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs">{t.studyTitle}</td>
                  <td className="p-2.5 text-center font-mono text-[10px] text-blue-600 dark:text-blue-400">
                    <a href={t.registryUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center justify-center gap-1">
                      <span>View</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Featured Dossier Indicator */}
      {selectedTrial && (
        <div className="p-3 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-slate-800 dark:text-slate-200">
              Active Dossier: <strong className="text-purple-700 dark:text-purple-300">{selectedTrial.studyNumber}</strong> ({selectedTrial.compound}) - {selectedTrial.phase}
            </span>
          </div>
          <span className="font-mono text-[10px] text-purple-700 dark:text-purple-300 truncate max-w-xs">
            {selectedTrial.registryUrl}
          </span>
        </div>
      )}
    </div>
  );
}
