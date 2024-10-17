from typing import List, Optional
from milvus.client import client

FileId = str

class MilvusService:
    def load_file(self, file: bytes, user_id: str) -> FileId:
        raise Exception("Not implemented")
        return ""

    def delete_file(self, file_id: int, user_id: str) -> FileId:
        raise Exception("Not implemented")
        return ""

    def get_files(self, user_id: str) -> List[FileId]:
        raise Exception("Not implemented")
        return []

    def get_contexts(self, file_id: Optional[int], file_ids: Optional[List[int]], query: str, user_id: str) -> List[str]:
        raise Exception("Not implemented")
        return []
