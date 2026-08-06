from fastapi import APIRouter, HTTPException
from typing import List
from models.schemas import ThreadState
from data.db import get_data_engine

router = APIRouter(prefix="/threads", tags=["Conversation Threads"])


@router.get("", response_model=List[ThreadState])
def list_threads():
    engine = get_data_engine()
    return engine.get_threads()


@router.get("/{thread_id}", response_model=ThreadState)
def get_thread(thread_id: str):
    engine = get_data_engine()
    threads = engine.get_threads()
    for t in threads:
        if t.threadId == thread_id:
            return t
    raise HTTPException(status_code=404, detail=f"Thread {thread_id} not found")
