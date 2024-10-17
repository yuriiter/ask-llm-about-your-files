from fastapi import FastAPI, UploadFile, File, HTTPException, Header
from typing import List, Optional
from milvus.services import MilvusService
from milvus.exceptions import NotFoundException
from build_response import build_response

app = FastAPI()
milvus_service = MilvusService()

@app.post("/files")
async def upload_file(
    file: UploadFile = File(...), 
    user_id: str = Header(..., alias="Authorization")
):
    file_content = await file.read()
    file_type = file.content_type or ""

    if not "image" in file_type and not "pdf" in file_type:
        raise HTTPException(status_code=400, detail="Unsupported file type.")

    loaded_file_id = milvus_service.load_file(file_content, user_id)

    return build_response(200, None, {"file_id": loaded_file_id})

@app.delete("/files/{file_id}")
async def delete_file(file_id: int, user_id: str = Header(..., alias="Authorization")):
    try:
        deleted_file_id = milvus_service.delete_file(file_id, user_id)
        return build_response(200, None, {"file_id": deleted_file_id})
    except NotFoundException:
        raise HTTPException(status_code=404, detail="Resource not found")


@app.get("/files")
async def list_files(user_id: str = Header(..., alias="Authorization")):
    try:
        files = milvus_service.get_files(user_id)
        return build_response(200, None, {"files": files})
    except NotFoundException:
        raise HTTPException(status_code=404, detail="Resource not found")

@app.get("/contexts")
async def query_files(
    file_id: Optional[int] = None, 
    file_ids: Optional[List[int]] = None, 
    query: str = "", 
    user_id: str = Header(..., alias="Authorization")
):
    try:
        contexts = milvus_service.get_contexts(file_id, file_ids, query, user_id)
        return build_response(200, None, {"contexts": contexts})
    except NotFoundException:
        raise HTTPException(status_code=404, detail="Resource not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
