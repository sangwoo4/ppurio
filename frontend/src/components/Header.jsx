import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { TbMessageChatbot, TbMessageCirclePlus } from "react-icons/tb";
import { MdLogin } from "react-icons/md";
import '../styles/Header.css';

const Header = () => {

  return (
    <header className="header">
      <div className="logo-container">
        <span className="logo-text">Daou Tech</span>
      </div>
      <nav className="nav-links">
        <Link className="nav-link home" to="/"><IoHome className="icon" />홈</Link>
        <Link className="nav-link" to="/chatbot"><TbMessageChatbot className="icon" />챗봇</Link>
        <Link className="nav-link" to="/send/message"><TbMessageCirclePlus className="icon" />메세지 전송</Link>
        <Link className="nav-link" to="/create/ai"><GiPerspectiveDiceSixFacesRandom className="icon" />AI 생성</Link>
        <Link className="nav-link login-link" to="/login"><MdLogin className="icon" />로그인</Link>
      </nav>
    </header>
  );
};

export default Header;
