from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from services.eval_dataset import get_eval_dataset, GoldenTestCase
from services.intent_classifier import get_intent_classifier
from services.prompt_builder import get_prompt_builder
from eval.ragas_suite import (
    get_ragas_evaluator,
    RagasEvaluationSummary,
    CaseEvaluationReport,
)

router = APIRouter(prefix="/eval", tags=["Golden Evaluation Dataset & RAGAS Metrics"])


@router.get("/dataset")
def get_dataset():
    loader = get_eval_dataset()
    return {
        "summary": loader.get_summary(),
        "cases": loader.dataset,
    }


@router.get("/case/{case_id}", response_model=GoldenTestCase)
def get_case(case_id: str):
    loader = get_eval_dataset()
    case = loader.get_case_by_id(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Test case not found")
    return case


@router.post("/run/{case_id}")
def run_case_evaluation(case_id: str):
    loader = get_eval_dataset()
    case = loader.get_case_by_id(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Test case not found")

    classifier = get_intent_classifier()
    prompt_builder = get_prompt_builder()

    classification = classifier.classify(case.query)
    gen = prompt_builder.generate_response(case.query)

    intent_match = classification.intent == case.expected_intent

    return {
        "caseId": case.id,
        "query": case.query,
        "expectedIntent": case.expected_intent,
        "predictedIntent": classification.intent,
        "intentMatch": intent_match,
        "classificationConfidence": classification.confidence,
        "expectedSourceTopic": case.expected_source_topic,
        "goldenAnswer": case.golden_answer,
        "generatedResponse": gen.response,
        "citations": gen.citations,
        "notes": case.notes,
        "latencyMs": gen.latencyMs,
    }


@router.post("/ragas/run", response_model=RagasEvaluationSummary)
def run_ragas_benchmark(max_cases: Optional[int] = Query(None, description="Max cases to evaluate")):
    evaluator = get_ragas_evaluator()
    return evaluator.evaluate_all(max_cases=max_cases)


@router.post("/ragas/case/{case_id}", response_model=CaseEvaluationReport)
def run_ragas_case_evaluation(case_id: str):
    loader = get_eval_dataset()
    case = loader.get_case_by_id(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Test case not found")
    evaluator = get_ragas_evaluator()
    return evaluator.evaluate_case(case)
