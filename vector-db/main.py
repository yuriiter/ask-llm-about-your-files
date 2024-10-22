from dotenv import load_dotenv
load_dotenv()

from utils.config_manager import ConfigManager
from core.vector_service import VectorService

def create_app(config_path: str):
    config = ConfigManager.load_config(config_path)
    
    db_adapter = ConfigManager.create_component(config['vector_db'])
    text_embedding_model = ConfigManager.create_component(config['text_embedding_model'])
    image_embedding_model = ConfigManager.create_component(config['image_embedding_model'])
    
    file_processors = ConfigManager.create_file_processors(config['file_processors'])
    
    if 'zip' in file_processors:
        file_processors['zip'].file_processors = file_processors
    if 'rar' in file_processors:
        file_processors['rar'].file_processors = file_processors
    
    vector_service = VectorService(db_adapter, text_embedding_model, image_embedding_model, file_processors)
    
    api_cls = ConfigManager.get_implementation(config['api']['interface'], config['api']['implementation'])
    api = api_cls(vector_service)
    
    return api

if __name__ == "__main__":
    app = create_app('config/config.yaml')
    app.run()
