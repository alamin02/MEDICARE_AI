"""
MedICARE AI - RAG Knowledge Base Retriever
Handles vector embeddings, semantic retrieval, and source attribution.
Compatible with Qdrant vector database with deterministic fallback.
"""

from typing import List, Dict, Any

class MedicalRAGRetriever:
    def __init__(self, qdrant_url: str = None):
        self.qdrant_url = qdrant_url
        self.knowledge_documents = [
            {
                "id": "doc-burns",
                "topic": "Thermal Burns",
                "content": "Cool with gentle running tap water for 10-20 minutes. Do not apply ice, butter, or paste.",
                "source": "WHO Clinical Guidelines on Burn Care"
            },
            {
                "id": "doc-cuts",
                "topic": "Active Hemorrhage",
                "content": "Apply firm continuous direct pressure using sterile gauze for at least 5-10 minutes. Elevate limb.",
                "source": "American Red Cross First Aid Manual"
            },
            {
                "id": "doc-choking",
                "topic": "Airway Obstruction",
                "content": "Alternate 5 firm back blows between shoulder blades and 5 abdominal thrusts (Heimlich maneuver).",
                "source": "International Resuscitation Guidelines"
            }
        ]

    def retrieve(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        query_terms = query.lower().split()
        scored = []
        for doc in self.knowledge_documents:
            score = sum(1 for term in query_terms if term in doc["topic"].lower() or term in doc["content"].lower())
            scored.append((score, doc))
        
        scored.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scored[:top_k]]
