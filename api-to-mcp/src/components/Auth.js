import React, { useState } from "react";
import "./Auth.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const API_BASE_URL =
  process.env.REACT_APP_API_DOMAIN || "http://57.158.26.182:8081";
// Simple icon components to replace lucide-react
const Eye = () => <span>👁</span>;
const EyeOff = () => <span>🙈</span>;
const ArrowRight = () => <span>→</span>;

const Login = ({ onLogin, onSwitchToSignup }) => {
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // State riêng cho thông báo thành công
  const [successMessage, setSuccessMessage] = useState("");

  // Kiểm tra xem có lời nhắn từ trang Signup gửi qua không
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Xóa state trong history để F5 không hiện lại (tuỳ chọn, nhưng nên làm để clean)
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 401) {
        setError(data.error || "Invalid email or password.");
      } else if (data.success) {
        // Store the token
        localStorage.setItem("JWTtoken", data.data.JWTtoken);
        onLogin(data.data);
      } else {
        // Handle other login failures
        setError(data.message || "Login failed");
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Login error:", error);
      setError("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your API to MCP account</p>
        </div>
        {successMessage && (
          <div
            className="auth-success"
            style={{
              color: "#155724",
              backgroundColor: "#d4edda",
              borderColor: "#c3e6cb",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "15px",
              fontSize: "14px",
            }}
          >
            {successMessage}
          </div>
        )}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
            <ArrowRight />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <button onClick={onSwitchToSignup} className="auth-link">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const Signup = ({ onSignup, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Gọi API đăng ký
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          company_name: "ctu",
          plan: "free",
        }),
      });

      const data = await response.json();

      // 3. Xử lý phản hồi
      if (response.ok && data.success) {
        // Nếu thành công, gọi onSignup để App.js điều hướng về Login
        onSignup();
      } else {
        // Nếu thất bại, hiện thông báo lỗi từ backend
        alert(data.message || "Đăng ký thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Lỗi kết nối đến server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Start converting your APIs to MCP servers</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
            <ArrowRight />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <button onClick={onSwitchToLogin} className="auth-link">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const SuccessScreen = ({ user, onContinue }) => {
  return (
    <div className="auth-container">
      <div className="success-card">
        <div className="success-header">
          <div className="success-icon">🎉</div>
          <h1>Welcome to API to MCP!</h1>
          <p>Your account has been created successfully</p>
        </div>

        <div className="success-content">
          <div className="user-info">
            <h3>Account Details</h3>
            <div className="info-item">
              <span className="label">Name:</span>
              <span className="value">{user.name}</span>
            </div>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Plan:</span>
              <span className="value plan-badge">{user.plan}</span>
            </div>
          </div>

          <div className="api-key-section">
            <h3>Your API Key</h3>
            <div className="api-key-container">
              <code className="api-key">{user.apiKey}</code>
              <button className="copy-button">Copy</button>
            </div>
            <p className="api-key-note">
              Keep this API key secure. You'll use it to authenticate your MCP
              servers.
            </p>
          </div>

          <div className="usage-info">
            <h3>Usage Limits</h3>
            <div className="usage-stats">
              <div className="stat">
                <span className="stat-number">1,000</span>
                <span className="stat-label">API Calls/Month</span>
              </div>
              <div className="stat">
                <span className="stat-number">5</span>
                <span className="stat-label">Active Tools</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </div>
        </div>

        <button onClick={onContinue} className="continue-button">
          Go to Dashboard
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};

export { Login, Signup, SuccessScreen };
