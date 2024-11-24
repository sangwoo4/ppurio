import mysql.connector
from fastapi import HTTPException
import logging
import traceback

# 데이터베이스 설정
DB_CONFIG = {
    'user': 'root',
    'password': '1234',
    'host': 'mysql-container',
    'port': 3306,
    'database': 'ppurio'
}

#localhost
# DB_CONFIG = {
#     'user': 'root',
#     'password': '1234',
#     'host': 'localhost',
#     'database': 'ppurio'
# }

# 로거 설정
logger = logging.getLogger(__name__)

# 메시지 및 이미지 데이터를 가져오는 함수
def fetch_message_and_image_from_db(category: str = None):
    """
    사용자 입력(prompt), 이미지 URL, 카테고리 ID를 데이터베이스에서 가져옵니다.
    특정 카테고리로 필터링할 수 있습니다.
    카테고리가 None인 경우, 카테고리가 NULL인 데이터를 가져옵니다.
    """
    try:
        # MySQL 연결
        conn = mysql.connector.connect(**DB_CONFIG)
        logger.info("데이터베이스 연결 성공")
        cursor = conn.cursor(dictionary=True)

        # 기본 쿼리
        query = """
        SELECT 
            m.prompt AS user_prompt,
            i.url AS image_url,
            m.category_id AS category_id
        FROM message_list m
        LEFT JOIN image i ON m.id = i.message_id
        """

        # 카테고리 조건 추가
        if category is None:
            query += " WHERE m.category_id IS NULL"
        else:
            query += " WHERE m.category_id = %s"

        # 쿼리 실행
        if category is None:
            cursor.execute(query)
        else:
            cursor.execute(query, (category,))

        results = cursor.fetchall()
        logger.info(f"쿼리 실행 성공, 결과: {results}")

        cursor.close()
        conn.close()

        if not results:
            logger.warning("데이터베이스에서 데이터를 찾을 수 없습니다.")
        return results

    except Exception as e:
        logger.error(f"데이터베이스에서 데이터 로드 중 오류 발생: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="데이터를 로드하는 중 오류가 발생했습니다.")

# 데이터베이스 연결 테스트 함수
def test_db_connection():
    """
    데이터베이스 연결을 테스트합니다.
    """
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        cursor.execute("SELECT DATABASE()")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        logger.info(f"데이터베이스 연결 성공: {result[0]}")
        return True
    except Exception as e:
        logger.error(f"데이터베이스 연결 실패: {str(e)}")
        return False
if __name__ == "__main__":
    # DB 연결 테스트 실행
    print("DB 연결 테스트 결과:", test_db_connection())
    
    # 메시지 및 이미지 가져오기 테스트
    print("메시지 및 이미지 가져오기 결과:")
    try:
        result = fetch_message_and_image_from_db()
        for row in result:
            print(row)
    except Exception as e:
        print(f"오류 발생: {e}")
