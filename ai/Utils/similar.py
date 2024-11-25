from abc import ABC, abstractmethod
from pecab import PeCab
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# 유사도 계산 인터페이스 정의
class SimilarityStrategy(ABC):
    @abstractmethod
    def calculate_similarity(self, sentence1: str, sentence2: str) -> float:
        pass

# 자카드 유사도 전략
# class JaccardSimilarity(SimilarityStrategy):
#     def calculate_similarity(self, sentence1: str, sentence2: str) -> float:
#         set1 = set(sentence1.lower().split())
#         set2 = set(sentence2.lower().split())
#         intersection = set1.intersection(set2)
#         union = set1.union(set2)
#         return len(intersection) / len(union) if len(union) > 0 else 0.0

# 코사인 유사도 전략
class CosineSimilarity(SimilarityStrategy):
    def __init__(self):
        self.pecab = PeCab()

    def tokenize_korean(self, sentence: str) -> str:
        tokens = self.pecab.morphs(sentence)
        return " ".join(tokens)

    def calculate_similarity(self, sentence1: str, sentence2: str) -> float:
        try:
            tokenized_sentence1 = self.tokenize_korean(sentence1)
            tokenized_sentence2 = self.tokenize_korean(sentence2)
            vectorizer = TfidfVectorizer()
            vectors = vectorizer.fit_transform([tokenized_sentence1, tokenized_sentence2])
            return cosine_similarity(vectors[0], vectors[1])[0][0]
        except Exception as e:
            print(f"유사도 계산 중 오류 발생: {str(e)}")
            return 0.0

# 유사도 계산기
class SimilarityCalculator:
    _instance = None

    def __new__(cls, strategy: SimilarityStrategy):
        if cls._instance is None:
            cls._instance = super(SimilarityCalculator, cls).__new__(cls)
            cls._instance.strategy = strategy
        return cls._instance

    def calculate(self, sentence1: str, sentence2: str) -> float:
        return self.strategy.calculate_similarity(sentence1, sentence2)

# 사용 예시
# if __name__ == "__main__":
#     sentence1 = "나는 학교에 갔다."
#     sentence2 = "내가 학교로 등교했다."

#     jaccard_calculator = SimilarityCalculator(JaccardSimilarity())
#     print(f"자카드 유사도: {jaccard_calculator.calculate(sentence1, sentence2):.2f}")

#     cosine_calculator = SimilarityCalculator(CosineSimilarity())
#     print(f"코사인 유사도: {cosine_calculator.calculate(sentence1, sentence2):.2f}")
