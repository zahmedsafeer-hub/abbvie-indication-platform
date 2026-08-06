from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models.schemas import ClinicalTrial
from data.db import get_data_engine

router = APIRouter(prefix="/trials", tags=["Clinical Trials"])


@router.get("", response_model=List[ClinicalTrial])
def list_trials(indication: Optional[str] = Query(None, description="Filter by indication")):
    engine = get_data_engine()
    return engine.get_trials(indication=indication)


@router.get("/{study_number}", response_model=ClinicalTrial)
def get_trial(study_number: str):
    engine = get_data_engine()
    trial = engine.get_trial_by_study_number(study_number)
    if not trial:
        raise HTTPException(status_code=404, detail=f"Clinical trial {study_number} not found")
    return trial
