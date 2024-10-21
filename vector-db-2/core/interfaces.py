from abc import ABC, abstractmethod
from typing import List, Dict, Any, Union

class VectorDBInterface(ABC):
    @abstractmethod
    def __init__(self, uri: str):
        pass
    
    @abstractmethod
    def insert(self, vectors: List[List[float]], metadata: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        pass
    
    @abstractmethod
    def search(self, query_vector: List[float], top_k: int) -> List[Dict[str, Any]]:
        pass
    
    @abstractmethod
    def delete(self, ids: List[str]) -> bool:
        pass

class EmbeddingModelInterface(ABC):
    @abstractmethod
    def embed(self, content: Union[str, bytes]) -> List[float]:
        pass

class FileProcessorInterface(ABC):
    @abstractmethod
    def process(self, file_content: bytes, file_name: str) -> List[Dict[str, Union[str, bytes]]]:
        pass

    def chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 100) -> List[str]:
        chunks = []
        start = 0
        text_length = len(text)

        while start < text_length:
            end = start + chunk_size
            chunk = text[start:end]
            
            if end < text_length:
                last_period = chunk.rfind('.')
                if last_period != -1:
                    end = start + last_period + 1
                    chunk = text[start:end]

            chunks.append(chunk)
            start = end - overlap

        return chunks

class APIInterface(ABC):
    @abstractmethod
    def run(self):
        pass

