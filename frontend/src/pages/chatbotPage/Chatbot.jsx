
import React, { useState, useEffect } from "react";
import "../../styles/Chatbot.css";
import API_BASE_URL from "../../URL_API";
import { useNavigate } from 'react-router-dom';
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

const Chatbot = () => {
  const navigate = useNavigate();
  const steps = 6;
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState([
    { text: "텍스트와 이미지 생성 중 선택해주세요", isBot: true },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [chatMode, setChatMode] = useState(null);
  const [selectedTone, setSelectedTone] = useState(null);
  const [keyword, setKeyword] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userText, setUserText] = useState("");
  const [mood, setMood] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isImageIncluded, setIsImageIncluded] = useState(false); // 이미지 포함 여부

  const [resultText, setResultText] = useState(null);
  const [resultCategory, setResultCategory] = useState(null);
  const [resultImgData, setResultImgData] = useState(null); // 이미지 결과 데이터를 저장하는 상태
  const [resultTxtData, setResultTxtData] = useState(null); // 텍스트 결과 데이터를 저장하는 상태


  // 로컬스토리지에서 userId 가져오기
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const displayStep = (targetStep) => {
    const stepsElements = document.querySelectorAll(".steps__step");
    stepsElements.forEach((stepEl, index) => {
      stepEl.classList.remove("steps__step--current", "steps__step--done");
      if (index < targetStep) {
        stepEl.classList.add("steps__step--done");
      } else if (index === targetStep) {
        stepEl.classList.add("steps__step--current");
      }
    });
  };

  useEffect(() => {
    displayStep(currentStep);
  }, [currentStep]);

  const handleButtonClick = (mode) => {
    setChatMode(mode);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `선택한 모드: ${mode === "text" ? "텍스트 생성" : "이미지 생성"}`, isBot: false },
      { text: "생성 목적을 선택해주세요", isBot: true },
    ]);
    setCurrentStep(1); // 생성 목적 선택 단계로 이동
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputValue, isBot: false },
      ]);
      setInputValue(""); // 입력 필드 초기화
      if (currentStep === 2) {
        setUserText(inputValue); // 'text' 데이터 저장
        handleNextMessage();
      } else if (currentStep === 3) {
        const tags = inputValue.split(" ").slice(0, 3); // 최대 3개 추출
        setKeyword(tags);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `입력한 키워드: ${tags.join(", ")}`, isBot: false },
        ]);
        setInputValue(""); // 입력 필드 초기화
        setCurrentStep(4); // 어조 선택 단계로 이동
      } else if (currentStep === 4) {
        setMood([inputValue]); // 직접 입력한 어조 저장
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `입력한 어조: ${inputValue}`, isBot: false },
          { text: "모든 입력이 완료되었습니다. 생성 중입니다...", isBot: true },
        ]);
        setCurrentStep(5); // 생성 완료 단계로 이동
      }
    }
  };

  const handleSkip = () => {
    if (currentStep === 3) {
      setKeyword(null); // 해시태그를 null로 설정
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "중요 키워드를 건너뛰었습니다.", isBot: true },
      ]);
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setMood(null); // 어조를 null로 설정
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "어조 선택을 건너뛰었습니다.", isBot: true },
        { text: "생성 중입니다...", isBot: true },
      ]);
      setCurrentStep(5); // 생성 단계로 바로 이동
      handleGenerateMessage(); // 직접 호출하여 API 요청
    }
  };


  const handleNextMessage = () => {
    if (currentStep === 2) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "중요 키워드가 있나요? 최대 3개까지 입력해주세요.", isBot: true },
      ]);
      setCurrentStep(3);
    }
  };

  useEffect(() => {
    if (mood && mood.length > 0) {
      handleGenerateMessage();
    }
  }, [mood]); // mood가 변경될 때마다 실행

  // mood가 선택되었을 때 상태 업데이트
  const handleToneSelect = (mood) => {
    setSelectedTone(mood);
    setMood([mood]); // mood 선택 시 상태 업데이트
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `선택한 어조: ${mood}`, isBot: false },
      { text: "모든 입력이 완료되었습니다. 생성 중입니다...", isBot: true },
    ]);
    setCurrentStep(5);
  };

  useEffect(() => {
    if (currentStep === 4) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "어조를 선택하거나 직접 입력해주세요.", isBot: true },
      ]);
    }
  }, [currentStep]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("카테고리 데이터를 가져오는 데 실패했습니다.");
        }

        const result = await response.json();
        setCategories(result.data);
      } catch (err) {
        console.error("카테고리 요청 에러:", err);
      }
    };

    fetchCategories();
  }, [API_BASE_URL]);



  const handleCategorySelect = (categorySelected) => {
    setCategory(categorySelected); // 생성 목적 선택
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `선택한 생성 목적: ${categorySelected}`, isBot: false },
      { text: "내용을 입력해주세요", isBot: true },
    ]);
    setCurrentStep(2); // 내용 입력 단계로 이동
  };

  const handleImageToggle = () => {
    setIsImageIncluded(prevState => !prevState); // 체크박스 클릭 시 이미지 포함 여부 토글
  };

  const handleGenerateMessage = async () => {
    const data = {
      userId,
      text: userText,
      mood: mood,
      keyword: keyword,
      category,
    };

    console.log("요청 데이터: ", data);

    const textApiUrl = `${API_BASE_URL}/message/generate/text`;
    const imageApiUrl = `${API_BASE_URL}/message/generate/image`;

    try {
      // 상태 초기화
      setResultTxtData(null);
      setResultImgData(null);

      let responses = [];

      // 텍스트와 이미지를 동시에 요청
      if (chatMode === "text" && isImageIncluded) {
        responses = [
          fetch(textApiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }),
          fetch(imageApiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }),
        ];
      } else {
        const apiUrl = chatMode === "image" ? imageApiUrl : textApiUrl;
        responses = [fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })];
      }

      // 응답 처리
      const resultPromises = responses.map(async (responsePromise, index) => {
        const response = await responsePromise;
        if (!response.ok) throw new Error(`서버 응답 에러: ${response.status}`);
        const result = await response.json();

        if (index === 0 && result.data.text) {
          console.log("텍스트 생성 완료:", result.data.text);
          setResultTxtData(result.data.text); // 텍스트 업데이트
        }
        if (index === 1 && result.data.url) {
          console.log("이미지 생성 완료:", result.data.url);
          setResultImgData(result.data.url); // 이미지 URL 업데이트
        }
        return result;
      });

      // 메시지 생성
      const results = await Promise.all(resultPromises);
      setResultText(data.text);
      setResultCategory(data.category);

      // 결과 저장
      results.forEach((result, index) => {
        if (result.data) {
          // 텍스트와 이미지 구분
          if (result.data.text) {
            console.log("텍스트 생성 결과:", result.data.text);
            setResultTxtData(result.data.text); // 텍스트 결과 저장
          }
          if (result.data.url) {
            console.log("이미지 생성 결과:", result.data.url);
            setResultImgData(result.data.url); // 이미지 URL 결과 저장
          }
        }

      });

      // 메시지 생성 및 저장
      const newMessages = results.map((result) => {
        // 텍스트와 이미지를 각각 저장
        const message = {
          text: result.data.text || '',
          image: result.data.url || '',
          isBot: true,
        };
        console.log("메시지에 저장될 텍스트:", message.text);
        return message;
      });

      setMessages((prev) => [...prev, ...newMessages]);

      setCurrentStep(steps); // 최종 단계 이동
    } catch (error) {
      console.error("에러 발생:", error);
      setMessages((prev) => [
        ...prev,
        { text: `에러 발생: ${error.message}`, isBot: true },
      ]);
    }
  };

  const handleEdit = () => {
    if (resultImgData) {
      navigate('/edit/product', { state: { imageSrc: resultImgData, text: resultTxtData, userText: resultText, category: resultCategory } }); // EditProduct로 이미지 결과만 전달
    }
  };

  const handleSendMessageDirect = () => {
    if (resultImgData || resultTxtData) {
      navigate('/send/message', { state: { imageSrc: resultImgData, text: resultTxtData, userText: resultText, category: resultCategory } }); // 텍스트와 이미지 결과를 모두 전달
    }
  };

  // 다시 시작 버튼 - 1단계로 초기화
  const handleRestart = () => {
    setCurrentStep(0); // 단계 초기화 (0번 단계)
    setMessages([{ text: "텍스트와 이미지 생성 중 선택해주세요", isBot: true }]); // 초기 메시지 설정
    setChatMode(null); // 챗봇 모드 초기화
  };

  // 재생성 버튼 - 기존 내용 그대로 다시 생성
  const handleRegenerate = () => {
    if (currentStep === 6) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "다시 생성 중입니다...", isBot: true },
      ]);
      handleGenerateMessage(); // 메시지 생성 함수 호출
    }
  };


  return (
    <div className="chatbot-page">
      <div className="chatbot-container">
        <div className="chatbot-messages">

          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.isBot ? "bot" : "user"}`}>
              {/* 텍스트가 있을 때 */}
              {msg.text && !msg.text.startsWith("http") && (
                <div
                  className="message-text"
                  dangerouslySetInnerHTML={{
                    __html: msg.text.replace(/\n/g, "<br>") || "내용이 없습니다.",
                  }}
                ></div>
              )}
              {/* 이미지가 있을 때 */}
              {msg.image && (
                <img src={msg.image} className="generated-image" alt="Generated" />
              )}
            </div>
          ))}

          {/* 재시작 또는 재생성 버튼 */}
          {currentStep === 6 && (
            <div className="re-selection">
              <button onClick={handleRegenerate}>다시 생성</button>
              <button onClick={handleRestart}>다시 입력</button>
            </div>
          )}


          {currentStep === 1 && (
            <div className="category-selection">
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category, index) => (
                  <button key={index} onClick={() => handleCategorySelect(category)}>
                    {category}
                  </button>
                ))
              ) : (
                <p>카테고리를 불러오는 중이거나 데이터가 없습니다.</p>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="tone-selection">
              <button onClick={() => handleToneSelect("부드럽게")}>부드럽게</button>
              <button onClick={() => handleToneSelect("어둡게")}>어두운 톤</button>
              <button onClick={() => handleToneSelect("정중하게")}>정중한 톤</button>
              <button onClick={() => handleToneSelect("밝게")}>밝은 톤</button>
              <button onClick={handleSkip}>건너뛰기</button>
            </div>
          )}
          {currentStep === 3 && (
            <button className="skip-button" onClick={handleSkip}>
              건너뛰기
            </button>
          )}
        </div>
        {currentStep === 2 && chatMode === 'text' && (
          <div>
            <label>이미지도 같이 생성할까요? </label>
            <button onClick={handleImageToggle} className="image-included-button">
              {isImageIncluded ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
            </button>
          </div>
        )}
        {chatMode && (
          <form className="chat-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="메시지를 입력하세요..."
              required
            />
            <button type="submit">전송</button>
          </form>
        )}
        {!chatMode && (
          <div className="chat-mode-selection">
            <button onClick={() => handleButtonClick("text")}>텍스트 생성</button>
            <button onClick={() => handleButtonClick("image")}>이미지 생성</button>
          </div>
        )}
      </div>

      <form className="step-form">
        <div className="steps">
          <div className="steps__step" data-step="0">
            <div className="steps__step-number">1</div>
            <div className="steps__step-name">유형 선택</div>
          </div>
          <div className="steps__connector"></div>
          <div className="steps__step" data-step="1">
            <div className="steps__step-number">2</div>
            <div className="steps__step-name">생성 목적</div>
          </div>
          <div className="steps__connector"></div>
          <div className="steps__step" data-step="2">
            <div className="steps__step-number">3</div>
            <div className="steps__step-name">내용 입력</div>
          </div>
          <div className="steps__connector"></div>
          <div className="steps__step" data-step="3">
            <div className="steps__step-number">4</div>
            <div className="steps__step-name">중요 키워드</div>
          </div>
          <div className="steps__connector"></div>
          <div className="steps__step" data-step="4">
            <div className="steps__step-number">5</div>
            <div className="steps__step-name">어조 선택</div>
          </div>
          <div className="steps__connector"></div>
          <div className="steps__step" data-step="5">
            <div className="steps__step-number">6</div>
            <div className="steps__step-name">완료</div>
          </div>
        </div>
      </form>

      <div className="result-container">
        <h2>결과 화면</h2>
        {resultTxtData && (
          <div
            className="message-text"
            dangerouslySetInnerHTML={{
              __html: resultTxtData.replace(/\n/g, "<br>") || "내용이 없습니다.",
            }}
          ></div>
        )}
        {resultImgData && (
          <img
            src={resultImgData}
            alt="Generated"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        )}
        {!resultTxtData && !resultImgData && <p>결과가 여기에 표시됩니다.</p>}
        <div className="result-actions">
          <button onClick={handleEdit}>편집하기</button>
          <button onClick={handleSendMessageDirect}>메시지 전송하기</button>
        </div>
      </div>


    </div>
  );

};

export default Chatbot;
