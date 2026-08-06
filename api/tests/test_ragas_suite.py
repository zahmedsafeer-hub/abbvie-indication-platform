import pytest
from fastapi.testclient import TestClient
from main import app
from eval.ragas_suite import (
    RagasEvaluator,
    get_ragas_evaluator,
    RAGAS_THRESHOLDS,
    KNOWN_LIMITATIONS,
)
from services.eval_dataset import get_eval_dataset, GoldenTestCase


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def evaluator():
    return RagasEvaluator()


def test_standard_ragas_metrics_computation(evaluator):
    loader = get_eval_dataset()
    case = loader.get_case_by_id("DEF-001")
    assert case is not None

    rep = evaluator.evaluate_case(case)

    # Standard metrics assertion
    assert 0.0 <= rep.faithfulness <= 1.0
    assert 0.0 <= rep.responseRelevancy <= 1.0
    assert 0.0 <= rep.contextPrecision <= 1.0
    assert 0.0 <= rep.contextRecall <= 1.0
    assert 0.0 <= rep.contextEntityRecall <= 1.0
    assert 0.0 <= rep.answerCorrectness <= 1.0
    assert 0.0 <= rep.answerSimilarity <= 1.0


def test_custom_format_adherence_metric(evaluator):
    # 1. Valid Definitional (concise + citation, no numbered list)
    valid_def = "STAT1 mediates Type I and II interferon signaling in SLE [[source:ARCH-TARGET-STAT1#1]]. It operates downstream of TYK2."
    score_def = evaluator.compute_format_adherence("DEFINITIONAL", valid_def)
    assert score_def >= 0.90

    # 2. Invalid Definitional (improperly includes protocol steps)
    bad_def = "1. Seed cells. 2. Incubate. STAT1 definition."
    score_bad_def = evaluator.compute_format_adherence("DEFINITIONAL", bad_def)
    assert score_bad_def < 0.70

    # 3. Valid Protocol (numbered steps)
    valid_prot = "1. Seed γδ17 T-cells at 2.5 x 10^5 cells/well. 2. Stimulate with IL-23 for 15 min [[source:EL-2026-00002538#1]]."
    score_prot = evaluator.compute_format_adherence("PROTOCOL", valid_prot)
    assert score_prot >= 0.90

    # 4. Valid Troubleshooting (actionable steps + PI review caveat)
    valid_tsh = "1. Verify laser calibration. 2. Verify buffer pH at 7.4. Notice: Guidance does not replace PI review [[source:EL-2026-00002538#1]]."
    score_tsh = evaluator.compute_format_adherence("TROUBLESHOOTING", valid_tsh)
    assert score_tsh >= 0.90


def test_zero_tolerance_claim_groundedness_flags_hallucinated_dosage(evaluator):
    """
    CRITICAL TEST: Verifies that an ungrounded quantitative claim
    (e.g., 'Upadacitinib 500mg daily' or 'IC50 = 999 nM')
    receives a strict score of 0.0 and status 'NEEDS_REVIEW' with ZERO partial credit.
    """
    loader = get_eval_dataset()
    case = loader.get_case_by_id("DEF-001")
    assert case is not None

    # Hallucinated response containing fabricated dosage '500mg' and fabricated IC50 '999 nM'
    hallucinated_response = (
        "Upadacitinib should be prescribed at 500mg daily for patients, achieving an ungrounded IC50 = 999 nM. "
        "STAT1 is active in SLE."
    )

    # Evaluate with hallucinated response override
    rep = evaluator.evaluate_case(case, response_override=hallucinated_response)

    # Must be strictly 0.0 and NEEDS_REVIEW
    assert rep.claimGroundedness == 0.0, f"Expected 0.0 for ungrounded claim, got {rep.claimGroundedness}"
    assert rep.groundednessStatus == "NEEDS_REVIEW"
    assert len(rep.ungroundedClaims) > 0

    # Verify that the ungrounded tokens were specifically identified
    ungrounded_str = " ".join(rep.ungroundedClaims)
    assert "500mg" in ungrounded_str or "500 mg" in ungrounded_str or "999 nM" in ungrounded_str or "999" in ungrounded_str

    # Contrast with grounded response
    grounded_response = (
        "STAT1 is a key downstream mediator of interferon signaling in SLE with an ARCH SWAG score of 7.92 [[source:ARCH-TARGET-STAT1#1]]. "
        "Phase 2 study M19-130 evaluated Upadacitinib at 30 mg QD achieving SRI-4 of 68.2% (p=0.003)."
    )
    rep_grounded = evaluator.evaluate_case(case, response_override=grounded_response)
    assert rep_grounded.claimGroundedness == 1.0
    assert rep_grounded.groundednessStatus == "PASSED"
    assert len(rep_grounded.ungroundedClaims) == 0


def test_full_ragas_evaluation_and_summary_reporting(evaluator):
    # Run benchmark over first 5 cases
    summary = evaluator.evaluate_all(max_cases=5)

    assert summary.totalEvaluated == 5
    assert summary.meanFaithfulness >= 0.80
    assert summary.meanClaimGroundedness >= 0.90
    assert len(summary.categoryBreakdown) > 0
    assert len(summary.knownLimitations) > 50
    assert "LLM-as-a-Judge Semantic Drift" in summary.knownLimitations


def test_ragas_api_endpoints(client):
    # 1. Run live RAGAS case evaluation
    res_case = client.post("/api/eval/ragas/case/DEF-001")
    assert res_case.status_code == 200
    data_case = res_case.json()
    assert data_case["caseId"] == "DEF-001"
    assert "claimGroundedness" in data_case
    assert "groundednessStatus" in data_case

    # 2. Run live RAGAS benchmark summary
    res_bench = client.post("/api/eval/ragas/run?max_cases=3")
    assert res_bench.status_code == 200
    data_bench = res_bench.json()
    assert data_bench["totalEvaluated"] == 3
    assert "meanFaithfulness" in data_bench
    assert "categoryBreakdown" in data_bench
    assert "violationsTable" in data_bench
