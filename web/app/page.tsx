"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  Bot,
  ExternalLink,
  FileText,
  HelpCircle,
  Layers,
  MessageSquare,
  Network,
  RotateCw,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  Wrench,
  Zap,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { OmniBar } from "@/components/layout/OmniBar";
import { ThreadHistoryDrawer } from "@/components/drawers/ThreadHistoryDrawer";
import { CitationSidePanel } from "@/components/drawers/CitationSidePanel";
import { MoaRankingTable } from "@/components/widgets/MoaRankingTable";
import { ClinicalTrialsTable } from "@/components/widgets/ClinicalTrialsTable";
import { DossierReportViewer } from "@/components/widgets/DossierReportViewer";
import { ComboRankTable } from "@/components/widgets/ComboRankTable";
import { RiskTable } from "@/components/widgets/RiskTable";
import { SabScatterPlot3D } from "@/components/widgets/SabScatterPlot3D";
import { PathwayMap } from "@/components/widgets/PathwayMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  createThreadSession,
  fetchThreadSession,
  postThreadChatMessage,
  deleteThreadSession,
  listThreadSessions,
} from "@/lib/api";
import {
  ThreadSessionData,
  ChatMessageTurn,
  CitationItem,
} from "@/types/platform";

export default function HomePage() {
  const [selectedIndication, setSelectedIndication] = useState("Systemic Lupus Erythematosus");
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [activeCitation, setActiveCitation] = useState<CitationItem | null>(null);

  const [activeWidget, setActiveWidget] = useState<
    "none" | "moa" | "trials" | "combos" | "risk" | "scatter3d" | "pathway"
  >("none");

  const [sessions, setSessions] = useState<ThreadSessionData[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>("thread_main_1");
  const [activeSession, setActiveSession] = useState<ThreadSessionData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadInitialData = async () => {
    try {
      const list = await listThreadSessions();
      if (list.length === 0) {
        const s1 = await createThreadSession(
          "thread_main_1",
          "SLE Target Prioritization & ARCH Analysis"
        );
        const s2 = await createThreadSession(
          "thread_main_2",
          "γδ17 T-Cell Screen & mTORC1/2 Validation"
        );
        const s3 = await createThreadSession(
          "thread_main_3",
          "IL-6 Combination Synergy (Slide 16)"
        );
        setSessions([s1, s2, s3]);
        setActiveThreadId(s1.threadId);
        setActiveSession(s1);
      } else {
        setSessions(list);
        setActiveThreadId(list[0].threadId);
        setActiveSession(list[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectThread = async (tid: string) => {
    setActiveThreadId(tid);
    try {
      const s = await fetchThreadSession(tid);
      setActiveSession(s);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateNewThread = async () => {
    const newId = `thread_${Date.now().toString().slice(-6)}`;
    const title = `New ${selectedIndication.slice(0, 3).toUpperCase()} Inquiry`;
    const created = await createThreadSession(newId, title);
    setSessions([created, ...sessions]);
    setActiveThreadId(created.threadId);
    setActiveSession(created);
    setActiveWidget("none");
  };

  const handleDeleteThread = async (tid: string) => {
    await deleteThreadSession(tid);
    const updated = sessions.filter((s) => s.threadId !== tid);
    setSessions(updated);
    if (activeThreadId === tid && updated.length > 0) {
      handleSelectThread(updated[0].threadId);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    const lower = text.toLowerCase();

    // Check for interactive widget trigger phrases
    if (lower.includes("scatter") || lower.includes("sab") || lower.includes("3d")) {
      setActiveWidget("scatter3d");
    } else if (lower.includes("pathway") || lower.includes("cascade") || lower.includes("signaling")) {
      setActiveWidget("pathway");
    } else if (lower.includes("moa") || lower.includes("target ranking") || lower.includes("slide 11")) {
      setActiveWidget("moa");
    } else if (lower.includes("trial") || lower.includes("m19-130") || lower.includes("dossier") || lower.includes("slide 12") || lower.includes("slide 13")) {
      setActiveWidget("trials");
    } else if (lower.includes("risk") || lower.includes("toxicology") || lower.includes("slide 18")) {
      setActiveWidget("risk");
    } else if (lower.includes("combo") || lower.includes("combination") || lower.includes("slide 16")) {
      setActiveWidget("combos");
    }

    setLoading(true);
    try {
      const res = await postThreadChatMessage(activeThreadId, text);
      const updated = await fetchThreadSession(activeThreadId);
      setActiveSession(updated);

      if (res.citations && res.citations.length > 0) {
        setActiveCitation(res.citations[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCitationClick = (citation: CitationItem) => {
    setActiveCitation(citation);
    setIsRightDrawerOpen(true);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* 1. Executive Top Header */}
      <Header
        selectedIndication={selectedIndication}
        onSelectIndication={setSelectedIndication}
        onToggleLeftDrawer={() => setIsLeftDrawerOpen(!isLeftDrawerOpen)}
        onToggleRightDrawer={() => setIsRightDrawerOpen(!isRightDrawerOpen)}
        isLeftOpen={isLeftDrawerOpen}
        isRightOpen={isRightDrawerOpen}
      />

      {/* 2. Left Searchable Thread History Drawer */}
      <ThreadHistoryDrawer
        isOpen={isLeftDrawerOpen}
        onClose={() => setIsLeftDrawerOpen(false)}
        sessions={sessions}
        activeThreadId={activeThreadId}
        onSelectThread={(tid) => {
          handleSelectThread(tid);
          setIsLeftDrawerOpen(false);
        }}
        onCreateNewThread={() => {
          handleCreateNewThread();
          setIsLeftDrawerOpen(false);
        }}
        onDeleteThread={handleDeleteThread}
      />

      {/* 3. Right Citation & Provenance Side-Panel */}
      <CitationSidePanel
        isOpen={isRightDrawerOpen}
        onClose={() => setIsRightDrawerOpen(false)}
        citation={activeCitation}
      />

      {/* 4. Main Executive Chat & Inquiry Stream */}
      <main className="flex-1 flex flex-col justify-between max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6 pb-28">
        
        {/* Active Session Info Ribbon & Widget Fast Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 text-xs backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-bold text-white">
              {activeSession?.title || "Active Scientific Workspace"}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              ({activeThreadId})
            </span>
          </div>

          {/* Quick Widget Toggles */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            <button
              onClick={() => setActiveWidget(activeWidget === "scatter3d" ? "none" : "scatter3d")}
              className={`px-2 py-1 rounded-lg border font-mono transition-colors ${
                activeWidget === "scatter3d"
                  ? "bg-indigo-600 text-white border-indigo-500"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
              }`}
            >
              Slide 17 (3D sAB)
            </button>
            <button
              onClick={() => setActiveWidget(activeWidget === "pathway" ? "none" : "pathway")}
              className={`px-2 py-1 rounded-lg border font-mono transition-colors ${
                activeWidget === "pathway"
                  ? "bg-pink-600 text-white border-pink-500"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
              }`}
            >
              Slide 19 (Pathway)
            </button>
            <button
              onClick={() => setActiveWidget(activeWidget === "moa" ? "none" : "moa")}
              className={`px-2 py-1 rounded-lg border font-mono transition-colors ${
                activeWidget === "moa"
                  ? "bg-blue-600 text-white border-blue-500"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
              }`}
            >
              Slide 11 (MOA)
            </button>
            <button
              onClick={() => setActiveWidget(activeWidget === "trials" ? "none" : "trials")}
              className={`px-2 py-1 rounded-lg border font-mono transition-colors ${
                activeWidget === "trials"
                  ? "bg-purple-600 text-white border-purple-500"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
              }`}
            >
              Slides 12-15 (Trials)
            </button>
            <button
              onClick={() => setActiveWidget(activeWidget === "combos" ? "none" : "combos")}
              className={`px-2 py-1 rounded-lg border font-mono transition-colors ${
                activeWidget === "combos"
                  ? "bg-emerald-600 text-white border-emerald-500"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
              }`}
            >
              Slide 16 (Combos)
            </button>
            <button
              onClick={() => setActiveWidget(activeWidget === "risk" ? "none" : "risk")}
              className={`px-2 py-1 rounded-lg border font-mono transition-colors ${
                activeWidget === "risk"
                  ? "bg-amber-600 text-white border-amber-500"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
              }`}
            >
              Slide 18 (Risk)
            </button>
          </div>
        </div>

        {/* ACTIVE EMBEDDED WIDGET CONTAINER */}
        {activeWidget !== "none" && (
          <div className="animate-in fade-in zoom-in duration-300">
            {activeWidget === "scatter3d" && <SabScatterPlot3D />}
            {activeWidget === "pathway" && <PathwayMap />}
            {activeWidget === "moa" && <MoaRankingTable />}
            {activeWidget === "trials" && (
              <div className="space-y-4">
                <ClinicalTrialsTable />
                <DossierReportViewer />
              </div>
            )}
            {activeWidget === "combos" && <ComboRankTable />}
            {activeWidget === "risk" && <RiskTable />}
          </div>
        )}

        {/* Conversation Stream */}
        <div className="flex-1 space-y-4">
          {activeSession?.history && activeSession.history.length > 0 ? (
            activeSession.history.map((turn, idx) => (
              <div
                key={idx}
                className={`flex flex-col space-y-1.5 ${
                  turn.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  {turn.role === "user" ? (
                    <User className="w-3 h-3 text-blue-400" />
                  ) : (
                    <Bot className="w-3 h-3 text-emerald-400" />
                  )}
                  <span className="capitalize">{turn.role}</span>
                  {turn.intent && (
                    <span className="text-[9px] bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800 font-sans">
                      {turn.intent}
                    </span>
                  )}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[90%] whitespace-pre-wrap ${
                    turn.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-600/10"
                      : "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-xl"
                  }`}
                >
                  {turn.content}

                  {/* Render Citation Pills */}
                  {turn.citations && turn.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                        Sources:
                      </span>
                      {turn.citations.map((c, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => handleCitationClick(c)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-950/80 hover:bg-blue-900 text-blue-400 border border-blue-800/40 text-[10px] font-mono font-bold transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-3 h-3 text-blue-400" />
                          <span>{c.citationTag}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            /* Welcome Hero Box */
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 text-center space-y-3 shadow-2xl">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                AbbVie Indication Knowledge Platform
              </h2>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Explore ARCH Target MOAs (Slide 11), Clinical Trials (Slides 12-15), 3D sAB Intact Scatter Plot (Slide 17), Multi-Axis Pathway Map (Slide 19), and the γδ17 T-cell / IL-23 preclinical screen.
              </p>

              {/* Sample Quick Starter Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl mx-auto pt-2 text-left text-xs">
                <button
                  onClick={() => handleSendMessage("Show me sAB scatter plot")}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-indigo-500 transition-colors space-y-0.5"
                >
                  <p className="font-bold text-white text-xs">"Show me sAB scatter plot"</p>
                  <p className="text-[10px] text-indigo-400">Slide 17: Interactive 3D AI Score vs sAB</p>
                </button>
                <button
                  onClick={() => handleSendMessage("Show pathway map")}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-pink-500 transition-colors space-y-0.5"
                >
                  <p className="font-bold text-white text-xs">"Show pathway map"</p>
                  <p className="text-[10px] text-pink-400">Slide 19: IL6, TNFSF13B & IL-23/mTORC1</p>
                </button>
                <button
                  onClick={() => handleSendMessage("What are the MOA rankings for SLE?")}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-blue-500 transition-colors space-y-0.5"
                >
                  <p className="font-bold text-white text-xs">"What are the MOA rankings for SLE?"</p>
                  <p className="text-[10px] text-blue-400">Slide 11: Top 8 ARCH Target Prioritization</p>
                </button>
                <button
                  onClick={() => handleSendMessage("Show clinical trial M19-130 dossier")}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-purple-500 transition-colors space-y-0.5"
                >
                  <p className="font-bold text-white text-xs">"Show clinical trial M19-130 dossier"</p>
                  <p className="text-[10px] text-purple-400">Slide 13: ABBV-599 Phase 2 SRI-4 endpoints</p>
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-3 bg-slate-900/50 rounded-xl border border-slate-800 animate-pulse">
              <RotateCw className="w-4 h-4 animate-spin text-blue-400" />
              <span>Retrieving grounded evidence from ARCH repository & Slide 22 ELN...</span>
            </div>
          )}
        </div>
      </main>

      {/* 5. Floating Omni-Bar */}
      <div className="fixed bottom-4 inset-x-0 z-30 pointer-events-auto">
        <OmniBar
          onSendMessage={handleSendMessage}
          onOpenDocModal={() => window.location.assign("/test-harness/extractor")}
          disabled={loading}
        />
      </div>
    </div>
  );
}
