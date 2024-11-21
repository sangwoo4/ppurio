import React, { useState } from 'react';
import { PinturaEditor } from '@pqina/react-pintura';
import '@pqina/pintura/pintura.css';
import '../../styles/EditProduct.css';
import daouName from "../../assets/daoutechName.jpeg";

import {
  createDefaultImageReader,
  createDefaultImageWriter,
  createDefaultShapePreprocessor,
  setPlugins,
  plugin_crop,
  plugin_finetune,
  plugin_filter,
  plugin_annotate,
  plugin_finetune_defaults,
  plugin_filter_defaults,
  markup_editor_defaults,
} from '@pqina/pintura';

import {
  LocaleCore,
  LocaleCrop,
  LocaleFinetune,
  LocaleFilter,
  LocaleAnnotate,
  LocaleMarkupEditor,
} from '@pqina/pintura/locale/en_GB';

setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);

const editorDefaults = {
  utils: ['crop', 'finetune', 'filter', 'annotate'],
  imageReader: createDefaultImageReader(),
  imageWriter: createDefaultImageWriter(),
  shapePreprocessor: createDefaultShapePreprocessor(),
  ...plugin_finetune_defaults,
  ...plugin_filter_defaults,
  ...markup_editor_defaults,
  locale: {
    ...LocaleCore,
    ...LocaleCrop,
    ...LocaleFinetune,
    ...LocaleFilter,
    ...LocaleAnnotate,
    ...LocaleMarkupEditor,
  },
};

const EditProduct = () => {
  const [imageSrc] = useState(daouName); // 디폴트 이미지 설정
  const [results, setResults] = useState([]);
  const [popupImage, setPopupImage] = useState(null);

  const handleDeleteImage = (index) => {
    setResults(results.filter((_, i) => i !== index)); // 특정 인덱스의 이미지를 삭제
  };

  const openPopup = (image) => {
    setPopupImage(image); // 클릭한 이미지 팝업에 설정
  };

  const closePopup = () => {
    setPopupImage(null); // 팝업 닫기
  };

  const handleSendMessage = () => {
    console.log('메시지가 전송되었습니다!');
  };

  return (
    <div className="create-ai-page">
      {imageSrc && (
        <div className="pintura-editor-container">
          <PinturaEditor
            {...editorDefaults}
            src={imageSrc} // imageSrc 사용
            onLoad={(res) => console.log('Image loaded:', res)}
            onProcess={({ dest }) => setResults([...results, URL.createObjectURL(dest)])}
          />
        </div>
      )}

      <div className="result-images-container">
        <div className="result-images-header">
          <span role="img" aria-label="saved-images">📌</span> 이미지 저장 내역
          <span className="done-hint">
            이미지를 편집한 후 <strong>Done</strong> 버튼을 눌러 저장하세요!
          </span>
        </div>
        {results.length === 0 && <p>저장된 이미지가 없습니다.</p>}
        <div className="result-images-list">
          {results.map((result, index) => (
            <div key={index} className="result-image">
              <button className="delete-button" onClick={() => handleDeleteImage(index)}>✖</button>
              <img src={result} alt={`Edited result ${index + 1}`} onClick={() => openPopup(result)} />
            </div>
          ))}
        </div>
      </div>

      <button className="send-message-button" onClick={handleSendMessage}>
        메시지 전송
      </button>

      {popupImage && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-button" onClick={closePopup}>✖</button>
            <img src={popupImage} alt="Full view" />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProduct;