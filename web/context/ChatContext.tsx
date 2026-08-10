"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { postThreadChatMessage, fetchThreadSession } from "@/lib/api";
import { ChatMessageTurn, CitationItem, QueryIntentType } from "@/types/platform";

interface ChatContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMinimized: boolean;
  setIsMinimized: (min: boolean) => void;
  messages: ChatMessageTurn[];
  activeCitation: CitationItem | null;
  setActiveCitation: (c: CitationItem | null) => void;
  isGenerating: boolean;
  currentLiveResponse: string;
  sendMessage: (query: string) => Promise<void>;
  activeThreadId: string;
  setActiveThreadId: (id: string) => void;
  clearHistory: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState("thread_main_1");
  const [messages, setMessages] = useState<ChatMessageTurn[]>([]);
  const [activeCitation, setActiveCitation] = useState<CitationItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLiveResponse, setCurrentLiveResponse] = useState("");

  // Load initial history on mount
  useEffect(() => {
    fetchThreadSession(activeThreadId)
      .then((session) => {
        if (session && session.history) {
          setMessages(session.history);
        }
      })
      .catch(() => {});
  }, [activeThreadId]);

  const clearHistory = () => {
    setMessages([]);
    setCurrentLiveResponse("");
  };

  const sendMessage = async (query: string) => {
    if (!query.trim()) return;
    const now = new Date().toISOString();

    const userTurn: ChatMessageTurn = {
      role: "user",
      content: query,
      timestamp: now,
    };

    setMessages((prev) => [...prev, userTurn]);
    setIsOpen(true);
    setIsMinimized(false);
    setIsGenerating(true);
    setCurrentLiveResponse("");

    try {
      const res = await postThreadChatMessage(activeThreadId, query);
      const fullResponse = res.response || "No response generated.";
      const citations = res.citations || [];
      const intent: QueryIntentType = res.intent || "DEFINITIONAL";

      // Live Typewriter Streaming Effect for clear, visible generation
      let currentIdx = 0;
      const step = Math.max(1, Math.floor(fullResponse.length / 30));
      
      await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          currentIdx += step;
          if (currentIdx >= fullResponse.length) {
            setCurrentLiveResponse(fullResponse);
            clearInterval(interval);
            resolve();
          } else {
            setCurrentLiveResponse(fullResponse.slice(0, currentIdx));
          }
        }, 15);
      });

      const asstTurn: ChatMessageTurn = {
        role: "assistant",
        content: fullResponse,
        intent,
        citations,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, asstTurn]);
      if (citations.length > 0) {
        setActiveCitation(citations[0]);
      }
    } catch (err) {
      console.error("Chat message error:", err);
      const errorTurn: ChatMessageTurn = {
        role: "assistant",
        content: "Error retrieving response from AbbVie Indication Knowledge Platform. Please ensure the backend is active.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorTurn]);
    } finally {
      setIsGenerating(false);
      setCurrentLiveResponse("");
    }
  };

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        setIsOpen,
        isMinimized,
        setIsMinimized,
        messages,
        activeCitation,
        setActiveCitation,
        isGenerating,
        currentLiveResponse,
        sendMessage,
        activeThreadId,
        setActiveThreadId,
        clearHistory,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useGlobalChat() {
  const context = useContext(ChatContext);
  if (!context) {
    return {
      isOpen: false,
      setIsOpen: () => {},
      isMinimized: false,
      setIsMinimized: () => {},
      messages: [],
      activeCitation: null,
      setActiveCitation: () => {},
      isGenerating: false,
      currentLiveResponse: "",
      sendMessage: async () => {},
      activeThreadId: "thread_main_1",
      setActiveThreadId: () => {},
      clearHistory: () => {},
    };
  }
  return context;
}
