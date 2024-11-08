import React, { useState } from 'react';
import '../../styles/Message.css';

const Message = () => {
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = 'http://localhost:8080/message/send';
    const data = {
      phone: phoneNumber,
      message: message,
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
        // 메시지 전송 후 초기화
        setMessage('');
        setPhoneNumber('');
      } else {
        const errorData = await response.json();
        console.error('메시지 전송 실패:', errorData);
      }
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  return (
    <div className="message-frame">
      <h1>메세지 전송 화면</h1>
      <form className="messagePageForm" onSubmit={handleSubmit}>
        <div>
          <label className="messageLabel">
            전화번호:
            <input
              className="messagePhoneInput"
              type="text"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              required
              placeholder="전화번호 입력"
            />
          </label>
        </div>
        <div>
          <label className="messageLabel">
            메시지:
            <textarea
              className="messageTextarea"
              value={message}
              onChange={handleMessageChange}
              required
              placeholder="메시지 입력"
            />
          </label>
        </div>
        <button className="messageSubmit" type="submit">전송</button>
      </form>
    </div>
  );
};

export default Message;
