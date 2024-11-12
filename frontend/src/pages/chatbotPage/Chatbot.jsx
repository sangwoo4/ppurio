import React, { useState, useEffect } from 'react';
import '../../styles/Chatbot.css';

import { useUser } from '../../hooks/UserContext';

const Chatbot = () => {
  const steps = 5;
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState([{ text: "텍스트와 이미지 생성 중 선택해주세요", isBot: true }]);
  const [inputValue, setInputValue] = useState('');
  const [chatMode, setChatMode] = useState(null);
  const [selectedTone, setSelectedTone] = useState(null);
  const [hashTags, setHashTags] = useState([]);

  const displayStep = (targetStep) => {
    const stepsElements = document.querySelectorAll('.steps__step');
    stepsElements.forEach((stepEl, index) => {
      stepEl.classList.remove('steps__step--current', 'steps__step--done');
      if (index < targetStep) {
        stepEl.classList.add('steps__step--done');
      } else if (index === targetStep) {
        stepEl.classList.add('steps__step--current');
      }
    });
  };

  useEffect(() => {
    displayStep(currentStep);
  }, [currentStep]);

  const checkExtremes = () => {
    return {
      prevDisabled: currentStep <= 0,
      nextDisabled: currentStep >= steps - 1,
    };
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const next = () => {
    if (currentStep < steps - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handleButtonClick = (mode) => {
    setChatMode(mode);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `선택한 모드: ${mode === "text" ? "텍스트 생성" : "이미지 생성"}`, isBot: false },
      { text: "내용을 입력해주세요", isBot: true }
    ]);
    setCurrentStep(1); // 다음 단계로 이동
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, isBot: false }]);
      setInputValue('');

      // 챗봇의 다음 메시지를 결정
      handleNextMessage(inputValue);
    }
  };

  const handleNextMessage = (inputText) => {
    if (currentStep === 1) { // 사용자가 내용을 입력한 후
      setMessages((prevMessages) => [...prevMessages, { text: "중요 키워드가 있나요? 최대 3개까지 입력해주세요", isBot: true }]);
      setHashTags(inputText.split(" ").slice(0, 3)); // 해시태그 저장
      setCurrentStep(2); // 다음 단계로 이동
    } else if (currentStep === 2) { // 키워드 입력 단계
      setMessages((prevMessages) => [...prevMessages, { text: "원하는 어조가 있나요?", isBot: true }]);
      setCurrentStep(3); // 다음 단계로 이동
    }
  };

  const handleToneSelect = (tone) => {
    setSelectedTone(tone);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `선택한 어조: ${tone}`, isBot: false },
      { text: "생성 중입니다...", isBot: true }
    ]);
    setCurrentStep(4); // 생성 단계로 이동

    // 생성 중 메시지 이후 서버 전송 호출
    handleGenerateMessage();
  };

  const handleGenerateMessage = async () => {
    const data = {
      userId: 1,
      text: inputValue,
      mood: [selectedTone],
      hashTag: hashTags
    };

    try {
      const response = await fetch('http://localhost:8080/message/generate/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "생성이 완료되었습니다!", isBot: true },
          { text: result.generatedText, isBot: true }
        ]);
        setCurrentStep(steps); // 최종 단계로 이동
      } else {
        throw new Error("서버 응답 에러");
      }
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `에러 발생: ${error.message}`, isBot: true }
      ]);
    }
  };

  const { prevDisabled, nextDisabled } = checkExtremes();

  return (
    <div className="chatbot-page">
      <div className="chatbot-container">
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
              {msg.text}
            </div>
          ))}
          {currentStep === 3 && (
            <div className="tone-selection">
              <button onClick={() => handleToneSelect("부드럽게")}>부드럽게</button>
              <button onClick={() => handleToneSelect("어둡게")}>어둡게</button>
              <button onClick={() => handleToneSelect("정중하게")}>정중하게</button>
              <button onClick={() => handleToneSelect("밝게")}>밝게</button>
            </div>
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
            <div className="steps__step-name">내용</div>
          </div>
          <div className="steps__connector"></div>
          <div className="steps__step" data-step="2">
            <div className="steps__step-number">3</div>
            <div className="steps__step-name">중요 키워드</div>
          </div>
          <div className="steps__connector"></div>
          <div className="steps__step" data-step="3">
            <div className="steps__step-number">4</div>
            <div className="steps__step-name">어조</div>
          </div>
          <div className="steps__connector"></div>
          <div className="steps__step" data-step="4">
            <div className="steps__step-number">5</div>
            <div className="steps__step-name">생성</div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;






// import React, { useState, useEffect } from 'react';
// import '../../styles/Chatbot.css';

// const Chatbot = () => {
//   const steps = 5;
//   const [currentStep, setCurrentStep] = useState(0);
//   const [messages, setMessages] = useState([{ text: "텍스트와 이미지 생성 중 선택해주세요", isBot: true }]);
//   const [inputValue, setInputValue] = useState('');
//   const [chatMode, setChatMode] = useState(null);
//   const [selectedTone, setSelectedTone] = useState(null);
//   const [hashTags, setHashTags] = useState([]); // 해시태그 저장

//   const displayStep = (targetStep) => {
//     const stepsElements = document.querySelectorAll('.steps__step');
//     stepsElements.forEach((stepEl, index) => {
//       stepEl.classList.remove('steps__step--current', 'steps__step--done');
//       if (index < targetStep) {
//         stepEl.classList.add('steps__step--done');
//       } else if (index === targetStep) {
//         stepEl.classList.add('steps__step--current');
//       }
//     });
//   };

//   useEffect(() => {
//     displayStep(currentStep);
//   }, [currentStep]);

//   const checkExtremes = () => {
//     return {
//       prevDisabled: currentStep <= 0,
//       nextDisabled: currentStep >= steps - 1,
//     };
//   };

//   const prev = () => {
//     if (currentStep > 0) {
//       setCurrentStep((prevStep) => prevStep - 1);
//     }
//   };

//   const next = () => {
//     if (currentStep < steps - 1) {
//       setCurrentStep((prevStep) => prevStep + 1);
//     }
//   };

//   const handleButtonClick = (mode) => {
//     setChatMode(mode);
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { text: `선택한 모드: ${mode === "text" ? "텍스트 생성" : "이미지 생성"}`, isBot: false },
//       { text: "내용을 입력해주세요", isBot: true }
//     ]);
//     setCurrentStep(1); // 다음 단계로 이동
//   };

//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//   };

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (inputValue.trim()) {
//       setMessages([...messages, { text: inputValue, isBot: false }]);
//       setInputValue('');

//       // 챗봇의 다음 메시지를 결정
//       handleNextMessage(inputValue);
//     }
//   };

//   const handleNextMessage = (inputText) => {
//     if (currentStep === 1) { // 사용자가 내용을 입력한 후
//       setMessages((prevMessages) => [...prevMessages, { text: "중요 키워드가 있나요? 최대 3개까지 입력해주세요", isBot: true }]);
//       setHashTags(inputText.split(" ").slice(0, 3)); // 해시태그 저장
//       setCurrentStep(2); // 다음 단계로 이동
//     } else if (currentStep === 2) { // 키워드 입력 단계
//       setMessages((prevMessages) => [...prevMessages, { text: "원하는 어조가 있나요?", isBot: true }]);
//       setCurrentStep(3); // 다음 단계로 이동
//     }
//   };

//   const handleToneSelect = (tone) => {
//     setSelectedTone(tone);
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { text: `선택한 어조: ${tone}`, isBot: false },
//       { text: "생성 중입니다...", isBot: true }
//     ]);
//     setCurrentStep(4); // 생성 단계로 이동

//     // 생성 중 메시지 이후 서버 전송 호출
//     handleGenerateMessage();
//   };

//   const handleGenerateMessage = async () => {
//     const data = {
//       userId: 1,
//       text: inputValue,
//       mood: [selectedTone],
//       hashTag: hashTags
//     };

//     try {
//       const response = await fetch('http://localhost:8080/message/generate/text', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { text: "생성이 완료되었습니다!", isBot: true },
//           { text: result.generatedText, isBot: true }
//         ]);
//         setCurrentStep(steps); // 최종 단계로 이동
//       } else {
//         throw new Error("서버 응답 에러");
//       }
//     } catch (error) {
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { text: `에러 발생: ${error.message}`, isBot: true }
//       ]);
//     }
//   };

//   const { prevDisabled, nextDisabled } = checkExtremes();

//   return (
//     <div className="chatbot-page">
//       <div className="chatbot-container">
//         <div className="chatbot-messages">
//           {messages.map((msg, index) => (
//             <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
//               {msg.text}
//             </div>
//           ))}
//           {currentStep === 3 && (
//             <div className="tone-selection">
//               <button onClick={() => handleToneSelect("부드럽게")}>부드럽게</button>
//               <button onClick={() => handleToneSelect("어둡게")}>어둡게</button>
//               <button onClick={() => handleToneSelect("정중하게")}>정중하게</button>
//               <button onClick={() => handleToneSelect("밝게")}>밝게</button>
//             </div>
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
//             <div className="steps__step-name">내용</div>
//           </div>
//           <div className="steps__connector"></div>
//           <div className="steps__step" data-step="2">
//             <div className="steps__step-number">3</div>
//             <div className="steps__step-name">중요 키워드</div>
//           </div>
//           <div className="steps__connector"></div>
//           <div className="steps__step" data-step="3">
//             <div className="steps__step-number">4</div>
//             <div className="steps__step-name">어조</div>
//           </div>
//           <div className="steps__connector"></div>
//           <div className="steps__step" data-step="4">
//             <div className="steps__step-number">5</div>
//             <div className="steps__step-name">생성</div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Chatbot;

