from typing import List, Dict, Any, Optional
import os
from pymilvus import MilvusClient, FieldSchema, CollectionSchema, DataType
from core.interfaces import VectorDBInterface
from uuid import uuid4

class MilvusAdapter(VectorDBInterface):
    def __init__(self, uri: str, collection_name: str, fields: list, vector_dim: int = 768, token: Optional[str] = None):
        self.uri = uri
        self.collection_name = collection_name
        self.vector_dim = vector_dim
        self.fields = fields
        self.token = token
        self._connect()
        self._ensure_collection_exists()

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
        fields = []

        for field_config in self.fields:
            dtype = getattr(DataType, field_config['dtype'])
            field_params = {
                'name': field_config['name'],
                'dtype': dtype,
                'is_primary': field_config.get('is_primary', False),
                'auto_increment': field_config.get('auto_increment', False),
                'description': field_config.get('description', '')
            }

            dim = field_config.get('dim', None)
            max_length = field_config.get('max_length', None)
            audo_id = field_config.get('audo_id', None)

            if dim:
                field_params['dim'] = dim
            if max_length:
                field_params['max_length'] = max_length
            if audo_id:
                field_params['audo_id'] = audo_id

            field_schema = FieldSchema(**field_params)
            fields.append(field_schema)

        schema = CollectionSchema(fields=fields, enable_dynamic_field=True, audo_id=True)

        self.client.create_collection(
            collection_name=self.collection_name,
            schema=schema
        )
        print(f"Collection '{self.collection_name}' created successfully.")

    def insert(self, vectors: List[List[float]], metadata: List[Dict[str, Any]]):
        data = [
            {"id": str(uuid4()), "vector": vector, "text": meta.get('text', ''), "file_id": meta.get('file_id', '')}
            for vector, meta in zip(vectors, metadata)
        ]
        result = self.client.insert(self.collection_name, data)

        return {"insert_count": result.get('insert_count', 0), "file_id": metadata[0].get('file_id', '')}

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
