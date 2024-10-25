import * as grpc from "@grpc/grpc-js";
import { vector_service } from "./generated/vector_service";

interface FileMetadata {
  fileId: string;
  fileName: string;
  imagesNum: number;
  textChunksNum: number;
}

interface UploadFileResponse {
  message: string;
  result: FileMetadata[];
}

interface SearchResult {
  id: string;
  type: string;
  distance: number;
  content: string;
  fileId: string;
  metadata: { [key: string]: string };
}

interface DeleteResponse {
  message: string;
  success: boolean;
}

class VectorServiceClient {
  private client: vector_service.VectorServiceClient;

  constructor() {
    const address = process.env.VECTOR_SERVICE_URL ?? "localhost:5000";
    const insecureCredentials = grpc.credentials.createInsecure();
    this.client = new vector_service.VectorServiceClient(
      address,
      insecureCredentials,
    );
  }

  public uploadFile = async (
    content: Uint8Array,
    filename: string,
  ): Promise<UploadFileResponse> => {
    const client = this.client;
    const uploadFileRequest = new vector_service.UploadFileRequest({
      content,
      filename,
    });

    return new Promise((resolve, reject) => {
      client.UploadFile(uploadFileRequest, (err, response) => {
        if (err) reject(err);

        const result =
          response?.result.map((metadata) => ({
            fileId: metadata.file_id,
            fileName: metadata.file_name,
            imagesNum: metadata.images_num,
            textChunksNum: metadata.text_chunks_num,
          })) ?? [];

        resolve({
          message: response?.message ?? "No message",
          result,
        });
      });
    });
  };

  public search = async (
    query: string,
    topResults?: number,
    type?: string,
    fileIds?: string[],
  ): Promise<SearchResult[]> => {
    const client = this.client;
    const searchRequest = new vector_service.SearchRequest({
      query,
      top_results: topResults,
      type,
      file_ids: fileIds,
    });

    return new Promise((resolve, reject) => {
      client.Search(searchRequest, (err, response) => {
        if (err) reject(err);

        const results =
          response?.results.map((result) => ({
            id: result.id,
            type: result.type,
            distance: result.distance,
            content: result.content,
            fileId: result.file_id,
            metadata: Object.fromEntries(result.metadata),
          })) ?? [];

        resolve(results);
      });
    });
  };

  public delete = async (id: string): Promise<DeleteResponse> => {
    const client = this.client;
    const deleteRequest = new vector_service.DeleteRequest({
      id,
    });

    return new Promise((resolve, reject) => {
      client.Delete(deleteRequest, (err, response) => {
        if (err) reject(err);

        resolve({
          message: response?.message ?? "No message",
          success: response?.success ?? false,
        });
      });
    });
  };
}

export const vectorServiceClient = new VectorServiceClient();
