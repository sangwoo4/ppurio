# common_service.py

import logging
from fastapi import HTTPException

def setup_logger():
    logger = logging.getLogger("fastapi_logger")
    logger.setLevel(logging.INFO)

    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s\n"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger

class CommonService:
    def __init__(self):
        self.logger = setup_logger()

    def log_request(self, request_data):
        self.logger.info(f"Request Data: {request_data}")

    def handle_api_error(self, error):
        self.logger.error(f"API Error: {error}")
        raise HTTPException(status_code=500, detail=f"API Error: {error}")

    def validate_category(self, category, category_map):
        return category_map.get(category, category)
