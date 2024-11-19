import React, { useState } from 'react';
import '../../styles/Message.css';
import API_BASE_URL from "../../URL_API"; //aws 서버

const Message = () => {
  const [recipient, setRecipient] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // 미리보기 URL 상태 추가

  const handleAttachmentChange = (event) => {
    const file = event.target.files[0];
    setAttachment(file);

    // 이미지 미리보기 URL 생성
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      recipient,
      messageContent,
      attachment,
    });
  };

  return (
    <div className="message-page">
      <h1 className="message-title">메세지 전송 화면</h1>
      <div className="message-form-container">
        <form onSubmit={handleSubmit} className="message-form">
          <label className="message-label">받는 사람:</label>
          <input
            type="text"
            placeholder="받는 사람의 이름 또는 연락처 입력"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="message-input"
          />

          <label className="message-label">메세지 내용:</label>
          <textarea
            placeholder="메세지를 입력하세요"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            className="message-textarea"
          />

          <label className="message-label">첨부 이미지 (선택):</label>
          <input type="file" onChange={handleAttachmentChange} className="message-file-input" />

          {/* 이미지 미리보기 추가 */}
          {previewUrl && (
            <div className="preview-container">
              <img src={previewUrl} alt="미리보기" className="preview-image" />
            </div>
          )}

          <button
            type="submit"
            className="button"
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            메세지 전송
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;
