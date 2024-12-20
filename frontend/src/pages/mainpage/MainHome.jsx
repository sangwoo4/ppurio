import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import "../../styles/MainHome.css";
import mainColor from "../../assets/maincolor.png";
import mainImage1 from "../../assets/mainImage1.png";
import mainImage2 from "../../assets/mainImage2.png";
import { useUser } from "../../hooks/UserContext";

const MainHome = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const { userId, setUserId } = useUser();

  // 유저 id 설정 불러오기
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, [setUserId]);


  // 각 텍스트 문구
  const fullTexts = [
    `
    ✨ AI기술을 활용하여 원하는 텍스트와 이미지를 손쉽게 생성해보세요!
    🎨 챗봇과의 간편한 대화를 통해 여러분의 아이디어를 현실로 만들어 드립니다. 
    AI를 통해 여러분 들의 창의력의 새로운 가능성을 경험해보세요! ✨
    `.trim(),
    `
    ✨ 광고에 최적화된 텍스트를 빠르고 손쉽게 작성해보세요!
    🎯 AI 기술을 활용해 한층 더 나은 홍보 전략을 만들어보세요. 
    당신의 아이디어가 빛날 수 있도록 도와드립니다. 💡
    `.trim(),
    `
    💡 이제 복잡한 작업은 AI에게 맡기고 창의력에 집중하세요!
    📷 이미지 생성과 텍스트 제작을 간단하게 처리할 수 있습니다.
    로그인 후 이용가능합니다. 🎯
    `.trim(),
  ];

  // 이미지 배열
  const images = [mainImage1, mainImage2];

  const handleButtonClick = () => {
    if (!userId) {
      alert("로그인 후 이용 가능합니다!");
      navigate("/login");
    } else {
      navigate("/chatbot");
    }
  };

  useEffect(() => {
    let textIndex = 0; // 현재 표시할 텍스트의 인덱스
    let charIndex = 0; // 텍스트의 각 문자를 타이핑할 인덱스
    let typingInterval;

    const startTyping = () => {
      setText(""); // 텍스트를 초기화하여 이전 문구가 남지 않도록 설정

      typingInterval = setInterval(() => {
        if (charIndex < fullTexts[textIndex].length) {
          setText((prev) => {
            const updatedText = prev + (fullTexts[textIndex][charIndex] || "");
            return updatedText;
          });
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            textIndex = (textIndex + 1) % fullTexts.length; // 순환하여 다음 텍스트 인덱스로 이동
            charIndex = 0;
            setText("");
            startTyping();
          }, 60000); // 1분(60초) 대기
        }
      }, 50); // 타이핑 속도 (50ms)
    };

    startTyping(); // 초기 타이핑 시작

    return () => {
      clearInterval(typingInterval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 30000); // 30초마다 실행

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mainhome-container">
      <div className="mainframe">
        <img
          src={mainColor}
          alt="Main Frame"
        />
      </div>
      <div className="textPhrase">
        <h5>나만의 텍스트 1분 완성✨</h5>
      </div>
      <div className="text-box">
        <p>{text}</p>
      </div>

      <div className="imagePhrase">
        <h5>원하는 이미지도 1분안에 완성✨</h5>
      </div>
      <div className="image-box">
        <img
          src={images[imageIndex]}
          alt="Main Display"
          style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "8px" }}
        />
      </div>

      <div className="text-frame">
        <p>챗봇을 통해 간편하게 제작해보세요</p>
        <p>문자 전송까지 한 번에 해결🎯</p>
      </div>

      <button onClick={handleButtonClick} className="ai-button">AI 생성하러가기</button>
    </div>
  );
};

export default MainHome;
