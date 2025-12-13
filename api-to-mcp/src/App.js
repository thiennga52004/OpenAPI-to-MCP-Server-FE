import React, { useState, useEffect } from "react";
// 1. Import axios
import axios from "axios";
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

const API_BASE_URL = process.env.REACT_APP_API_DOMAIN;

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
  const isAuthenticated = !!token;

  // --- Handler Functions ---
  const handleLogout = () => {
    console.log("Token hết hạn hoặc không hợp lệ. Đang đăng xuất...");
    localStorage.removeItem("JWTtoken");
    setToken(null);
    navigate("/");
  };

  const handleLogin = (userData) => {
    setToken(localStorage.getItem("JWTtoken"));
    navigate("/dashboard");
  };

  const handleSignup = () => {
    navigate("/login", {
      state: { message: "Sign up successful! Please log in." },
    });
  };

  const handleSuccessContinue = () => {
    navigate("/dashboard");
  };

  // --- 2. Logic dùng API Tools để kiểm tra Token ---
  useEffect(() => {
    const checkAuthWithTools = async () => {
      const currentToken = localStorage.getItem("JWTtoken");

      // Nếu không có token thì thôi, không cần check
      if (!currentToken) return;

      try {
        // Gọi API tools như một cách để "Ping" kiểm tra quyền truy cập
        await axios.get(`${API_BASE_URL}/api/tools`, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });

        // Nếu chạy xuống đây nghĩa là API trả về 200 OK -> Token VẪN CÒN SỐNG.
        // Ta không cần làm gì cả (vì AppRoutes không cần hiển thị tools).
        console.log("Token verified via Tools API.");
      } catch (err) {
        console.error("Error validating token:", err);

        // Quan trọng: Kiểm tra xem lỗi có phải do Token hết hạn/sai không (401 hoặc 403)
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          // Nếu đúng là lỗi xác thực -> Gọi hàm Logout ngay
          handleLogout();
        }
        // Các lỗi khác (500, mạng...) có thể bỏ qua ở đây, để Dashboard tự xử lý
      }
    };

    checkAuthWithTools();

    // (Tùy chọn) Check lại mỗi khi chuyển trang hoặc định kỳ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Chạy lại mỗi khi token thay đổi

  // --- Route Protection ---
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/" replace />;
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

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard token={token} onLogout={handleLogout} />
          </PrivateRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Chatbot />
          </PrivateRoute>
        }
      />

      <Route path="/docs" element={<Docs />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
