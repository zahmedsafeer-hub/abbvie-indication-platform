"""
Synthetic Document Generator for AbbVie Scientific Documents.
Recreates Slide 22 ELN (EL-2026-00002538) and γδ17 T-cell / IL-23 literature for evaluation.
"""

from typing import Dict, Any, List
from models.schemas import BoundingBox


def get_slide22_eln_doc() -> Dict[str, Any]:
    text = (
        "ABBVIE ELECTRONIC LAB NOTEBOOK (ELN)\n"
        "Document ID: EL-2026-00002538 | Project: Target Validation & Repurposing Engine\n"
        "Date: 2026-04-12 | Principal Investigator: Immunology Discovery Group\n"
        "Title: High-Throughput Repurposing Screen & Dose-Response Analysis of A-1984701.0 and A-2208690.0 in γδ17 T-Cell Lines\n\n"
        "1. COMPOUND INVENTORY & CHARACTERIZATION:\n"
        "- Compound ID: A-1984701.0 | Lot: 2669264 | Root: 1984701\n"
        "  Mechanism: Selective TYK2 / Src family kinase inhibitor; Target: TYK2 / Src kinases\n"
        "- Compound ID: A-2208690.0 | Lot: 1883921 | Root: 2208690\n"
        "  Mechanism: Dual catalytic mTORC1 / mTORC2 inhibitor; Target: mTOR kinase complex\n\n"
        "2. BIOLOGICAL ASSAYS & TARGET PATHWAYS:\n"
        "- In Vitro Assay: γδ17 T-cell line IL-23 assay (p-STAT3 / p-S6 / p-Akt Ser473 / IL-17A release)\n"
        "- In Vivo Model: imiquimod-induced skin inflammation model (ear thickness swelling & epidermal hyperplasia)\n"
        "- Investigated Biological Axis: IL-23 / IL-17 axis, mTORC1, mTORC2, Src family kinases\n"
        "- Evaluated Administration Routes: intraperitoneal, oral, topical\n\n"
        "3. QUANTITATIVE EXPERIMENTAL MATRIX:\n"
        "- LPAR1000 (A-1984701.0): log2FC = -3.85, p = 0.00012, IC50 (IP) = 12.4 nM, IC50 (Oral) = 24.8 nM, IC50 (Topical) = 18.2 nM\n"
        "- Tyk200 (A-2208690.0): log2FC = -3.52, p = 0.00034, IC50 (IP) = 16.8 nM, IC50 (Oral) = 31.5 nM, IC50 (Topical) = 22.0 nM\n"
        "- Combo (A-1984701.0 + A-2208690.0): log2FC = -4.92, p = 0.00004, IC50 (IP) = 6.2 nM, IC50 (Oral) = 11.5 nM, IC50 (Topical) = 8.4 nM\n\n"
        "4. VALIDATION CONCLUSION:\n"
        "Combined TYK2/Src family kinase inhibition with dual mTORC1/2 blockade achieves synergistic repression of γδ17 T-cell activation without overt cytotoxicity in primary dermal subsets."
    )

    bounding_boxes = [
        BoundingBox(page=1, x1=0.05, y1=0.04, x2=0.95, y2=0.12, label="Header & Metadata"),
        BoundingBox(page=1, x1=0.05, y1=0.15, x2=0.95, y2=0.32, label="Compound Identifiers (A-1984701.0, A-2208690.0)"),
        BoundingBox(page=1, x1=0.05, y1=0.35, x2=0.95, y2=0.55, label="Assays & Pathways (γδ17 T-cell, mTORC1, mTORC2, Src)"),
        BoundingBox(page=1, x1=0.05, y1=0.58, x2=0.95, y2=0.82, label="Quantitative Matrix (log2FC, p-values, IC50)"),
        BoundingBox(page=1, x1=0.05, y1=0.85, x2=0.95, y2=0.95, label="Primary Cell Validation Conclusion"),
    ]

    return {
        "documentId": "EL-2026-00002538",
        "title": "High-Throughput Repurposing Screen & Dose-Response Analysis of A-1984701.0 and A-2208690.0 in γδ17 T-Cell Lines",
        "docType": "ELN",
        "rawText": text,
        "boundingBoxes": bounding_boxes,
    }


def get_gd17_pubmed_doc() -> Dict[str, Any]:
    text = (
        "PubMed ID: PUB-34982103\n"
        "Title: High-Throughput Drug Repurposing Screen Identifies mTORC1/mTORC2 and Src Family Kinase Regulators of γδ17 T-Cell Driven Skin Inflammation\n"
        "Journal of Experimental Immunology & Therapeutic Repurposing (2025)\n\n"
        "ABSTRACT:\n"
        "We developed an in vitro model using a γδ17 T-cell line to study IL-23 responses and performed a drug-repurposing screen of US Food and Drug Administration-approved compounds. Hits were validated in primary cells. The in vivo efficacy of candidate inhibitors was evaluated in the imiquimod-induced model of skin inflammation via intraperitoneal, oral, and topical administration. Mechanistic studies assessed IL-23-dependent activation of mechanistic target of rapamycin complex 1 (mTORC1) and mTORC2 and the role of Src family kinases.\n\n"
        "RESULTS:\n"
        "Screening validated potent target engagement for AbbVie leads A-1984701.0 (TYK2/Src modulator, log2FC = -3.85, p = 0.00012) and A-2208690.0 (dual mTORC1/mTORC2 inhibitor, log2FC = -3.52, p = 0.00034), alongside benchmark controls Rapamycin (mTORC1 allosteric inhibitor, log2FC = -2.94), Tofacitinib (pan-JAK, log2FC = -3.28), and Dasatinib (Src inhibitor, log2FC = -3.61).\n"
        "All candidate inhibitors significantly mitigated epidermal thickening across intraperitoneal, oral, and topical routes of administration."
    )

    bounding_boxes = [
        BoundingBox(page=1, x1=0.08, y1=0.05, x2=0.92, y2=0.18, label="Publication Citation & Title"),
        BoundingBox(page=1, x1=0.08, y1=0.22, x2=0.92, y2=0.52, label="Structured Abstract (γδ17 T-cell / IL-23 / mTORC1/2 / Src)"),
        BoundingBox(page=1, x1=0.08, y1=0.56, x2=0.92, y2=0.88, label="Screen Results & Quantitative Fold-Change Data"),
        BoundingBox(page=1, x1=0.08, y1=0.90, x2=0.92, y2=0.96, label="In Vivo Formulation Summary"),
    ]

    return {
        "documentId": "PUB-34982103",
        "title": "High-Throughput Drug Repurposing Screen Identifies mTORC1/mTORC2 and Src Family Kinase Regulators of γδ17 T-Cell Driven Skin Inflammation",
        "docType": "PubMed",
        "rawText": text,
        "boundingBoxes": bounding_boxes,
    }


def get_sample_document(key: str) -> Dict[str, Any]:
    if key in ["slide22_eln", "EL-2026-00002538"]:
        return get_slide22_eln_doc()
    elif key in ["gd17_pubmed", "PUB-34982103"]:
        return get_gd17_pubmed_doc()
    else:
        return get_slide22_eln_doc()
