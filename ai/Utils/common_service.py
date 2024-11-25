import logging
from fastapi import HTTPException

#로깅 설정 및 관리 클래스.
class LoggerManager:
    _loggers = {}

    # 로그 메시지를 콘솔에 출력할 수 있도록 구성합니다.
    @staticmethod
    def _setup_handler():
        handler = logging.StreamHandler()
        formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
        handler.setFormatter(formatter)
        return handler
    
    # 지정된 이름의 로거를 반환합니다.
    @staticmethod
    def get_logger(name="base_logger"):
        if name not in LoggerManager._loggers:
            logger = logging.getLogger(name)
            logger.setLevel(logging.INFO)
            if not logger.handlers:  # 기존 핸들러 확인
                handler = LoggerManager._setup_handler()
                logger.addHandler(handler)
            LoggerManager._loggers[name] = logger
        return LoggerManager._loggers[name]
    
# 하나 이상 서비스 클래스에서 공통적으로 사용되는 기능을 제공합니다.
class CommonService:
    def __init__(self):
        self.logger = LoggerManager.get_logger("base_logger")

    def log_request(self, request_data):
        self.logger.info(f"Request Data: {request_data}")

    def handle_api_error(self, error):
        self.logger.error(f"API Error: {error}")
        raise HTTPException(status_code=500, detail=f"API Error: {error}")

    # 주어진 카테고리를 카테고리 맵에서 검증합니다.
    def validate_category(self, category, category_map):
        validated_category = category_map.get(category)
        if not validated_category:
            self.logger.warning(f"Invalid category: {category}")
        return validated_category or category