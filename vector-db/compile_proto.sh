#!/usr/bin/sh
source venv/bin/activate
python -m grpc_tools.protoc \
    --proto_path=../proto/ \
    --python_out=. \
    --grpc_python_out=. \
    ../proto/vector_service.proto

