import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { TbMessageChatbot, TbMessageCirclePlus } from "react-icons/tb";
import { MdLogin, MdLogout } from "react-icons/md";
import '../styles/Header.css';
import { useUser } from "../hooks/UserContext";

const Header = () => {
  const { userId, setUserId } = useUser();

  // 유저 id 설정 불러오기
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, [setUserId]);

  // 로그아웃 핸들러
  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem("userId");
    window.location.reload();
    alert("로그아웃되었습니다.");
    console.log("User logged out");
  };

  return (
    <header className="header">
      <div className="logo-container">
        <span className="logo-text">Daou Tech</span>
      </div>
      <nav className="nav-links">
        <Link className="nav-link" to="/"><IoHome className="icon" />홈</Link>
        <Link className="nav-link" to="/chatbot"><TbMessageChatbot className="icon" />챗봇</Link>
        <Link className="nav-link" to="/send/message"><TbMessageCirclePlus className="icon" />메세지 전송</Link>
        <Link className="nav-link" to="/edit/product"><GiPerspectiveDiceSixFacesRandom className="icon" />이미지 편집</Link>

        {userId ? (
          <button className="nav-link" onClick={handleLogout}>
            <MdLogout className="icon" />로그아웃
          </button>
        ) : (
          <Link className="nav-link" to="/login">
            <MdLogin className="icon" />로그인
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;



// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { IoHome } from "react-icons/io5";
// import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
// import { TbMessageChatbot, TbMessageCirclePlus } from "react-icons/tb";
// import { MdLogin } from "react-icons/md";
// import '../styles/Header.css';

// const Header = () => {

//   return (
//     <header className="header">
//       <div className="logo-container">
//         <span className="logo-text">Daou Tech</span>
//       </div>
//       <nav className="nav-links">
//         <Link className="nav-link" to="/"><IoHome className="icon" />홈</Link>
//         <Link className="nav-link" to="/chatbot"><TbMessageChatbot className="icon" />챗봇</Link>
//         <Link className="nav-link" to="/send/message"><TbMessageCirclePlus className="icon" />메세지 전송</Link>
//         <Link className="nav-link" to="/create/ai"><GiPerspectiveDiceSixFacesRandom className="icon" />이미지 편집</Link>
//         <Link className="nav-link" to="/login"><MdLogin className="icon" />로그인</Link>
//       </nav>
//     </header>
//   );
// };

// export default Header;
