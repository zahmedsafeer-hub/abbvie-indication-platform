from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data.db import get_data_engine
from routes import (
    targets_router,
    trials_router,
    combos_router,
    preclinical_router,
    indications_router,
    provenance_router,
    threads_router,
    extract_router,
    graph_router,
    chat_router,
    session_router,
    eval_router,
)

app = FastAPI(
    title="AbbVie Indication Knowledge Platform API",
    description="Phase 1a Indication Assessment, ARCH Targets, Clinical Trials, Combination Synergy, LangExtract, 3D Knowledge Graph, Intent Classifier, Thread Session State Manager, and Golden Eval Dataset",
    version="1.5.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(indications_router, prefix="/api")
app.include_router(targets_router, prefix="/api")
app.include_router(trials_router, prefix="/api")
app.include_router(combos_router, prefix="/api")
app.include_router(preclinical_router, prefix="/api")
app.include_router(provenance_router, prefix="/api")
app.include_router(threads_router, prefix="/api")
app.include_router(extract_router, prefix="/api")
app.include_router(graph_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(session_router, prefix="/api")
app.include_router(eval_router, prefix="/api")


@app.get("/")
def root():
    return {
        "status": "healthy",
        "service": "AbbVie Indication Knowledge Platform API",
        "version": "1.4.0",
        "docs": "/docs",
    }


@app.get("/api/health")
def health_check():
    engine = get_data_engine()
    db = engine.db
    return {
        "status": "ok",
        "message": f"Data Engine Initialized: {len(db.archTargets)} ARCH Targets, {len(db.clinicalTrials)} Trials, {len(db.comboMechanisms)} Combos, 1 Repurposing Screen ({db.preclinicalSample.cellLine} / IL-23 / mTORC1/2)",
        "metrics": {
            "targetsCount": len(db.archTargets),
            "trialsCount": len(db.clinicalTrials),
            "combosCount": len(db.comboMechanisms),
            "indicationsCount": len(db.indications),
            "provenanceRecordsCount": len(db.provenanceRecords),
            "preclinicalCompoundsCount": len(db.preclinicalSample.compounds),
        }
    }


@app.get("/api/summary")
def get_platform_summary():
    engine = get_data_engine()
    return engine.db


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
