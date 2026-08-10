export interface BoundingBox {
  page?: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
}

export type DocumentType = 'ELN' | 'PubMed' | 'IDMP-Ontology' | 'SOP' | 'CSR';

export interface ProvenanceRecord {
  sourceDocId: string;
  docTitle: string;
  docType: DocumentType;
  snippet: string;
  pageNumber: number;
  boundingBox: BoundingBox;
  confidenceScore: number;
}

export type IndicationName = 'Systemic Lupus Erythematosus' | 'Hidradenitis Suppurativa' | string;

export interface Indication {
  id: string;
  name: IndicationName;
  description: string;
  therapeuticArea?: string;
}

export type DevelopmentStatus = 'Phase 1' | 'Phase 2' | 'Phase 3' | 'Launched' | 'Discontinued';

export interface ARCHTarget {
  gene: string;
  ensemblId: string;
  disease: string;
  archVersion: string;
  swagStrength: number;
  swagScore: number;
  swagScoreNoClin: number;
  pathwayCausal: number;
  genetic: number;
  pathwayGeneral: number;
  clinicalMao: number;
  currentDevStatus: DevelopmentStatus;
  links: string[];
}

export interface ClinicalTrial {
  studyNumber: string;
  studyTitle: string;
  therapeuticArea: string;
  drugName: string;
  compound: string;
  indication: string;
  startYear: number;
  phase: string;
  mainFindings: string;
  bottomLine: string;
  registryUrl: string;
}

export type ToxicityRisk = 'Low' | 'Moderate' | 'Severe';

export interface ComboMechanism {
  moa1: string;
  moa2: string;
  disease: string;
  ta: string;
  swag1: number;
  swag2: number;
  dualActivity: number;
  expectedResult: string;
  sabIntact: number;
  compositeAiScore: number;
  toxicityRisk: ToxicityRisk;
}

export type RouteOfAdmin = 'intraperitoneal' | 'oral' | 'topical';

export interface DosageArmMetric {
  route: RouteOfAdmin;
  dose: string;
  ic50: number;
  unit: string;
  log2FC: number;
  pValue: number;
  efficacyPercent: number;
}

export interface CompoundPreclinicalData {
  compoundId: string;
  compoundName: string;
  mechanism: string;
  log2FC: number;
  pValue: number;
  ic50Ip?: number | null;
  ic50Oral?: number | null;
  ic50Topical?: number | null;
  dosageArms: DosageArmMetric[];
  validationNotes: string;
}

export interface PreclinicalSampleData {
  assayType: 'in vitro' | 'in vivo';
  cellLine: 'γδ17 T-cell' | string;
  targetPathway: 'IL-23 / mTORC1 / mTORC2 / Src family kinases' | string;
  compoundSource: 'FDA-Approved Repurposing Screen' | string;
  modelSystem: 'imiquimod-induced skin inflammation' | string;
  routesOfAdmin: RouteOfAdmin[];
  validationStatus: 'validated in primary cells' | string;
  abstract: string;
  compounds: CompoundPreclinicalData[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  provenance?: ProvenanceRecord[];
}

export interface ThreadState {
  threadId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  clarificationTurnCount: number;
}

// ============================================================================
// LANGEXTRACT SCIENTIFIC DOCUMENT PARSING TYPES
// ============================================================================

export interface ExtractedCompound {
  compoundId: string;
  lotNumber?: string | null;
  rootNumber?: string | null;
  commonName?: string | null;
  mechanism?: string | null;
  boundingBox?: BoundingBox | null;
}

export interface ExtractedPathway {
  pathwayName: string;
  targetFamily?: string | null;
  biologicalRole?: string | null;
  boundingBox?: BoundingBox | null;
}

export interface ExtractedAssayModel {
  assayName: string;
  modelType: 'in vitro' | 'in vivo' | 'ex vivo';
  system?: string | null;
  validationStatus?: string | null;
  boundingBox?: BoundingBox | null;
}

export interface ExtractedQuantitativeMetric {
  entity: string;
  metricType: string;
  condition?: string | null;
  value: number;
  unit?: string | null;
  log2FC?: number | null;
  pValue?: number | null;
  ic50?: number | null;
  boundingBox?: BoundingBox | null;
}

export interface ExtractedTriple {
  subject: string;
  predicate: string;
  object: string;
  confidence: number;
  provenance?: ProvenanceRecord | null;
}

export interface ExtractionResult {
  documentId: string;
  title: string;
  docType: DocumentType;
  compounds: ExtractedCompound[];
  pathways: ExtractedPathway[];
  assayModels: ExtractedAssayModel[];
  routesOfAdmin: RouteOfAdmin[];
  quantitativeMatrix: ExtractedQuantitativeMetric[];
  triples: ExtractedTriple[];
  confidenceScore: number;
  rawText?: string | null;
  boundingBoxes: BoundingBox[];
}

export interface DocumentExtractRequest {
  documentId?: string;
  text?: string;
  docType?: DocumentType;
  sampleDocKey?: string;
}

// ============================================================================
// 3D GRAPH & GTM SCORER TYPES
// ============================================================================

export type NodeType =
  | 'Gene'
  | 'Compound'
  | 'Drug'
  | 'DrugProduct'
  | 'DrugConcept'
  | 'CompoundSubstance'
  | 'Ingredient'
  | 'Assay'
  | 'Endpoint'
  | 'Disease'
  | 'HealthCondition'
  | 'PatientAdverseEvent'
  | 'Pathway'
  | 'Variant'
  | 'Tissue'
  | 'CellLine'
  | 'CellType'
  | string;

export interface Graph3DNode {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  swagScore?: number | null;
  swagStrength?: number | null;
  causalScore?: number | null;
  geneticScore?: number | null;
  currentDevStatus?: string | null;
  details?: Record<string, any>;
}

export type RelationshipType =
  | 'HAS_ACTIVITY_AGAINST'
  | 'HAS_ANTAGONISM_AGAINST'
  | 'HAS_AGONISM_AGAINST'
  | 'ASSOCIATED_WITH'
  | 'INCREASES_PHOSPHORYLATION'
  | 'AFFECTS_TRANSLOCATION'
  | 'SHARES_PATHWAY_WITH'
  | 'TESTED_IN_CLINICAL_TRIALS_FOR'
  | 'APPROVED_TREATMENT_FOR'
  | 'HAS_SWAG_SCORE'
  | 'HAS_HUMAN_GENETICS_EVIDENCE_ASSOCIATION'
  | 'WAS_STUDIED'
  | 'TARGETS'
  | 'INHIBITS'
  | 'EXPRESSION_MODULATED_BY'
  | 'EVALUATED_IN'
  | 'COMBINED_WITH'
  | 'SIGNALING_INTERACTION'
  | string;

export interface Graph3DEdge {
  id: string;
  source: string;
  target: string;
  relationship: RelationshipType;
  weight: number;
  strength?: number;
  confidence?: number;
  sabIntact?: number | null;
  compositeAiScore?: number | null;
  color?: string | null;
}

export interface Graph3DTopology {
  nodes: Graph3DNode[];
  edges: Graph3DEdge[];
  metrics: Record<string, any>;
}

export interface MOARanking {
  gene: string;
  swagScore: number;
  swagStrength: number;
  causalScore: number;
  geneticScore: number;
  currentDevStatus: string;
  rank: number;
}

export interface ComboRanking {
  moa1: string;
  moa2: string;
  compositeAiScore: number;
  sabIntact: number;
  dualActivity: number;
  toxicityRisk: ToxicityRisk;
  rank: number;
}

export interface CypherQueryRequest {
  query: string;
}

export interface CypherQueryResponse {
  backend: 'Neo4j' | 'SQLite-Graph-Engine';
  query: string;
  results: Record<string, any>[];
  count: number;
}

// ============================================================================
// INTENT CLASSIFIER & CHAT GENERATION TYPES
// ============================================================================

export type QueryIntentType = 'DEFINITIONAL' | 'PROTOCOL' | 'TROUBLESHOOTING' | 'COMPARATIVE' | 'OUT_OF_SCOPE';

export interface IntentClassificationRequest {
  query: string;
  context?: string | null;
}

export interface IntentClassificationResult {
  intent: QueryIntentType;
  isInScope: boolean;
  confidence: number;
  rationale: string;
  suggestedTemplate: string;
}

export interface CitationItem {
  docId: string;
  page: number;
  snippet: string;
  citationTag: string;
}

export interface ChatGenerateRequest {
  query: string;
  conversationId?: string | null;
  overrideIntent?: QueryIntentType | null;
}

export interface ChatGenerateResponse {
  intent: QueryIntentType;
  isInScope: boolean;
  response: string;
  citations: CitationItem[];
  sources: string[];
  templateApplied: string;
  latencyMs: number;
}

// ============================================================================
// SESSION STATE & BOUNDED CLARIFICATION TYPES
// ============================================================================

export interface ChatMessageTurn {
  role: 'user' | 'assistant' | 'system';
  content: string;
  intent?: QueryIntentType | null;
  citations?: CitationItem[];
  isClarification?: boolean;
  isPivot?: boolean;
  timestamp?: string;
}

export interface ThreadSessionData {
  threadId: string;
  title: string;
  history: ChatMessageTurn[];
  clarificationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionRequest {
  threadId?: string | null;
  title?: string | null;
}

export interface SessionChatRequest {
  message: string;
  overrideIntent?: QueryIntentType | null;
}

export interface SessionChatResponse {
  threadId: string;
  intent: QueryIntentType;
  response: string;
  citations: CitationItem[];
  clarificationCount: number;
  isPivot: boolean;
  assumptions: string[];
  qcSuggestions: string[];
  latencyMs: number;
}

// ============================================================================
// GOLDEN EVALUATION DATASET TYPES
// ============================================================================

export interface GoldenTestCase {
  id: string;
  query: string;
  expected_intent: QueryIntentType;
  expected_source_topic: string;
  golden_answer: string;
  notes: string;
}

export interface GoldenDatasetSummary {
  totalCases: number;
  scientificCases: number;
  adversarialCases: number;
  distribution: Record<string, number>;
}

export interface GoldenDatasetResponse {
  summary: GoldenDatasetSummary;
  cases: GoldenTestCase[];
}

export interface CaseEvaluationResult {
  caseId: string;
  query: string;
  expectedIntent: QueryIntentType;
  predictedIntent: QueryIntentType;
  intentMatch: boolean;
  classificationConfidence: number;
  expectedSourceTopic: string;
  goldenAnswer: string;
  generatedResponse: string;
  citations: CitationItem[];
  notes: string;
  latencyMs: number;
}

export interface CaseEvaluationReport {
  caseId: string;
  query: string;
  intent: string;
  faithfulness: number;
  responseRelevancy: number;
  contextPrecision: number;
  contextRecall: number;
  contextEntityRecall: number;
  answerCorrectness: number;
  answerSimilarity: number;
  formatAdherence: number;
  claimGroundedness: number;
  groundednessStatus: 'PASSED' | 'NEEDS_REVIEW' | string;
  ungroundedClaims: string[];
  allQuantitativeClaims: string[];
  generatedResponse: string;
  retrievedContext: string;
  passedAllThresholds: boolean;
}

export interface RagasCategorySummary {
  count: number;
  meanFaithfulness: number;
  meanClaimGroundedness: number;
  meanFormatAdherence: number;
}

export interface RagasViolationRecord {
  caseId: string;
  query: string;
  intent: string;
  claimGroundedness: number;
  status: string;
  ungroundedClaims: string[];
  excerpt: string;
}

export interface RagasEvaluationSummary {
  totalEvaluated: number;
  meanFaithfulness: number;
  meanResponseRelevancy: number;
  meanContextPrecision: number;
  meanContextRecall: number;
  meanContextEntityRecall: number;
  meanAnswerCorrectness: number;
  meanAnswerSimilarity: number;
  meanFormatAdherence: number;
  meanClaimGroundedness: number;
  thresholds: Record<string, number>;
  categoryBreakdown: Record<string, RagasCategorySummary>;
  violationsTable: RagasViolationRecord[];
  knownLimitations: string;
}

// ============================================================================
// SCIENTIFIC PROMPT HARDENING TYPES
// ============================================================================

export interface PitfallItem {
  pitfall: string;
  riskLevel: 'HIGH' | 'MODERATE' | 'CRITICAL' | string;
  mitigation: string;
}

export interface HardenedPromptResult {
  originalQuery: string;
  targetDomain: string;
  hypothesis: string;
  pitfallAnalysis: PitfallItem[];
  peerContextualization: string;
  hardenedPrompt: string;
  injectedConstraints: string[];
  positiveControlDemanded: string;
  negativeControlDemanded: string;
  counterFactualDemanded: string;
  scientificJustification: string;
}

export interface PlatformDatabase {
  indications: Indication[];
  archTargets: ARCHTarget[];
  clinicalTrials: ClinicalTrial[];
  comboMechanisms: ComboMechanism[];
  preclinicalSample: PreclinicalSampleData;
  provenanceRecords: ProvenanceRecord[];
  threads?: ThreadState[];
}
