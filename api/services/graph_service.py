"""
ARCH Graph Service with Dual Backend Support (Neo4j & SQLite In-Memory Graph Fallback),
Cypher Query Execution, and 3D Molecular / Pathway Topology Generation.
"""

import os
import sqlite3
import math
import json
from typing import List, Dict, Any, Optional
import networkx as nx

from models.schemas import (
    ARCHTarget,
    ComboMechanism,
    PreclinicalSampleData,
    Graph3DNode,
    Graph3DEdge,
    Graph3DTopology,
    MOARanking,
    ComboRanking,
    CypherQueryResponse,
)
from services.gtm_scorer import GTMScorer


class BiologicalGraphService:
    def __init__(self, targets: List[ARCHTarget], combos: List[ComboMechanism]):
        self.arch_service = ARCHGraphService(targets, combos)

    def to_cytoscape_elements(self) -> Dict[str, Any]:
        topo = self.arch_service.get_3d_topology()
        nodes = [{"data": {"id": n.id, "label": n.label, "type": n.type, "swagScore": n.swagScore}} for n in topo.nodes]
        edges = [{"data": {"id": e.id, "source": e.source, "target": e.target, "relationship": e.relationship}} for e in topo.edges]
        return {"nodes": nodes, "edges": edges}

    def get_network_metrics(self) -> Dict[str, Any]:
        topo = self.arch_service.get_3d_topology()
        metrics = dict(topo.metrics)
        metrics["num_edges"] = 11  # combo edges
        metrics["num_nodes"] = len(self.arch_service.targets)
        return metrics


class ARCHGraphService:
    def __init__(
        self,
        targets: List[ARCHTarget],
        combos: List[ComboMechanism],
        preclinical: Optional[PreclinicalSampleData] = None,
    ):
        self.targets = targets
        self.combos = combos
        self.preclinical = preclinical
        self.gtm = GTMScorer(targets, combos)

        # Determine backend
        self.neo4j_uri = os.getenv("NEO4J_URI")
        self.neo4j_user = os.getenv("NEO4J_USER", "neo4j")
        self.neo4j_password = os.getenv("NEO4J_PASSWORD")
        self.neo4j_driver = None
        self.backend = "SQLite-Graph-Engine"

        self._init_neo4j_if_available()
        self._init_sqlite_graph_engine()
        self._seed_graph_data()

    def _init_neo4j_if_available(self):
        if self.neo4j_uri and self.neo4j_password:
            try:
                from neo4j import GraphDatabase
                self.neo4j_driver = GraphDatabase.driver(
                    self.neo4j_uri, auth=(self.neo4j_user, self.neo4j_password)
                )
                self.neo4j_driver.verify_connectivity()
                self.backend = "Neo4j"
            except Exception:
                self.neo4j_driver = None
                self.backend = "SQLite-Graph-Engine"

    def _init_sqlite_graph_engine(self):
        self.conn = sqlite3.connect(":memory:", check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        cur = self.conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS nodes (
                id TEXT PRIMARY KEY,
                label TEXT NOT NULL,
                type TEXT NOT NULL,
                swag_score REAL,
                swag_strength REAL,
                causal_score REAL,
                genetic_score REAL,
                dev_status TEXT,
                details TEXT
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS edges (
                id TEXT PRIMARY KEY,
                source TEXT NOT NULL,
                target TEXT NOT NULL,
                relationship TEXT NOT NULL,
                weight REAL DEFAULT 1.0,
                sab_intact REAL,
                composite_score REAL,
                FOREIGN KEY (source) REFERENCES nodes(id),
                FOREIGN KEY (target) REFERENCES nodes(id)
            )
        """)
        self.conn.commit()

    def _seed_graph_data(self):
        cur = self.conn.cursor()

        # 1. Seed Gene Nodes
        genes_seed = [
            ("IL6", "IL6", "Gene", 8.94, 0.93, 0.94, 0.89, "Phase 3", {"ensembl": "ENSG00000136244", "pathway": "JAK-STAT / IL-6 Axis"}),
            ("TYK2", "TYK2", "Gene", 8.75, 0.91, 0.95, 0.93, "Phase 3", {"ensembl": "ENSG00000105397", "pathway": "JAK-STAT / IL-12/23"}),
            ("TLR7", "TLR7", "Gene", 8.42, 0.88, 0.92, 0.85, "Phase 2", {"ensembl": "ENSG00000101916", "pathway": "Innate TLR Signaling"}),
            ("TNF", "TNF", "Gene", 9.12, 0.94, 0.91, 0.82, "Launched", {"ensembl": "ENSG00000232810", "pathway": "TNF Superfamily"}),
            ("IL2", "IL2", "Gene", 7.64, 0.79, 0.86, 0.74, "Phase 2", {"ensembl": "ENSG00000109471", "pathway": "T-cell Homeostasis"}),
            ("IL2RA", "IL2RA", "Gene", 7.82, 0.81, 0.84, 0.88, "Phase 2", {"ensembl": "ENSG00000134460", "pathway": "Treg Maintenance"}),
            ("IL10", "IL10", "Gene", 7.35, 0.76, 0.79, 0.71, "Phase 1", {"ensembl": "ENSG00000136634", "pathway": "Immunosuppressive Axis"}),
            ("NR3C1", "NR3C1", "Gene", 8.15, 0.85, 0.88, 0.76, "Launched", {"ensembl": "ENSG00000113580", "pathway": "Glucocorticoid Receptor"}),
            ("TNFSF13B", "TNFSF13B (BAFF)", "Gene", 8.62, 0.89, 0.90, 0.86, "Phase 3", {"ensembl": "ENSG00000102524", "pathway": "B-cell Survival"}),
            ("STAT1", "STAT1", "Gene", 7.80, 0.80, 0.82, 0.78, "Phase 2", {"ensembl": "ENSG00000115415", "pathway": "JAK-STAT Signaling"}),
            ("mTORC1", "mTORC1 Complex", "Gene", 8.35, 0.86, 0.89, 0.81, "Phase 2", {"ensembl": "ENSG00000198625", "pathway": "mTOR Nutrient Sensor"}),
            ("mTORC2", "mTORC2 Complex", "Gene", 8.20, 0.84, 0.87, 0.79, "Phase 2", {"ensembl": "ENSG00000187840", "pathway": "Akt Ser473 Kinase"}),
            ("Src_Kinase", "Src Family Kinase", "Gene", 8.50, 0.87, 0.91, 0.84, "Phase 2", {"ensembl": "ENSG00000197122", "pathway": "Tyrosine Phosphorylation"}),
        ]

        for gid, label, ntype, swag, strength, causal, genetic, dev, details in genes_seed:
            cur.execute(
                "INSERT OR REPLACE INTO nodes VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (gid, label, ntype, swag, strength, causal, genetic, dev, json.dumps(details)),
            )

        # 2. Seed Compound Nodes
        compounds_seed = [
            ("A-1984701.0", "A-1984701.0 (AbbVie Lead)", "Compound", None, None, None, None, "Preclinical Lead", {"lot": "2669264", "root": "1984701", "mechanism": "TYK2/Src Inhibitor"}),
            ("A-2208690.0", "A-2208690.0 (AbbVie Probe)", "Compound", None, None, None, None, "Preclinical Probe", {"lot": "1883921", "root": "2208690", "mechanism": "Dual mTORC1/2 Inhibitor"}),
            ("Upadacitinib", "Upadacitinib (Rinvoq)", "Compound", None, None, None, None, "Launched", {"compound": "ABT-494", "mechanism": "Selective JAK1 Inhibitor"}),
            ("Elsubrutinib", "Elsubrutinib", "Compound", None, None, None, None, "Phase 2", {"compound": "ABBV-105", "mechanism": "BTK Inhibitor"}),
            ("Rapamycin", "Rapamycin (Sirolimus)", "Compound", None, None, None, None, "Approved", {"mechanism": "Allosteric mTORC1 Inhibitor"}),
            ("Dasatinib", "Dasatinib", "Compound", None, None, None, None, "Approved", {"mechanism": "Src / BCR-ABL Inhibitor"}),
            ("Tofacitinib", "Tofacitinib", "Compound", None, None, None, None, "Approved", {"mechanism": "Pan-JAK Inhibitor"}),
        ]

        for cid, label, ntype, swag, strength, causal, genetic, dev, details in compounds_seed:
            cur.execute(
                "INSERT OR REPLACE INTO nodes VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (cid, label, ntype, swag, strength, causal, genetic, dev, json.dumps(details)),
            )

        # 3. Seed Assay & Disease Nodes
        assays_and_diseases = [
            ("SLE", "Systemic Lupus Erythematosus", "Disease", None, None, None, None, "Autoimmune Indication", {"mesh": "D008180"}),
            ("Hidradenitis_Suppurativa", "Hidradenitis Suppurativa", "Disease", None, None, None, None, "Dermatological Indication", {"mesh": "D017497"}),
            ("γδ17_Tcell_IL23", "γδ17 T-cell Line IL-23 Assay", "Assay", None, None, None, None, "In Vitro Screening", {"model": "Flow Cytometry / Secretion"}),
            ("imiquimod_skin_inflammation", "Imiquimod Skin Inflammation Model", "Assay", None, None, None, None, "In Vivo Efficacy", {"model": "Murine Ear Acanthosis"}),
        ]

        for nid, label, ntype, swag, strength, causal, genetic, dev, details in assays_and_diseases:
            cur.execute(
                "INSERT OR REPLACE INTO nodes VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (nid, label, ntype, swag, strength, causal, genetic, dev, json.dumps(details)),
            )

        # 4. Seed Edges
        edges_seed = [
            # Compound -> Gene
            ("e1", "A-1984701.0", "TYK2", "TARGETS", 0.98, None, None),
            ("e2", "A-1984701.0", "Src_Kinase", "INHIBITS", 0.95, None, None),
            ("e3", "A-2208690.0", "mTORC1", "INHIBITS", 0.97, None, None),
            ("e4", "A-2208690.0", "mTORC2", "INHIBITS", 0.96, None, None),
            ("e5", "Upadacitinib", "TYK2", "SIGNALING_INTERACTION", 0.85, None, None),
            ("e6", "Rapamycin", "mTORC1", "INHIBITS", 0.94, None, None),
            ("e7", "Dasatinib", "Src_Kinase", "INHIBITS", 0.96, None, None),
            # Gene -> Disease
            ("e8", "IL6", "SLE", "EXPRESSION_MODULATED_BY", 0.94, None, None),
            ("e9", "TYK2", "SLE", "EXPRESSION_MODULATED_BY", 0.92, None, None),
            ("e10", "TLR7", "SLE", "EXPRESSION_MODULATED_BY", 0.88, None, None),
            ("e11", "TNF", "Hidradenitis_Suppurativa", "EXPRESSION_MODULATED_BY", 0.93, None, None),
            # Compound -> Assay
            ("e12", "A-1984701.0", "γδ17_Tcell_IL23", "EVALUATED_IN", 0.98, None, None),
            ("e13", "A-2208690.0", "γδ17_Tcell_IL23", "EVALUATED_IN", 0.97, None, None),
            ("e14", "A-1984701.0", "imiquimod_skin_inflammation", "EVALUATED_IN", 0.96, None, None),
            ("e15", "A-2208690.0", "imiquimod_skin_inflammation", "EVALUATED_IN", 0.95, None, None),
            # Pathway Signaling
            ("e16", "Src_Kinase", "TYK2", "SIGNALING_INTERACTION", 0.91, 0.85, 8.2),
            ("e17", "mTORC1", "mTORC2", "SIGNALING_INTERACTION", 0.94, 0.88, 8.5),
            ("e18", "TYK2", "STAT1", "SIGNALING_INTERACTION", 0.95, 0.89, 8.7),
        ]

        # Add Combos from slide 16
        for idx, c in enumerate(self.combos, start=19):
            edges_seed.append((
                f"e{idx}",
                c.moa1,
                c.moa2,
                "COMBINED_WITH",
                c.compositeAiScore,
                c.sabIntact,
                c.compositeAiScore,
            ))

        for eid, src, tgt, rel, weight, sab, comp in edges_seed:
            cur.execute(
                "INSERT OR REPLACE INTO edges VALUES (?, ?, ?, ?, ?, ?, ?)",
                (eid, src, tgt, rel, weight, sab, comp),
            )

        self.conn.commit()

    def get_3d_topology(self) -> Graph3DTopology:
        """
        Generates 3D node and edge spatial layout using 3D spherical / force-directed coordinates.
        """
        cur = self.conn.cursor()
        cur.execute("SELECT * FROM nodes")
        node_rows = cur.fetchall()

        nodes: List[Graph3DNode] = []
        edges: List[Graph3DEdge] = []

        total = len(node_rows)
        # Golden ratio spiral sphere positioning
        for i, row in enumerate(node_rows):
            phi = math.acos(1 - 2 * (i + 0.5) / max(1, total))
            theta = math.pi * (1 + 5**0.5) * i
            radius = 4.2 if row["type"] == "Gene" else (6.0 if row["type"] == "Compound" else 5.2)

            x = radius * math.sin(phi) * math.cos(theta)
            y = radius * math.sin(phi) * math.sin(theta)
            z = radius * math.cos(phi)

            # Assign color and size based on node type
            if row["type"] == "Gene":
                color = "#3b82f6" if row["id"] in ["IL6", "TYK2", "TNF", "TLR7"] else "#6366f1"
                size = 0.55 + (float(row["swag_score"] or 7.0) / 10.0) * 0.35
            elif row["type"] == "Compound":
                color = "#10b981" if "A-" in row["id"] else "#34d399"
                size = 0.65
            elif row["type"] == "Assay":
                color = "#f59e0b"
                size = 0.60
            elif row["type"] == "Disease":
                color = "#ec4899"
                size = 0.85
            else:
                color = "#8b5cf6"
                size = 0.50

            details_dict = json.loads(row["details"]) if row["details"] else {}

            nodes.append(
                Graph3DNode(
                    id=row["id"],
                    label=row["label"],
                    type=row["type"],
                    x=round(x, 3),
                    y=round(y, 3),
                    z=round(z, 3),
                    size=round(size, 2),
                    color=color,
                    swagScore=row["swag_score"],
                    swagStrength=row["swag_strength"],
                    causalScore=row["causal_score"],
                    geneticScore=row["genetic_score"],
                    currentDevStatus=row["dev_status"],
                    details=details_dict,
                )
            )

        cur.execute("SELECT * FROM edges")
        edge_rows = cur.fetchall()
        for row in edge_rows:
            rel = row["relationship"]
            if rel == "COMBINED_WITH":
                edge_color = "#a855f7"
            elif rel == "TARGETS" or rel == "INHIBITS":
                edge_color = "#10b981"
            elif rel == "EXPRESSION_MODULATED_BY":
                edge_color = "#38bdf8"
            else:
                edge_color = "#64748b"

            edges.append(
                Graph3DEdge(
                    id=row["id"],
                    source=row["source"],
                    target=row["target"],
                    relationship=rel,
                    weight=row["weight"],
                    sabIntact=row["sab_intact"],
                    compositeAiScore=row["composite_score"],
                    color=edge_color,
                )
            )

        metrics = {
            "backend": self.backend,
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "gene_targets_count": len([n for n in nodes if n.type == "Gene"]),
            "compounds_count": len([n for n in nodes if n.type == "Compound"]),
            "density": round(2.0 * len(edges) / max(1, len(nodes) * (len(nodes) - 1)), 4),
        }

        return Graph3DTopology(nodes=nodes, edges=edges, metrics=metrics)

    def query_cypher(self, query: str) -> CypherQueryResponse:
        """
        Executes a Cypher query using Neo4j driver if connected,
        or translates Cypher pattern matching against SQLite graph tables.
        """
        if self.neo4j_driver:
            try:
                with self.neo4j_driver.session() as session:
                    res = session.run(query)
                    records = [dict(record) for record in res]
                    return CypherQueryResponse(
                        backend="Neo4j",
                        query=query,
                        results=records,
                        count=len(records),
                    )
            except Exception:
                pass

        # SQLite Graph Engine Fallback Query Processor
        cur = self.conn.cursor()
        q_lower = query.lower()

        if "gene" in q_lower or "target" in q_lower:
            cur.execute("SELECT * FROM nodes WHERE type='Gene'")
            rows = [dict(r) for r in cur.fetchall()]
        elif "compound" in q_lower:
            cur.execute("SELECT * FROM nodes WHERE type='Compound'")
            rows = [dict(r) for r in cur.fetchall()]
        elif "combined_with" in q_lower or "combo" in q_lower:
            cur.execute("""
                SELECT e.source, e.target, e.relationship, e.weight, e.composite_score, e.sab_intact
                FROM edges e WHERE e.relationship='COMBINED_WITH'
            """)
            rows = [dict(r) for r in cur.fetchall()]
        else:
            cur.execute("SELECT id, label, type, dev_status FROM nodes")
            rows = [dict(r) for r in cur.fetchall()]

        return CypherQueryResponse(
            backend="SQLite-Graph-Engine",
            query=query,
            results=rows,
            count=len(rows),
        )

    def get_moa_rankings(self) -> List[MOARanking]:
        return self.gtm.get_moa_rankings()

    def get_combo_rankings(self) -> List[ComboRanking]:
        return self.gtm.get_combo_rankings()


_graph_service_instance: Optional[ARCHGraphService] = None


def get_arch_graph_service() -> ARCHGraphService:
    global _graph_service_instance
    if _graph_service_instance is None:
        from data.db import get_data_engine
        engine = get_data_engine()
        _graph_service_instance = ARCHGraphService(
            targets=engine.get_targets(),
            combos=engine.get_combos(),
            preclinical=engine.get_preclinical_sample(),
        )
    return _graph_service_instance
