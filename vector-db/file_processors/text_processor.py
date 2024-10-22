from core.interfaces import FileProcessorInterface
from typing import List, Dict, Union

class TextProcessor(FileProcessorInterface):
    def process(self, file_content: bytes, file_name: str) -> List[Dict[str, Union[str, bytes]]]:
        text = file_content.decode('utf-8')
        chunks = self.chunk_text(text)
        return [{"type": "text", "content": chunk} for chunk in chunks]
