import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import UserService from './components/service/UserService';
import ProfilePage from './components/userspage/ProfilePage';
import BooksPage from './components/userspage/BooksPage';
import UserManagement from './components/userspage/UserManagement';
import Navbar from './components/common/Navbar';

function MainApp({ isAuthenticated, isAdmin, onLogin, onLogout }) {
  const location = useLocation();
  const hideNavbarOnPaths = ['/login', '/'];
  const isHiddenPath = hideNavbarOnPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!isHiddenPath && (
        <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={onLogout} />
      )}
      <div className="flex-grow">
        <Routes>
          <Route exact path="/" element={<LoginPage onLogin={onLogin} />} />
          <Route exact path="/login" element={<LoginPage onLogin={onLogin} />} />
          <Route path="/books" element={isAuthenticated ? <BooksPage isAdmin={isAdmin} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage onLogout={onLogout} /> : <Navigate to="/login" />} />
          {isAdmin && (
            <>
              <Route path="/user-management" element={<UserManagement />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(UserService.isAuthenticated());
  const [isAdmin, setIsAdmin] = useState(UserService.isAdmin());

  useEffect(() => {
    setIsAuthenticated(UserService.isAuthenticated());
    setIsAdmin(UserService.isAdmin());
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(UserService.isAuthenticated());
    setIsAdmin(UserService.isAdmin());
  };

  const handleLogout = () => {
    UserService.logout();
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <BrowserRouter>
      <MainApp
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </BrowserRouter>
  );
}