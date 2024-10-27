from concurrent import futures
import grpc
import time
import os
import traceback
from core.interfaces import APIInterface
from core.vector_service import VectorService

import vector_service_pb2 as pb2
import vector_service_pb2_grpc as pb2_grpc

class VectorServiceServicer(pb2_grpc.VectorServiceServicer):
    def __init__(self, vector_service: VectorService):
        self.vector_service = vector_service

    def UploadFile(self, request, context):
        try:
            result = self.vector_service.process_and_store(
                request.content,
                request.filename
            )
            
            file_metadata_list = []
            for item in result:
                metadata = pb2.FileMetadata(
                    file_id=item["file_id"],
                    file_name=item["file_name"],
                    images_num=item["images_num"],
                    text_chunks_num=item["text_chunks_num"]
                )
                file_metadata_list.append(metadata)
            
            return pb2.UploadFileResponse(
                message="File processed successfully",
                result=file_metadata_list
            )
        except Exception as e:
            print(traceback.format_exc())
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return pb2.UploadFileResponse()

    def Search(self, request, context):
        try:
            results = self.vector_service.search(
                query=request.query,
                top_k=request.top_results,
                query_type=request.type,
                file_ids=list(request.file_ids) if request.file_ids else None
            )
            
            search_results = []
            for result in results:
                metadata = {k: str(v) for k, v in result["metadata"].items()}
                search_result = pb2.SearchResult(
                    id=result["id"],
                    type=result["type"],
                    distance=float(result["distance"]),
                    content=result["content"],
                    file_id=result["file_id"],
                    metadata=metadata
                )
                search_results.append(search_result)
            
            return pb2.SearchResponse(results=search_results)
        except Exception as e:
            print(traceback.format_exc())
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return pb2.SearchResponse()

    def Delete(self, request, context):
        try:
            success = self.vector_service.delete([request.id])
            return pb2.DeleteResponse(
                message="Delete operation completed",
                success=success
            )
        except Exception as e:
            print(traceback.format_exc())
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return pb2.DeleteResponse()

class GRPCApp(APIInterface):
    def __init__(self, vector_service: VectorService):
        self.vector_service = vector_service
        self.server = None

    def run(self):
        self.server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
        pb2_grpc.add_VectorServiceServicer_to_server(
            VectorServiceServicer(self.vector_service),
            self.server
        )
        port = os.getenv('API_PORT', '5000')
        self.server.add_insecure_port(f'[::]:{port}')
        self.server.start()
        print(f"gRPC server started on port {port}")
        try:
            while True:
                time.sleep(86400)
        except KeyboardInterrupt:
            self.server.stop(0)
