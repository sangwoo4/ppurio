import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import smartphoneImage from '../../assets/smartphone.png'; // 이미지 import
import '../../styles/Message.css';
import API_BASE_URL from "../../URL_API"; //aws 주소

const Message = () => {
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [image, setImage] = useState(null); // To store uploaded image
  const [chatHistory, setChatHistory] = useState([]);

  const handleMessageChange = (e) => setMessage(e.target.value);
  const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || !phoneNumber.trim()) return;

    const apiUrl = `${API_BASE_URL}/message/send`;
    const data = {
      phone: phoneNumber,
      message: message,
      image: image, // Add image data
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('메시지 전송 성공:', result);

        // Add API response to chat history
        setChatHistory((prevHistory) => [
          ...prevHistory,
          {
            type: 'sent',
            content: message,
            image: image, // Include image in sent message
            details: { phone: phoneNumber, timestamp: result.timestamp },
          },
          {
            type: 'received',
            content: result.response,
            details: { messageId: result.messageId, timestamp: result.timestamp },
          },
        ]);

        setMessage(''); // Clear message input
        setImage(null); // Clear image input
      } else {
        const errorData = await response.json();
        console.error('메시지 전송 실패:', errorData);

        setChatHistory((prevHistory) => [
          ...prevHistory,
          {
            type: 'error',
            content: errorData.errorMessage || '전송 실패',
            details: { timestamp: new Date().toISOString() },
          },
        ]);
      }
    } catch (error) {
      console.error('에러 발생:', error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          type: 'error',
          content: '서버와의 연결에 실패했습니다.',
          details: { timestamp: new Date().toISOString() },
        },
      ]);
    }
  };

  return (
    <Container fluid className="message-container">
      <Row className="d-flex">
        {/* 왼쪽 영역 */}
        <Col md={6} className="bg-light p-4 message-form-wrapper">
          <h2 className="text-left mb-4">메시지 전송</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="phoneNumber">
              <Form.Label>받는 사람 전화번호</Form.Label>
              <Form.Control
                type="text"
                placeholder="전화번호를 입력하세요"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="message">
              <Form.Label>메시지 내용</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="메시지를 입력하세요"
                value={message}
                onChange={handleMessageChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="image">
              <Form.Label>이미지 업로드</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>

            <div className="d-grid gap-2 mt-4">
              <Button type="submit" variant="primary" size="lg">
                메시지 전송
              </Button>
            </div>
          </Form>
        </Col>

        {/* 오른쪽 영역 */}
        <Col md={6} className="d-flex justify-content-center align-items-center">
          <div
            className="phone-preview"
            style={{
              backgroundImage: `url(${smartphoneImage})`, // JSX를 통해 배경 이미지 설정
            }}
          >
            <div className="phone-screen">
              <div className="chat-container">
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`chat-bubble ${chat.type}`}>
                    <p>{chat.content}</p>
                    {chat.image && (
                      <img
                        src={chat.image}
                        alt="Uploaded"
                        style={{ maxWidth: '100%', borderRadius: '10px' }}
                      />
                    )}
                    {chat.details && (
                      <div className="chat-details">
                        {chat.details.phone && <small>전화번호: {chat.details.phone}</small>}
                        {chat.details.messageId && <small>메시지 ID: {chat.details.messageId}</small>}
                        {chat.details.timestamp && (
                          <small>보낸 시간: {new Date(chat.details.timestamp).toLocaleString()}</small>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Message;