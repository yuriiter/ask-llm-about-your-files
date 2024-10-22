import torch
from torchvision import models, transforms
from PIL import Image
import io
import numpy as np
import base64
from core.interfaces import EmbeddingModelInterface
from typing import List, Union, Tuple
import requests
from urllib.parse import urlparse
import clip

class ClipDualEmbedding(EmbeddingModelInterface):
    def __init__(self, model_name: str = 'resnet50', use_cuda: bool = False, output_dim: int = 512):
        self.device = torch.device("cuda" if use_cuda and torch.cuda.is_available() else "cpu")
        
        self.clip_model, self.clip_preprocess = clip.load("ViT-B/32", device=self.device)
        self.clip_model.eval()
        
        self.model = getattr(models, model_name)(weights='IMAGENET1K_V1')
        self.model = self.model.to(self.device)
        self.model.eval()
        
        self.resnet_preprocess = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        
        self.output_dim = output_dim

    def is_url(self, string: str) -> bool:
        try:
            result = urlparse(string)
            return all([result.scheme, result.netloc])
        except ValueError:
            return False

    def fetch_image_from_url(self, url: str) -> Image.Image:
        response = requests.get(url)
        response.raise_for_status()
        return Image.open(io.BytesIO(response.content)).convert('RGB')

    def embed(self, content: Union[str, bytes]) -> List[float]:
        if isinstance(content, str):
            if self.is_url(content):
                image = self.fetch_image_from_url(content)
                return self._process_image_embedding(image)
            else:
                try:
                    content_bytes = base64.b64decode(content)
                    image = Image.open(io.BytesIO(content_bytes)).convert('RGB')
                    return self._process_image_embedding(image)
                except Exception:
                    return self.embed_text(content)
        elif isinstance(content, bytes):
            image = Image.open(io.BytesIO(content)).convert('RGB')
            return self._process_image_embedding(image)
        else:
            raise ValueError("Invalid input type. Expected str (URL, base64, or text query) or bytes (image data).")

    def _process_image_embedding(self, image: Image.Image) -> List[float]:
        clip_embedding = self.embed_image_clip(image)
        return clip_embedding

    def embed_image_clip(self, image: Image.Image) -> List[float]:
        image_input = self.clip_preprocess(image).unsqueeze(0).to(self.device)
        with torch.no_grad():
            image_features = self.clip_model.encode_image(image_input)
        
        features = image_features.squeeze().cpu().numpy()
        features = self._adjust_output_dim(features)
        return features.tolist()

    def embed_image_resnet(self, image: Image.Image) -> List[float]:
        input_tensor = self.resnet_preprocess(image)
        input_batch = input_tensor.unsqueeze(0).to(self.device)

        with torch.no_grad():
            features = self.model(input_batch)

        features = features.squeeze().cpu().numpy()
        features = self._adjust_output_dim(features)
        return features.tolist()

    def embed_text(self, text: str) -> List[float]:
        with torch.no_grad():
            text_inputs = clip.tokenize([text]).to(self.device)
            text_features = self.clip_model.encode_text(text_inputs)

        features = text_features.squeeze().cpu().numpy()
        features = self._adjust_output_dim(features)
        return features.tolist()

    def _adjust_output_dim(self, features: np.ndarray) -> np.ndarray:
        if features.shape[0] < self.output_dim:
            return np.pad(features, (0, self.output_dim - features.shape[0]), 'constant')
        elif features.shape[0] > self.output_dim:
            return features[:self.output_dim]
        return features
