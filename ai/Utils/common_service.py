import logging
from fastapi import HTTPException

def setup_logger(name="base_logger"):
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    if not any(isinstance(h, logging.StreamHandler) for h in logger.handlers):
        stream_handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        stream_handler.setFormatter(formatter)
        logger.addHandler(stream_handler)

    logger.propagate = False
    return logger

class CommonService:
    def __init__(self):
        self.logger = setup_logger("base_logger")

    def log_request(self, request_data):
        self.logger.info(f"Request Data: {request_data}")

    def handle_api_error(self, error):
        self.logger.error(f"API Error: {error}")
        raise HTTPException(status_code=500, detail=f"API Error: {error}")

    def validate_category(self, category, category_map):
        return category_map.get(category, category)
