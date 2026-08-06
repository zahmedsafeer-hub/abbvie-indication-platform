from fastapi import APIRouter, HTTPException
from typing import Optional, Dict, Any
from models.schemas import ExtractionResult, DocumentExtractRequest
from services.extractor import get_extraction_engine
from services.doc_generator import get_sample_document

router = APIRouter(prefix="/extract", tags=["LangExtract Engine"])


@router.post("/document", response_model=ExtractionResult)
def extract_document(req: DocumentExtractRequest):
    engine = get_extraction_engine()

    if req.sampleDocKey:
        return engine.extract_sample(req.sampleDocKey)

    if not req.text and not req.documentId:
        raise HTTPException(
            status_code=400,
            detail="Either 'text' or 'sampleDocKey' must be provided for extraction.",
        )

    text = req.text or ""
    doc_id = req.documentId or "DOC-UPLOAD-001"
    doc_type = req.docType or "ELN"

    return engine.extract_from_text(
        text=text,
        doc_id=doc_id,
        doc_title=f"Extraction for {doc_id}",
        doc_type=doc_type,
    )


@router.get("/sample/{sample_key}")
def get_sample_doc(sample_key: str):
    try:
        doc = get_sample_document(sample_key)
        return doc
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Sample document {sample_key} not found")
