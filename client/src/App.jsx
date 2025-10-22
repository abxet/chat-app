import React from 'react';
import Signup from './pages/Signup.jsx'
// import Login from './pages/Login.jsx'
// import Chat from './pages/Chat.jsx'
import { Route, Routes, BrowserRouter } from'react-router-dom'

function App() {
return (

   <BrowserRouter >

        {/* <Route exact path="/" element={Login} /> */}
        <Routes>
          <Route path="/" element={<Signup />} />
          {/* <Route path="/signup" element={Signup} /> */}
        </Routes>

   </BrowserRouter>
  
);
}

export default App
