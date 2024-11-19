import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/EditProduct.css';
import API_BASE_URL from '../../URL_API'; // aws 서버

const SendMessage = () => {
  return (
    <div className="d-grid gap-2 mt-4">
      <Button variant="primary" size="lg">
        메시지 전송(이미지 포함)
      </Button>
    </div>
  );
};

const EditProduct = () => {
  const [aiText, setAiText] = useState(''); // AI 텍스트 생성
  const [generatedText, setGeneratedText] = useState(''); // AI 텍스트
  const [imageDescription, setImageDescription] = useState(''); // 이미지 생성
  const [generatedImage, setGeneratedImage] = useState(''); // AI 이미지 생성

  return (
    <Container fluid className="p-3">
      <Row>
        {/* Left Side */}
        <Col md={6} className="bg-light p-4">
          <h2>왼쪽 영역</h2>

          {/* 입력 필드 */}
          <Form>
            <Form.Group className="mb-3" controlId="aiText">
              <Form.Label>AI 텍스트 생성</Form.Label>
              <Form.Control
                type="text"
                placeholder="AI 텍스트를 입력하세요"
                value={aiText}
                onChange={(e) => setAiText(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="generatedText">
              <Form.Label>AI 텍스트</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="AI가 생성한 텍스트가 여기에 표시됩니다"
                value={generatedText}
                onChange={(e) => setGeneratedText(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="imageDescription">
              <Form.Label>이미지 생성</Form.Label>
              <Form.Control
                type="text"
                placeholder="생성할 이미지 설명을 입력하세요"
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="generatedImage">
              <Form.Label>AI 이미지 생성</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="AI가 생성한 이미지가 여기에 표시됩니다"
                value={generatedImage}
                onChange={(e) => setGeneratedImage(e.target.value)}
              />
            </Form.Group>
          </Form>

          {/* SendMessage 버튼 추가 */}
          <SendMessage />
        </Col>

        {/* Right Side: 미리보기 영역 */}
        <Col md={6} className="d-flex justify-content-center align-items-center">
          <div className="phone-preview bg-secondary text-white p-3">
            <h5 className="text-center">미리보기</h5>
            <div className="preview-content mt-4">
              <h6>AI 텍스트 생성</h6>
              <p>{aiText || 'AI 텍스트가 여기에 표시됩니다.'}</p>

              <h6>AI 텍스트</h6>
              <p>{generatedText || 'AI가 생성한 텍스트가 여기에 표시됩니다.'}</p>

              <h6>이미지 생성</h6>
              <p>{imageDescription || '생성할 이미지 설명이 여기에 표시됩니다.'}</p>

              <h6>AI 이미지 생성</h6>
              <p>{generatedImage || 'AI가 생성한 이미지 설명이 여기에 표시됩니다.'}</p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProduct;