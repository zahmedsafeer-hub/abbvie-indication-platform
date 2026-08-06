import pytest
from fastapi.testclient import TestClient
from main import app
from services.eval_dataset import get_eval_dataset, GoldenDatasetLoader, GoldenTestCase


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def loader():
    return get_eval_dataset()


def test_golden_dataset_total_count_and_distribution(loader):
    dataset = loader.dataset
    assert len(dataset) == 45, f"Expected exactly 45 golden test cases, found {len(dataset)}"

    summary = loader.get_summary()
    assert summary["totalCases"] == 45
    assert summary["scientificCases"] == 40
    assert summary["adversarialCases"] == 5

    dist = summary["distribution"]
    # Check category counts
    definitional_count = len(loader.filter_by_intent("DEFINITIONAL"))
    protocol_count = len(loader.filter_by_intent("PROTOCOL"))
    troubleshooting_count = len(loader.filter_by_intent("TROUBLESHOOTING"))
    comparative_count = len(loader.filter_by_intent("COMPARATIVE"))
    out_of_scope_count = len(loader.filter_by_intent("OUT_OF_SCOPE"))

    # Scientific counts: 10 Def + 2 Adv Def = 12 total Def; 15 Protocol; 10 Trouble + 1 Adv Trouble = 11; 5 Comp; 2 Adv Out-of-Scope
    assert protocol_count == 15
    assert comparative_count == 5


def test_golden_dataset_schema_integrity(loader):
    valid_intents = {"DEFINITIONAL", "PROTOCOL", "TROUBLESHOOTING", "COMPARATIVE", "OUT_OF_SCOPE"}
    
    seen_ids = set()
    for case in loader.dataset:
        assert case.id not in seen_ids, f"Duplicate ID detected: {case.id}"
        seen_ids.add(case.id)

        assert len(case.query.strip()) > 5, f"Query too short for {case.id}"
        assert case.expected_intent in valid_intents, f"Invalid intent {case.expected_intent} for {case.id}"
        assert len(case.expected_source_topic.strip()) > 0, f"Missing source topic for {case.id}"
        assert len(case.golden_answer.strip()) > 20, f"Missing golden answer for {case.id}"
        assert len(case.notes.strip()) > 0, f"Missing notes for {case.id}"


def test_adversarial_test_cases(loader):
    adv_cases = [c for c in loader.dataset if c.id.startswith("ADV")]
    assert len(adv_cases) == 5, f"Expected 5 adversarial cases, found {len(adv_cases)}"

    # ADV-001: Off-topic general query
    adv1 = loader.get_case_by_id("ADV-001")
    assert adv1 is not None
    assert adv1.expected_intent == "OUT_OF_SCOPE"
    assert "capital of France" in adv1.query

    # ADV-002: Vague query requiring bounded clarification
    adv2 = loader.get_case_by_id("ADV-002")
    assert adv2 is not None
    assert adv2.expected_intent == "TROUBLESHOOTING"
    assert "failed" in adv2.query

    # ADV-003: False premise rejection
    adv3 = loader.get_case_by_id("ADV-003")
    assert adv3 is not None
    assert "Compound X-99999" in adv3.query
    assert "not recognized entities" in adv3.golden_answer

    # ADV-004: Stock price
    adv4 = loader.get_case_by_id("ADV-004")
    assert adv4 is not None
    assert adv4.expected_intent == "OUT_OF_SCOPE"

    # ADV-005: Medical advice
    adv5 = loader.get_case_by_id("ADV-005")
    assert adv5 is not None
    assert "human patient" in adv5.query
    assert "cannot provide clinical prescribing directives" in adv5.golden_answer


def test_eval_api_endpoints(client):
    # 1. Get full dataset
    res = client.get("/api/eval/dataset")
    assert res.status_code == 200
    data = res.json()
    assert data["summary"]["totalCases"] == 45
    assert len(data["cases"]) == 45

    # 2. Get specific case
    res_case = client.get("/api/eval/case/DEF-001")
    assert res_case.status_code == 200
    case_data = res_case.json()
    assert case_data["id"] == "DEF-001"
    assert "STAT1" in case_data["query"]

    # 3. Live evaluation run against case
    res_run = client.post("/api/eval/run/DEF-001")
    assert res_run.status_code == 200
    run_data = res_run.json()
    assert run_data["caseId"] == "DEF-001"
    assert run_data["expectedIntent"] == "DEFINITIONAL"
    assert "generatedResponse" in run_data
    assert len(run_data["citations"]) > 0
