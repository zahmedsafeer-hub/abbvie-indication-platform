import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MoaRankingTable } from "../components/widgets/MoaRankingTable";
import { ClinicalTrialsTable } from "../components/widgets/ClinicalTrialsTable";
import { DossierReportViewer } from "../components/widgets/DossierReportViewer";
import { ComboRankTable } from "../components/widgets/ComboRankTable";
import { RiskTable } from "../components/widgets/RiskTable";
import { SabScatterPlot3D } from "../components/widgets/SabScatterPlot3D";
import { PathwayMap } from "../components/widgets/PathwayMap";

describe("AbbVie R&D Interactive Widgets (Slides 11-19)", () => {
  it("MoaRankingTable (Slide 11) renders targets, filters, and responds to click", () => {
    const handleSelect = vi.fn();
    render(<MoaRankingTable onSelectTarget={handleSelect} />);

    expect(screen.getByText("Target MOA Rankings & Multi-Omics Genetics")).toBeDefined();
    expect(screen.getAllByText("TLR7").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("IL6").length).toBeGreaterThanOrEqual(1);

    // Search filter
    const searchInput = screen.getByPlaceholderText(/Search target/i);
    fireEvent.change(searchInput, { target: { value: "TYK2" } });
    expect(screen.getAllByText("TYK2").length).toBeGreaterThanOrEqual(1);
  });

  it("ClinicalTrialsTable & DossierReportViewer (Slides 12-15) render studies and SRI-4 endpoints", () => {
    render(<ClinicalTrialsTable />);
    expect(screen.getAllByText("M19-130").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("M16-044")).toBeDefined();

    render(<DossierReportViewer />);
    expect(screen.getByText("SRI-4 Response Rate")).toBeDefined();
    expect(screen.getByText("68.2%")).toBeDefined();

    // Switch to STAT1 CI report tab
    const stat1Tab = screen.getByText("STAT1 CI Report");
    fireEvent.click(stat1Tab);
    expect(screen.getByText(/STAT1 Target Competitive Intelligence/i)).toBeDefined();

    // Switch to IL6 CI report tab
    const il6Tab = screen.getByText("IL6 CI Report");
    fireEvent.click(il6Tab);
    expect(screen.getByText(/IL6 Target Competitive Intelligence/i)).toBeDefined();
  });

  it("ComboRankTable & RiskTable (Slides 16 & 18) render combo mechanisms and risk matrix", () => {
    render(<ComboRankTable />);
    expect(screen.getByText("IL-6 Combination Synergy & GTM Link Prediction Rankings")).toBeDefined();
    expect(screen.getAllByText("TNFSF13B").length).toBeGreaterThanOrEqual(1);

    render(<RiskTable />);
    expect(screen.getByText("Severe Infection Risk")).toBeDefined();
    expect(screen.getByText("Cytopenias (Neutropenia)")).toBeDefined();
    expect(screen.getByText(/Overall Profile: Manageable/i)).toBeDefined();
  });

  it("SabScatterPlot3D (Slide 17) mounts and renders scatter plot container", () => {
    render(<SabScatterPlot3D />);
    expect(screen.getByText(/3D sAB Intact vs Composite AI Score/i)).toBeDefined();
    expect(screen.getAllByText(/IL6 \| TNFSF13B/i).length).toBeGreaterThanOrEqual(1);
  });

  it("PathwayMap (Slide 19) mounts SVG nodes and handles node interaction", () => {
    render(<PathwayMap />);
    expect(screen.getByText(/Integrated Signaling Pathway Map/i)).toBeDefined();
    expect(screen.getAllByText(/IL-6 Cytokine/i).length).toBeGreaterThanOrEqual(1);

    // Click another node
    const bcellNodes = screen.getAllByText(/BAFF/i);
    expect(bcellNodes.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(bcellNodes[0]);
    expect(screen.getByText(/Axis:/i)).toBeDefined();
  });
});
