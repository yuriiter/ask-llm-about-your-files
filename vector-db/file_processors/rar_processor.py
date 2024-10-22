import rarfile
import io
from core.interfaces import FileProcessorInterface
from typing import Dict

class RarProcessor(FileProcessorInterface):
    def __init__(self, file_processors: Dict[str, FileProcessorInterface] = {}):
        self.file_processors = file_processors or {}

    def process(self, file_content: bytes, file_name: str):
        results = []
        with rarfile.RarFile(io.BytesIO(file_content)) as rar_file:
            for name in rar_file.namelist():
                with rar_file.open(name) as file:
                    content = file.read()
                    extension = name.split('.')[-1].lower()
                    processor = self.file_processors.get(extension, self.file_processors.get('txt'))
                    if processor:
                        results.extend(processor.process(content, name))
        return results
