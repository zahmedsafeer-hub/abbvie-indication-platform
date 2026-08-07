"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Copy,
  FlaskConical,
  HelpCircle,
  Lightbulb,
  Microscope,
  RotateCw,
  Scale,
  Send,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { hardenScientificPrompt } from "@/lib/api";
import { HardenedPromptResult, PitfallItem } from "@/types/platform";

interface PromptHardenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onApplyHardenedPrompt: (hardenedText: string) => void;
}

export function PromptHardenerModal({
  isOpen,
  onClose,
  initialQuery = "",
  onApplyHardenedPrompt,
}: PromptHardenerModalProps) {
  const [query, setQuery] = useState(initialQuery || "Evaluate TYK2 and mTORC1 inhibition in γδ17 T-cells");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HardenedPromptResult | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleHarden = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await hardenScientificPrompt(query);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.hardenedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (!result) return;
    onApplyHardenedPrompt(result.hardenedPrompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 text-white">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">
                  Scientific Prompt Hardener & Stress-Testing Suite
                </h3>
                <Badge variant="purple">PhD Principal Scientist Persona</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fortifies scientific research prompts with peer controls, pitfall mitigation, and counter-factual failure modes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scroll">
          
          {/* Query Input Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Input Draft Research Hypothesis / Scientific Prompt:</span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">Rigorous Peer Hardening</span>
            </label>
            <div className="flex gap-2">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={2}
                placeholder="e.g. Investigate IL-6 and BAFF combination synergy in SLE pathology..."
                className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none font-sans"
              />
              <Button
                onClick={handleHarden}
                disabled={loading || !query.trim()}
                className="px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs gap-2 flex-shrink-0 shadow-lg shadow-purple-600/20"
              >
                {loading ? <RotateCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Harden Prompt</span>
              </Button>
            </div>

            {/* Quick Scientific Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
              <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px] self-center">Scientific Benchmarks:</span>
              <button
                onClick={() => setQuery("Evaluate TYK2 and mTORC1 inhibition in γδ17 T-cells")}
                className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-purple-600 dark:text-purple-300 border border-slate-200 dark:border-slate-700"
              >
                γδ17 Kinase Screen
              </button>
              <button
                onClick={() => setQuery("Investigate IL-6 and BAFF combination synergy in SLE")}
                className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-300 border border-slate-200 dark:border-slate-700"
              >
                IL6 + BAFF Synergy
              </button>
              <button
                onClick={() => setQuery("Compare Upadacitinib and Elsubrutinib clinical efficacy in SLE")}
                className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-300 border border-slate-200 dark:border-slate-700"
              >
                ABBV-599 Trial Endpoints
              </button>
            </div>
          </div>

          {/* Hardening Analysis Output */}
          {result && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* 4-Step Pipeline Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* Step 1: Pitfall Analysis */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 font-mono">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Step 1: Pitfalls & Hallucination Traps</span>
                    </span>
                    <Badge variant="destructive">{result.pitfallAnalysis.length} Pitfalls Identified</Badge>
                  </div>
                  <div className="space-y-2">
                    {result.pitfallAnalysis.map((p, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                        <div className="flex justify-between items-center text-[11px] font-bold text-slate-900 dark:text-slate-200">
                          <span>{p.pitfall}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono">
                            {p.riskLevel}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400">
                          <strong>Mitigation:</strong> {p.mitigation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 2: Peer Contextualization & Required Controls */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 font-mono">
                      <Microscope className="w-4 h-4" />
                      <span>Step 2: Peer Context & Mandatory Controls</span>
                    </span>
                    <Badge variant="blue">Gold Standards</Badge>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                    {result.peerContextualization}
                  </p>
                  <div className="space-y-1.5 pt-1 text-[10px] font-mono">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>(+) Positive Control:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-sans">{result.positiveControlDemanded}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between text-amber-600 dark:text-amber-400">
                      <span>(-) Negative Control:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-sans">{result.negativeControlDemanded}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: The Hardened Prompt (Reconstruction) */}
              <div className="p-4.5 rounded-2xl bg-gradient-to-b from-purple-500/10 to-indigo-500/10 border border-purple-300 dark:border-purple-800/60 space-y-3">
                <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-800/40 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="font-bold text-purple-900 dark:text-purple-300 text-xs uppercase font-mono">
                      Step 3: Reconstructed Hardened Prompt
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopy}
                      className="text-xs h-7 gap-1 px-2 text-purple-700 dark:text-purple-300"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? "Copied!" : "Copy"}</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleApply}
                      className="text-xs h-7 gap-1 px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold"
                    >
                      <Send className="w-3 h-3" />
                      <span>Apply to OmniBar</span>
                    </Button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono leading-relaxed whitespace-pre-wrap select-text">
                  {result.hardenedPrompt}
                </div>

                {/* Step 4: Justification */}
                <div className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                  <strong>PhD Justification:</strong> {result.scientificJustification}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex justify-between items-center text-xs">
          <span className="text-slate-400 font-mono text-[10px]">
            AbbVie Information Research • Scientific Prompt Hardening Framework
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

      </div>
    </div>
  );
}
