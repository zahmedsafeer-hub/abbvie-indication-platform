from fastapi import APIRouter
from typing import List, Dict, Any
from models.schemas import (
    Graph3DTopology,
    MOARanking,
    ComboRanking,
    CypherQueryRequest,
    CypherQueryResponse,
)
from services.graph_service import get_arch_graph_service

router = APIRouter(prefix="/graph", tags=["ARCH Knowledge Graph & GTM Engine"])


@router.get("/3d-network", response_model=Graph3DTopology)
def get_3d_network_topology():
    service = get_arch_graph_service()
    return service.get_3d_topology()


@router.get("/moa-rankings", response_model=List[MOARanking])
def get_moa_rankings():
    service = get_arch_graph_service()
    return service.get_moa_rankings()


@router.get("/combo-rankings", response_model=List[ComboRanking])
def get_combo_rankings():
    service = get_arch_graph_service()
    return service.get_combo_rankings()


@router.post("/cypher", response_model=CypherQueryResponse)
def execute_cypher_query(req: CypherQueryRequest):
    service = get_arch_graph_service()
    return service.query_cypher(req.query)
