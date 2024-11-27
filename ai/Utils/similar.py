# similar.py
from abc import ABC, abstractmethod
from pecab import PeCab
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# 한국어 문장 토큰화
def tokenize_korean(sentence: str) -> str:
    pecab = PeCab()
    tokens = pecab.morphs(sentence)
    return " ".join(tokens)

# 유사도 계산 전략을 정의하는 추상 클래스
class SimilarityStrategy(ABC):
    @abstractmethod
    def calculate_similarity(self, sentence1: str, sentence2: str) -> float:
        pass

# 코사인 유사도를 사용한 유사도 계산 클래스
class CosineSimilarity(SimilarityStrategy):
    def calculate_similarity(self, sentence1: str, sentence2: str) -> float:
        tokenized_sentence1 = tokenize_korean(sentence1)
        tokenized_sentence2 = tokenize_korean(sentence2)
        vectorizer = TfidfVectorizer()
        vectors = vectorizer.fit_transform([tokenized_sentence1, tokenized_sentence2])
        return cosine_similarity(vectors[0], vectors[1])[0][0]

# 유사도 계산기를 관리하는 클래스
class SimilarityCalculator:
    def __init__(self, strategy: SimilarityStrategy):
        self.strategy = strategy

    def calculate(self, text1: str, text2: str) -> float:
        return self.strategy.calculate_similarity(text1, text2)

# 유사도 서비스 클래스
class SimilarityService:
    def __init__(self, strategy: SimilarityStrategy):
        self.similarity_calculator = SimilarityCalculator(strategy)

    # 입력 텍스트와 데이터베이스 항목 중 가장 유사한 항목을 반환합니다.
    def find_most_similar(self, input_text: str, db_data: list, threshold: float = 0.65) -> dict:
        highest_similarity = 0
        best_entry = None

        for entry in db_data:
            similarity = self.similarity_calculator.calculate(input_text, entry["user_prompt"])
            print(f"'{input_text}'와(과) '{entry['user_prompt']}'을(를) 비교 중 - 유사도: {similarity:.6f}")
            if similarity > highest_similarity:
                highest_similarity = similarity
                best_entry = entry
                if similarity >= 1.0:
                    print("최대 유사도를 발견하여 루프를 종료합니다.")
                    break

        if best_entry and highest_similarity >= threshold:
            print(f"최고 유사도 {highest_similarity:.6f}로 가장 유사한 항목 발견: {best_entry}")
            return best_entry

        print(f"유사도가 {threshold} 이상인 항목을 찾을 수 없습니다. 최고 유사도: {highest_similarity:.6f}")
        return None