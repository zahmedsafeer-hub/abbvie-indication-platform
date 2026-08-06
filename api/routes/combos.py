from fastapi import APIRouter, Query
from typing import List, Optional, Dict, Any
from models.schemas import ComboMechanism
from data.db import get_data_engine
from services.graph_service import BiologicalGraphService

router = APIRouter(prefix="/combos", tags=["Combination Mechanisms"])


@router.get("", response_model=List[ComboMechanism])
def list_combos(
    moa1: Optional[str] = Query(None, description="Filter by MOA 1 (e.g. IL6)"),
    moa2: Optional[str] = Query(None, description="Filter by MOA 2"),
):
    engine = get_data_engine()
    return engine.get_combos(moa1=moa1, moa2=moa2)


@router.get("/graph", response_model=Dict[str, Any])
def get_combo_network_graph():
    engine = get_data_engine()
    targets = engine.get_targets()
    combos = engine.get_combos()
    service = BiologicalGraphService(targets, combos)
    return {
        "cytoscape": service.to_cytoscape_elements(),
        "metrics": service.get_network_metrics(),
    }
