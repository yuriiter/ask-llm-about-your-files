from typing import List
from sentence_transformers import SentenceTransformer
import numpy as np
from core.interfaces import EmbeddingModelInterface

class SentenceTransformerEmbedding(EmbeddingModelInterface):
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2', output_dim: int = 384):
        self.model = SentenceTransformer(model_name)
        self.output_dim = output_dim

    def embed(self, text: str) -> List[float]:
        vector = self.model.encode(text).tolist()
        if len(vector) < self.output_dim:
            vector += [0.0] * (self.output_dim - len(vector))
        elif len(vector) > self.output_dim:
            vector = vector[:self.output_dim]
        return vector
