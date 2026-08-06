import pytest
import time
from fastapi.testclient import TestClient
from main import app
from services.intent_classifier import IntentClassifier, get_intent_classifier
from services.prompt_builder import PromptBuilderAndGenerator, get_prompt_builder
from models.schemas import IntentClassificationResult, ChatGenerateResponse


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def classifier():
    return get_intent_classifier()


@pytest.fixture
def generator():
    return get_prompt_builder()


def test_intent_classification_categories(classifier):
    # 1. Definitional
    res_def = classifier.classify("What is mTORC1 in IL-23 signaling?")
    assert res_def.intent == "DEFINITIONAL"
    assert res_def.isInScope is True

    # 2. Protocol
    res_proto = classifier.classify("How do I run the imiquimod skin inflammation protocol?")
    assert res_proto.intent == "PROTOCOL"
    assert res_proto.isInScope is True

    # 3. Troubleshooting
    res_trouble = classifier.classify("My γδ17 T-cell assay readings are inconsistent")
    assert res_trouble.intent == "TROUBLESHOOTING"
    assert res_trouble.isInScope is True

    # 4. Comparative
    res_comp = classifier.classify("Compare oral vs topical administration of candidate inhibitors")
    assert res_comp.intent == "COMPARATIVE"
    assert res_comp.isInScope is True

    # 5. Out of Scope
    res_out = classifier.classify("What is the weather today in Boston?")
    assert res_out.intent == "OUT_OF_SCOPE"
    assert res_out.isInScope is False


def test_scope_filter_and_performance(classifier):
    # Ambiguous scientific query MUST be assumed in-scope
    res_ambiguous = classifier.classify("Target biology of gp130")
    assert res_ambiguous.isInScope is True

    # Latency test: must be < 300ms
    start = time.time()
    for _ in range(10):
        classifier.classify("Explain TYK2 inhibition")
    elapsed = (time.time() - start) / 10.0
    assert elapsed < 0.30  # Less than 300ms


def test_strict_citation_and_templates(generator):
    # 1. Definitional: 2-4 sentences + citation tag
    res_def = generator.generate_response("What is mTORC1 in IL-23 signaling?")
    assert res_def.intent == "DEFINITIONAL"
    assert len(res_def.citations) > 0
    assert "[[source:" in res_def.response
    assert "[[source:EL-2026-00002538#1]]" in res_def.response or "[[source:PUB-34982103#1]]" in res_def.response

    # 2. Protocol: Numbered steps + citations
    res_proto = generator.generate_response("How do I run the imiquimod skin inflammation protocol?")
    assert res_proto.intent == "PROTOCOL"
    assert "1." in res_proto.response
    assert "2." in res_proto.response
    assert "[[source:" in res_proto.response

    # 3. Troubleshooting: Mandatory PI review caveat + diagnostic checklist
    res_trouble = generator.generate_response("My γδ17 T-cell assay readings are inconsistent")
    assert res_trouble.intent == "TROUBLESHOOTING"
    assert "This diagnostic guidance is a starting point and does not replace PI or lab-lead review." in res_trouble.response
    assert "[[source:" in res_trouble.response

    # 4. Comparative: Evidence synthesis + quantitative citations
    res_comp = generator.generate_response("Compare oral vs topical administration of candidate inhibitors")
    assert res_comp.intent == "COMPARATIVE"
    assert "Oral" in res_comp.response and "Topical" in res_comp.response
    assert "[[source:" in res_comp.response


def test_chat_api_endpoints(client):
    # 1. Test POST /api/chat/classify
    res_c = client.post("/api/chat/classify", json={"query": "What is TYK2?"})
    assert res_c.status_code == 200
    data_c = res_c.json()
    assert data_c["intent"] == "DEFINITIONAL"
    assert data_c["isInScope"] is True

    # 2. Test POST /api/chat/generate
    res_g = client.post("/api/chat/generate", json={"query": "My γδ17 T-cell assay readings are inconsistent"})
    assert res_g.status_code == 200
    data_g = res_g.json()
    assert data_g["intent"] == "TROUBLESHOOTING"
    assert len(data_g["citations"]) > 0
    assert "This diagnostic guidance is a starting point and does not replace PI or lab-lead review." in data_g["response"]
