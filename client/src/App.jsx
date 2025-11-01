import React from 'react';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Chat from './pages/Chat.jsx';
import Home from './pages/home.jsx';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { UserProvider } from './context/UserContext.jsx'; 
import { KeyProvider } from './context/KeyContext.jsx';

function App() {
  return (
    <UserProvider>
      <KeyProvider>
        <BrowserRouter>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </KeyProvider>
    </UserProvider>
  );
}

export default App;
