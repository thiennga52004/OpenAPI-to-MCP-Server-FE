import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import { Login, Signup, SuccessScreen } from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Docs from "./components/Docs";
import "./App.css";
import Chatbot from "./components/mcp/chatbot";

// Wrapper để sử dụng hook navigate trong App
function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <AppRoutes user={user} setUser={setUser} />
    </Router>
  );
}

function AppRoutes({ user, setUser }) {
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  // --- Handler Functions ---
  const handleLogin = (userData) => {
    setUser(userData);
    navigate("/dashboard");
  };

  const handleSignup = (userData) => {
    setUser(userData);
    navigate("/success");
  };

  const handleSuccessContinue = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  // --- Route Protection (PrivateRoute) ---
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      {/* Trang chủ */}
      <Route
        path="/"
        element={
          <HomePage
            onNavigateToLogin={() => navigate("/login")}
            onNavigateToDocs={() => navigate("/docs")}
            onNavigateToHome={() => navigate("/")}
          />
        }
      />

      {/* Trang đăng nhập */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={handleLogin} onSwitchToSignup={() => navigate("/signup")} />
          )
        }
      />

      {/* Trang đăng ký */}
      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Signup onSignup={handleSignup} onSwitchToLogin={() => navigate("/login")} />
          )
        }
      />

      {/* Màn hình đăng ký thành công */}
      <Route
        path="/success"
        element={<SuccessScreen user={user} onContinue={handleSuccessContinue} />}
      />

      {/* Dashboard — cần login */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard user={user} onLogout={handleLogout} />
          </PrivateRoute>
        }
      />

      {/* Trang tài liệu */}
      <Route path="/docs" element={<Docs 
            onNavigateToLogin={() => navigate("/login")}
            onNavigateToDocs={() => navigate("/docs")}
            onNavigateToHome={() => navigate("/")} />} />

      {/* Mặc định: redirect về trang chủ */}
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/chat" element= {<Chatbot/>} />
    </Routes>
  );
}

export default App;
