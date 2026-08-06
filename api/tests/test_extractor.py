import pytest
from fastapi.testclient import TestClient
from main import app
from services.extractor import LangExtractEngine, get_extraction_engine
from services.doc_generator import get_slide22_eln_doc, get_gd17_pubmed_doc
from models.schemas import ExtractionResult, DocumentExtractRequest


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def engine():
    return get_extraction_engine()


def test_slide22_eln_extraction(engine):
    result = engine.extract_sample("slide22_eln")
    assert isinstance(result, ExtractionResult)
    assert result.documentId == "EL-2026-00002538"
    assert result.docType == "ELN"
    assert result.confidenceScore >= 0.92

    # Verify 100% extraction of compounds A-1984701.0, A-2208690.0
    compound_ids = {c.compoundId for c in result.compounds}
    assert "A-1984701.0" in compound_ids
    assert "A-2208690.0" in compound_ids

    # Check Lot & Root metadata extraction
    a198 = next(c for c in result.compounds if c.compoundId == "A-1984701.0")
    assert a198.lotNumber == "2669264"
    assert a198.rootNumber == "1984701"

    a220 = next(c for c in result.compounds if c.compoundId == "A-2208690.0")
    assert a220.lotNumber == "1883921"
    assert a220.rootNumber == "2208690"

    # Verify 100% extraction of target pathways (mTORC1, mTORC2, Src family kinases)
    pathway_names = {p.pathwayName for p in result.pathways}
    assert "mTORC1" in pathway_names
    assert "mTORC2" in pathway_names
    assert "Src family kinases" in pathway_names

    # Verify administration routes
    assert set(result.routesOfAdmin) == {"intraperitoneal", "oral", "topical"}

    # Verify quantitative matrix extraction
    metrics = {m.entity: m for m in result.quantitativeMatrix}
    assert any("LPAR1000" in k or "A-1984701.0" in k for k in metrics.keys())
    assert any("Tyk200" in k or "A-2208690.0" in k for k in metrics.keys())
    assert any("Combo" in k for k in metrics.keys())

    # Verify bounding boxes presence and coordinates
    assert len(result.boundingBoxes) > 0
    for bbox in result.boundingBoxes:
        assert bbox.page >= 1
        assert 0.0 <= bbox.x1 < bbox.x2 <= 1.0
        assert 0.0 <= bbox.y1 < bbox.y2 <= 1.0

    # Verify knowledge graph triples
    assert len(result.triples) >= 3
    for triple in result.triples:
        assert triple.confidence >= 0.92
        assert triple.subject
        assert triple.predicate
        assert triple.object


def test_gd17_pubmed_literature_extraction(engine):
    result = engine.extract_sample("gd17_pubmed")
    assert isinstance(result, ExtractionResult)
    assert result.documentId == "PUB-34982103"
    assert result.docType == "PubMed"
    assert result.confidenceScore >= 0.92

    compound_ids = {c.compoundId for c in result.compounds}
    assert "A-1984701.0" in compound_ids
    assert "A-2208690.0" in compound_ids
    assert "Rapamycin" in compound_ids
    assert "Dasatinib" in compound_ids
    assert "Tofacitinib" in compound_ids

    pathway_names = {p.pathwayName for p in result.pathways}
    assert "mTORC1" in pathway_names
    assert "mTORC2" in pathway_names
    assert "Src family kinases" in pathway_names

    assert set(result.routesOfAdmin) == {"intraperitoneal", "oral", "topical"}


def test_extract_endpoint(client):
    req_payload = {
        "sampleDocKey": "slide22_eln"
    }
    response = client.post("/api/extract/document", json=req_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["documentId"] == "EL-2026-00002538"
    assert data["confidenceScore"] >= 0.92
    assert any(c["compoundId"] == "A-1984701.0" for c in data["compounds"])
    assert any(c["compoundId"] == "A-2208690.0" for c in data["compounds"])
    assert any(p["pathwayName"] == "mTORC1" for p in data["pathways"])
    assert any(p["pathwayName"] == "mTORC2" for p in data["pathways"])
    assert any(p["pathwayName"] == "Src family kinases" for p in data["pathways"])


def test_custom_text_extraction(client):
    text = (
        "ELN Report: Screening of compound A-1984701.0 (Lot: 2669264, Root: 1984701) in γδ17 T-cell line "
        "targeting mTORC1 and Src family kinases via oral and intraperitoneal administration."
    )
    req_payload = {
        "documentId": "ELN-TEST-99",
        "text": text,
        "docType": "ELN"
    }
    response = client.post("/api/extract/document", json=req_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["documentId"] == "ELN-TEST-99"
    assert any(c["compoundId"] == "A-1984701.0" for c in data["compounds"])
    assert any(p["pathwayName"] == "mTORC1" for p in data["pathways"])
    assert any(p["pathwayName"] == "Src family kinases" for p in data["pathways"])
    assert "oral" in data["routesOfAdmin"]
    assert "intraperitoneal" in data["routesOfAdmin"]
