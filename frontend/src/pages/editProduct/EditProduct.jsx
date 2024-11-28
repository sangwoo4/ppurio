import React, { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import ImageEditor from "@toast-ui/react-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import "../../styles/EditProduct.css";
import defaultImage from "../../assets/daoutechName.jpeg";

const EditProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const imageEdit = location.state?.imageSrc || defaultImage;
  const [imageSrc, setImageSrc] = useState(imageEdit);
  const [editImage, setEditImage] = useState([]);
  const [popupImage, setPopupImage] = useState(null);
  const imageEditorRef = useRef(null);

  useEffect(() => {
    if (location.state) {
      if (location.state.imageSrc) {
        setImageSrc(location.state.imageSrc);
      }
      console.log("Received Image Source:", location.state.imageSrc);
    }
  }, [location.state]);

  const handleSaveImage = () => {
    const editorInstance = imageEditorRef.current?.getInstance();

    if (editorInstance) {
      try {
        const dataURL = editorInstance.toDataURL(); // Base64 형식의 이미지 URL을 가져옴

        // Convert PNG to JPEG
        const img = new Image();
        img.src = dataURL;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const width = img.width;
          const height = img.height;
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const jpegDataURL = canvas.toDataURL('image/jpeg'); // Convert to JPEG

          if (!editImage.includes(jpegDataURL)) {
            setEditImage((prevImages) => [...prevImages, jpegDataURL]); // 배열에 저장
          } else {
            alert("이미 저장된 이미지입니다.");
          }
        };
      } catch (error) {
        console.error("Failed to save the image:", error);
      }
    } else {
      console.error("Editor instance is not available.");
    }
  };


  const handleDeleteImage = (index) => {
    setEditImage(editImage.filter((_, i) => i !== index)); // 이미지 삭제
  };

  const handleDownloadImage = (index) => {
    const imageToDownload = editImage[index];

    if (imageToDownload) {
      const link = document.createElement("a");
      link.href = imageToDownload;
      link.download = `edited_image_${index + 1}.png`;
      link.click();
    } else {
      alert("다운로드할 이미지가 없습니다.");
    }
  };

  const openPopup = (image) => {
    setPopupImage(image); // 팝업 열기
  };

  const closePopup = () => {
    setPopupImage(null); // 팝업 닫기
  };

  const handleSendMessageDirect = () => {
    if (editImage.length > 1) {
      alert("한 개의 이미지만 전송 가능합니다.");
    } else if (editImage.length === 1) {
      navigate("/send/message", {
        state: {
          editImage: editImage[0],
        },
      });
    } else {
      alert("전송할 이미지가 없습니다. 이미지 저장 후 전송해주세요.");
    }
  };

  return (
    <div className="edit-product-page">
      <div className="editor-container">
        <div className="image-editor-container">
          <ImageEditor
            ref={imageEditorRef}
            includeUI={{
              loadImage: {
                path: imageSrc,
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
                height: "750px",
              },
              menuBarPosition: "bottom",
            }}
          />
        </div>
        <div className="toolbar">
          <Button className="btn btn-success save-button" onClick={handleSaveImage}>
            이미지 저장하기
          </Button>
        </div>
      </div>

      <div className="result-images-container">
        <h4>📌 저장된 이미지 내역</h4>
        <div className="result-images-list">
          {editImage.length === 0 && <p>저장된 이미지가 없습니다.</p>}
          {editImage.map((result, index) => (
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
                onClick={() => openPopup(result)} // 이미지를 클릭하면 팝업 열기
              />
              <Button
                className="btn btn-primary download-button"
                onClick={() => handleDownloadImage(index)}
              >
                다운로드
              </Button>
            </div>
          ))}
        </div>
      </div>

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

      <div className="send-message-container">
        <Button className="send-message-button" onClick={handleSendMessageDirect}>
          메시지 전송하기
        </Button>
      </div>
    </div>
  );
};

export default EditProduct;






// // import React, { useState, useEffect } from "react";
// // import { Button } from "react-bootstrap";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import FilerobotImageEditor from "react-filerobot-image-editor";
// // import "../../styles/EditProduct.css";
// // import defaultImage from "../../assets/daoutechName.jpeg";

// // const EditProduct = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const imageEdit = location.state?.imageSrc || defaultImage;
// //   const [imageSrc, setImageSrc] = useState(imageEdit);
// //   const [editImage, setEditImage] = useState([]);
// //   const [isEditorVisible, setIsEditorVisible] = useState(false);
// //   const [popupImage, setPopupImage] = useState(null);
// //   const [isLoading, setIsLoading] = useState(false);

// //   useEffect(() => {
// //     if (location.state) {
// //       if (location.state.imageSrc) {
// //         setImageSrc(location.state.imageSrc);
// //       }
// //       console.log("Received Image Source:", location.state.imageSrc);
// //     }
// //   }, [location.state]);

// //   const handleSaveImage = (editedImage) => {
// //     if (!editImage.includes(editedImage)) {
// //       setEditImage((prevImages) => [...prevImages, editedImage]);
// //     } else {
// //       alert("이미 저장된 이미지입니다.");
// //     }
// //     setIsEditorVisible(false);
// //   };

// //   const handleDeleteImage = (index) => {
// //     setEditImage(editImage.filter((_, i) => i !== index));
// //   };

// //   const handleDownloadImage = (index) => {
// //     const imageToDownload = editImage[index];
// //     if (imageToDownload) {
// //       const link = document.createElement("a");
// //       link.href = imageToDownload;
// //       link.download = `edited_image_${index + 1}.png`;
// //       link.click();
// //     } else {
// //       alert("다운로드할 이미지가 없습니다.");
// //     }
// //   };

// //   const openPopup = (image) => {
// //     setPopupImage(image);
// //   };

// //   const closePopup = () => {
// //     setPopupImage(null);
// //   };

// //   const handleSendMessageDirect = () => {
// //     if (editImage.length > 1) {
// //       alert("한 개의 이미지만 전송 가능합니다.");
// //     } else if (editImage.length === 1) {
// //       navigate("/send/message", {
// //         state: {
// //           editImage: editImage[0],
// //         },
// //       });
// //     } else {
// //       alert("전송할 이미지가 없습니다. 이미지 저장 후 전송해주세요.");
// //     }
// //   };

// //   const handleStartEditing = () => {
// //     setIsLoading(true);
// //     setTimeout(() => {
// //       setIsEditorVisible(true);
// //       setIsLoading(false);
// //     }, 500); // 로딩 효과를 위해 약간의 지연 추가
// //   };

// //   return (
// //     <div className="edit-product-page">
// //       <div className="editor-container">
// //         {isEditorVisible && (
// //           <div className="image-editor-wrapper">
// //             <FilerobotImageEditor
// //               source={imageSrc} // 필수: source에 이미지 경로 전달
// //               onSave={(editedImageObject) =>
// //                 handleSaveImage(editedImageObject.imageBase64)
// //               }
// //               onClose={() => setIsEditorVisible(false)}
// //             />
// //           </div>
// //         )}
// //         {!isEditorVisible && (
// //           <Button
// //             className="btn btn-primary"
// //             onClick={handleStartEditing}
// //             disabled={isLoading}
// //           >
// //             {isLoading ? "로딩 중..." : "이미지 편집하기!"}
// //           </Button>
// //         )}
// //       </div>

// //       <div className="result-images-container">
// //         <h4>📌 저장된 이미지 내역</h4>
// //         <div className="result-images-list">
// //           {editImage.length === 0 && <p>저장된 이미지가 없습니다.</p>}
// //           {editImage.map((result, index) => (
// //             <div key={index} className="result-image">
// //               <button
// //                 className="delete-button"
// //                 onClick={() => handleDeleteImage(index)}
// //               >
// //                 ✖
// //               </button>
// //               <img
// //                 src={result}
// //                 alt={`Edited result ${index + 1}`}
// //                 className="img-thumbnail"
// //                 onClick={() => openPopup(result)}
// //               />
// //               <Button
// //                 className="btn btn-primary download-button"
// //                 onClick={() => handleDownloadImage(index)}
// //               >
// //                 다운로드
// //               </Button>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       {popupImage && (
// //         <div className="popup-overlay" onClick={closePopup}>
// //           <div className="popup-content" onClick={(e) => e.stopPropagation()}>
// //             <button className="popup-close-button" onClick={closePopup}>
// //               ✖
// //             </button>
// //             <img src={popupImage} alt="Full view" className="popup-image" />
// //           </div>
// //         </div>
// //       )}

// //       <div className="send-message-container">
// //         <Button
// //           className="send-message-button"
// //           onClick={handleSendMessageDirect}
// //         >
// //           메시지 전송하기
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default EditProduct;

