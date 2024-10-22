#!/usr/bin/sh
source venv/bin/activate
python -m grpc_tools.protoc \
    --proto_path=./api/protos \
    --python_out=. \
    --grpc_python_out=. \
    ./api/protos/vector_service.proto

