from fastapi import APIRouter, Query
from typing import List, Optional
from models.schemas import ProvenanceRecord
from data.db import get_data_engine

router = APIRouter(prefix="/provenance", tags=["Provenance"])


@router.get("", response_model=List[ProvenanceRecord])
def list_provenance_records(doc_type: Optional[str] = Query(None, description="Filter by doc type")):
    engine = get_data_engine()
    return engine.get_provenance_records(doc_type=doc_type)
