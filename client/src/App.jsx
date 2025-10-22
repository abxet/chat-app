import React from 'react';
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Chat from './pages/Chat.jsx'
import HomePage from './pages/home.jsx';
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App
