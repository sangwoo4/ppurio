import React, { useEffect, useState } from "react";
import "../../styles/MainHome.css";
import mainColor from "../../assets/maincolor.png";
import mainImage1 from "../../assets/mainImage1.png"; // 첫 번째 이미지 경로
import mainImage2 from "../../assets/mainImage2.png"; // 두 번째 이미지 경로

const MainHome = () => {
  const [text, setText] = useState(""); // 출력되는 텍스트 상태
  const [imageIndex, setImageIndex] = useState(0); // 현재 이미지 인덱스 상태

  // 각 텍스트 문구
  const fullTexts = [
    `
    🌟 AI기술을 활용하여 원하는 텍스트와 이미지를 손쉽게 생성해보세요!
    🎨 챗봇과의 간편한 대화를 통해 여러분의 아이디어를 현실로 만들어 드립니다. 
    AI를 통해 여러분 들의 창의력의 새로운 가능성을 경험해보세요! ✨
    `.trim(),
    `
    🚀 광고에 최적화된 텍스트를 빠르고 손쉽게 작성해보세요!
    🎯 AI 기술을 활용해 한층 더 나은 홍보 전략을 만들어보세요. 
    당신의 아이디어가 빛날 수 있도록 도와드립니다. 💡
    `.trim(),
    `
    🤖 이제 복잡한 작업은 AI에게 맡기고 창의력에 집중하세요!
    📷 이미지 생성과 텍스트 제작을 간단하게 처리할 수 있습니다.
    더 나은 결과를 위해 함께하세요! 🎉
    `.trim(),
  ];

  // 이미지 배열
  const images = [mainImage1, mainImage2]; // 이미지를 배열로 설정

  useEffect(() => {
    let textIndex = 0; // 현재 표시할 텍스트의 인덱스
    let charIndex = 0; // 텍스트의 각 문자를 타이핑할 인덱스
    let typingInterval;

    const startTyping = () => {
      setText(""); // 텍스트를 초기화하여 이전 문구가 남지 않도록 설정

      typingInterval = setInterval(() => {
        if (charIndex < fullTexts[textIndex].length) {
          setText((prev) => {
            // 이전 텍스트와 새 문자를 합침, undefined 방지
            const updatedText = prev + (fullTexts[textIndex][charIndex] || "");
            return updatedText;
          });
          charIndex++;
        } else {
          clearInterval(typingInterval);
          // 다음 텍스트로 넘어가기 전에 1분 대기
          setTimeout(() => {
            textIndex = (textIndex + 1) % fullTexts.length; // 순환하여 다음 텍스트 인덱스로 이동
            charIndex = 0; // 다음 텍스트 타이핑 시작
            setText(""); // 기존 텍스트 초기화
            startTyping(); // 타이핑 시작
          }, 60000); // 1분(60초) 대기
        }
      }, 50); // 타이핑 속도 (50ms)
    };

    startTyping(); // 초기 타이핑 시작

    return () => {
      clearInterval(typingInterval); // 타이핑 중지
    };
  }, []); // 빈 배열을 넣어 컴포넌트 마운트 시 한 번만 실행

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length); // 30초마다 이미지 변경
    }, 30000); // 30초마다 실행

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 정리
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
        <h5>나만의 텍스트 1분 완성!</h5>
      </div>
      {/* 텍스트 박스 */}
      <div className="text-box">
        <p>{text}</p>
      </div>

      <div className="imagePhrase">
        <h5>원하는 이미지도 1분안에 완성</h5>
      </div>
      {/* 이미지 삽입 공간 */}
      <div className="image-box">
        <img
          src={images[imageIndex]} // 현재 이미지 인덱스에 해당하는 이미지 표시
          alt="Main Display"
          style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "8px" }}
        />
      </div>

      {/* AI 생성 버튼 */}
      <button className="ai-button">AI 생성하러가기</button>
    </div>
  );
};

export default MainHome;
