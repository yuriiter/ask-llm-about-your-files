from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import List
from core.interfaces import APIInterface
from core.vector_service import VectorService

class Query(BaseModel):
    text: str
    top_k: int = 5

class FastAPIApp(APIInterface):
    def __init__(self, vector_service: VectorService):
        self.app = FastAPI()
        self.vector_service = vector_service
        
        @self.app.post("/upload")
        async def upload_file(file: UploadFile = File(...)):
            try:
                if file == None:
                    raise HTTPException(status_code=400)
                contents = await file.read()
                ids = self.vector_service.process_and_store(contents, file.filename)
                return {"message": "File processed successfully", "ids": ids}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))

        @self.app.post("/search")
        async def search(query: Query):
            try:
                results = self.vector_service.search(query.text, query.top_k)
                return {"results": results}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))

        @self.app.delete("/delete/{id}")
        async def delete(id: str):
            try:
                success = self.vector_service.delete([id])
                return {"message": "Delete operation completed", "success": success}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))

    def run(self):
        import uvicorn
        uvicorn.run(self.app, host="0.0.0.0", port=8000)
