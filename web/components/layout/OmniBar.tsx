"use client";

import React, { useState } from "react";
import {
  ArrowUp,
  Camera,
  FileUp,
  Mic,
  MicOff,
  Paperclip,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface OmniBarProps {
  onSendMessage: (text: string) => void;
  onOpenDocModal?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function OmniBar({
  onSendMessage,
  onOpenDocModal,
  disabled,
  placeholder,
}: OmniBarProps) {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const toggleMic = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate speech-to-text placeholder prompt
      setInput("What are the combination synergy scores for IL6 and TNFSF13B?");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-1.5 shadow-2xl focus-within:border-blue-500/70 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
      >
        {/* Document / Camera Upload Button */}
        <button
          type="button"
          onClick={onOpenDocModal}
          className="p-2 rounded-xl text-slate-400 hover:text-purple-400 hover:bg-slate-800 transition-colors"
          title="Upload Document / Launch LangExtract Parser"
        >
          <FileUp className="w-4 h-4" />
        </button>

        {/* Microphone Button */}
        <button
          type="button"
          onClick={toggleMic}
          className={`p-2 rounded-xl transition-colors ${
            isRecording
              ? "text-rose-400 bg-rose-950/60 border border-rose-800/40 animate-pulse"
              : "text-slate-400 hover:text-blue-400 hover:bg-slate-800"
          }`}
          title="Voice Ingest / Dictation"
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Search / Inquiry Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder={
            placeholder ||
            "Ask me anything about ARCH targets, clinical trials, γδ17 screen, or MOA combinations..."
          }
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
        />

        {/* Send Button */}
        <Button
          type="submit"
          disabled={disabled || !input.trim()}
          size="sm"
          className="h-8 w-8 p-0 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-500/20 disabled:opacity-40"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
