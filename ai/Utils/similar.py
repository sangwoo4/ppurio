from abc import ABC, abstractmethod
from pecab import PeCab
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from Utils.common_service import LoggerManager

# 로거 설정
similar_logger = LoggerManager.get_logger("similar_logger")

# 한국어 문장 토큰화
def tokenize_korean(sentence: str) -> str:
    similar_logger.debug(f"원본 문장: {sentence}")
    pecab = PeCab()
    tokens = pecab.morphs(sentence)
    tokenized_sentence = " ".join(tokens)
    similar_logger.debug(f"토큰화된 문장: {tokenized_sentence}")
    return tokenized_sentence

# 유사도 계산 전략을 정의하는 추상 클래스
class SimilarityStrategy(ABC):
    @abstractmethod
    def calculate_similarity(self, sentence1: str, sentence2: str) -> float:
        pass

# 코사인 유사도를 사용한 유사도 계산 클래스
class CosineSimilarity(SimilarityStrategy):
    def __init__(self):
        similar_logger.info("CosineSimilarity 전략 초기화 완료.")

    def calculate_similarity(self, sentence1: str, sentence2: str) -> float:
        similar_logger.debug(f"입력 문장1: {sentence1}")
        similar_logger.debug(f"입력 문장2: {sentence2}")

        tokenized_sentence1 = tokenize_korean(sentence1)
        tokenized_sentence2 = tokenize_korean(sentence2)

        vectorizer = TfidfVectorizer()
        vectors = vectorizer.fit_transform([tokenized_sentence1, tokenized_sentence2])
        similarity = cosine_similarity(vectors[0], vectors[1])[0][0]

        similar_logger.info(f"'{sentence1}'와(과) '{sentence2}'의 유사도: {similarity:.6f}")
        return similarity

# 유사도 계산기를 관리하는 클래스
class SimilarityCalculator:
    def __init__(self, strategy: SimilarityStrategy):
        self.strategy = strategy
        similar_logger.info(f"SimilarityCalculator 초기화 완료. 전략: {self.strategy.__class__.__name__}")

    def calculate(self, text1: str, text2: str) -> float:
        similar_logger.debug(f"유사도 계산 요청 - 문장1: {text1}, 문장2: {text2}")
        similarity = self.strategy.calculate_similarity(text1, text2)
        similar_logger.debug(f"유사도 계산 결과: {similarity:.6f}")
        return similarity

# 유사도 서비스 클래스
class SimilarityService:
    def __init__(self, strategy: SimilarityStrategy):
        self.similarity_calculator = SimilarityCalculator(strategy)
        similar_logger.info("SimilarityService 초기화 완료.")

    # 입력 텍스트와 데이터베이스 항목 중 가장 유사한 항목을 반환합니다.
    def find_most_similar(self, input_text: str, db_data: list, threshold: float = 0.65) -> dict:
        similar_logger.info(f"입력 텍스트: {input_text}")
        similar_logger.info(f"데이터베이스 항목 수: {len(db_data)}")

        highest_similarity = 0.5
        best_entry = None

        for entry in db_data:
            similarity = self.similarity_calculator.calculate(input_text, entry["user_prompt"])
            similar_logger.debug(f"'{input_text}'와(과) '{entry['user_prompt']}' 비교 중 - 유사도: {similarity:.6f}")

            if similarity > highest_similarity:
                highest_similarity = similarity
                best_entry = entry
                similar_logger.info(f"최고 유사도 갱신: {highest_similarity:.6f}, 항목: {best_entry}")
                if similarity >= 1.0:
                    similar_logger.info("최대 유사도를 발견하여 루프를 종료합니다.")
                    break

        if best_entry and highest_similarity >= threshold:
            similar_logger.info(f"최고 유사도 {highest_similarity:.6f}로 가장 유사한 항목 발견: {best_entry}")
            return best_entry

        similar_logger.warning(f"유사도가 {threshold} 이상인 항목을 찾을 수 없습니다. 최고 유사도: {highest_similarity:.6f}")
        return None