"""
Graph Transformer Model (GTM) Simulator and Link Prediction Engine for AbbVie ARCH Pipeline.
Computes SWAG strength, SWAG score, causal score, sAB Intact synergy, and Composite AI Score.
"""

import math
from typing import List, Dict, Any, Tuple
import networkx as nx
from models.schemas import ARCHTarget, ComboMechanism, MOARanking, ComboRanking


class GTMScorer:
    """
    Simulates Graph Transformer Model (GTM) node and link representations,
    attention-weighted multi-hop propagation, and combination synergy prediction.
    """

    def __init__(self, targets: List[ARCHTarget], combos: List[ComboMechanism]):
        self.targets = targets
        self.combos = combos
        self.target_map = {t.gene: t for t in targets}
        self.graph = nx.Graph()
        self._build_network()

    def _build_network(self):
        # Add target nodes
        for t in self.targets:
            self.graph.add_node(
                t.gene,
                type="Gene",
                swagScore=t.swagScore,
                swagStrength=t.swagStrength,
                causal=t.pathwayCausal,
                genetic=t.genetic,
                devStatus=t.currentDevStatus,
            )

        # Add combo edges
        for c in self.combos:
            if not self.graph.has_node(c.moa1):
                self.graph.add_node(c.moa1, type="Gene", swagScore=c.swag1)
            if not self.graph.has_node(c.moa2):
                self.graph.add_node(c.moa2, type="Gene", swagScore=c.swag2)

            self.graph.add_edge(
                c.moa1,
                c.moa2,
                weight=c.compositeAiScore,
                sabIntact=c.sabIntact,
                dualActivity=c.dualActivity,
                toxicityRisk=c.toxicityRisk,
            )

    def compute_sab_intact(self, moa1: str, moa2: str) -> float:
        """
        Calculates sAB Intact score based on network shortest path distance
        and shared signaling neighborhood overlap.
        """
        if moa1 == moa2:
            return 1.0

        if self.graph.has_edge(moa1, moa2):
            edge_data = self.graph.get_edge_data(moa1, moa2)
            if "sabIntact" in edge_data:
                return float(edge_data["sabIntact"])

        if self.graph.has_node(moa1) and self.graph.has_node(moa2):
            try:
                spl = nx.shortest_path_length(self.graph, source=moa1, target=moa2)
                # Network separation heuristic: sAB = exp(-0.35 * (spl - 1))
                sab = math.exp(-0.35 * max(0, spl - 1))
                return round(min(0.99, max(0.40, sab * 0.8)), 2)
            except nx.NetworkXNoPath:
                return 0.50
        return 0.65

    def compute_composite_ai_score(
        self,
        moa1: str,
        moa2: str,
        swag1: float,
        swag2: float,
        dual_activity: float,
    ) -> float:
        """
        GTM attention fusion aggregating SWAG scores, dual pathway activity,
        and network topological distance.
        """
        sab = self.compute_sab_intact(moa1, moa2)
        base_synergy = 0.45 * (swag1 + swag2) / 2.0 + 0.35 * dual_activity + 0.20 * (sab * 10.0)
        # Normalize to typical 6.0 - 9.0 range
        return round(min(9.9, max(5.0, base_synergy * 0.85)), 2)

    def get_moa_rankings(self) -> List[MOARanking]:
        """
        Ranks single MOA targets by SWAG score, causal alignment, and genetic evidence.
        """
        sorted_targets = sorted(self.targets, key=lambda t: t.swagScore, reverse=True)
        rankings = []
        for i, t in enumerate(sorted_targets, start=1):
            rankings.append(
                MOARanking(
                    gene=t.gene,
                    swagScore=t.swagScore,
                    swagStrength=t.swagStrength,
                    causalScore=t.pathwayCausal,
                    geneticScore=t.genetic,
                    currentDevStatus=t.currentDevStatus,
                    rank=i,
                )
            )
        return rankings

    def get_combo_rankings(self) -> List[ComboRanking]:
        """
        Ranks combination pairs by Composite AI Score and sAB intact metric.
        """
        sorted_combos = sorted(self.combos, key=lambda c: c.compositeAiScore, reverse=True)
        rankings = []
        for i, c in enumerate(sorted_combos, start=1):
            rankings.append(
                ComboRanking(
                    moa1=c.moa1,
                    moa2=c.moa2,
                    compositeAiScore=c.compositeAiScore,
                    sabIntact=c.sabIntact,
                    dualActivity=c.dualActivity,
                    toxicityRisk=c.toxicityRisk,
                    rank=i,
                )
            )
        return rankings
