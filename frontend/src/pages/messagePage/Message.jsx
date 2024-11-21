import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { DeviceFrameset } from "react-device-frameset"; // DeviceFrameset import
import "react-device-frameset/styles/marvel-devices.min.css"; // 스타일 import
import { FaImage, FaCommentDots, FaPhoneAlt } from "react-icons/fa"; // 아이콘 추가
import "../../styles/Message.css";
import API_BASE_URL from "../../URL_API"; // API 주소

const Message = () => {
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState(null);

  const [imageSrc, setImageSrc] = useState(null); // 이미지 상태
  const [text, setText] = useState(null); // 텍스트 상태

  useEffect(() => {
    if (location.state) {
      // 전달받은 데이터에서 이미지 URL만 추출하여 상태에 설정
      setImageSrc(location.state.imageSrc ? location.state.imageSrc.url : null);
      setText(location.state.text); // Ensure location.state.text is an object with a 'text' property
    }
  }, [location.state]);

  console.log("Chatbot에서 전달받은 이미지:", imageSrc); // 이미지 확인
  console.log("Chatbot에서 전달받은 텍스트:", text); // 텍스트 확인

  const handleMessageChange = (e) => setMessage(e.target.value);
  const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result); // 선택한 이미지의 데이터 URL을 상태에 저장
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const apiUrl = `${API_BASE_URL}/message/send`;
    const data = {
      phone: phoneNumber,
      message: message,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_ACCESS_TOKEN",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("메시지 전송 성공:", result);
        setMessage("");
        setImageSrc(null);
      } else {
        console.error("메시지 전송 실패:", await response.json());
      }
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  return (
    <div className="message-container">
      {/* Row Content */}
      <div className="row-content">
        {/* 왼쪽 영역 */}
        <div className="col-left bg-light p-4">
          <h2>메시지 전송</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>받는 사람 전화번호</Form.Label>
              <Form.Control
                type="text"
                placeholder="전화번호를 입력하세요"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>메시지 내용</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                className="message-input"
                placeholder="메시지를 입력하세요"
                value={message || (text && text.text ? text.text : '')} // Access text.text if text is an object
                onChange={handleMessageChange}
              />
            </Form.Group>
            {/* File Upload Section */}
            <div className="drop-zone">
              <p>이미지를 드래그하거나 파일을 선택하세요.</p>
              <label className="file-label">
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <span className="file-button">파일 선택</span>
              </label>
            </div>
            <Button
              variant="primary"
              onClick={handleSendMessage}
              className="w-100 mt-3"
            >
              메시지 전송
            </Button>
          </Form>
        </div>

        {/* 오른쪽 영역 */}
        <div className="col-right">
          <DeviceFrameset device="iPhone X" color="black">
            <div className="phone-content">
              <div className="phone-header">
                <div className="header-status">
                  {phoneNumber ? (
                    phoneNumber
                  ) : (
                    <div className="default-phone">
                      <FaPhoneAlt size={20} style={{ marginRight: 10 }} />
                      전화번호를 입력하세요
                    </div>
                  )}
                  <span className="message-type">{image ? "MMS" : "SMS"}</span>
                </div>
              </div>

              <div className="phone-image-preview">
                {/* 이미지 미리보기 */}
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt="첨부 이미지"
                    style={{ maxWidth: "100%", borderRadius: "10px" }}
                  />
                ) : (
                  <div className="default-preview">
                    <FaImage size={50} color="#ccc" />
                    <p>이미지를 업로드하세요.</p>
                  </div>
                )}
              </div>

              <div className="phone-message-preview">
                {/* 텍스트 미리보기 */}
                {text && text.text ? (
                  <p style={{ margin: 0 }}>{text.text}</p>
                ) : (
                  <div className="default-message">
                    <FaCommentDots size={50} color="#ccc" />
                    <p>메시지를 입력하세요.</p>
                  </div>
                )}
              </div>
            </div>
          </DeviceFrameset>
        </div>
      </div>
    </div>
  );
};

export default Message;
