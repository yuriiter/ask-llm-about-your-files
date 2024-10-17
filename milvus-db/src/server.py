import os
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from pymilvus import (
    Collection,
    connections,
    FieldSchema,
    CollectionSchema,
    DataType
)
from PIL import Image
import PyPDF2
import io

app = FastAPI()

# Connect to Milvus
connections.connect(host='localhost', port='19530')

# Define collection name
collection_name = "file_collection"

# Define schema
if not Collection.exists(collection_name):
    fields = [
        FieldSchema(name="file_id", dtype=DataType.INT64, is_primary=True, auto_id=True),
        FieldSchema(name="file_vector", dtype=DataType.FLOAT_VECTOR, dim=128),  # Adjust dimension as necessary
        FieldSchema(name="file_type", dtype=DataType.STRING),
        FieldSchema(name="file_content", dtype=DataType.BINARY),
    ]
    schema = CollectionSchema(fields=fields)
    collection = Collection(name=collection_name, schema=schema)
else:
    collection = Collection(collection_name)

def extract_features_from_image(file):
    # Simple placeholder for feature extraction from an image
    image = Image.open(file)
    image = image.resize((128, 128))  # Resize for consistent dimension
    image_array = np.asarray(image).flatten()  # Flatten the image
    image_vector = image_array.astype(np.float32) / 255.0  # Normalize
    return image_vector

def extract_text_from_pdf(file):
    # Simple placeholder for extracting text from a PDF
    reader = PyPDF2.PdfFileReader(file)
    text = ""
    for page in range(reader.numPages):
        text += reader.getPage(page).extract_text()
    return text

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_content = await file.read()
    file_type = file.content_type

    if "image" in file_type:
        vector = extract_features_from_image(io.BytesIO(file_content))
    elif "pdf" in file_type:
        vector = np.random.rand(128).astype(np.float32)  # Placeholder for PDF
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type.")

    # Insert data into Milvus
    ids = collection.insert([[None], [vector], [file_type], [file_content]])

    return {"file_id": ids.primary_keys[0]}

@app.get("/query/")
async def query_file(file_id: int):
    results = collection.query(expr=f"file_id == {file_id}", output_fields=["file_id", "file_type"])
    if not results:
        raise HTTPException(status_code=404, detail="File not found.")
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
