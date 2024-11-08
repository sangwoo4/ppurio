import { Routes, Route } from 'react-router-dom';
import React from "react";

import MainHome from './pages/mainpage/MainHome';
import Login from './pages/loginPage/Login'
import Signup from './pages/loginPage/Signup'
import Chatbot from './pages/chatbotPage/Chatbot'
import Message from './pages/messagePage/Message'
import Code from './TEST_FILE/Code';
import TestFile from './TEST_FILE/TestFile';
import MaskImageEditor from './pages/createAiPage/CreateAI';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/send/message" element={<Message />} />
        <Route path="/create/ai" element={<MaskImageEditor />} />

        <Route path="/test" element={<Code />} />
        <Route path="/test2" element={<TestFile />} />
      </Routes>
    </div>
  );
}

export default App;