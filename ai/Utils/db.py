# db.py
import aiomysql

from fastapi import HTTPException
from Utils.common_service import LoggerManager

# 데이터베이스 설정
DB_CONFIG = {
    'user': 'root',
    'password': '1234',
    'host': 'mysql-container',
    'port': 3306,
    'db': 'ppurio',
}

# DB 전용 로거
db_logger = LoggerManager.get_logger("db_logger")

# 데이터베이스 연결 풀을 관리하는 클래스
class DatabaseConnection:
    def __init__(self, config):
        self.config = config
        self.logger = db_logger
        self.pool = None

    # 데이터베이스 연결 풀 생성
    async def create_pool(self):
        try:
            self.logger.info("데이터베이스 연결 풀 생성 중...")
            self.pool = await aiomysql.create_pool(
                **self.config,
                minsize=5,
                maxsize=20,
                connect_timeout=10
            )
            self.logger.info("데이터베이스 연결 풀 생성 성공")
        except aiomysql.Error as e:
            self.logger.error(f"데이터베이스 연결 풀 생성 실패: {e.args}")
            raise HTTPException(status_code=500, detail="데이터베이스 연결 풀 생성 실패")

    # 연결 획득
    async def get_connection(self):
        if not self.pool:
            await self.create_pool()
        return await self.pool.acquire()

    # 연결 반환
    async def release_connection(self, conn):
        try:
            if conn:
                self.pool.release(conn)
                self.logger.info("데이터베이스 연결 반환 성공")
        except Exception as e:
            self.logger.warning(f"데이터베이스 연결 반환 실패: {str(e)}")


# 데이터베이스 쿼리 실행 및 데이터를 반환하는 클래스
class DataService:
    def __init__(self, db_connection: DatabaseConnection):
        self.db_connection = db_connection
        self.logger = db_logger

    async def fetch_data(self, query: str, params: tuple = ()):
        conn = None
        try:
            conn = await self.db_connection.get_connection()
            async with conn.cursor(aiomysql.DictCursor) as cursor:
                self.logger.info(f"쿼리 실행 중: {query}, 매개변수: {params}")
                await cursor.execute(query, params)
                results = await cursor.fetchall()
                self.logger.info(f"쿼리 실행 완료. 조회된 행 수: {len(results)}개")
            return results
        except aiomysql.Error as e:
            self.logger.error(f"MySQL 오류 발생: {e.args}")
            raise HTTPException(status_code=500, detail="데이터베이스 처리 중 오류가 발생했습니다.")
        except Exception as e:
            self.logger.error(f"알 수 없는 오류 발생: {str(e)}")
            raise HTTPException(status_code=500, detail="데이터 조회 중 오류가 발생했습니다.")
        finally:
            await self.db_connection.release_connection(conn)


# 메시지 및 이미지 데이터를 관리하는 서비스 클래스
class MessageImageService:
    def __init__(self, data_service: DataService):
        self.data_service = data_service
        self.logger = db_logger

    # 카테고리 ID 조회
    async def fetch_category_id(self, category: str) -> int:
        query = "SELECT id FROM category WHERE category = %s"
        result = await self.data_service.fetch_data(query, (category,))
        if result:
            category_id = result[0]['id']
            self.logger.info(f"카테고리 '{category}'의 ID: {category_id}")
            return category_id
        else:
            self.logger.warning(f"카테고리 '{category}'를 찾을 수 없습니다.")
            return None

    # 메시지 및 이미지 데이터 조회
    async def fetch_message_and_image(self, category: str = None):
        query = """
        SELECT DISTINCT
            m.prompt AS user_prompt,
            i.url AS image_url,
            m.category_id AS category_id
        FROM message m
        LEFT JOIN image i ON m.id = i.message_id
        """
        params = None

        if category:
            category_id = await self.fetch_category_id(category)
            if not category_id:
                self.logger.warning(f"유효하지 않은 카테고리: {category}")
                return []
            query += " WHERE m.category_id = %s LIMIT 10"
            params = (category_id,)
        else:
            query += " WHERE m.category_id IS NULL LIMIT 10"

        results = await self.data_service.fetch_data(query, params)
        self.logger.info(f"조회된 메시지 및 이미지 데이터 수: {len(results)}")
        return results