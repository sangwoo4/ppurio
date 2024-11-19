import { Routes, Route } from 'react-router-dom';
import React from "react";

import MainHome from './pages/mainpage/MainHome';
import Login from './pages/loginPage/Login'
import Chatbot from './pages/chatbotPage/Chatbot'
import Message from './pages/messagePage/Message'
import EditProduct from './pages/editProduct/EditProduct';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/send/message" element={<Message />} />
        <Route path="/edit/product" element={<EditProduct />} />

      </Routes>
    </div>
  );
}

export default App;