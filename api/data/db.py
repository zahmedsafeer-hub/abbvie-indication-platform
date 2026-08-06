import json
import os
from pathlib import Path
from typing import List, Optional
from models.schemas import (
    PlatformDatabase,
    Indication,
    ARCHTarget,
    ClinicalTrial,
    ComboMechanism,
    PreclinicalSampleData,
    ProvenanceRecord,
    ThreadState,
)

DATA_PATH = Path(__file__).parent / "mock_db.json"


class DataEngine:
    _instance: Optional["DataEngine"] = None

    def __init__(self, data_path: Path = DATA_PATH):
        self.data_path = data_path
        self._db: Optional[PlatformDatabase] = None
        self.reload()

    @classmethod
    def get_instance(cls) -> "DataEngine":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def reload(self) -> PlatformDatabase:
        with open(self.data_path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
        self._db = PlatformDatabase.model_validate(raw_data)
        return self._db

    @property
    def db(self) -> PlatformDatabase:
        if self._db is None:
            self.reload()
        assert self._db is not None
        return self._db

    def get_indications(self) -> List[Indication]:
        return self.db.indications

    def get_targets(self, disease: Optional[str] = None) -> List[ARCHTarget]:
        if disease:
            return [t for t in self.db.archTargets if disease.lower() in t.disease.lower()]
        return self.db.archTargets

    def get_target_by_gene(self, gene: str) -> Optional[ARCHTarget]:
        for t in self.db.archTargets:
            if t.gene.upper() == gene.upper():
                return t
        return None

    def get_trials(self, indication: Optional[str] = None) -> List[ClinicalTrial]:
        if indication:
            return [t for t in self.db.clinicalTrials if indication.lower() in t.indication.lower()]
        return self.db.clinicalTrials

    def get_trial_by_study_number(self, study_number: str) -> Optional[ClinicalTrial]:
        for t in self.db.clinicalTrials:
            if t.studyNumber.upper() == study_number.upper():
                return t
        return None

    def get_combos(self, moa1: Optional[str] = None, moa2: Optional[str] = None) -> List[ComboMechanism]:
        combos = self.db.comboMechanisms
        if moa1:
            combos = [c for c in combos if c.moa1.upper() == moa1.upper()]
        if moa2:
            combos = [c for c in combos if c.moa2.upper() == moa2.upper()]
        return combos

    def get_preclinical_sample(self) -> PreclinicalSampleData:
        return self.db.preclinicalSample

    def get_provenance_records(self, doc_type: Optional[str] = None) -> List[ProvenanceRecord]:
        if doc_type:
            return [p for p in self.db.provenanceRecords if p.docType.upper() == doc_type.upper()]
        return self.db.provenanceRecords

    def get_threads(self) -> List[ThreadState]:
        return self.db.threads or []


def get_data_engine() -> DataEngine:
    return DataEngine.get_instance()
