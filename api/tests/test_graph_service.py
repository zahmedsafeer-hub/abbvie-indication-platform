import pytest
from fastapi.testclient import TestClient
from main import app
from services.graph_service import ARCHGraphService, get_arch_graph_service
from services.gtm_scorer import GTMScorer
from models.schemas import Graph3DTopology, MOARanking, ComboRanking


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def service():
    return get_arch_graph_service()


def test_graph_service_topology_and_nodes(service):
    topo = service.get_3d_topology()
    assert isinstance(topo, Graph3DTopology)
    assert len(topo.nodes) >= 15
    assert len(topo.edges) >= 20

    node_ids = {n.id for n in topo.nodes}

    # 1. Asserts 8 MOA targets from Slide 11 are present
    expected_8_moas = {"TLR7", "IL2", "IL2RA", "TYK2", "TNF", "IL10", "IL6", "NR3C1"}
    assert expected_8_moas.issubset(node_ids)

    # 2. Asserts γδ17 / IL-23 / mTORC1/2 / Src pathway nodes are present
    expected_pathways_and_compounds = {
        "mTORC1",
        "mTORC2",
        "Src_Kinase",
        "A-1984701.0",
        "A-2208690.0",
        "γδ17_Tcell_IL23",
        "imiquimod_skin_inflammation",
    }
    assert expected_pathways_and_compounds.issubset(node_ids)

    # 3. Check 3D coordinates & bounds
    for n in topo.nodes:
        assert isinstance(n.x, float)
        assert isinstance(n.y, float)
        assert isinstance(n.z, float)
        assert n.size > 0
        assert n.color.startswith("#")


def test_graph_relationships(service):
    topo = service.get_3d_topology()
    rels = {e.relationship for e in topo.edges}
    expected_rels = {
        "TARGETS",
        "INHIBITS",
        "EXPRESSION_MODULATED_BY",
        "EVALUATED_IN",
        "COMBINED_WITH",
        "SIGNALING_INTERACTION",
    }
    assert expected_rels.issubset(rels)


def test_gtm_scorer_and_rankings(service):
    moa_ranks = service.get_moa_rankings()
    assert len(moa_ranks) == 8
    assert all(isinstance(r, MOARanking) for r in moa_ranks)
    # Check ranking monotonicity
    for i in range(len(moa_ranks) - 1):
        assert moa_ranks[i].swagScore >= moa_ranks[i + 1].swagScore
        assert moa_ranks[i].rank == i + 1

    combo_ranks = service.get_combo_rankings()
    assert len(combo_ranks) == 11
    assert all(isinstance(c, ComboRanking) for c in combo_ranks)

    # Slide 16 Top Rank check (TNFSF13B & TYK2)
    top_combos = [c.moa2 for c in combo_ranks[:2]]
    assert "TNFSF13B" in top_combos
    assert "TYK2" in top_combos

    # Test sAB Intact metric calculation
    sab_score = service.gtm.compute_sab_intact("IL6", "TNFSF13B")
    assert 0.0 <= sab_score <= 1.0


def test_cypher_query_fallback(service):
    res = service.query_cypher("MATCH (g:Gene) RETURN g")
    assert res.backend in ["Neo4j", "SQLite-Graph-Engine"]
    assert res.count > 0
    assert len(res.results) > 0


def test_graph_endpoints(client):
    # 1. 3D Network endpoint
    res_topo = client.get("/api/graph/3d-network")
    assert res_topo.status_code == 200
    data_topo = res_topo.json()
    assert "nodes" in data_topo
    assert "edges" in data_topo
    assert len(data_topo["nodes"]) >= 15

    # 2. MOA rankings endpoint
    res_moa = client.get("/api/graph/moa-rankings")
    assert res_moa.status_code == 200
    assert len(res_moa.json()) == 8
    assert res_moa.json()[0]["gene"] == "TNF" or res_moa.json()[0]["swagScore"] >= 9.0

    # 3. Combo rankings endpoint
    res_combo = client.get("/api/graph/combo-rankings")
    assert res_combo.status_code == 200
    assert len(res_combo.json()) == 11

    # 4. Cypher query endpoint
    res_cypher = client.post("/api/graph/cypher", json={"query": "MATCH (n:Node) RETURN n"})
    assert res_cypher.status_code == 200
    assert res_cypher.json()["count"] > 0
