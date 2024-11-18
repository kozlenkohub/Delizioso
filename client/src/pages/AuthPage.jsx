// authpage.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from '../components/Register.jsx';
import Login from '../components/Login.jsx';
import ForgotPassword from '../components/ForgotPassword.jsx';
import ResetPassword from '../components/ResetPassword.jsx';

function AuthPage() {
  return (
    <Routes>
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
}

export default AuthPage;
