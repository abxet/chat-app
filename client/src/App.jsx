import React from 'react';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Chat from './pages/Chat.jsx';
import HomePage from './pages/home.jsx';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { UserProvider } from './context/UserContext.jsx'; // ⬅️ import provider

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protect Chat route */}
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
    </UserProvider>
  );
}

export default App;
