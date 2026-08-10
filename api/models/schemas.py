from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field


class BoundingBox(BaseModel):
    page: int = Field(1, description="Page index (1-indexed)")
    x1: float = Field(..., description="Top-left X coordinate (0.0 to 1.0 or pixel)")
    y1: float = Field(..., description="Top-left Y coordinate (0.0 to 1.0 or pixel)")
    x2: float = Field(..., description="Bottom-right X coordinate (0.0 to 1.0 or pixel)")
    y2: float = Field(..., description="Bottom-right Y coordinate (0.0 to 1.0 or pixel)")
    label: Optional[str] = Field(None, description="Optional entity label for visualization")


class ProvenanceRecord(BaseModel):
    sourceDocId: str = Field(..., description="Unique ID of source document")
    docTitle: str = Field(..., description="Document title")
    docType: Literal['ELN', 'PubMed', 'IDMP-Ontology', 'SOP', 'CSR'] = Field(..., description="Type of document")
    snippet: str = Field(..., description="Exact textual excerpt or figure snippet")
    pageNumber: int = Field(..., description="Page number where snippet was located")
    boundingBox: BoundingBox = Field(..., description="Bounding box on the source page")
    confidenceScore: float = Field(..., ge=0.0, le=1.0, description="Extraction confidence score")


class Indication(BaseModel):
    id: str = Field(..., description="Indication identifier (e.g., SLE, HS)")
    name: str = Field(..., description="Indication name (e.g. 'Systemic Lupus Erythematosus', 'Hidradenitis Suppurativa')")
    description: str = Field(..., description="Detailed clinical description of the indication")
    therapeuticArea: Optional[str] = Field("Immunology", description="Therapeutic Area")


class ARCHTarget(BaseModel):
    gene: str = Field(..., description="Target Gene Symbol (e.g. TLR7, IL6)")
    ensemblId: str = Field(..., description="Ensembl Gene Identifier")
    disease: str = Field(..., description="Target Disease context")
    archVersion: str = Field("v2.4", description="ARCH pipeline version")
    swagStrength: float = Field(..., description="SWAG association strength metric")
    swagScore: float = Field(..., description="Composite SWAG score")
    swagScoreNoClin: float = Field(..., description="SWAG score excluding clinical MAO weight")
    pathwayCausal: float = Field(..., description="Causal pathway alignment score")
    genetic: float = Field(..., description="Genetic evidence score (GWAS/eQTL)")
    pathwayGeneral: float = Field(..., description="General biological pathway overlap score")
    clinicalMao: float = Field(..., description="Clinical mechanism-of-action support score")
    currentDevStatus: Literal['Phase 1', 'Phase 2', 'Phase 3', 'Launched', 'Discontinued'] = Field(
        ..., description="Current clinical development status"
    )
    links: List[str] = Field(default_factory=list, description="Cross-reference links and ontology URIs")


class ClinicalTrial(BaseModel):
    studyNumber: str = Field(..., description="AbbVie Study Number (e.g., M14-5521, M19-130)")
    studyTitle: str = Field(..., description="Full protocol study title")
    therapeuticArea: str = Field("Immunology", description="Therapeutic area")
    drugName: str = Field(..., description="Generic/Brand drug name (e.g., Upadacitinib, Elsubrutinib)")
    compound: str = Field(..., description="AbbVie Compound identifier (e.g., ABT-494, ABBV-599)")
    indication: str = Field(..., description="Disease indication")
    startYear: int = Field(..., description="Clinical trial start year")
    phase: str = Field(..., description="Trial Phase (e.g., Phase 1b, Phase 2, Phase 3)")
    mainFindings: str = Field(..., description="Primary clinical endpoint findings and statistical outcome")
    bottomLine: str = Field(..., description="Executive bottom-line summary for indication assessment")
    registryUrl: str = Field(..., description="ClinicalTrials.gov or internal registry URL")


class ComboMechanism(BaseModel):
    moa1: str = Field(..., description="Primary Mechanism of Action / Target 1 (e.g., IL6)")
    moa2: str = Field(..., description="Partner Mechanism of Action / Target 2 (e.g., TNFSF13B, TYK2)")
    disease: str = Field("Systemic Lupus Erythematosus", description="Target disease context")
    ta: str = Field("Immunology", description="Therapeutic area")
    swag1: float = Field(..., description="ARCH SWAG score for Target 1")
    swag2: float = Field(..., description="ARCH SWAG score for Target 2")
    dualActivity: float = Field(..., description="Calculated dual biological pathway activity score")
    expectedResult: str = Field(..., description="Expected biological synergy or pathway rescue outcome")
    sabIntact: float = Field(..., description="sAB intact score metric (Slide 16)")
    compositeAiScore: float = Field(..., description="Composite AI Combination Synergy Score")
    toxicityRisk: Literal['Low', 'Moderate', 'Severe'] = Field(..., description="Predicted combination toxicity risk")


class DosageArmMetric(BaseModel):
    route: Literal['intraperitoneal', 'oral', 'topical'] = Field(..., description="Route of administration")
    dose: str = Field(..., description="Dosage specification (e.g. '10 mg/kg QD', '0.5% ointment')")
    ic50: float = Field(..., description="IC50 value in nanomolar (nM)")
    unit: str = Field("nM", description="Concentration unit")
    log2FC: float = Field(..., description="Log2 Fold Change relative to control")
    pValue: float = Field(..., description="Statistical p-value (Student's t / ANOVA)")
    efficacyPercent: float = Field(..., description="Percentage suppression of inflammation / IL-23 response")


class CompoundPreclinicalData(BaseModel):
    compoundId: str = Field(..., description="Screen identifier (e.g., A-1984701.0, A-2208690.0)")
    compoundName: str = Field(..., description="Standard compound/drug name")
    mechanism: str = Field(..., description="Known biochemical mechanism (e.g. mTORC1/2 inhibitor, Src kinase inhibitor)")
    log2FC: float = Field(..., description="In vitro log2 fold change of IL-23 mediated signaling")
    pValue: float = Field(..., description="Statistical significance p-value")
    ic50Ip: Optional[float] = Field(None, description="In vivo IC50 for intraperitoneal administration (nM)")
    ic50Oral: Optional[float] = Field(None, description="In vivo IC50 for oral administration (nM)")
    ic50Topical: Optional[float] = Field(None, description="In vivo IC50 for topical administration (nM)")
    dosageArms: List[DosageArmMetric] = Field(default_factory=list, description="Dosage arm metrics across administration routes")
    validationNotes: str = Field(..., description="Primary cell validation notes and mechanistic observations")


class PreclinicalSampleData(BaseModel):
    assayType: Literal['in vitro', 'in vivo'] = Field('in vitro', description="Primary assay category")
    cellLine: Literal['γδ17 T-cell'] = Field('γδ17 T-cell', description="Cell line used for IL-23 response screening")
    targetPathway: Literal['IL-23 / mTORC1 / mTORC2 / Src family kinases'] = Field(
        'IL-23 / mTORC1 / mTORC2 / Src family kinases', description="Biological pathway axis under investigation"
    )
    compoundSource: Literal['FDA-Approved Repurposing Screen'] = Field(
        'FDA-Approved Repurposing Screen', description="Source library of screened compounds"
    )
    modelSystem: Literal['imiquimod-induced skin inflammation'] = Field(
        'imiquimod-induced skin inflammation', description="In vivo animal model system"
    )
    routesOfAdmin: List[Literal['intraperitoneal', 'oral', 'topical']] = Field(
        default=['intraperitoneal', 'oral', 'topical'], description="Evaluated routes of administration"
    )
    validationStatus: Literal['validated in primary cells'] = Field(
        'validated in primary cells', description="Experimental validation status"
    )
    abstract: str = Field(..., description="Study abstract summary")
    compounds: List[CompoundPreclinicalData] = Field(..., description="Evaluated compounds and response metrics")


class Message(BaseModel):
    id: str = Field(..., description="Unique message ID")
    role: Literal['user', 'assistant', 'system'] = Field(..., description="Author role")
    content: str = Field(..., description="Message text content")
    timestamp: str = Field(..., description="ISO 8601 timestamp")
    provenance: Optional[List[ProvenanceRecord]] = Field(default_factory=list, description="Associated provenance citations")


class ThreadState(BaseModel):
    threadId: str = Field(..., description="Thread unique identifier")
    title: str = Field(..., description="Thread title")
    createdAt: str = Field(..., description="Creation ISO timestamp")
    updatedAt: str = Field(..., description="Last update ISO timestamp")
    messages: List[Message] = Field(default_factory=list, description="List of messages in conversation")
    clarificationTurnCount: int = Field(0, description="Count of clarification turns")


# ============================================================================
# LANGEXTRACT SCIENTIFIC DOCUMENT PARSING SCHEMAS
# ============================================================================

class ExtractedCompound(BaseModel):
    compoundId: str = Field(..., description="Compound identifier (e.g., A-1984701.0, A-2208690.0, Rapamycin)")
    lotNumber: Optional[str] = Field(None, description="ELN Chemical Lot Number (e.g. Lot: 2669264)")
    rootNumber: Optional[str] = Field(None, description="AbbVie Root Compound Number (e.g. Root: 1984701)")
    commonName: Optional[str] = Field(None, description="Common or chemical drug name")
    mechanism: Optional[str] = Field(None, description="Primary molecular mechanism")
    boundingBox: Optional[BoundingBox] = Field(None, description="Source provenance bounding box")


class ExtractedPathway(BaseModel):
    pathwayName: str = Field(..., description="Pathway name (e.g., mTORC1, mTORC2, Src family kinases, IL-23 / IL-17)")
    targetFamily: Optional[str] = Field(None, description="Target family classification (e.g. Kinase, Cytokine receptor)")
    biologicalRole: Optional[str] = Field(None, description="Functional role in disease/assay context")
    boundingBox: Optional[BoundingBox] = Field(None, description="Source provenance bounding box")


class ExtractedAssayModel(BaseModel):
    assayName: str = Field(..., description="Biological assay or model name (e.g., γδ17 T-cell line IL-23 assay, imiquimod-induced skin inflammation model)")
    modelType: Literal['in vitro', 'in vivo', 'ex vivo'] = Field('in vitro', description="Assay classification")
    system: Optional[str] = Field(None, description="Biological system / cell type / organism")
    validationStatus: Optional[str] = Field(None, description="Experimental validation status")
    boundingBox: Optional[BoundingBox] = Field(None, description="Source provenance bounding box")


class ExtractedQuantitativeMetric(BaseModel):
    entity: str = Field(..., description="Compound or condition (e.g., LPAR1000, Tyk200, Combo, A-1984701.0)")
    metricType: str = Field(..., description="Metric type (e.g., log2FC, p-value, IC50, Efficacy)")
    condition: Optional[str] = Field(None, description="Assay condition or route (e.g. IP, Oral, Topical, 5 mg/kg BID)")
    value: float = Field(..., description="Quantitative metric numerical value")
    unit: Optional[str] = Field(None, description="Measurement unit (e.g., nM, %, log2)")
    log2FC: Optional[float] = Field(None, description="Log2 fold change if applicable")
    pValue: Optional[float] = Field(None, description="Statistical p-value if applicable")
    ic50: Optional[float] = Field(None, description="IC50 in nM if applicable")
    boundingBox: Optional[BoundingBox] = Field(None, description="Source provenance bounding box")


class ExtractedTriple(BaseModel):
    subject: str = Field(..., description="Subject entity (e.g., A-1984701.0, IL-23, mTORC1)")
    predicate: str = Field(..., description="Relationship predicate (e.g., inhibits, activates, modulates, evaluated_in)")
    object: str = Field(..., description="Object entity (e.g., TYK2, γδ17 T-cell line, imiquimod skin inflammation)")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Extraction confidence score")
    provenance: Optional[ProvenanceRecord] = Field(None, description="Full provenance record")


class ExtractionResult(BaseModel):
    documentId: str = Field(..., description="Source Document Identifier (e.g. EL-2026-00002538, PUB-34982103)")
    title: str = Field(..., description="Extracted or declared document title")
    docType: Literal['ELN', 'PubMed', 'IDMP-Ontology', 'SOP', 'CSR'] = Field(..., description="Document classification")
    compounds: List[ExtractedCompound] = Field(default_factory=list, description="Extracted compound entities")
    pathways: List[ExtractedPathway] = Field(default_factory=list, description="Extracted target pathway entities")
    assayModels: List[ExtractedAssayModel] = Field(default_factory=list, description="Extracted assay & model systems")
    routesOfAdmin: List[Literal['intraperitoneal', 'oral', 'topical']] = Field(
        default_factory=list, description="Identified routes of administration"
    )
    quantitativeMatrix: List[ExtractedQuantitativeMetric] = Field(
        default_factory=list, description="Quantitative matrix measurements (log2FC, p-value, IC50)"
    )
    triples: List[ExtractedTriple] = Field(default_factory=list, description="Extracted knowledge graph triples")
    confidenceScore: float = Field(..., ge=0.0, le=1.0, description="Overall parsing confidence score")
    rawText: Optional[str] = Field(None, description="Raw source text analyzed")
    boundingBoxes: List[BoundingBox] = Field(default_factory=list, description="All identified visual bounding boxes")


class DocumentExtractRequest(BaseModel):
    documentId: Optional[str] = Field(None, description="Document ID or key (e.g. EL-2026-00002538)")
    text: Optional[str] = Field(None, description="Raw text snippet to parse")
    docType: Optional[Literal['ELN', 'PubMed', 'IDMP-Ontology', 'SOP', 'CSR']] = Field('ELN', description="Document type")
    sampleDocKey: Optional[str] = Field(None, description="Built-in sample document key (e.g. 'slide22_eln', 'gd17_pubmed')")


# ============================================================================
# 3D GRAPH & GTM SCORER SCHEMAS
# ============================================================================

class Graph3DNode(BaseModel):
    id: str = Field(..., description="Unique node ID (e.g. IL6, mTORC1, A-1984701.0)")
    label: str = Field(..., description="Display label")
    type: str = Field(..., description="Node classification (Gene, Compound, Drug, Disease, Endpoint, Variant, etc.)")
    x: float = Field(..., description="3D X coordinate")
    y: float = Field(..., description="3D Y coordinate")
    z: float = Field(..., description="3D Z coordinate")
    size: float = Field(1.0, description="Sphere radius size")
    color: str = Field("#3b82f6", description="Hex color")
    swagScore: Optional[float] = Field(None, description="ARCH SWAG score")
    swagStrength: Optional[float] = Field(None, description="SWAG strength")
    causalScore: Optional[float] = Field(None, description="Causal pathway alignment score")
    geneticScore: Optional[float] = Field(None, description="Genetic evidence score")
    currentDevStatus: Optional[str] = Field(None, description="Clinical development status")
    details: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional biological metadata")


class Graph3DEdge(BaseModel):
    id: str = Field(..., description="Edge identifier")
    source: str = Field(..., description="Source node ID")
    target: str = Field(..., description="Target node ID")
    relationship: str = Field(
        ..., description="Graph relationship type (e.g. HAS_ACTIVITY_AGAINST, ASSOCIATED_WITH, SHARES_PATHWAY_WITH, etc.)"
    )
    weight: float = Field(1.0, description="Edge weight / confidence score")
    strength: Optional[int] = Field(3, description="ARCH-v6.0 Evidence Strength (0-4 integer)")
    confidence: Optional[float] = Field(0.95, description="ARCH-v6.0 Evidence Confidence (0.0-1.0 float)")
    sabIntact: Optional[float] = Field(None, description="Biological non-redundancy / intact synergy score (sAB)")
    compositeAiScore: Optional[float] = Field(None, description="Composite AI synergy score")
    color: str = Field("#64748b", description="Edge render color")


class Graph3DTopology(BaseModel):
    nodes: List[Graph3DNode] = Field(default_factory=list)
    edges: List[Graph3DEdge] = Field(default_factory=list)
    metrics: Dict[str, Any] = Field(default_factory=dict)


class MOARanking(BaseModel):
    gene: str = Field(..., description="Gene symbol")
    swagScore: float = Field(..., description="ARCH SWAG score")
    swagStrength: float = Field(..., description="SWAG association strength")
    causalScore: float = Field(..., description="Causal score")
    geneticScore: float = Field(..., description="Genetic score")
    currentDevStatus: str = Field(..., description="Development status")
    rank: int = Field(..., description="Overall MOA priority ranking")


class ComboRanking(BaseModel):
    moa1: str = Field(..., description="MOA Target 1")
    moa2: str = Field(..., description="MOA Target 2")
    compositeAiScore: float = Field(..., description="GTM Composite AI Score")
    sabIntact: float = Field(..., description="GTM sAB Intact Score")
    dualActivity: float = Field(..., description="Dual pathway score")
    toxicityRisk: Literal['Low', 'Moderate', 'Severe'] = Field(..., description="Toxicity risk")
    rank: int = Field(..., description="Synergy priority rank")


class CypherQueryRequest(BaseModel):
    query: str = Field(..., description="Cypher query string (e.g. MATCH (g:Gene)-[r:COMBINED_WITH]->(p:Gene) RETURN g, r, p)")


class CypherQueryResponse(BaseModel):
    backend: Literal['Neo4j', 'SQLite-Graph-Engine'] = Field(..., description="Active graph execution backend")
    query: str
    results: List[Dict[str, Any]] = Field(default_factory=list)
    count: int = Field(0)


# ============================================================================
# INTENT CLASSIFIER & CHAT GENERATION SCHEMAS
# ============================================================================

QueryIntentType = Literal['DEFINITIONAL', 'PROTOCOL', 'TROUBLESHOOTING', 'COMPARATIVE', 'OUT_OF_SCOPE']


class IntentClassificationRequest(BaseModel):
    query: str = Field(..., description="User question or scientific prompt")
    context: Optional[str] = Field(None, description="Optional conversation context")


class IntentClassificationResult(BaseModel):
    intent: QueryIntentType = Field(..., description="Classified intent category")
    isInScope: bool = Field(..., description="Whether query is in scope of AbbVie Platform")
    confidence: float = Field(..., description="Confidence score 0.0-1.0")
    rationale: str = Field(..., description="Classifier reasoning")
    suggestedTemplate: str = Field(..., description="Assigned prompt template name")


class CitationItem(BaseModel):
    docId: str = Field(..., description="Source document ID")
    page: int = Field(1, description="Source page number")
    snippet: str = Field(..., description="Relevant supporting text excerpt")
    citationTag: str = Field(..., description="Tag e.g. [[source:EL-2026-00002538#1]]")


class ChatGenerateRequest(BaseModel):
    query: str = Field(..., description="Scientific inquiry prompt")
    conversationId: Optional[str] = Field(None, description="Conversation session ID")
    overrideIntent: Optional[QueryIntentType] = Field(None, description="Optional manual intent override")


class ChatGenerateResponse(BaseModel):
    intent: QueryIntentType = Field(..., description="Classified intent")
    isInScope: bool = Field(..., description="Scope filter pass/fail")
    response: str = Field(..., description="Structured grounded response text")
    citations: List[CitationItem] = Field(default_factory=list, description="Extracted ground-truth citations")
    sources: List[str] = Field(default_factory=list, description="Source document identifiers")
    templateApplied: str = Field(..., description="Applied prompt template format")
    latencyMs: float = Field(0.0, description="End-to-end execution time in milliseconds")


# ============================================================================
# SESSION STATE & BOUNDED CLARIFICATION SCHEMAS
# ============================================================================

class ChatMessageTurn(BaseModel):
    role: Literal['user', 'assistant', 'system']
    content: str
    intent: Optional[QueryIntentType] = None
    citations: List[CitationItem] = Field(default_factory=list)
    isClarification: bool = False
    isPivot: bool = False
    timestamp: str = Field(default="")


class ThreadSessionData(BaseModel):
    threadId: str = Field(..., description="Unique thread/session ID")
    title: str = Field("New Scientific Inquiry Session", description="Session display title")
    history: List[ChatMessageTurn] = Field(default_factory=list)
    clarificationCount: int = Field(0, description="Active clarification loop count (0-2)")
    createdAt: str
    updatedAt: str


class CreateSessionRequest(BaseModel):
    threadId: Optional[str] = Field(None, description="Optional custom thread ID")
    title: Optional[str] = Field(None, description="Optional session title")


class SessionChatRequest(BaseModel):
    message: str = Field(..., description="User message prompt")
    overrideIntent: Optional[QueryIntentType] = Field(None, description="Optional manual intent override")


class SessionChatResponse(BaseModel):
    threadId: str
    intent: QueryIntentType
    response: str
    citations: List[CitationItem] = Field(default_factory=list)
    clarificationCount: int
    isPivot: bool = Field(False, description="Whether session pivoted to best-effort answer with QC checks")
    assumptions: List[str] = Field(default_factory=list, description="Explicit assumptions made upon pivot")
    qcSuggestions: List[str] = Field(default_factory=list, description="Actionable QC and instrument diagnostic checks")
    latencyMs: float = 0.0


class PlatformDatabase(BaseModel):
    indications: List[Indication]
    archTargets: List[ARCHTarget]
    clinicalTrials: List[ClinicalTrial]
    comboMechanisms: List[ComboMechanism]
    preclinicalSample: PreclinicalSampleData
    provenanceRecords: List[ProvenanceRecord]
    threads: List[ThreadState] = Field(default_factory=list)
