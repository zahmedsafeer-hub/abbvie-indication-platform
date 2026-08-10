"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  Bot,
  ExternalLink,
  FileText,
  FlaskConical,
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
import { PromptHardenerModal } from "@/components/widgets/PromptHardenerModal";
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
  const [isHardenerModalOpen, setIsHardenerModalOpen] = useState(false);
  const [hardenerInitialQuery, setHardenerInitialQuery] = useState("");
  const [activeCitation, setActiveCitation] = useState<CitationItem | null>(null);

  const [activeWidget, setActiveWidget] = useState<
    "none" | "moa" | "trials" | "combos" | "risk" | "scatter3d" | "pathway"
  >("none");

  const [sessions, setSessions] = useState<ThreadSessionData[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>("thread_main_1");
  const [activeSession, setActiveSession] = useState<ThreadSessionData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [viewMode, setViewMode] = useState<"both" | "chat_only" | "widget_only">("both");
  const chatEndRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

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
          "IL-6 Combination Synergy Analysis"
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
      scrollToBottom();
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
    scrollToBottom();
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
    } else if (lower.includes("moa") || lower.includes("target ranking") || lower.includes("prioritization")) {
      setActiveWidget("moa");
    } else if (lower.includes("trial") || lower.includes("m19-130") || lower.includes("dossier") || lower.includes("abbv-599")) {
      setActiveWidget("trials");
    } else if (lower.includes("risk") || lower.includes("toxicology") || lower.includes("safety")) {
      setActiveWidget("risk");
    } else if (lower.includes("combo") || lower.includes("combination") || lower.includes("synergy")) {
      setActiveWidget("combos");
    }

    setLoading(true);
    scrollToBottom();
    try {
      const res = await postThreadChatMessage(activeThreadId, text);
      const updated = await fetchThreadSession(activeThreadId);
      setActiveSession(updated);

      if (res.citations && res.citations.length > 0) {
        setActiveCitation(res.citations[0]);
      }
      scrollToBottom();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleCitationClick = (citation: CitationItem) => {
    setActiveCitation(citation);
    setIsRightDrawerOpen(true);
  };

  const handleOpenHardener = (queryText?: string) => {
    setHardenerInitialQuery(queryText || "");
    setIsHardenerModalOpen(true);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* 1. Executive Top Header */}
      <Header
        selectedIndication={selectedIndication}
        onSelectIndication={setSelectedIndication}
        onToggleLeftDrawer={() => setIsLeftDrawerOpen(!isLeftDrawerOpen)}
        onToggleRightDrawer={() => setIsRightDrawerOpen(!isRightDrawerOpen)}
        onOpenHardenerModal={() => handleOpenHardener()}
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

      {/* 4. Scientific Prompt Hardener Modal */}
      <PromptHardenerModal
        isOpen={isHardenerModalOpen}
        onClose={() => setIsHardenerModalOpen(false)}
        initialQuery={hardenerInitialQuery}
        onApplyHardenedPrompt={(hardened) => handleSendMessage(hardened)}
      />

      {/* 5. Main Executive Chat & Scientific Discovery Stream */}
      <main className="flex-1 flex flex-col justify-between max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6 pb-32">
        
        {/* Active Session Info Ribbon & Widget Fast Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white dark:bg-slate-900/80 p-3.5 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs shadow-md dark:shadow-xl backdrop-blur-sm transition-colors duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-900 dark:text-white">
              {activeSession?.title || "Active Scientific Workspace"}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              ({activeThreadId})
            </span>
          </div>

          {/* Quick Semantic Widget Toggles */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            <button
              onClick={() => setActiveWidget(activeWidget === "scatter3d" ? "none" : "scatter3d")}
              className={`px-2.5 py-1 rounded-xl border font-mono transition-all ${
                activeWidget === "scatter3d"
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
              }`}
            >
              3D Synergy Space
            </button>
            <button
              onClick={() => setActiveWidget(activeWidget === "pathway" ? "none" : "pathway")}
              className={`px-2.5 py-1 rounded-xl border font-mono transition-all ${
                activeWidget === "pathway"
                  ? "bg-pink-600 text-white border-pink-500 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
              }`}
            >
              Signaling Cascade
            </button>
            <button
              onClick={() => setActiveWidget(activeWidget === "moa" ? "none" : "moa")}
              className={`px-2.5 py-1 rounded-xl border font-mono transition-all ${
                activeWidget === "moa"
                  ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
              }`}
            >
              Target Prioritization
            </button>
            <button
              onClick={() => setActiveWidget(activeWidget === "trials" ? "none" : "trials")}
              className={`px-2.5 py-1 rounded-xl border font-mono transition-all ${
                activeWidget === "trials"
                  ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
              }`}
            >
              Clinical Assets (ABBV-599)
            </button>
            <button
              onClick={() => setActiveWidget(activeWidget === "combos" ? "none" : "combos")}
              className={`px-2.5 py-1 rounded-xl border font-mono transition-all ${
                activeWidget === "combos"
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
              }`}
            >
              Combination Pairs (IL-6)
            </button>
            <button
              onClick={() => setActiveWidget(activeWidget === "risk" ? "none" : "risk")}
              className={`px-2.5 py-1 rounded-xl border font-mono transition-all ${
                activeWidget === "risk"
                  ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
              }`}
            >
              Toxicological Risk Matrix
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
                    <User className="w-3 h-3 text-blue-500" />
                  ) : (
                    <Bot className="w-3 h-3 text-emerald-500" />
                  )}
                  <span className="capitalize font-bold text-slate-700 dark:text-slate-300">{turn.role}</span>
                  {turn.intent && (
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-900 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-800 font-sans text-slate-600 dark:text-slate-400">
                      {turn.intent}
                    </span>
                  )}
                </div>

                <div
                  className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed max-w-[90%] whitespace-pre-wrap ${
                    turn.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-600/15"
                      : "bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-xl"
                  }`}
                >
                  {turn.content}

                  {/* Render Citation Pills */}
                  {turn.citations && turn.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                        Sources:
                      </span>
                      {turn.citations.map((c, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => handleCitationClick(c)}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 text-[10px] font-mono font-bold transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-3 h-3 text-blue-500" />
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
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-3xl bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-500/30 shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  AbbVie Indication Knowledge Platform
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                  Multi-omics target prioritization, competitive clinical intelligence, computational combination synergy, and scientific prompt hardening.
                </p>
              </div>

              {/* Sample Guided Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left text-xs pt-2">
                <button
                  onClick={() =>
                    handleSendMessage("What are the top prioritized ARCH targets in SLE?")
                  }
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/70 hover:bg-blue-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-blue-500/40 transition-all space-y-1"
                >
                  <span className="font-bold text-blue-600 dark:text-blue-400 block font-mono text-[10px] uppercase">
                    1. Target Prioritization
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 text-[11px] block">
                    &quot;What are the top prioritized ARCH targets in SLE?&quot;
                  </span>
                </button>
                <button
                  onClick={() =>
                    handleSendMessage(
                      "What were the SRI-4 and BICLA response rates in M19-130 for ABBV-599?"
                    )
                  }
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/70 hover:bg-purple-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 hover:border-purple-300 dark:hover:border-purple-500/40 transition-all space-y-1"
                >
                  <span className="font-bold text-purple-600 dark:text-purple-400 block font-mono text-[10px] uppercase">
                    2. Clinical Pipeline
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 text-[11px] block">
                    &quot;What were the SRI-4 response rates in M19-130 for ABBV-599?&quot;
                  </span>
                </button>
                <button
                  onClick={() =>
                    handleSendMessage(
                      "What is the sAB Intact synergy score for IL6 combined with TNFSF13B (BAFF)?"
                    )
                  }
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/70 hover:bg-emerald-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all space-y-1"
                >
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block font-mono text-[10px] uppercase">
                    3. Combination Synergy
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 text-[11px] block">
                    &quot;What is the sAB synergy score for IL6 combined with TNFSF13B?&quot;
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Real-time Assistant Generating Indicator */}
          {loading && (
            <div className="flex flex-col items-start space-y-1.5 animate-pulse">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-600 dark:text-blue-400">
                <Bot className="w-3.5 h-3.5 animate-spin" />
                <span>AbbVie AI Assistant synthesizing grounded answer from ARCH-v6.0 evidence...</span>
              </div>
              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-slate-600 dark:text-slate-400 text-xs italic shadow-md">
                Retrieving multi-omics target priors, clinical endpoints, and verified citations...
              </div>
            </div>
          )}

          {/* Anchor for Auto-Scroll */}
          <div ref={chatEndRef} />
        </div>

        {/* Bottom Floating OmniBar */}
        <div className="fixed bottom-4 left-0 right-0 z-30 pointer-events-auto">
          <OmniBar
            onSendMessage={handleSendMessage}
            onOpenDocModal={() => {
              // Open extractor page
              window.location.href = "/test-harness/extractor";
            }}
            onOpenHardenerModal={(curQuery) => handleOpenHardener(curQuery)}
            disabled={loading}
          />
        </div>
      </main>
    </div>
  );
}
