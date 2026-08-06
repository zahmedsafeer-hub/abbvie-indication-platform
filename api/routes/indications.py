from fastapi import APIRouter
from typing import List
from models.schemas import Indication
from data.db import get_data_engine

router = APIRouter(prefix="/indications", tags=["Indications"])


@router.get("", response_model=List[Indication])
def list_indications():
    engine = get_data_engine()
    return engine.get_indications()
