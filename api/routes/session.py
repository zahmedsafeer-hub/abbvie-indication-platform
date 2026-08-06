from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from models.schemas import (
    ThreadSessionData,
    CreateSessionRequest,
    SessionChatRequest,
    SessionChatResponse,
    ChatMessageTurn,
)
from services.session_manager import get_session_manager

router = APIRouter(prefix="/session", tags=["Session State & Clarification Management"])


@router.post("/create", response_model=ThreadSessionData)
def create_new_session(req: CreateSessionRequest = CreateSessionRequest()):
    mgr = get_session_manager()
    return mgr.create_session(thread_id=req.threadId, title=req.title)


@router.get("/list", response_model=List[ThreadSessionData])
def list_all_sessions():
    mgr = get_session_manager()
    return mgr.list_sessions()


@router.get("/{thread_id}", response_model=ThreadSessionData)
def get_session_details(thread_id: str):
    mgr = get_session_manager()
    return mgr.get_session(thread_id)


@router.get("/{thread_id}/history", response_model=List[ChatMessageTurn])
def get_session_history(thread_id: str):
    mgr = get_session_manager()
    return mgr.get_context(thread_id)


@router.post("/{thread_id}/chat", response_model=SessionChatResponse)
def post_session_chat(thread_id: str, req: SessionChatRequest):
    mgr = get_session_manager()
    return mgr.process_message(thread_id, req.message, req.overrideIntent)


@router.delete("/{thread_id}")
def delete_thread_session(thread_id: str):
    mgr = get_session_manager()
    success = mgr.delete_session(thread_id)
    if not success:
        raise HTTPException(status_code=404, detail="Thread session not found")
    return {"status": "deleted", "threadId": thread_id}
