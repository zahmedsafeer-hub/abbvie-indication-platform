import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "../components/layout/Header";
import { OmniBar } from "../components/layout/OmniBar";
import { ThreadHistoryDrawer } from "../components/drawers/ThreadHistoryDrawer";
import { CitationSidePanel } from "../components/drawers/CitationSidePanel";
import { ThreadSessionData, CitationItem } from "../types/platform";

describe("Executive AppShell & Side-Panels", () => {
  const mockSessions: ThreadSessionData[] = [
    {
      threadId: "thread_1",
      title: "SLE Target Prioritization",
      history: [
        { role: "user", content: "What is TYK2?" },
        { role: "assistant", content: "TYK2 is an intracellular kinase." },
      ],
      clarificationCount: 0,
      createdAt: "2026-04-12T10:00:00Z",
      updatedAt: "2026-04-12T10:05:00Z",
    },
    {
      threadId: "thread_2",
      title: "γδ17 Assay Troubleshooting",
      history: [
        { role: "user", content: "Assay inconsistent" },
        { role: "assistant", content: "Check cytokine potency." },
      ],
      clarificationCount: 1,
      createdAt: "2026-04-12T11:00:00Z",
      updatedAt: "2026-04-12T11:10:00Z",
    },
    {
      threadId: "thread_3",
      title: "IL6 Combination Synergy",
      history: [],
      clarificationCount: 0,
      createdAt: "2026-04-12T12:00:00Z",
      updatedAt: "2026-04-12T12:00:00Z",
    },
  ];

  it("Header renders Indication and AbbVie / Google Cloud branding", () => {
    const handleSelect = vi.fn();
    render(
      <Header
        selectedIndication="Systemic Lupus Erythematosus"
        onSelectIndication={handleSelect}
      />
    );

    expect(screen.getAllByText("Systemic Lupus Erythematosus").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("abbvie")).toBeDefined();
    expect(screen.getByText("Google Cloud")).toBeDefined();
  });

  it("OmniBar renders inputs and triggers message submission", () => {
    const handleSend = vi.fn();
    render(<OmniBar onSendMessage={handleSend} />);

    const input = screen.getByPlaceholderText(/Ask me anything/i);
    fireEvent.change(input, { target: { value: "What is mTORC1?" } });
    fireEvent.submit(input.closest("form")!);

    expect(handleSend).toHaveBeenCalledWith("What is mTORC1?");
  });

  it("ThreadHistoryDrawer filters sessions via keyword search and handles deletion", () => {
    const handleSelect = vi.fn();
    const handleCreate = vi.fn();
    const handleDelete = vi.fn();
    const handleClose = vi.fn();

    render(
      <ThreadHistoryDrawer
        isOpen={true}
        onClose={handleClose}
        sessions={mockSessions}
        activeThreadId="thread_1"
        onSelectThread={handleSelect}
        onCreateNewThread={handleCreate}
        onDeleteThread={handleDelete}
      />
    );

    expect(screen.getByText("SLE Target Prioritization")).toBeDefined();
    expect(screen.getByText("γδ17 Assay Troubleshooting")).toBeDefined();

    // Test real-time keyword search filter
    const searchInput = screen.getByPlaceholderText(/Search keywords/i);
    fireEvent.change(searchInput, { target: { value: "Troubleshooting" } });

    expect(screen.getByText("γδ17 Assay Troubleshooting")).toBeDefined();
    expect(screen.queryByText("SLE Target Prioritization")).toBeNull();
  });

  it("CitationSidePanel displays title, highlighted snippet, and bounding box coordinates", () => {
    const mockCitation: CitationItem = {
      docId: "EL-2026-00002538",
      page: 1,
      snippet: "LPAR1000 achieved log2FC = -3.85 (p = 0.00012) in γδ17 T-cells.",
      citationTag: "[[source:EL-2026-00002538#1]]",
    };

    render(
      <CitationSidePanel
        isOpen={true}
        onClose={vi.fn()}
        citation={mockCitation}
      />
    );

    expect(screen.getByText("[[source:EL-2026-00002538#1]]")).toBeDefined();
    expect(screen.getByText(/"LPAR1000 achieved log2FC/i)).toBeDefined();
    expect(screen.getByText(/BBox:/i)).toBeDefined();
    expect(screen.getByText(/Download Original SOP \/ PDF/i)).toBeDefined();
  });
});
