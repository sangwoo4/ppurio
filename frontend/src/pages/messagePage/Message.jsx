import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";
import { FaImage, FaCommentDots, FaPhoneAlt } from "react-icons/fa";
import "../../styles/Message.css";
import API_BASE_URL from "../../URL_API";

const Message = () => {
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [targets, setTargets] = useState([{ name: "", to: "" }]); // 여러 명 대상 관리
  const [userText, setUserText] = useState(null);
  const [category, setCategory] = useState(null);
  const [imageSrc, setImageSrc] = useState(null); // 이미지 상태
  const [text, setText] = useState(null); // 텍스트 상태
  const [userId, setUserId] = useState(null);

  // message 상태가 변경될 때마다 text 상태도 업데이트
  useEffect(() => {
    setText(message);
  }, [message]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (location.state) {
      if (location.state.imageSrc) {
        setImageSrc(location.state.imageSrc); // URL을 직접 설정
      }
      // setImageSrc(location.state.imageSrc ? location.state.imageSrc.url : null);
      setText(location.state.text);
      setUserText(location.state.userText);
      setCategory(location.state.category);

      // 편집된 이미지도 전달받았다면 설정
      if (location.state.editImage) {
        setImageSrc(location.state.editImage); // 편집된 이미지를 이미지 편집기에서 사용
      }

      // 전달받은 값들을 콘솔로 출력
      console.log("Received Image Source:", location.state.imageSrc);
      console.log("Received Edited Image:", location.state.editImage); // 편집된 이미지 확인
      console.log("Received Text:", location.state.text);
      console.log("userText: ", location.state.userText, ", userCategory: ", location.state.category);
    }
  }, [location.state]);


  // 받는 사람 추가
  const addTarget = () => {
    setTargets([...targets, { name: "", to: "" }]);
  };

  // 받는 사람 삭제
  const removeTarget = (index) => {
    setTargets(targets.filter((_, i) => i !== index));
  };

  // 이름과 번호 업데이트
  const updateTarget = (index, key, value) => {
    const updatedTargets = [...targets];
    updatedTargets[index][key] = value;
    setTargets(updatedTargets);
  };

  const calculateByteLength = (message) => {
    return [...message].reduce(
      (acc, char) => (char.charCodeAt(0) > 127 ? acc + 2 : acc + 1),
      0
    );
  };

  const handleSendMessage = async () => {
    const messageToSend = message.trim() ? message : text; // message가 비어 있으면 text 사용
    // if (!message.trim()) return;

    const byteLength = calculateByteLength(message);
    let messageType = "SMS";
    if (imageSrc) {
      messageType = "MMS";
    } else if (byteLength > 90) {
      messageType = "LMS";
    }

    const targetCount = targets.length;

    // targets 배열의 각 name을 content에 치환
    const updatedTargets = targets.map(target => ({
      ...target,
      content: message.replace("[*이름*]", target.name),
    }));

    const data = {
      account: "hansung06",
      messageType,
      content: messageToSend, // 기본 메시지
      targetCount,
      category,
      prompt: userText,
      targets: updatedTargets, // 업데이트된 targets
      userId,
    };

    if (imageSrc) {
      data.files = [{ fileUrl: imageSrc }];
    }

    console.log("Request Data:", data);

    try {
      const response = await fetch(`${API_BASE_URL}/message/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Response Data:", result);

      if (response.ok && result.success) {
        alert("메시지 전송에 성공했습니다!");
      } else {
        alert(result.message || "메시지 전송에 실패했습니다.");
      }
    } catch (error) {
      alert("메시지 전송 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="message-container">
      <div className="row-content">
        {/* 메시지 작성 레이아웃 */}
        <div className="col-left bg-light p-4">
          <h2>메시지 작성</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={6}
                placeholder="메시지를 입력하세요"
                value={message || text}
                onChange={(e) => setMessage(e.target.value)}
                className="message-input"
              />
            </Form.Group>
            <div className="drop-zone">
              <label className="file-label">
                <FaImage size={30} color="#007acc" />
                <p>이미지를 드래그하거나 클릭하여 선택하세요.</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setImageSrc(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
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

        {/* 받는 사람 정보 레이아웃 */}
        <div className="col-center bg-light p-4">
          <h2>받는 사람 정보</h2>
          {targets.map((target, index) => (
            <div key={index} className="target-box mb-3">
              <Form.Control
                type="text"
                placeholder="받는 사람 이름"
                value={target.name}
                onChange={(e) => updateTarget(index, "name", e.target.value)}
                className="mb-2"
              />
              <Form.Control
                type="text"
                placeholder="전화번호"
                value={target.to}
                onChange={(e) => updateTarget(index, "to", e.target.value)}
              />
            </div>
          ))}
          {/* 추가 및 삭제 버튼을 한 번만 렌더링 */}
          <div className="button-group mt-2">
            <Button variant="success" onClick={addTarget} className="me-2">
              +
            </Button>
            {targets.length > 1 && (
              <Button variant="danger" onClick={() => removeTarget(targets.length - 1)}>
                -
              </Button>
            )}
          </div>
        </div>

        {/* 스마트폰 미리보기 레이아웃 */}
        <div className="col-right">
          <DeviceFrameset device="iPhone X" color="black">
            <div className="phone-content">
              <div className="phone-header">
                <div className="header-status">
                  <FaPhoneAlt size={20} style={{ marginRight: 10 }} />
                  {targets.map((target) => target.to).join(", ")}
                  <span className="message-type">
                    {imageSrc
                      ? "MMS"
                      : calculateByteLength(message) > 90
                        ? "LMS"
                        : "SMS"}
                  </span>
                </div>
              </div>
              <div className="phone-image-preview">
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
                {text ? (
                  <p>{text}</p>
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




// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { Form, Button } from "react-bootstrap";
// import { DeviceFrameset } from "react-device-frameset";
// import "react-device-frameset/styles/marvel-devices.min.css";
// import { FaImage, FaCommentDots, FaPhoneAlt } from "react-icons/fa";
// import "../../styles/Message.css";
// import API_BASE_URL from "../../URL_API";

// const Message = () => {
//   const location = useLocation();
//   const [message, setMessage] = useState("");
//   const [targets, setTargets] = useState([{ name: "", to: "" }]); // 여러 명 대상 관리
//   const [userText, setUserText] = useState(null);
//   const [category, setCategory] = useState(null);
//   const [imageSrc, setImageSrc] = useState(null); // 이미지 상태
//   const [text, setText] = useState(null); // 텍스트 상태
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userId");
//     if (storedUserId) {
//       setUserId(storedUserId);
//     }
//   }, []);

//   useEffect(() => {
//     if (location.state) {
//       setImageSrc(location.state.imageSrc ? location.state.imageSrc.url : null);
//       setText(location.state.text);
//       setUserText(location.state.userText);
//       setCategory(location.state.category);
//     }
//   }, [location.state]);

//   // 받는 사람 추가
//   const addTarget = () => {
//     setTargets([...targets, { name: "", to: "" }]);
//   };

//   // 받는 사람 삭제
//   const removeTarget = (index) => {
//     setTargets(targets.filter((_, i) => i !== index));
//   };

//   // 이름과 번호 업데이트
//   const updateTarget = (index, key, value) => {
//     const updatedTargets = [...targets];
//     updatedTargets[index][key] = value;
//     setTargets(updatedTargets);
//   };

//   const calculateByteLength = (message) => {
//     return [...message].reduce(
//       (acc, char) => (char.charCodeAt(0) > 127 ? acc + 2 : acc + 1),
//       0
//     );
//   };

//   const handleSendMessage = async () => {
//     if (!message.trim()) return;

//     const byteLength = calculateByteLength(message);
//     let messageType = "SMS";
//     if (imageSrc) {
//       messageType = "MMS";
//     } else if (byteLength > 90) {
//       messageType = "LMS";
//     }

//     const targetCount = targets.length;

//     // targets 배열의 각 name을 content에 치환
//     const updatedTargets = targets.map(target => ({
//       ...target,
//       content: message.replace("[*이름*]", target.name),
//     }));

//     const data = {
//       account: "hansung06",
//       messageType,
//       content: message, // 기본 메시지
//       targetCount,
//       category,
//       prompt: userText,
//       targets: updatedTargets, // 업데이트된 targets
//       userId,
//     };

//     if (imageSrc) {
//       data.files = [{ fileUrl: imageSrc }];
//     }

//     console.log("Request Data:", data);

//     try {
//       const response = await fetch(`${API_BASE_URL}/message/send`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();
//       console.log("Response Data:", result);

//       if (response.ok && result.success) {
//         alert("메시지 전송에 성공했습니다!");
//       } else {
//         alert(result.message || "메시지 전송에 실패했습니다.");
//       }
//     } catch (error) {
//       alert("메시지 전송 중 오류가 발생했습니다.");
//     }
//   };

//   return (
//     <div className="message-container">
//       <div className="row-content">
//         <div className="col-left bg-light p-4">
//           <h2>메시지 전송</h2>
//           <Form>
//             {targets.map((target, index) => (
//               <div key={index} className="target-box mb-3">
//                 <Form.Group className="mb-2">
//                   <Form.Label>받는 사람 이름</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="받는 사람 이름"
//                     value={target.name}
//                     onChange={(e) =>
//                       updateTarget(index, "name", e.target.value)
//                     }
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-2">
//                   <Form.Label>받는 사람 전화번호</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="전화번호"
//                     value={target.to}
//                     onChange={(e) => updateTarget(index, "to", e.target.value)}
//                   />
//                 </Form.Group>
//                 <div className="button-group">
//                   <Button
//                     variant="success"
//                     onClick={addTarget}
//                     className="me-2"
//                   >
//                     +
//                   </Button>
//                   {targets.length > 1 && (
//                     <Button
//                       variant="danger"
//                       onClick={() => removeTarget(index)}
//                     >
//                       -
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             ))}
//             <Form.Group className="mb-3">
//               <Form.Label>메시지 내용</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 className="message-input"
//                 placeholder="메시지를 입력하세요"
//                 value={message || (text && text.text ? text.text : "")}
//                 onChange={(e) => setMessage(e.target.value)}
//               />
//             </Form.Group>
//             <div className="drop-zone">
//               <p>이미지를 드래그하거나 파일을 선택하세요.</p>
//               <label className="file-label">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => {
//                     const file = e.target.files[0];
//                     if (file) {
//                       const reader = new FileReader();
//                       reader.onload = () => setImageSrc(reader.result);
//                       reader.readAsDataURL(file);
//                     }
//                   }}
//                 />
//                 <span className="file-button">파일 선택</span>
//               </label>
//             </div>
//             <Button
//               variant="primary"
//               onClick={handleSendMessage}
//               className="w-100 mt-3"
//             >
//               메시지 전송
//             </Button>
//           </Form>
//         </div>
//         <div className="col-right">
//           <DeviceFrameset device="iPhone X" color="black">
//             <div className="phone-content">
//               <div className="phone-header">
//                 <div className="header-status">
//                   <FaPhoneAlt size={20} style={{ marginRight: 10 }} />
//                   {targets.map((target) => target.to).join(", ")}
//                   <span className="message-type">
//                     {imageSrc
//                       ? "MMS"
//                       : calculateByteLength(message) > 90
//                         ? "LMS"
//                         : "SMS"}
//                   </span>
//                 </div>
//               </div>
//               <div className="phone-image-preview">
//                 {imageSrc ? (
//                   <img
//                     src={imageSrc}
//                     alt="첨부 이미지"
//                     style={{ maxWidth: "100%", borderRadius: "10px" }}
//                   />
//                 ) : (
//                   <div className="default-preview">
//                     <FaImage size={50} color="#ccc" />
//                     <p>이미지를 업로드하세요.</p>
//                   </div>
//                 )}
//               </div>
//               <div className="phone-message-preview">
//                 {text && text.text ? (
//                   <p>{text.text}</p>
//                 ) : (
//                   <div className="default-message">
//                     <FaCommentDots size={50} color="#ccc" />
//                     <p>메시지를 입력하세요.</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </DeviceFrameset>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Message;
