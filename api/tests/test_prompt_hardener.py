import pytest
from fastapi.testclient import TestClient
from main import app
from services.prompt_hardener import get_prompt_hardener, ScientificPromptHardener


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def hardener():
    return get_prompt_hardener()


def test_scientific_prompt_hardening_workflow(hardener):
    query = "Evaluate TYK2 and mTORC1 inhibition in γδ17 T-cells"
    res = hardener.harden_prompt(query)

    assert res.originalQuery == query
    assert "Kinase Signaling" in res.targetDomain
    assert len(res.pitfallAnalysis) >= 2
    assert "Off-Target Pan-Kinase Toxicity" in res.pitfallAnalysis[0].pitfall
    assert len(res.injectedConstraints) >= 4
    assert "recombinant mouse IL-23" in res.positiveControlDemanded
    assert "0.1% DMSO" in res.negativeControlDemanded
    assert len(res.counterFactualDemanded) > 10
    assert "PhD-level Principal Research Scientist" in res.hardenedPrompt


def test_prompt_hardener_api_endpoint(client):
    payload = {"query": "Investigate IL-6 and BAFF synergy in SLE"}
    response = client.post("/api/prompt/harden", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert "hardenedPrompt" in data
    assert "pitfallAnalysis" in data
    assert len(data["injectedConstraints"]) > 0
    assert "scientificJustification" in data
