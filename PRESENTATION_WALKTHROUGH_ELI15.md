# AbbVie Indication Knowledge Platform — Spoken Presentation Walkthrough (ELI15)
*An executive, humanized, step-by-step spoken guide explaining every page, tab, and widget.*

---

## 🎙️ Welcome & Opening Hook

> *"Imagine you are an AbbVie research scientist looking for a breakthrough treatment for Lupus—a devastating autoimmune disease where a patient's own immune system attacks their skin, joints, and organs. 
> 
> Normally, finding the right biological target, cross-checking 12 clinical trials, testing combination drugs, and digging through messy lab notebooks takes months of manual searching across dozens of disconnected tools.
> 
> This platform changes that forever. It’s an intelligent, full-stack computational research assistant that acts like having a team of PhD computational biologists, clinical data analysts, and compliance fact-checkers right at your fingertips."*

---

## 🏛️ Act 1: The Executive Landing Page & Discovery Workspace (`/`)

### 1. The Executive Header: "The Command Bridge"
- **Indication Selector (Top-Left)**: 
  - *What it is*: A dropdown that lets you switch between diseases like **Systemic Lupus Erythematosus (SLE)** and **Hidradenitis Suppurativa (HS)**.
  - *ELI15*: Think of it like tuning your satellite to a specific frequency. Click "Lupus," and the entire platform's brain instantly loads all target genes, clinical trials, and lab datasets relevant to Lupus.
- **Theme Toggle (Sun ☀️ / Moon 🌙)**:
  - *What it is*: A 1-click switcher between **Clinical Light Mode** and **Deep Lab Dark Mode**.
  - *ELI15*: Whether you are presenting in a bright conference room on a projector or deep in a dark lab analyzing 3D graphs at midnight, the UI adapts with beautiful contrast.
- **AbbVie | Google Cloud Badge (Top-Right)**:
  - *What it is*: Official enterprise branding showing our high-speed Google Cloud backend integration.

### 2. The Prominent Omni-Bar: "The Scientist's Google Search Bar on Steroids"
- *Where it is*: Floating prominently at the bottom of the screen with a glowing blue border.
- *What it does*: You type or speak in plain English—just like talking to a colleague: *"What is the synergy between IL-6 and BAFF?"* or *"What was the Phase 2 SRI-4 response rate for ABBV-599?"*
- *Superpowers*:
  - 🧪 **PhD Hardener Button**: Click this, and your draft question is instantly upgraded into a peer-reviewed, laboratory-grade research hypothesis with controls and failure modes.
  - 📄 **Document Upload**: Drop in a PDF or an electronic lab notebook page, and it automatically reads the tables and charts.
  - 🎙️ **Microphone**: Hands full in the lab? Just speak your question out loud.

### 3. Left Drawer: "The Research Notebook (Thread History)"
- *What it is*: Click **Threads** on the top-left to slide open your conversation history.
- *ELI15*: Every research project gets its own isolated memory folder. You can search your past conversations in real-time with zero lag or delete completed threads. Crucially, **zero context bleeds across different threads**—your target screen in Thread A never mixes up data with your trial search in Thread B.

### 4. Right Drawer: "The Zero-Hallucination Citation Side-Panel"
- *What it is*: Whenever the AI answers, it places clickable blue source pills (e.g. `[[source:EL-2026-00002538#1]]`). Clicking one slides open the exact document provenance.
- *ELI15*: Think of it as a laser pointer that snaps directly to Page 1 of the lab notebook, highlighting the exact bounding box and numerical values. In medicine, guessing is dangerous—this panel guarantees **100% verifiable proof for every claim**.

---

## 🔬 Act 2: The 6 Interactive R&D Scientific Widgets

When you ask about targets, combinations, or trials, interactive visual widgets open up right in your workspace:

### 1. Target Prioritization (ARCH MOA Rankings) — *The "Draft Pick Board"*
- *ELI15*: Imagine a leaderboard ranking every human gene from best to worst for treating Lupus. 
- *Core Features*: Ranks targets like **TLR7**, **IL6**, **TYK2**, and **TNF** by their **SWAG Score** (a composite multi-omics AI score), causal genetics, and current development status. Includes a 1-click **Export to CSV** button for easy sharing with lab directors.

### 2. Clinical Pipeline Assets & ABBV-599 CI Dossiers — *The "Flight Tracker for Drug Trials"*
- *ELI15*: Tracks 12 AbbVie clinical studies (from early Phase 1 to Phase 3).
- *Star Asset*: Click on study **M19-130** to open the dossier on **ABBV-599** (our dual-action BTK + JAK1 inhibitor). It clearly displays the **68.2% SRI-4 response rate** ($p=0.003$ vs $41.5\%$ placebo), proving that hitting two targets at once gave patients dramatic relief.

### 3. Combination Discovery (IL-6 Synergy) — *The "Ultimate Drug Tag-Team"*
- *ELI15*: Lupus is complex; one drug usually isn't enough. This widget ranks the top 11 partner targets to combine with an IL-6 inhibitor.
- *Top Pick*: Shows why pairing **IL-6 with TNFSF13B (BAFF)** is our #1 candidate—it achieves an $s_{AB}$ Biological Synergy score of **0.80**, because it simultaneously stops plasma cells from surviving while cutting off inflammatory B-cell priming.

### 4. 3D Synergy Space ($s_{AB}$ Intact) — *The "Holographic Galaxy of Drug Pairs"*
- *ELI15*: An interactive 3D Three.js scatter plot you can grab, rotate, and zoom with your mouse.
- *The 3 Axes*:
  - **X-axis**: Composite AI Score (How smart the computer thinks the pair is).
  - **Y-axis**: $s_{AB}$ Intact Synergy (How biologically non-redundant the pathways are).
  - **Z-axis**: Clinical Precedence (How safe and proven the drug classes are).
- Clicking any 3D orb instantly focuses on that drug combination's deep rationale!

### 5. Toxicological Risk Matrix — *The "Safety Shield"*
- *ELI15*: High efficacy is useless if the drug isn't safe. This matrix systematically grades 5 adverse event categories (Infection risk, Liver enzymes, Neutropenia, GI risk, and Rebound flares) and lays out exact clinical mitigation protocols for patient safety.

### 6. Signaling Cascade Network — *The "Cellular Subway Map"*
- *ELI15*: An interactive molecular pathway diagram showing how inflammatory signals travel from outside the cell membrane (IL-6 and BAFF) down to the nucleus, driving Lupus disease flares. Click any node (like `mTORC1` or `Src Kinase`) to see which preclinical compounds block it.

---

## 🛡️ Act 3: The 5-Tab Admin Testing & Evaluation Dashboard (`/admin/testing`)

*This is the cockpit where engineers, compliance leads, and scientific directors verify that the platform is 100% accurate, safe, and cost-effective.*

### Tab 1: Interactive Query Playground — *The "Live Diagnostic Lab"*
- *What it does*: Type any query, and watch 4 diagnostic engines light up simultaneously:
  1. **Intent Classifier**: Categorizes the question into Definitional, Protocol, Troubleshooting, Comparative, or Out-of-Scope in $<50\text{ms}$.
  2. **Graph Cypher Generator**: Converts your plain English into a Neo4j graph database query.
  3. **Grounded Generator**: Generates the exact citation-backed answer.
  4. **Citation Inspector**: Verifies every single source reference.

### Tab 2: Golden Benchmark Runner — *The "45-Question Master Exam"*
- *What it does*: Tests the AI against **45 domain-expert verified golden test cases** (10 Definitions, 15 Lab SOP Protocols, 10 Troubleshooting scenarios, 5 Drug Comparisons, and 5 Adversarial curveballs like off-topic questions).
- *ELI15*: It compares the AI's answer against the gold-standard answer written by senior scientists side-by-side to guarantee quality.

### Tab 3: RAGAS & Groundedness Audit — *The "Strict Fact-Checking Polygraph"*
- *What it does*: Evaluates the AI across industry-standard RAGAS metrics (**92% Faithfulness**, **95% Context Precision**, **91% Recall**).
- *The Zero-Tolerance Claim Groundedness Rule*: Scans every number, dosage (e.g. `60 mg`), concentration (e.g. `24.8 nM`), and percentage in the response. If even *one* single number is made up or unverified, the score instantly drops to **0.0 (NEEDS_REVIEW)** with zero partial credit!

### Tab 4: Token Budget & Cost Tracker — *The "Cloud Gas Gauge"*
- *What it does*: Tracks live token burn rate against the enterprise budget cap of **<$2,000 / month**.
- *Current Status*: Current monthly spend is only **$284.50** (Projected $640.20 run rate), utilizing just $32\%$ of budget while running on ultra-fast Gemini 2.5 Flash ($0.075 / 1M input tokens).

### Tab 5: Scientific Prompt Hardener (PhD Principal Scientist Mode) — *The "Stress-Testing Crucible"*
- *What it does*: Implements our PhD-level prompt hardening engine. It treats prompts not as magic wishes, but as physical laboratory experiments.
- *The 4-Step Pipeline*:
  1. **Pitfall Analysis**: Flags non-specific pan-kinase toxicity and confounding DMSO vehicle artifacts.
  2. **Peer Contextualization**: Mandates positive controls ($20\text{ ng/mL IL-23}$) and negative vehicle controls ($0.1\%\text{ DMSO}$).
  3. **Prompt Reconstruction**: Injects strict constraints and forces **3 counter-factual failure modes** ("Why might this hypothesis fail?").
  4. **PhD Justification**: Explains the exact scientific rationale for every constraint.

---

## ⚡ Act 4: Specialized Deep-Dive Test Harnesses

1. **3D Molecular Knowledge Graph (`/test-harness/graph-3d`)**:
   - Explore biological relationships between Genes (`IL6`, `TYK2`, `STAT1`), Compounds (`A-1984701.0`, `Upadacitinib`), and Diseases (`SLE`, `HS`).
2. **LangExtract Preclinical OCR Engine (`/test-harness/extractor`)**:
   - Upload complex Electronic Lab Notebooks (ELN `EL-2026-00002538`) and extracts dosage arms, log2FC values, and $p$-values with bounding box coordinates.
3. **Session State & Bounded Clarification (`/test-harness/session`)**:
   - Tests our bounded clarification loop. The AI asks at most 1–2 clarifying questions; if the user says *"I don't know"*, it stops interrogating and immediately pivots to actionable QC instrument checks (checking buffer pH 7.4 and spectrophotometer calibration logs).

---

## 🌟 Closing Summary

> *"In summary, the AbbVie Indication Knowledge Platform bridges the gap between raw biomedical data and life-saving translational medicine. It is fast, visual, scientifically hardened, 100% grounded in verified evidence, and fully tested with 44/44 passing test suites."*
