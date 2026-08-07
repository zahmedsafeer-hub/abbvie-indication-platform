from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.prompt_hardener import get_prompt_hardener, HardenedPromptResult

router = APIRouter(prefix="/prompt", tags=["Scientific Prompt Hardening Engine"])


class HardenRequest(BaseModel):
    query: str
    domainContext: Optional[str] = None


@router.post("/harden", response_model=HardenedPromptResult)
def harden_scientific_prompt(req: HardenRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query prompt cannot be empty")
    hardener = get_prompt_hardener()
    return hardener.harden_prompt(req.query, context_domain=req.domainContext)
