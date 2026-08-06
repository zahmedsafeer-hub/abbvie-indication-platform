from fastapi import APIRouter
from models.schemas import (
    IntentClassificationRequest,
    IntentClassificationResult,
    ChatGenerateRequest,
    ChatGenerateResponse,
)
from services.intent_classifier import get_intent_classifier
from services.prompt_builder import get_prompt_builder

router = APIRouter(prefix="/chat", tags=["Intent Classifier & Chat Assistant"])


@router.post("/classify", response_model=IntentClassificationResult)
def classify_intent(req: IntentClassificationRequest):
    classifier = get_intent_classifier()
    return classifier.classify(req.query, req.context)


@router.post("/generate", response_model=ChatGenerateResponse)
def generate_chat_response(req: ChatGenerateRequest):
    generator = get_prompt_builder()
    return generator.generate_response(req.query, req.overrideIntent)
