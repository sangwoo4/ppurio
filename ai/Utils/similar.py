# 자카드 유사도 계산 함수
# 문장의 교집합(공통된 단어)를 찾아 유사도 측정
# 리턴값: 공통 단어가 없는 문장 = 0.0 ~ 완전 일치하는 문장 = 1.0
# 조사를 떼기 위해선 한국어 형태소 파이썬 라이브러리 추가 요망(현재 조사 중)
# 의미는 같지만 형태는 다른 유의어 파악을 위해선 코사인 유사도 등 다른 방식 필요 
def jaccard_similarity(sentence1: str, sentence2: str) -> float:
    # 문장을 소문자로 변환하고, 공백을 기준으로 단어로 분리
    set1 = set(sentence1.lower().split())
    set2 = set(sentence2.lower().split())

    # 교집합과 합집합 계산
    intersection = set1.intersection(set2)
    union = set1.union(set2)

    # 자카드 유사도 계산
    if len(union) == 0:
        return 0.0  # 합집합이 비어 있으면 유사도는 0
    return len(intersection) / len(union)
'''
# 테스트 예시
if __name__ == "__main__":
    sentence1 = "나는 사과를 좋아한다."
    sentence2 = "나는 사과가 싫다."
    
    similarity = jaccard_similarity(sentence1, sentence2)
    print(f"두 문장의 자카드 유사도: {similarity:.2f}")
'''
#한국어 형태소를 분류하는 기능 추가(먹다,먹는,먹을 등의 상황에서 유연하게 인식)
#코사인 유사도로 변경
#pip install pecab 필요
# 리턴값: 완전히 다른 의미의 문장 = 0.0 ~ 완전 일치하는 문장 = 1.0
from pecab import PeCab
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# PeCAn 형태소 분석기 초기화
pecab = PeCab()

# 형태소로 나누는 함수
def tokenize_korean(sentence):
    """
    입력된 한국어 문장을 PeCAn으로 형태소 분석 후, 형태소 리스트를 반환합니다.
    """
    tokens = pecab.morphs(sentence)  # 모든 형태소 추출
    return " ".join(tokens)

# 코사인 유사도 계산 함수
def calculate_similarity(sentence1, sentence2):
    tokenized_sentence1 = tokenize_korean(sentence1)
    tokenized_sentence2 = tokenize_korean(sentence2)
    
    # TF-IDF 벡터화
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([tokenized_sentence1, tokenized_sentence2])
    
    similarity = cosine_similarity(vectors[0], vectors[1])
    return similarity[0][0]

'''
# main 함수
if __name__ == "__main__":
    sentence1 = "나는 학교로 갔다."
    sentence2 = "내가 학교에 등교했다."
    similarity = calculate_similarity(sentence1, sentence2)
    print(f"두 문장의 유사도: {similarity:.4f}")
'''