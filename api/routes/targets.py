from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models.schemas import ARCHTarget
from data.db import get_data_engine

router = APIRouter(prefix="/targets", tags=["ARCH Targets"])


@router.get("", response_model=List[ARCHTarget])
def list_targets(disease: Optional[str] = Query(None, description="Filter by disease context")):
    engine = get_data_engine()
    return engine.get_targets(disease=disease)


@router.get("/{gene}", response_model=ARCHTarget)
def get_target(gene: str):
    engine = get_data_engine()
    target = engine.get_target_by_gene(gene)
    if not target:
        raise HTTPException(status_code=404, detail=f"Target {gene} not found")
    return target
