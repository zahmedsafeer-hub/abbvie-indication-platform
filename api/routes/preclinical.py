from fastapi import APIRouter
from models.schemas import PreclinicalSampleData
from data.db import get_data_engine

router = APIRouter(prefix="/preclinical", tags=["Preclinical Repurposing Screen"])


@router.get("/sample", response_model=PreclinicalSampleData)
def get_preclinical_sample_data():
    engine = get_data_engine()
    return engine.get_preclinical_sample()
