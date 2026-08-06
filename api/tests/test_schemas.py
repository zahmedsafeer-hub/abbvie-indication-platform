import pytest
import json
from pathlib import Path
from fastapi.testclient import TestClient

from models.schemas import (
    Indication,
    ARCHTarget,
    ClinicalTrial,
    ComboMechanism,
    DosageArmMetric,
    CompoundPreclinicalData,
    PreclinicalSampleData,
    ProvenanceRecord,
    BoundingBox,
    ThreadState,
    PlatformDatabase,
)
from data.db import get_data_engine
from main import app


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def engine():
    return get_data_engine()


def test_mock_db_loads_properly(engine):
    db = engine.db
    assert isinstance(db, PlatformDatabase)
    assert len(db.indications) >= 2
    assert len(db.archTargets) == 8
    assert len(db.clinicalTrials) == 12
    assert len(db.comboMechanisms) == 11
    assert db.preclinicalSample is not None
    assert len(db.provenanceRecords) >= 5


def test_arch_targets_slide11(engine):
    targets = engine.get_targets()
    assert len(targets) == 8
    expected_genes = {"TLR7", "IL2", "IL2RA", "TYK2", "TNF", "IL10", "IL6", "NR3C1"}
    actual_genes = {t.gene for t in targets}
    assert actual_genes == expected_genes

    for target in targets:
        assert target.ensemblId.startswith("ENSG")
        assert target.disease == "Systemic Lupus Erythematosus"
        assert target.archVersion == "v2.4"
        assert 0.0 <= target.swagStrength <= 1.0
        assert target.swagScore > 0
        assert target.swagScoreNoClin > 0
        assert target.currentDevStatus in ['Phase 1', 'Phase 2', 'Phase 3', 'Launched', 'Discontinued']
        assert len(target.links) > 0


def test_clinical_trials_slides14_15(engine):
    trials = engine.get_trials()
    assert len(trials) == 12
    expected_studies = {
        "M14-5521",
        "M14-5522",
        "M14-5623",
        "M13-093",
        "M14-562",
        "M16-044",
        "M16-763",
        "M23-699",
        "M25-433",
        "M16-356",
        "M19-130",
        "M20-186",
    }
    actual_studies = {t.studyNumber for t in trials}
    assert actual_studies == expected_studies

    # Verify M19-130 ABBV-599
    m19_130 = engine.get_trial_by_study_number("M19-130")
    assert m19_130 is not None
    assert "ABBV-599" in m19_130.compound
    assert "Elsubrutinib" in m19_130.drugName
    assert "Upadacitinib" in m19_130.drugName
    assert "NCT03978520" in m19_130.mainFindings


def test_combo_mechanisms_slide16(engine):
    combos = engine.get_combos()
    assert len(combos) == 11

    # Check that all combos have moa1 == IL6
    for c in combos:
        assert c.moa1 == "IL6"
        assert c.toxicityRisk in ['Low', 'Moderate', 'Severe']
        assert c.compositeAiScore > 0
        assert 0.0 <= c.sabIntact <= 1.0

    expected_moa2 = {
        "TNFSF13B",
        "TYK2",
        "TNFRSF13C",
        "NR3C1",
        "MS4A1",
        "TNFSF4",
        "JAK3",
        "JAK1",
        "NFKB1",
        "PDE4B",
        "TGFB1",
    }
    actual_moa2 = {c.moa2 for c in combos}
    assert actual_moa2 == expected_moa2

    # Verify specific scores from Slide 16
    tnfsf13b_combo = [c for c in combos if c.moa2 == "TNFSF13B"][0]
    assert tnfsf13b_combo.compositeAiScore == 7.58
    assert tnfsf13b_combo.sabIntact == 0.80

    tyk2_combo = [c for c in combos if c.moa2 == "TYK2"][0]
    assert tyk2_combo.compositeAiScore == 7.57


def test_preclinical_repurposing_screen(engine):
    preclinical = engine.get_preclinical_sample()
    assert preclinical.cellLine == "γδ17 T-cell"
    assert preclinical.targetPathway == "IL-23 / mTORC1 / mTORC2 / Src family kinases"
    assert preclinical.compoundSource == "FDA-Approved Repurposing Screen"
    assert preclinical.modelSystem == "imiquimod-induced skin inflammation"
    assert set(preclinical.routesOfAdmin) == {"intraperitoneal", "oral", "topical"}
    assert preclinical.validationStatus == "validated in primary cells"
    assert "We developed an in vitro model using a γδ17 T-cell line" in preclinical.abstract

    expected_compounds = {"A-1984701.0", "A-2208690.0", "Rapamycin", "Tofacitinib", "Dasatinib"}
    actual_compounds = {c.compoundId for c in preclinical.compounds}
    assert actual_compounds == expected_compounds

    for comp in preclinical.compounds:
        assert comp.log2FC < 0  # Repurposing hits demonstrate suppression
        assert comp.pValue < 0.05
        assert len(comp.dosageArms) == 3
        routes = {arm.route for arm in comp.dosageArms}
        assert routes == {"intraperitoneal", "oral", "topical"}
        for arm in comp.dosageArms:
            assert arm.ic50 > 0
            assert arm.efficacyPercent > 50.0


def test_provenance_records_and_threads(engine):
    records = engine.get_provenance_records()
    assert len(records) >= 5
    types = {r.docType for r in records}
    assert {"ELN", "PubMed", "IDMP-Ontology", "SOP", "CSR"}.issubset(types)

    for r in records:
        assert 0.0 <= r.confidenceScore <= 1.0
        assert r.boundingBox.x1 < r.boundingBox.x2
        assert r.boundingBox.y1 < r.boundingBox.y2

    threads = engine.get_threads()
    assert len(threads) >= 1
    t = threads[0]
    assert len(t.messages) >= 2


def test_fastapi_endpoints(client):
    res_health = client.get("/api/health")
    assert res_health.status_code == 200
    data = res_health.json()
    assert data["status"] == "ok"
    assert "Data Engine Initialized: 8 ARCH Targets, 12 Trials, 11 Combos, 1 Repurposing Screen (γδ17 T-cell / IL-23 / mTORC1/2)" in data["message"]

    res_targets = client.get("/api/targets")
    assert res_targets.status_code == 200
    assert len(res_targets.json()) == 8

    res_target_tlr7 = client.get("/api/targets/TLR7")
    assert res_target_tlr7.status_code == 200
    assert res_target_tlr7.json()["gene"] == "TLR7"

    res_trials = client.get("/api/trials")
    assert res_trials.status_code == 200
    assert len(res_trials.json()) == 12

    res_combos = client.get("/api/combos")
    assert res_combos.status_code == 200
    assert len(res_combos.json()) == 11

    res_graph = client.get("/api/combos/graph")
    assert res_graph.status_code == 200
    assert "cytoscape" in res_graph.json()
    assert res_graph.json()["metrics"]["num_edges"] == 11

    res_preclinical = client.get("/api/preclinical/sample")
    assert res_preclinical.status_code == 200
    assert res_preclinical.json()["cellLine"] == "γδ17 T-cell"
