# AbbVie Indication Knowledge Platform (ARCH R&D Suite)

An enterprise-grade, full-stack AI research and indication assessment platform built for AbbVie R&D. The platform integrates multi-omics target prioritization (ARCH SWAG metrics), clinical trial competitive intelligence, computational biological synergy scoring ($s_{AB}$ Intact), LangExtract document OCR provenance extraction, a 3D interactive knowledge graph, zero-tolerance RAGAS evaluation, and per-thread session state management.

---

## Architecture Overview

```
abbvie-indication-platform/
├── api/                             # Python 3.11+ FastAPI Backend
│   ├── data/                        # 45-case Golden Evaluation Dataset
│   ├── eval/                        # RAGAS Suite & Zero-Tolerance Claim Groundedness
│   ├── models/                      # Pydantic v2 Schemas & Enums
│   ├── routes/                      # REST API Endpoints
│   ├── services/                    # Core Business & AI Engines
│   │   ├── eval_dataset.py          # Benchmark Loader
│   │   ├── extractor.py             # LangExtract GenAI OCR & Provenance
│   │   ├── graph_service.py         # Neo4j / SQLite Dual Graph & 3D Topology
│   │   ├── gtm_scorer.py            # Graph Transformer Model (GTM) Scorer
│   │   ├── intent_classifier.py     # 4-Category Intent Router & Scope Filter
│   │   ├── prompt_builder.py        # Intent-Specific Grounded Prompt Builder
│   │   └── session_manager.py       # Thread Session State & Pivot Engine
│   └── tests/                       # PyTest Backend Test Suites (33 Tests)
├── web/                             # Next.js 14 App Router Frontend
│   ├── app/                         # Pages & Test Harness Views
│   │   ├── admin/testing/           # Unified Admin Testing Dashboard
│   │   ├── test-harness/            # Specialized Test Suites (Eval, Golden, Session)
│   │   └── page.tsx                 # Executive Dashboard & Omni-Bar
│   ├── components/
│   │   ├── drawers/                 # Thread History Drawer & Provenance Panel
│   │   ├── layout/                  # Executive Header & Floating OmniBar
│   │   └── widgets/                 # Slides 11-19 R&D Interactive Presentation Widgets
│   ├── lib/                         # API Client & Mock Seed Database
│   ├── types/                       # TypeScript Interfaces & Data Contracts
│   └── __tests__/                   # Vitest Component Test Suites (9 Tests)
├── scripts/                         # Master Automation Scripts
│   └── run_all_tests.sh             # Master Automated Test Suite (100% Pass Rate)
└── start.sh                         # Zero-Dependency One-Command Boot Script
```

---

## Core Features & Presentation Coverage

1. **ARCH Target MOA Ranking (Slide 11)**:
   - 8 prioritized target mechanisms (`TLR7`, `IL6`, `IL2RA`, `TYK2`, `TNF`, `IL10`, `NR3C1`, `IL2`) with composite SWAG scores, causal genetics, and dev status badges.
2. **Clinical Trials & CI Dossiers (Slides 12–15)**:
   - 12 AbbVie clinical studies (`M14-5521` to `M20-186`). Featured **ABBV-599 Phase 2 (M19-130 / NCT03978520)** dossier with SRI-4 ($68.2\%$) and BICLA ($58.4\%$) endpoints.
3. **Combination Rankings & Toxicological Risk (Slides 16 & 18)**:
   - Top 11 computational pairs for IL-6 (`IL6 + TNFSF13B` with $s_{AB} = 0.80$, `IL6 + TYK2` with $s_{AB} = 0.78$) and risk mitigation matrix.
4. **3D sAB Intact Scatter Plot (Slide 17)**:
   - Three.js 3D scatter plot mapping candidate combinations across AI Score, $s_{AB}$ Biological Synergy, and Clinical Precedence.
5. **Multi-Axis Signaling Pathway Map (Slide 19)**:
   - Interactive SVG network connecting the IL-6, BAFF, and IL-23 / mTOR axes to SLE autoimmune pathology.
6. **LangExtract Preclinical Document Parsing (Slide 22)**:
   - Extracts quantitative lab matrices (`LPAR1000`, `Tyk200`, `Combo`), bounding boxes, and log2FC/IC50 values from ELN `EL-2026-00002538`.
7. **Per-Thread Session State & Bounded Clarification**:
   - Caps clarification questions at max 2 rounds; pivots on *"I don't know"* to actionable QC checks (buffer pH 7.4, spectrophotometer logs).
8. **45-Case Golden Evaluation Dataset**:
   - 40 Scientific Domain Cases + 5 Adversarial Safety Cases.
9. **RAGAS Suite & Zero-Tolerance Claim Groundedness**:
   - Enforces $0.0$ / `NEEDS_REVIEW` on any ungrounded quantitative claim (dosages, concentrations, percentages, IC50 values).

---

## Quick Start

### One-Command Zero-Dependency Boot
```bash
./start.sh
```
- **Executive Workspace**: `http://localhost:3000`
- **Admin Testing Dashboard**: `http://localhost:3000/admin/testing`
- **RAGAS Evaluation Runner**: `http://localhost:3000/test-harness/eval-runner`
- **FastAPI Documentation**: `http://localhost:8000/docs`

---

## Running the Automated Test Suite

```bash
bash scripts/run_all_tests.sh
```
- **FastAPI PyTest Unit Tests**: 33 tests passed
- **Golden Evaluation & RAGAS Verification**: 9 tests passed
- **TypeScript Compilation (`tsc --noEmit`)**: 0 errors
- **Next.js Vitest Component Tests**: 9 tests passed
- **Total**: 42/42 tests passing ($100\%$ success rate)
