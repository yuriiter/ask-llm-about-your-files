from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
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
                contents = await file.read()
                result = self.vector_service.process_and_store(contents, file.filename or "Unknown")
                return {"message": "File processed successfully", "result": result}
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
