from pymilvus import (
    Collection,
    connections,
    FieldSchema,
    CollectionSchema,
    DataType,
    MilvusClient
)

client = MilvusClient(uri="main.db")

if not client.has_collection(collection_name="image_embeddings"):
    client.create_collection(
        collection_name="image_embeddings",
        vector_field_name="vector",
        dimension=512,
        auto_id=True,
        enable_dynamic_field=True,
        metric_type="COSINE",
    )

if not Collection.exists(collection_name):
    fields = [
        FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
        FieldSchema(name="text_vector", dtype=DataType.FLOAT_VECTOR, dim=128),
        FieldSchema(name="img_vector", dtype=DataType.FLOAT_VECTOR, dim=128),
        FieldSchema(name="text_chunk", dtype=DataType.STRING),
        FieldSchema(name="file_name", dtype=DataType.STRING),
    ]
    schema = CollectionSchema(fields=fields)
    collection = Collection(name=collection_name, schema=schema)
else:
    collection = Collection(collection_name)
