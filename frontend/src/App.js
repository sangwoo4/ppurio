import { Routes, Route } from 'react-router-dom';
import React from "react";

import MainHome from './pages/mainpage/MainHome';
import Login from './pages/loginPage/Login'
import Signup from './pages/loginPage/Signup'
import Chatbot from './pages/chatbotPage/Chatbot'
import Message from './pages/messagePage/Message'
import CreateAI from './pages/createAiPage/CreateAI'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/send/message" element={<Message />} />
        <Route path="/create/ai" element={<CreateAI />} />
      </Routes>
    </div>
  );
}

export default App;