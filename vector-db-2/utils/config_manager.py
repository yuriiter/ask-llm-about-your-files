import importlib
import yaml

class ConfigManager:
    @staticmethod
    def load_config(config_path: str) -> dict:
        with open(config_path, 'r') as file:
            return yaml.safe_load(file)

    @staticmethod
    def get_implementation(interface_path: str, implementation_path: str):
        module_name, class_name = implementation_path.rsplit('.', 1)
        module = importlib.import_module(module_name)
        return getattr(module, class_name)

    @staticmethod
    def create_component(component_config: dict):
        cls = ConfigManager.get_implementation(component_config['interface'], component_config['implementation'])
        return cls(**component_config.get('params', {}))

    @staticmethod
    def create_file_processors(file_processors_config: dict):
        file_processors = {}
        for ext, processor_config in file_processors_config.items():
            file_processors[ext] = ConfigManager.create_component(processor_config)
        return file_processors
