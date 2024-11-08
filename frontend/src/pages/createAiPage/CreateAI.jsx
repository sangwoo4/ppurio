import React, { useRef, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

const MaskImageEditor = () => {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: 0, y: 0 });

  // 이미지 파일을 업로드하고 캔버스에 렌더링하는 함수
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        setImage(img);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    };
    reader.readAsDataURL(file);
  };

  // 마우스 드래그 시작 시 호출
  const startDrawing = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setStartPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDrawing(true);
  };

  // 드래그 중 선택 영역 업데이트 및 시각적 표시
  const drawMask = (e) => {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setEndPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 캔버스를 초기화하고 이미지를 다시 그린 후 드래그 선택 영역을 시각적으로 표시
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // 드래그하는 동안 선택 영역 테두리 표시
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      startPos.x,
      startPos.y,
      endPos.x - startPos.x,
      endPos.y - startPos.y
    );
  };

  // 드래그가 끝나면 마스크(부분) 생성
  const endDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 선택 영역을 투명하게 만들기 위해 전체 이미지 다시 그리기
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // 드래그한 영역을 투명하게 처리
    ctx.clearRect(
      startPos.x,
      startPos.y,
      endPos.x - startPos.x,
      endPos.y - startPos.y
    );
  };

  // 투명 배경을 포함한 PNG 이미지를 저장
  const saveMask = () => {
    const canvas = canvasRef.current;
    const maskedImage = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = maskedImage;
    link.download = 'masked-image.png';
    link.click();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Mask Image Editor</Typography>

      <Button variant="contained" component="label" sx={{ mb: 2 }}>
        이미지 업로드
        <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
      </Button>

      <Box
        sx={{
          width: 500,
          height: 500,
          border: '2px dashed gray',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          style={{ maxWidth: '100%' }}
          onMouseDown={startDrawing}
          onMouseMove={drawMask}
          onMouseUp={endDrawing}
        />
      </Box>

      <Button variant="contained" color="success" onClick={saveMask}>
        이미지 저장
      </Button>
    </Box>
  );
};

export default MaskImageEditor;


// import React from 'react';
// import '../../styles/CreateAI.css';

// const CreateAI = () => {
//   return (
//     <div className="main-page">
//       <h1>AI 생성 화면</h1>
//     </div>
//   );
// };

// export default CreateAI;
