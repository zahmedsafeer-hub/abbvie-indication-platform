"""
Golden Evaluation Dataset Loader & Validation Engine
45-case domain-expert verified benchmark (40 scientific domain + 5 adversarial cases).
"""

import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from models.schemas import QueryIntentType


class GoldenTestCase(BaseModel):
    id: str
    query: str
    expected_intent: QueryIntentType
    expected_source_topic: str
    golden_answer: str
    notes: str


class GoldenDatasetLoader:
    """
    Loads and provides query filtering for the 45-case Golden Evaluation Dataset.
    """

    def __init__(self, dataset_path: Optional[str] = None):
        if dataset_path:
            self.path = Path(dataset_path)
        else:
            self.path = Path(__file__).resolve().parent.parent / "data" / "golden_eval_dataset.json"
        self._dataset: List[GoldenTestCase] = []
        self._load()

    def _load(self):
        if not self.path.exists():
            raise FileNotFoundError(f"Golden evaluation dataset not found at {self.path}")
        with open(self.path, "r", encoding="utf-8") as f:
            data = json.load(f)
        self._dataset = [GoldenTestCase(**item) for item in data]

    @property
    def dataset(self) -> List[GoldenTestCase]:
        return self._dataset

    def get_case_by_id(self, case_id: str) -> Optional[GoldenTestCase]:
        for c in self._dataset:
            if c.id.lower() == case_id.lower():
                return c
        return None

    def filter_by_intent(self, intent: str) -> List[GoldenTestCase]:
        return [c for c in self._dataset if c.expected_intent.upper() == intent.upper()]

    def get_summary(self) -> Dict[str, Any]:
        intent_counts = {}
        for c in self._dataset:
            intent_counts[c.expected_intent] = intent_counts.get(c.expected_intent, 0) + 1

        adversarial_count = sum(1 for c in self._dataset if c.id.startswith("ADV"))
        scientific_count = len(self._dataset) - adversarial_count

        return {
            "totalCases": len(self._dataset),
            "scientificCases": scientific_count,
            "adversarialCases": adversarial_count,
            "distribution": intent_counts,
        }


_eval_dataset_instance: Optional[GoldenDatasetLoader] = None


def get_eval_dataset() -> GoldenDatasetLoader:
    global _eval_dataset_instance
    if _eval_dataset_instance is None:
        _eval_dataset_instance = GoldenDatasetLoader()
    return _eval_dataset_instance
