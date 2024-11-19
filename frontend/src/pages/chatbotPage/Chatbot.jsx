import React, { useState, useEffect } from "react";
import "../../styles/Chatbot.css";
import API_BASE_URL from "../../URL_API";

const Chatbot = () => {
  const steps = 6; // 단계 수 변경
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState([
    { text: "텍스트와 이미지 생성 중 선택해주세요", isBot: true },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [chatMode, setChatMode] = useState(null);
  const [selectedTone, setSelectedTone] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [userId, setUserId] = useState(null);
  const [text, setText] = useState("");
  const [mood, setMood] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState(null); // 생성 목적 상태 추가

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
        setText(inputValue); // 'text' 데이터 저장
        handleNextMessage();
      } else if (currentStep === 3) {
        const tags = inputValue.split(" ").slice(0, 3); // 최대 3개 추출
        setKeywords(tags);
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
        handleGenerateMessage(); // API 호출
      }
    }
  };

  const handleSkip = () => {
    if (currentStep === 3) {
      setKeywords(null); // 해시태그를 null로 설정
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

  const handleToneSelect = (moodValue) => {
    setSelectedTone(moodValue); // UI용 상태
    setMood([moodValue]); // 서버 전송용 상태
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `선택한 어조: ${moodValue}`, isBot: false },
      { text: "모든 입력이 완료되었습니다. 생성 중입니다...", isBot: true },
    ]);
    setCurrentStep(5); // 생성 완료 단계로 이동
    handleGenerateMessage(); // API 호출
  };

  useEffect(() => {
    if (currentStep === 4) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "어조를 선택하거나 직접 입력해주세요.", isBot: true },
      ]);
    }
  }, [currentStep]);


  const handleCategorySelect = (categorySelected) => {
    setCategory(categorySelected); // 생성 목적 선택
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `선택한 생성 목적: ${categorySelected}`, isBot: false },
      { text: "내용을 입력해주세요", isBot: true },
    ]);
    setCurrentStep(2); // 내용 입력 단계로 이동
  };

  // useEffect(() => {
  //   if (currentStep === 5 && (mood || keywords)) {
  //   }
  // }, [mood]);

  const handleGenerateMessage = async () => {
    const data = {
      userId,
      text,
      mood,
      keyword: keywords,
      category,
    };

    const apiUrl =
      chatMode === "image"
        ? `${API_BASE_URL}/message/generate/image`
        : `${API_BASE_URL}/message/generate/text`;

    console.log("전송할 메시지:", data);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("응답 결과:", result); // 응답 결과 콘솔에 출력

        if (chatMode === "image") {
          // 이미지 생성 결과 처리
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "생성이 완료되었습니다!", isBot: true },
          ]);
          setImageUrl(result.data.url); // 이미지 URL 저장
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: result.data.url, isBot: true }, // 이미지 URL 추가
          ]);
        } else {
          // 텍스트 생성 결과 처리
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "생성이 완료되었습니다!", isBot: true },
            { text: result.data.text, isBot: true },
          ]);
        }
        setCurrentStep(steps); // 최종 단계로 이동
      } else {
        throw new Error("서버 응답 에러");
      }
    } catch (error) {
      console.log("에러 발생:", error); // 에러 메시지 출력
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `에러 발생: ${error.message}`, isBot: true },
      ]);
    }
  };


  return (
    <div className="chatbot-page">
      <div className="chatbot-container">
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.isBot ? "bot" : "user"}`}>
              {msg.text && msg.text.startsWith("http") ? (
                <img src={msg.text} className="generated-image" alt="Generated" />
              ) : (
                <div
                  className="message-text"
                  dangerouslySetInnerHTML={{
                    __html: msg.text?.replace(/\n/g, "<br>") || "내용이 없습니다.",
                  }}
                ></div>
              )}
            </div>
          ))}
          {currentStep === 1 && (
            <div className="category-selection">
              <button onClick={() => handleCategorySelect("재난 경고성 문자")}>재난 경고</button>
              <button onClick={() => handleCategorySelect("광고 홍보 문자")}>광고 및 홍보</button>
              <button onClick={() => handleCategorySelect("일반 안내 문자")}>일반 안내</button>
              <button onClick={() => handleCategorySelect("정당 문자")}>정당 관련</button>
              <button onClick={() => handleCategorySelect("증권 문자")}>증권 관련</button>
              <button onClick={() => handleCategorySelect("실종 문자")}>실종</button>
              <button onClick={() => handleCategorySelect("명함")}>명함</button>
              <button onClick={() => handleCategorySelect("건강 및 의학")}>건강 정보</button>
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
    </div>
  );

};

export default Chatbot;





// import React, { useState, useEffect } from "react";
// import "../../styles/Chatbot.css";
// import API_BASE_URL from "../../URL_API";

// const Chatbot = () => {
//   const steps = 6; // 단계 수 변경
//   const [currentStep, setCurrentStep] = useState(0);
//   const [messages, setMessages] = useState([
//     { text: "텍스트와 이미지 생성 중 선택해주세요", isBot: true },
//   ]);
//   const [inputValue, setInputValue] = useState("");
//   const [chatMode, setChatMode] = useState(null);
//   const [selectedTone, setSelectedTone] = useState(null);
//   const [keywords, setKeywords] = useState([]);
//   const [userId, setUserId] = useState(null);
//   const [text, setText] = useState("");
//   const [mood, setMood] = useState([]);
//   const [imageUrl, setImageUrl] = useState('');
//   const [category, setCategory] = useState(null); // 생성 목적 상태 추가

//   // 로컬스토리지에서 userId 가져오기
//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userId");
//     if (storedUserId) {
//       setUserId(storedUserId);
//     }
//   }, []);

//   const displayStep = (targetStep) => {
//     const stepsElements = document.querySelectorAll(".steps__step");
//     stepsElements.forEach((stepEl, index) => {
//       stepEl.classList.remove("steps__step--current", "steps__step--done");
//       if (index < targetStep) {
//         stepEl.classList.add("steps__step--done");
//       } else if (index === targetStep) {
//         stepEl.classList.add("steps__step--current");
//       }
//     });
//   };

//   useEffect(() => {
//     displayStep(currentStep);
//   }, [currentStep]);

//   const handleButtonClick = (mode) => {
//     setChatMode(mode);
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { text: `선택한 모드: ${mode === "text" ? "텍스트 생성" : "이미지 생성"}`, isBot: false },
//       { text: "생성 목적을 선택해주세요", isBot: true },
//     ]);
//     setCurrentStep(1); // 생성 목적 선택 단계로 이동
//   };

//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//   };

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (inputValue.trim()) {
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { text: inputValue, isBot: false },
//       ]);
//       setInputValue(""); // 입력 필드 초기화
//       if (currentStep === 2) {
//         setText(inputValue); // 'text' 데이터 저장
//         handleNextMessage();
//       } else if (currentStep === 3) {
//         const tags = inputValue.split(" ").slice(0, 3); // 최대 3개 추출
//         setKeywords(tags);
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { text: `입력한 키워드: ${tags.join(", ")}`, isBot: false },
//         ]);
//         setInputValue(""); // 입력 필드 초기화
//         setCurrentStep(4); // 어조 선택 단계로 이동
//       } else if (currentStep === 4) {
//         setMood([inputValue]); // 사용자가 입력한 어조 저장
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { text: `입력한 어조: ${inputValue}`, isBot: false },
//           { text: "모든 입력이 완료되었습니다. 생성 중입니다...", isBot: true },
//         ]);
//         setCurrentStep(5); // 생성 완료 단계로 이동
//         handleGenerateMessage(); // API 호출
//       }
//     }
//   };

//   const handleSkip = () => {
//     if (currentStep === 3) {
//       setKeywords(null); // 해시태그를 null로 설정
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { text: "중요 키워드를 건너뛰었습니다.", isBot: true },
//       ]);
//       setCurrentStep(4);
//     } else if (currentStep === 4) {
//       setMood(null); // 어조를 null로 설정
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { text: "어조 선택을 건너뛰었습니다.", isBot: true },
//         { text: "생성 중입니다...", isBot: true },
//       ]);
//       setCurrentStep(5); // 생성 단계로 바로 이동
//       handleGenerateMessage(); // 직접 호출하여 API 요청
//     }
//   };


//   const handleNextMessage = () => {
//     if (currentStep === 2) {
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { text: "중요 키워드가 있나요? 최대 3개까지 입력해주세요.", isBot: true },
//       ]);
//       setCurrentStep(3);
//     }
//   };

//   const handleToneSelect = (tone) => {
//     setSelectedTone(tone);
//     setMood([tone]); // 선택된 어조를 배열로 저장
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { text: `선택한 어조: ${tone}`, isBot: false },
//       { text: "모든 입력이 완료되었습니다. 생성 중입니다...", isBot: true },
//     ]);
//     setCurrentStep(5); // 생성 완료 단계로 이동
//     handleGenerateMessage(); // API 호출
//   };

//   useEffect(() => {
//     if (currentStep === 4) {
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { text: "어조를 선택하거나 직접 입력해주세요.", isBot: true },
//       ]);
//     }
//   }, [currentStep]);


//   const handleCategorySelect = (categorySelected) => {
//     setCategory(categorySelected); // 생성 목적 선택
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { text: `선택한 생성 목적: ${categorySelected}`, isBot: false },
//       { text: "내용을 입력해주세요", isBot: true },
//     ]);
//     setCurrentStep(2); // 내용 입력 단계로 이동
//   };

//   useEffect(() => {
//     if (currentStep === 5 && (mood || keywords)) {
//     }
//   }, [mood]);

//   const handleGenerateMessage = async () => {
//     const data = {
//       userId,
//       text,
//       mood,
//       keyword: keywords,
//       category, // 생성 목적 추가
//     };

//     const apiUrl =
//       chatMode === "image"
//         ? `${API_BASE_URL}/message/generate/image`
//         : `${API_BASE_URL}/message/generate/text`;

//     console.log("전송할 메시지:", data);

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log("응답 결과:", result); // 응답 결과 콘솔에 출력

//         if (chatMode === "image") {
//           // 이미지 생성 결과 처리
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             { text: "생성이 완료되었습니다!", isBot: true },
//           ]);
//           setImageUrl(result.data.url); // 이미지 URL 저장
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             { text: result.data.url, isBot: true }, // 이미지 URL 추가
//           ]);
//         } else {
//           // 텍스트 생성 결과 처리
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             { text: "생성이 완료되었습니다!", isBot: true },
//             { text: result.data.text, isBot: true },
//           ]);
//         }
//         setCurrentStep(steps); // 최종 단계로 이동
//       } else {
//         throw new Error("서버 응답 에러");
//       }
//     } catch (error) {
//       console.log("에러 발생:", error); // 에러 메시지 출력
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { text: `에러 발생: ${error.message}`, isBot: true },
//       ]);
//     }
//   };


//   return (
//     <div className="chatbot-page">
//       <div className="chatbot-container">
//         <div className="chatbot-messages">
//           {messages.map((msg, index) => (
//             <div key={index} className={`message ${msg.isBot ? "bot" : "user"}`}>
//               {msg.text && msg.text.startsWith("http") ? (
//                 <img src={msg.text} className="generated-image" alt="Generated" />
//               ) : (
//                 <div
//                   className="message-text"
//                   dangerouslySetInnerHTML={{
//                     __html: msg.text?.replace(/\n/g, "<br>") || "내용이 없습니다.",
//                   }}
//                 ></div>
//               )}
//             </div>
//           ))}
//           {currentStep === 1 && (
//             <div className="category-selection">
//               <button onClick={() => handleCategorySelect("재난 경고성 문자")}>재난 경고</button>
//               <button onClick={() => handleCategorySelect("광고 홍보 문자")}>광고 및 홍보</button>
//               <button onClick={() => handleCategorySelect("일반 안내 문자")}>일반 안내</button>
//               <button onClick={() => handleCategorySelect("정당 문자")}>정당 관련</button>
//               <button onClick={() => handleCategorySelect("증권 문자")}>증권 관련</button>
//               <button onClick={() => handleCategorySelect("실종 문자")}>실종</button>
//               <button onClick={() => handleCategorySelect("명함")}>명함</button>
//               <button onClick={() => handleCategorySelect("건강 및 의학")}>건강 정보</button>
//             </div>
//           )}
//           {currentStep === 4 && (
//             <div className="tone-selection">
//               <button onClick={() => handleToneSelect("부드럽게")}>부드럽게</button>
//               <button onClick={() => handleToneSelect("어둡게")}>어두운 톤</button>
//               <button onClick={() => handleToneSelect("정중하게")}>정중한 톤</button>
//               <button onClick={() => handleToneSelect("밝게")}>밝은 톤</button>
//               <button onClick={handleSkip}>건너뛰기</button>
//             </div>
//           )}
//           {currentStep === 3 && (
//             <button className="skip-button" onClick={handleSkip}>
//               건너뛰기
//             </button>
//           )}
//         </div>
//         {chatMode && (
//           <form className="chat-input" onSubmit={handleSendMessage}>
//             <input
//               type="text"
//               value={inputValue}
//               onChange={handleInputChange}
//               placeholder="메시지를 입력하세요..."
//               required
//             />
//             <button type="submit">전송</button>
//           </form>
//         )}
//         {!chatMode && (
//           <div className="chat-mode-selection">
//             <button onClick={() => handleButtonClick("text")}>텍스트 생성</button>
//             <button onClick={() => handleButtonClick("image")}>이미지 생성</button>
//           </div>
//         )}

//       </div>

//       <form className="step-form">
//         <div className="steps">
//           <div className="steps__step" data-step="0">
//             <div className="steps__step-number">1</div>
//             <div className="steps__step-name">유형 선택</div>
//           </div>
//           <div className="steps__connector"></div>
//           <div className="steps__step" data-step="1">
//             <div className="steps__step-number">2</div>
//             <div className="steps__step-name">생성 목적</div>
//           </div>
//           <div className="steps__connector"></div>
//           <div className="steps__step" data-step="2">
//             <div className="steps__step-number">3</div>
//             <div className="steps__step-name">내용 입력</div>
//           </div>
//           <div className="steps__connector"></div>
//           <div className="steps__step" data-step="3">
//             <div className="steps__step-number">4</div>
//             <div className="steps__step-name">중요 키워드</div>
//           </div>
//           <div className="steps__connector"></div>
//           <div className="steps__step" data-step="4">
//             <div className="steps__step-number">5</div>
//             <div className="steps__step-name">어조 선택</div>
//           </div>
//           <div className="steps__connector"></div>
//           <div className="steps__step" data-step="5">
//             <div className="steps__step-number">6</div>
//             <div className="steps__step-name">완료</div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );

// };

// export default Chatbot;

