import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import HomePage from "./components/HomePage";
import { Login, Signup, SuccessScreen } from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Docs from "./components/Docs";
import Chatbot from "./components/mcp/chatbot";
import "./App.css";

// Wrapper để dùng hook navigate trong App
function App() {
  const [token, setToken] = useState(localStorage.getItem("JWTtoken"));

  return (
    <Router>
      <AppRoutes token={token} setToken={setToken} />
    </Router>
  );
}

function AppRoutes({ token, setToken }) {
  const navigate = useNavigate();
  // Kiểm tra token có tồn tại không để xác định trạng thái đăng nhập
  const isAuthenticated = !!token;

  // --- Handler Functions ---
  const handleLogin = (userData) => {
    setToken(localStorage.getItem("JWTtoken"));
    navigate("/dashboard");
  };

  const handleSignup = (userData) => {
    setToken(localStorage.getItem("JWTtoken"));
    navigate("/success");
  };

  const handleSuccessContinue = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("JWTtoken");
    setToken(null);
    navigate("/");
  };

  // --- Route Protection (PrivateRoute) ---
  // Component này sẽ kiểm tra auth, nếu không có token sẽ đẩy về trang chủ (hoặc login)
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/" replace />;
    // Mẹo: Nên đẩy về /login thay vì / để trải nghiệm tốt hơn
  };

  return (
    <Routes>
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

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login
              onLogin={handleLogin}
              onSwitchToSignup={() => navigate("/signup")}
            />
          )
        }
      />

      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Signup
              onSignup={handleSignup}
              onSwitchToLogin={() => navigate("/login")}
            />
          )
        }
      />

      <Route
        path="/success"
        element={<SuccessScreen onContinue={handleSuccessContinue} />}
      />

      {/* --- CÁC ROUTE CẦN BẢO VỆ --- */}

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard token={token} onLogout={handleLogout} />
          </PrivateRoute>
        }
      />

      {/* Đã thêm bảo vệ cho /chat */}
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Chatbot />
          </PrivateRoute>
        }
      />

      <Route path="/docs" element={<Docs />} />

      {/* Route * (404) luôn để cuối cùng */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
