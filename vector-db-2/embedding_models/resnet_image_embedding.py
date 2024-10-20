from typing import List, Union
import torch
from torchvision import models, transforms
from PIL import Image
import io
import numpy as np
from core.interfaces import EmbeddingModelInterface

class ResNetImageEmbedding(EmbeddingModelInterface):
    def __init__(self, model_name: str = 'resnet50', use_cuda: bool = False, output_dim: int = 2048):
        self.device = torch.device("cuda" if use_cuda and torch.cuda.is_available() else "cpu")
        self.model = getattr(models, model_name)(weights=True)
        self.model = self.model.to(self.device)
        self.model.eval()
        
        self.preprocess = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        
        self.output_dim = output_dim

    def embed(self, content: Union[str, bytes]) -> List[float]:
        if isinstance(content, str):
            image = Image.open(content).convert('RGB')
        elif isinstance(content, bytes):
            image = Image.open(io.BytesIO(content)).convert('RGB')
        else:
            raise ValueError("Invalid input type. Expected str (file path) or bytes (image data).")

        input_tensor = self.preprocess(image)
        input_batch = input_tensor.unsqueeze(0).to(self.device)

        with torch.no_grad():
            features = self.model(input_batch)

        features = features.squeeze().cpu().numpy()
        if features.shape[0] < self.output_dim:
            features = np.pad(features, (0, self.output_dim - features.shape[0]), 'constant')
        elif features.shape[0] > self.output_dim:
            features = features[:self.output_dim]

        return features.tolist()
