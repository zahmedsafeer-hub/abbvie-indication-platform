"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock,
  Layers,
  MessageSquare,
  Plus,
  RotateCw,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  Wrench,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
  SessionChatResponse,
} from "@/types/platform";

export default function SessionManagerPage() {
  const [sessions, setSessions] = useState<ThreadSessionData[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>("thread_demo_1");
  const [activeSession, setActiveSession] = useState<ThreadSessionData | null>(null);
  const [inputMsg, setInputMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [lastResponse, setLastResponse] = useState<SessionChatResponse | null>(null);

  const loadSessions = async () => {
    try {
      const list = await listThreadSessions();
      if (list.length === 0) {
        const s1 = await createThreadSession("thread_demo_1", "Thread 1 - γδ17 Troubleshooting");
        const s2 = await createThreadSession("thread_demo_2", "Thread 2 - IL6 Target Dossier");
        setSessions([s1, s2]);
        setActiveThreadId(s1.threadId);
        setActiveSession(s1);
      } else {
        setSessions(list);
        if (!activeSession) {
          setActiveThreadId(list[0].threadId);
          setActiveSession(list[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectSession = async (tid: string) => {
    setActiveThreadId(tid);
    try {
      const sess = await fetchThreadSession(tid);
      setActiveSession(sess);
      setLastResponse(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateNewSession = async () => {
    const newId = `thread_${Date.now().toString().slice(-6)}`;
    const title = `Thread ${sessions.length + 1} - Scientific Session`;
    const created = await createThreadSession(newId, title);
    setSessions([created, ...sessions]);
    setActiveThreadId(created.threadId);
    setActiveSession(created);
    setLastResponse(null);
  };

  const handleDeleteSession = async (tid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteThreadSession(tid);
    const updated = sessions.filter((s) => s.threadId !== tid);
    setSessions(updated);
    if (activeThreadId === tid && updated.length > 0) {
      selectSession(updated[0].threadId);
    }
  };

  const handleSendMessage = async (msg: string) => {
    if (!msg.trim() || !activeThreadId) return;
    setInputMsg("");
    setLoading(true);

    try {
      const res = await postThreadChatMessage(activeThreadId, msg);
      setLastResponse(res);

      // Refresh session
      const updated = await fetchThreadSession(activeThreadId);
      setActiveSession(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
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
              <span>Per-Thread State & Bounded Clarification Manager</span>
              <Badge variant="purple">SQLite Isolation</Badge>
            </h1>
            <p className="text-xs text-slate-400">
              Max 2-round clarification loops, "I don't know" pivot logic, and 100% session context isolation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleCreateNewSession} size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>New Isolated Thread</span>
          </Button>
          <Badge variant="success">Max 2-Turn Bound</Badge>
        </div>
      </div>

      {/* Main Split Grid: Left Sidebar Sessions | Center Chat | Right QC Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT 3 COLUMNS: SESSIONS LIST */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Isolated Sessions ({sessions.length})
            </span>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto custom-scroll">
            {sessions.map((s) => (
              <div
                key={s.threadId}
                onClick={() => selectSession(s.threadId)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between space-y-1.5 ${
                  activeThreadId === s.threadId
                    ? "bg-blue-950/60 border-blue-500 shadow-md shadow-blue-500/10"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-blue-400 font-bold">
                    {s.threadId}
                  </span>
                  <button
                    onClick={(e) => handleDeleteSession(s.threadId, e)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="font-semibold text-white text-xs leading-snug truncate">
                  {s.title}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{s.history.length} turns</span>
                  <Badge variant={s.clarificationCount > 0 ? "warning" : "secondary"}>
                    Clarif: {s.clarificationCount}/2
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER 6 COLUMNS: ISOLATED CHAT STREAM */}
        <div className="lg:col-span-6 space-y-3">
          <Card className="border-slate-800 bg-slate-900/90 shadow-2xl flex flex-col h-[560px]">
            <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>{activeSession?.title || "Active Session"}</span>
                </CardTitle>
                <CardDescription className="text-[10px] font-mono text-slate-400">
                  Strict Context Isolation: Zero bleeding into other sessions
                </CardDescription>
              </div>

              {activeSession && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">Loop State:</span>
                  <Badge
                    variant={
                      activeSession.clarificationCount === 0
                        ? "success"
                        : activeSession.clarificationCount === 1
                        ? "warning"
                        : "destructive"
                    }
                  >
                    Round {activeSession.clarificationCount} of 2
                  </Badge>
                </div>
              )}
            </CardHeader>

            {/* Chat Stream Body */}
            <CardContent className="flex-1 p-4 overflow-y-auto custom-scroll space-y-3">
              {activeSession?.history && activeSession.history.length > 0 ? (
                activeSession.history.map((turn, i) => (
                  <div
                    key={i}
                    className={`flex flex-col space-y-1 ${
                      turn.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                      {turn.role === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-emerald-400" />}
                      <span className="capitalize">{turn.role}</span>
                      {turn.isClarification && (
                        <span className="text-amber-400 bg-amber-950/60 px-1 rounded border border-amber-800/40">Clarification Q</span>
                      )}
                      {turn.isPivot && (
                        <span className="text-purple-400 bg-purple-950/60 px-1 rounded border border-purple-800/40">QC Pivot</span>
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-xl text-xs max-w-[85%] whitespace-pre-wrap leading-relaxed ${
                        turn.role === "user"
                          ? "bg-blue-600 text-white rounded-br-none shadow"
                          : "bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-inner"
                      }`}
                    >
                      {turn.content}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-2 text-slate-500 text-xs">
                  <Bot className="w-8 h-8 text-slate-600" />
                  <p>This is a fresh, isolated scientific session.</p>
                  <p className="text-[10px] text-slate-600">Send an inquiry or test the clarification loop buttons below.</p>
                </div>
              )}
            </CardContent>

            {/* Interactive Bottom Input & Preset Fast Action Buttons */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/90 rounded-b-2xl space-y-2">
              {/* Quick Action Pill Buttons */}
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <button
                  onClick={() => handleSendMessage("The test failed")}
                  className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                >
                  "The test failed" (Vague)
                </button>
                <button
                  onClick={() => handleSendMessage("it gave an error")}
                  className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                >
                  "it gave an error" (Vague 2)
                </button>
                <button
                  onClick={() => handleSendMessage("I don't know")}
                  className="px-2 py-1 rounded bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 border border-amber-800/40 font-bold transition-colors"
                >
                  "I don't know" (Pivot Trigger)
                </button>
                <button
                  onClick={() => handleSendMessage("What is TYK2 in the ARCH pipeline?")}
                  className="px-2 py-1 rounded bg-blue-950/80 hover:bg-blue-900/80 text-blue-300 border border-blue-800/40 transition-colors"
                >
                  "What is TYK2?" (Factual)
                </button>
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputMsg)}
                  placeholder="Type message or reply..."
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Button
                  onClick={() => handleSendMessage(inputMsg)}
                  disabled={loading || !inputMsg.trim()}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-xs px-3"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT 3 COLUMNS: QC DIAGNOSTICS & PIVOT INSPECTOR */}
        <div className="lg:col-span-3 space-y-3">
          <Card className="border-slate-800 bg-slate-900/90 shadow-2xl h-[560px] flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-xs font-bold text-white flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-purple-400" />
                <span>Pivot & QC Inspector</span>
              </CardTitle>
              <CardDescription className="text-[10px] text-slate-400">
                Actionable checks generated upon 2-turn limit or "I don't know"
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 p-3.5 overflow-y-auto custom-scroll space-y-3 text-xs">
              {lastResponse?.isPivot ? (
                <div className="space-y-3">
                  <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/30 space-y-1">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                      ● Active Pivot Triggered
                    </span>
                    <p className="text-[11px] text-slate-200 leading-snug">
                      Clarification loop resolved with best-effort synthesis & QC checks.
                    </p>
                  </div>

                  {lastResponse.assumptions.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="font-bold text-slate-300 text-[11px] uppercase">Explicit Assumptions:</span>
                      <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[10px] text-slate-300">
                        {lastResponse.assumptions.map((a, idx) => (
                          <p key={idx}>• {a}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {lastResponse.qcSuggestions.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="font-bold text-slate-300 text-[11px] uppercase">Actionable QC Checks:</span>
                      <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[10px] text-slate-300">
                        {lastResponse.qcSuggestions.map((qc, idx) => (
                          <p key={idx} className="leading-tight">{qc}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 text-slate-400 text-xs">
                  <p className="text-[11px] leading-relaxed">
                    When a scientific query is ambiguous, the system allows up to <strong>2 clarification rounds</strong>.
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    If the user replies <em>"I don't know"</em> or the 2-round cap is reached, the agent will pivot directly to:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[10px] text-slate-300">
                    <li>Best-effort grounded answer</li>
                    <li>Explicit stated assumptions</li>
                    <li>Spectrophotometer / cytometer laser calibration check</li>
                    <li>Buffer pH 7.4 & viability verification</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
