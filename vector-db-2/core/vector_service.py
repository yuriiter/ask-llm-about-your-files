from typing import List, Dict, Any, Union
from .interfaces import VectorDBInterface, EmbeddingModelInterface, FileProcessorInterface
from uuid import uuid4

class VectorService:
    def __init__(self, db_adapter: VectorDBInterface, 
                 text_embedding_model: EmbeddingModelInterface, 
                 image_embedding_model: EmbeddingModelInterface,
                 file_processors: Dict[str, FileProcessorInterface]):
        self.db_adapter = db_adapter
        self.text_embedding_model = text_embedding_model
        self.image_embedding_model = image_embedding_model
        self.file_processors = file_processors
    
    def process_and_store(self, file_content: bytes, file_name: str) -> List[str]:
        file_extension = file_name.split('.')[-1].lower()
        
        if file_extension not in self.file_processors:
            raise ValueError(f"No processor found for file type: {file_extension}")
        
        processor = self.file_processors[file_extension]
        processed_contents = processor.process(file_content, file_name)
        
        vectors = []
        metadata = []
        file_id = str(uuid4())
        for content in processed_contents:
            if content['type'] == 'text':
                vector = self.text_embedding_model.embed(content['content'])
            elif content['type'] == 'image' and self.image_embedding_model:
                vector = self.image_embedding_model.embed(content['content'])
            else:
                continue
            vectors.append(vector)
            metadata.append({"text": content.get('content', ''), "file_id": file_id})
        
        return self.db_adapter.insert(vectors, metadata)
    
    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        query_vector = self.text_embedding_model.embed(query)
        return self.db_adapter.search(query_vector, top_k)
    
    def delete(self, ids: List[str]) -> bool:
        return self.db_adapter.delete(ids)
