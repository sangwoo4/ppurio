import React, { useState, useRef } from "react";
import { Button } from "react-bootstrap";
import ImageEditor from "@toast-ui/react-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import "../../styles/EditProduct.css";
import defaultImage from "../../assets/daoutechName.jpeg";

const EditProduct = () => {
  const [results, setResults] = useState([]);
  const [popupImage, setPopupImage] = useState(null);
  const imageEditorRef = useRef(null);

  const handleSaveImage = () => {
    const editorInstance = imageEditorRef.current?.getInstance();
    if (editorInstance) {
      try {
        const dataURL = editorInstance.toDataURL();
        setResults((prev) => [...prev, dataURL]);
      } catch (error) {
        console.error("Failed to save the image: ", error);
        alert("There was an error saving the image. Please try again.");
      }
    }
  };

  const handleDeleteImage = (index) => {
    setResults(results.filter((_, i) => i !== index));
  };

  const openPopup = (image) => {
    setPopupImage(image);
  };

  const closePopup = () => {
    setPopupImage(null);
  };

  return (
    <div className="edit-product-page">
      <div className="editor-container">
        {/* TUI Image Editor */}
        <div className="image-editor-container">
          <ImageEditor
            ref={imageEditorRef}
            includeUI={{
              loadImage: {
                path: defaultImage,
                name: "SampleImage",
              },
              theme: {
                "menu.backgroundColor": "#fff",
                "common.backgroundColor": "#f9f9f9",
              },
              menu: ["crop", "flip", "rotate", "draw", "shape", "text", "filter"],
              initMenu: "filter",
              uiSize: {
                width: "100%",
                height: "750px", // Editor area height increased
              },
              menuBarPosition: "bottom",
            }}
          />
        </div>

        {/* Save Button */}
        <div className="toolbar">
          <Button className="btn btn-success save-button" onClick={handleSaveImage}>
            Save Image
          </Button>
        </div>
      </div>

      {/* Saved Images Section */}
      <div className="result-images-container">
        <h4>📌 Saved Images</h4>
        <div className="result-images-list">
          {results.length === 0 && <p>No saved images.</p>}
          {results.map((result, index) => (
            <div key={index} className="result-image">
              <button
                className="delete-button"
                onClick={() => handleDeleteImage(index)}
              >
                ✖
              </button>
              <img
                src={result}
                alt={`Edited result ${index + 1}`}
                className="img-thumbnail"
                onClick={() => openPopup(result)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Popup for full image view */}
      {popupImage && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-button" onClick={closePopup}>
              ✖
            </button>
            <img src={popupImage} alt="Full view" className="popup-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProduct;









// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { PinturaEditor } from '@pqina/react-pintura';
// import '@pqina/pintura/pintura.css';
// import '../../styles/EditProduct.css';
// import daouName from "../../assets/daoutechName.jpeg";
// import API_BASE_URL from "../../URL_API"; // API 주소


// import {
//   createDefaultImageReader,
//   createDefaultImageWriter,
//   createDefaultShapePreprocessor,
//   setPlugins,
//   plugin_crop,
//   plugin_finetune,
//   plugin_filter,
//   plugin_annotate,
//   plugin_finetune_defaults,
//   plugin_filter_defaults,
//   markup_editor_defaults,
// } from '@pqina/pintura';

// import {
//   LocaleCore,
//   LocaleCrop,
//   LocaleFinetune,
//   LocaleFilter,
//   LocaleAnnotate,
//   LocaleMarkupEditor,
// } from '@pqina/pintura/locale/en_GB';

// setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);

// const editorDefaults = {
//   utils: ['crop', 'finetune', 'filter', 'annotate'],
//   imageReader: createDefaultImageReader(),
//   imageWriter: createDefaultImageWriter(),
//   shapePreprocessor: createDefaultShapePreprocessor(),
//   ...plugin_finetune_defaults,
//   ...plugin_filter_defaults,
//   ...markup_editor_defaults,
//   locale: {
//     ...LocaleCore,
//     ...LocaleCrop,
//     ...LocaleFinetune,
//     ...LocaleFilter,
//     ...LocaleAnnotate,
//     ...LocaleMarkupEditor,
//   },
// };

// const EditProduct = () => {
//   const location = useLocation();
//   const defaultImage = location.state?.imageSrc || daouName; // 전달받은 이미지가 있으면 사용, 없으면 기본 이미지 사용
//   const [imageSrc, setImageSrc] = useState(null); // 전달받은 이미지로 초기화
//   const [results, setResults] = useState([]);
//   const [popupImage, setPopupImage] = useState(null);

//   console.log("EditProduct에서 전달받은 이미지:", location.state?.imageSrc);

//   // 외부 URL에서 이미지를 Blob으로 가져오기
//   const loadImageFromURL = async (url) => {
//     try {
//       const response = await fetch(url);
//       const blob = await response.blob(); // 이미지 Blob 가져오기
//       const objectURL = URL.createObjectURL(blob); // Blob을 Object URL로 변환
//       console.log('Blob URL:', objectURL); // Blob URL 확인

//       setImageSrc(objectURL); // 변환된 Object URL을 상태에 설정
//     } catch (error) {
//       console.error("이미지 로드 실패:", error);
//     }
//   };

//   useEffect(() => {
//     if (location.state?.imageSrc) {
//       loadImageFromURL(location.state.imageSrc); // 서버에서 받은 이미지 URL이 있을 경우 로드
//     }
//   }, [location.state?.imageSrc]);

//   const handleDeleteImage = (index) => {
//     setResults(results.filter((_, i) => i !== index)); // 특정 인덱스의 이미지를 삭제
//   };

//   const openPopup = (image) => {
//     setPopupImage(image); // 클릭한 이미지 팝업에 설정
//   };

//   const closePopup = () => {
//     setPopupImage(null); // 팝업 닫기
//   };

//   const handleSendMessage = () => {
//     console.log('메시지가 전송되었습니다!');
//   };

//   return (
//     <div className="create-ai-page">
//       {/* {location.state?.imageSrc ? (
//         <div className="pintura-editor-container">
//           <PinturaEditor
//             {...editorDefaults}
//             src={location.state.imageSrc} // 원본 URL을 그대로 사용
//             onLoad={(res) => console.log('Image loaded:', res)} // 로드 이벤트 확인
//             onProcess={({ dest }) => setResults([...results, URL.createObjectURL(dest)])}
//           />
//         </div>
//       ) : (
//         <p>이미지 로딩 중...</p>
//       )} */}
//       {imageSrc ? (
//         <div className="pintura-editor-container">
//           <PinturaEditor
//             {...editorDefaults}
//             src={imageSrc} // Blob URL을 PinturaEditor에 전달
//             onLoad={(res) => console.log('Image loaded:', res)} // 로드 이벤트 확인
//             onProcess={({ dest }) => setResults([...results, URL.createObjectURL(dest)])}
//           />
//         </div>
//       ) : (
//         <p>이미지 로딩 중...</p> // 이미지가 없을 경우 로딩 중 메시지 표시
//       )}

//       <div className="result-images-container">
//         <div className="result-images-header">
//           <span role="img" aria-label="saved-images">📌</span> 이미지 저장 내역
//           <span className="done-hint">
//             이미지를 편집한 후 <strong>Done</strong> 버튼을 눌러 저장하세요!
//           </span>
//         </div>
//         {results.length === 0 && <p>저장된 이미지가 없습니다.</p>}
//         <div className="result-images-list">
//           {results.map((result, index) => (
//             <div key={index} className="result-image">
//               <button className="delete-button" onClick={() => handleDeleteImage(index)}>✖</button>
//               <img src={result} alt={`Edited result ${index + 1}`} onClick={() => openPopup(result)} />
//             </div>
//           ))}
//         </div>
//       </div>

//       <button className="send-message-button" onClick={handleSendMessage}>
//         메시지 전송
//       </button>

//       {popupImage && (
//         <div className="popup-overlay" onClick={closePopup}>
//           <div className="popup-content" onClick={(e) => e.stopPropagation()}>
//             <button className="popup-close-button" onClick={closePopup}>✖</button>
//             <img src={popupImage} alt="Full view" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EditProduct;
