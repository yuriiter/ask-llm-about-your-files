# 🚀 Vector Search Microservice

A powerful, flexible, and production-ready vector search microservice that enables semantic search across multiple file types with state-of-the-art ML models. Built with scalability and extensibility in mind, this service makes it easy to add intelligent search capabilities to your applications.

## ✨ Key Features

- **Multi-Modal Search**: Seamlessly search across both text and images using advanced embedding models
- **Multiple File Format Support**:
  - 📄 PDF documents with text and image extraction
  - 📝 Text files (.txt)
  - 🖼️ Images (jpg, jpeg, png)
  - 📦 Archives (zip, rar) with recursive processing
- **Dual Neural Processing**:
  - Text: Sentence Transformers for high-quality semantic text embeddings
  - Images: CLIP + ResNet dual embedding for robust image understanding
- **High Performance Vector Database**: Powered by Milvus for lightning-fast similarity search
- **Flexible API Options**:
  - gRPC for high-performance communication
  - FastAPI for RESTful interface
- **Enterprise-Ready Features**:
  - Configurable through YAML
  - Environment variable support
  - Comprehensive error handling
  - Detailed logging

## 🛠️ Architecture

The service follows clean architecture principles with clear separation of concerns:

- **Core Layer**: Contains business logic and interface definitions
- **API Layer**: Handles external communication (gRPC/REST)
- **DB Layer**: Manages vector storage and retrieval
- **Processors**: Handle different file types
- **Embedding Models**: Convert content to vector representations

## 🚀 Getting Started

### Prerequisites

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Configuration

The service is configured through `config/config.yaml`. Key configurations include:

```yaml
vector_db:
  uri: "file://./main.db" # Local Milvus DB
  # uri: "https://your-milvus-instance:19530" # Remote Milvus

text_embedding_model:
  model_name: "all-MiniLM-L6-v2"
  output_dim: 768

image_embedding_model:
  model_name: "resnet50"
  use_cuda: false
```

### Running the Service

```bash
# Start the service
python main.py

# The service will start on the configured port (default: 5000)
```

## 🎯 Use Cases

- **Document Search Systems**: Build intelligent document management systems with semantic search capabilities
- **Image Search**: Create visual search engines that understand image content
- **Multi-Modal Applications**: Develop applications that can search across both text and images
- **Content Analysis**: Extract and analyze content from various file formats
- **Knowledge Management**: Build smart knowledge bases with semantic search capabilities

## 🔧 Extending the Service

The service is designed for extensibility:

1. **Add New File Processors**: Implement `FileProcessorInterface` for new file types
2. **Custom Embedding Models**: Implement `EmbeddingModelInterface` for different embedding approaches
3. **Alternative Vector DBs**: Implement `VectorDBInterface` for other vector databases
4. **API of your choice**: Implement `APIInterface` for other kinds of API or frameworks

## 📈 Performance

- Efficient chunking strategies for optimal text processing
- HNSW index for fast approximate nearest neighbor search
- Configurable vector dimensions and index parameters
- Batch processing support for large files

## 🌟 Why Choose This Service?

1. **Production Ready**: Built with enterprise requirements in mind
2. **Flexible Architecture**: Easy to extend and modify
3. **Modern Stack**: Uses cutting-edge ML models and vector DB technology
4. **Developer Friendly**: Clear interfaces and comprehensive documentation
5. **Performance Oriented**: Optimized for speed and scalability

---

Built with ❤️ using Python, Milvus, Sentence Transformers, and CLIP
