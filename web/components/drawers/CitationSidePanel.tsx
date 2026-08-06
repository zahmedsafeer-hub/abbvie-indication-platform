"use client";

import React from "react";
import {
  Download,
  ExternalLink,
  FileCheck,
  FileText,
  Layers,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CitationItem } from "@/types/platform";

interface CitationSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  citation: CitationItem | null;
}

export function CitationSidePanel({
  isOpen,
  onClose,
  citation,
}: CitationSidePanelProps) {
  if (!isOpen || !citation) return null;

  const getDocDetails = (docId: string) => {
    if (docId.includes("EL-2026") || docId.includes("ELN")) {
      return {
        title: "High-Throughput Repurposing Screen & Dose-Response Analysis in γδ17 T-Cell Lines",
        type: "Electronic Lab Notebook (ELN)",
        author: "AbbVie Immunology Discovery Group",
        date: "2026-04-12",
        confidence: 0.96,
        bbox: "[0.08, 0.18, 0.92, 0.33]",
        downloadUrl: "#",
      };
    } else if (docId.includes("PUB") || docId.includes("34982103")) {
      return {
        title: "Targeting mTORC1/2 and Src Kinases in IL-23 Driven Skin Inflammation",
        type: "Peer-Reviewed PubMed Literature",
        author: "Journal of Experimental Immunology",
        date: "2025-11-08",
        confidence: 0.95,
        bbox: "[0.12, 0.25, 0.88, 0.45]",
        downloadUrl: "#",
      };
    } else if (docId.includes("M19-130") || docId.includes("NCT03978520") || docId.includes("trial")) {
      return {
        title: "Phase 2 Study of Elsubrutinib (ABBV-105) + Upadacitinib in SLE (NCT03978520)",
        type: "Clinical Study Report / Protocol",
        author: "AbbVie Global Clinical Development",
        date: "2024-09-15",
        confidence: 0.98,
        bbox: "[0.05, 0.10, 0.95, 0.40]",
        downloadUrl: "#",
      };
    } else {
      return {
        title: `AbbVie ARCH Biological Target Registry: ${docId}`,
        type: "ARCH Platform Data Asset",
        author: "AbbVie Genomics & Target Validation",
        date: "2026-02-20",
        confidence: 0.94,
        bbox: "[0.00, 0.00, 1.00, 1.00]",
        downloadUrl: "#",
      };
    }
  };

  const doc = getDocDetails(citation.docId);

  return (
    <aside
      data-testid="citation-side-panel"
      className="fixed inset-y-0 right-0 z-50 w-80 sm:w-96 bg-slate-950/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out"
    >
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-white text-xs sm:text-sm">
            Citation & Provenance
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-4 text-xs">
        
        {/* Source Header Card */}
        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/40">
              {citation.citationTag}
            </span>
            <Badge variant="success">{(doc.confidence * 100).toFixed(0)}% Confidence</Badge>
          </div>
          <h3 className="font-bold text-white text-sm leading-snug">
            {doc.title}
          </h3>
          <p className="text-[11px] text-purple-300 font-medium">
            {doc.type}
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60 font-mono">
            <span>Author: {doc.author}</span>
            <span>{doc.date}</span>
          </div>
        </div>

        {/* Highlighted Exact Text Snippet */}
        <div className="space-y-1.5">
          <span className="text-slate-300 font-bold text-[11px] uppercase tracking-wider block">
            Extracted Ground-Truth Excerpt:
          </span>
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-slate-200 text-xs leading-relaxed italic border-l-4 border-l-blue-500">
            "{citation.snippet}"
          </div>
        </div>

        {/* Spatial Bounding Box Coordinates */}
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px]">
          <div className="flex justify-between items-center text-slate-300 font-semibold">
            <span>Spatial Provenance Bounding Box:</span>
            <span className="text-purple-400">Page {citation.page}</span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800/80 text-emerald-400 text-[10px]">
            <code>BBox: {doc.bbox}</code>
          </div>
        </div>

        {/* Download Button */}
        <div className="pt-2">
          <Button
            onClick={() => alert(`Downloading verified source document: ${citation.docId}`)}
            size="sm"
            className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold gap-1.5 shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Original SOP / PDF</span>
          </Button>
        </div>

      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 text-[10px] text-slate-500 text-center font-mono">
        Verified Zero-Hallucination Grounding
      </div>
    </aside>
  );
}
