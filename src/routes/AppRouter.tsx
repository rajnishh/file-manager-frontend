import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegistrationPage from '../pages/RegistrationPage';
import FileUploadPage from '../pages/FileUploadPage';
import ProtectedRoute from './ProtectedRoutes';
import { isTokenValid } from '../utils/auth'; // Import the token check function

const AppRouter: React.FC = () => {
  const defaultRoute = isTokenValid() ? '/upload' : '/login';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={defaultRoute} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        
        {/* Protect the /upload route */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <FileUploadPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
