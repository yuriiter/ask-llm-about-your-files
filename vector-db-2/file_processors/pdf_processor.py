from core.interfaces import FileProcessorInterface
import PyPDF2
import io
from typing import List, Dict, Union

class PDFProcessor(FileProcessorInterface):
    def process(self, file_content: bytes, file_name: str) -> List[Dict[str, Union[str, bytes]]]:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        chunks = self.chunk_text(text.strip())
        return [{"type": "text", "content": chunk} for chunk in chunks]
