from typing import List, Dict, Any, Union
from .interfaces import VectorDBInterface, EmbeddingModelInterface, FileProcessorInterface

class VectorService:
    def __init__(self, db_adapter: VectorDBInterface, 
                 text_embedding_model: EmbeddingModelInterface, 
                 image_embedding_model: EmbeddingModelInterface,
                 file_processors: Dict[str, FileProcessorInterface]):
        self.db_adapter = db_adapter
        self.text_embedding_model = text_embedding_model
        self.image_embedding_model = image_embedding_model
        self.file_processors = file_processors

    def process_and_store(self, file_content: bytes, file_name: str) -> List[Dict[str, Any]]:
        file_extension = file_name.split('.')[-1].lower()

        if file_extension not in self.file_processors:
            raise ValueError(f"No processor found for file type: {file_extension}")

        processor = self.file_processors[file_extension]
        processed_contents = processor.process(file_content, file_name)

        vectors = []
        metadata = []
        for content in processed_contents:
            if content['type'] == 'text':
                vector = self.text_embedding_model.embed(content['content'])
            elif content['type'] == 'image' and self.image_embedding_model:
                vector = self.image_embedding_model.embed(content['content'])
            else:
                continue
            vectors.append(vector)
            metadata.append(content)

        return self.db_adapter.insert(vectors, metadata)

    def search(self, query: str, top_k: int = 5, query_type: str = "text", file_ids: Union[List[str], None] = None) -> List[Dict[str, Any]]:
        if query_type == "text":
            query_vector = self.text_embedding_model.embed(query)
            return self._search_with_vector(query_vector, top_k, file_ids, "text")
        elif query_type == "image":
            query_vector = self.image_embedding_model.embed(query)
            return self._search_with_vector(query_vector, top_k, file_ids, "image")
        elif query_type == "all":
            text_vector = self.text_embedding_model.embed(query)
            image_vector = self.image_embedding_model.embed(query)
            text_results = self._search_with_vector(text_vector, top_k, file_ids, "text")
            image_results = self._search_with_vector(image_vector, top_k, file_ids, "image")
            combined_results = text_results + image_results
            combined_results.sort(key=lambda x: x["distance"])
            return combined_results
        else:
            raise ValueError(f"Invalid query type: {query_type}")

    def _search_with_vector(self, query_vector: List[float], top_k: int, file_ids: Union[List[str], None], query_type: str) -> List[Dict[str, Any]]:
        results = self.db_adapter.search(query_vector, top_k, file_ids, query_type)
        return [
            {
                "id": hit["id"],
                "type": hit["type"],
                "distance": hit["distance"],
                "content": hit["content"],
                "file_id": hit["file_id"],
                "metadata": hit["metadata"],
            }
            for hit in results
        ]

    def delete(self, ids: List[str]) -> bool:
        return self.db_adapter.delete(ids)
