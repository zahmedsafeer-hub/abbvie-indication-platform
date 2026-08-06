"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock,
  ExternalLink,
  HelpCircle,
  Layers,
  MessageSquare,
  Network,
  Play,
  RotateCw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { classifyIntent, generateChatResponse } from "@/lib/api";
import {
  QueryIntentType,
  IntentClassificationResult,
  ChatGenerateResponse,
  CitationItem,
} from "@/types/platform";

export default function IntentClassifierPage() {
  const [query, setQuery] = useState<string>("What is mTORC1 in IL-23 signaling?");
  const [classification, setClassification] = useState<IntentClassificationResult | null>(null);
  const [chatResponse, setChatResponse] = useState<ChatGenerateResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [overrideIntent, setOverrideIntent] = useState<QueryIntentType | "AUTO">("AUTO");

  const samplePrompts = [
    {
      category: "DEFINITIONAL",
      prompt: "What is mTORC1 in IL-23 signaling?",
      desc: "2-4 sentence concise definition with zero protocol steps and source citation.",
    },
    {
      category: "PROTOCOL",
      prompt: "How do I run the imiquimod skin inflammation protocol?",
      desc: "Numbered SOP steps with exact dosages and endpoints directly from ELN.",
    },
    {
      category: "TROUBLESHOOTING",
      prompt: "My γδ17 T-cell assay readings are inconsistent",
      desc: "Diagnostic checklist + mandatory PI/lab-lead caveat.",
    },
    {
      category: "COMPARATIVE",
      prompt: "Compare oral vs topical administration of candidate inhibitors",
      desc: "Balanced evidence synthesis across IP, oral, and topical routes.",
    },
    {
      category: "OUT_OF_SCOPE",
      prompt: "What is the weather today in Boston?",
      desc: "Scope filter triggers rejection template for non-scientific queries.",
    },
  ];

  const handleTestPrompt = async (text: string) => {
    setQuery(text);
    setLoading(true);
    try {
      const cls = await classifyIntent(text);
      setClassification(cls);

      const gen = await generateChatResponse(
        text,
        overrideIntent === "AUTO" ? undefined : overrideIntent
      );
      setChatResponse(gen);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleTestPrompt("What is mTORC1 in IL-23 signaling?");
  }, []);

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
              <span>Intent Classifier & Scope Filter</span>
              <Badge variant="purple">Gemini 2.5 Flash / 1.5 Pro</Badge>
            </h1>
            <p className="text-xs text-slate-400">
              4-Category intent routing with strict zero-hallucination citation enforcement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/test-harness/graph-3d">
            <Button variant="secondary" size="sm" className="text-xs gap-1.5">
              <Network className="w-3.5 h-3.5" />
              <span>3D Knowledge Graph</span>
            </Button>
          </Link>
          <Badge variant="success">&lt;300ms Classifier</Badge>
        </div>
      </div>

      {/* Preset Test Prompts Ribbon */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Preset Verification Inquiries:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {samplePrompts.map((item) => (
            <button
              key={item.category}
              onClick={() => handleTestPrompt(item.prompt)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-1.5 ${
                query === item.prompt
                  ? "bg-blue-950/60 border-blue-500 shadow-md shadow-blue-500/10"
                  : "bg-slate-950 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    item.category === "DEFINITIONAL"
                      ? "bg-blue-950 text-blue-400 border border-blue-800/40"
                      : item.category === "PROTOCOL"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40"
                      : item.category === "TROUBLESHOOTING"
                      ? "bg-amber-950 text-amber-400 border border-amber-800/40"
                      : item.category === "COMPARATIVE"
                      ? "bg-purple-950 text-purple-400 border border-purple-800/40"
                      : "bg-rose-950 text-rose-400 border border-rose-800/40"
                  }`}
                >
                  {item.category}
                </span>
                <Sparkles className="w-3 h-3 text-slate-500" />
              </div>
              <p className="font-semibold text-white text-xs leading-snug line-clamp-2">
                "{item.prompt}"
              </p>
              <p className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT 5 COLUMNS: INTENT CLASSIFICATION METRICS */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-slate-800 bg-slate-900/90 shadow-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>Scope Filter & Classifier State</span>
                </CardTitle>
                {classification && (
                  <Badge variant={classification.isInScope ? "success" : "destructive"}>
                    {classification.isInScope ? "In Scope" : "Out of Scope"}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              {/* Input Box */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-300">
                  Active Scientific Query:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTestPrompt(query)}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter scientific inquiry..."
                  />
                  <Button
                    onClick={() => handleTestPrompt(query)}
                    disabled={loading}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-xs px-3"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Classification Results */}
              {classification && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3 font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-slate-400 text-[11px]">Assigned Intent:</span>
                    <span className="font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 text-xs">
                      {classification.intent}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-[11px]">Confidence Score:</span>
                    <span className="font-bold text-blue-400">
                      {(classification.confidence * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-[11px]">Applied Template:</span>
                    <span className="text-purple-300 text-[10px]">
                      {classification.suggestedTemplate}
                    </span>
                  </div>

                  <div className="space-y-1 pt-1 text-[10px] text-slate-300 font-sans">
                    <span className="font-semibold text-slate-400 block font-mono">Rationale:</span>
                    <p className="bg-slate-900/80 p-2 rounded border border-slate-800/80 text-slate-300 leading-relaxed">
                      {classification.rationale}
                    </p>
                  </div>
                </div>
              )}

              {/* Citations List */}
              {chatResponse && chatResponse.citations.length > 0 && (
                <div className="space-y-2">
                  <span className="font-semibold text-slate-300 text-xs flex items-center justify-between">
                    <span>Verified Source Citations:</span>
                    <Badge variant="outline">{chatResponse.citations.length} Grounded Sources</Badge>
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scroll">
                    {chatResponse.citations.map((c, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-[11px]"
                      >
                        <div className="flex items-center justify-between font-mono">
                          <span className="text-blue-400 font-bold">{c.citationTag}</span>
                          <span className="text-slate-500 text-[10px]">Page {c.page}</span>
                        </div>
                        <p className="text-slate-400 text-[10px] italic">"{c.snippet}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT 7 COLUMNS: STRUCTURED CHAT GENERATION RESPONSE */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-slate-800 bg-slate-900/90 shadow-2xl flex flex-col min-h-[500px]">
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <CardTitle className="text-sm font-bold text-white">
                    Grounded Response (Zero-Hallucination Verified)
                  </CardTitle>
                </div>
                {chatResponse && (
                  <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{chatResponse.latencyMs} ms</span>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-5 space-y-4 text-xs overflow-y-auto custom-scroll">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-2 text-slate-400">
                  <RotateCw className="w-6 h-6 animate-spin text-blue-500" />
                  <p className="text-xs">Classifying intent and retrieving grounded evidence...</p>
                </div>
              ) : chatResponse ? (
                <div className="space-y-4 leading-relaxed text-slate-200">
                  <div className="prose prose-invert max-w-none text-xs space-y-3 whitespace-pre-wrap">
                    {chatResponse.response}
                  </div>

                  {chatResponse.sources.length > 0 && (
                    <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2 text-[10px]">
                      <span className="text-slate-500 font-semibold uppercase">Source References:</span>
                      {chatResponse.sources.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/40 font-mono"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-500 italic">Select or enter a scientific inquiry to evaluate.</p>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
