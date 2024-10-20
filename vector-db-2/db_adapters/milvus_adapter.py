from typing import List, Dict, Any, Optional
import os
from pymilvus import MilvusClient
from core.interfaces import VectorDBInterface

class MilvusAdapter(VectorDBInterface):
    def __init__(self, uri: str, collection_name: str, vector_dim: int = 768, token: Optional[str] = None):
        self.uri = uri
        self.collection_name = collection_name
        self.vector_dim = vector_dim
        self._connect()
        self._ensure_collection_exists()
        self.token = token

    def _connect(self):
        if self.uri.startswith("file://"):
            path = self.uri[7:]
            if not os.path.isabs(path):
                path = os.path.abspath(path)
            os.makedirs(os.path.dirname(path), exist_ok=True)
            print(f"Milvus data file: {path}")
            self.client = MilvusClient(uri=path)
        else:
            self.client = MilvusClient(uri=self.uri, token=self.token)

    def _ensure_collection_exists(self):
        if not self.client.has_collection(self.collection_name):
            self._create_collection()

    def _create_collection(self):
        self.client.create_collection(
            collection_name=self.collection_name,
            dimension=self.vector_dim,
            primary_field_name="id",
            vector_field_name="vector"
        )
        print(f"Collection '{self.collection_name}' created successfully.")

    def insert(self, vectors: List[List[float]], metadata: List[Dict[str, Any]]) -> List[str]:
        data = [
            {"vector": vector, "text": meta.get('text', ''), "file_id": meta.get('file_id', '')}
            for vector, meta in zip(vectors, metadata)
        ]
        result = self.client.insert(self.collection_name, data)
        return result.primary_keys

    def search(self, query_vector: List[float], top_k: int) -> List[Dict[str, Any]]:
        result = self.client.search(
            collection_name=self.collection_name,
            data=[query_vector],
            limit=top_k,
            output_fields=["text", "file_id"]
        )
        return [
            {
                "id": hit["id"],
                "distance": hit["distance"],
                "text": hit["entity"].get("text"),
                "file_id": hit["entity"].get("file_id")
            }
            for hit in result[0]
        ]

    def delete(self, ids: List[str]) -> bool:
        expr = f"id in {ids}"
        result = self.client.delete(self.collection_name, expr)
        return result.delete_count > 0
