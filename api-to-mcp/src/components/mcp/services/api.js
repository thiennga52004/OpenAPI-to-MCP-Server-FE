// services/api.js
import axios from "axios";

const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;
// 1. Tạo instance axios
const client = axios.create({
  baseURL: API_DOMAIN,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. CẤU HÌNH INTERCEPTOR (Quan trọng)
// Hàm này sẽ chạy trước MỌI request được gửi đi
client.interceptors.request.use(
  (config) => {
    // Lấy token mới nhất từ localStorage
    // Lưu ý: Key phải khớp với key bạn dùng lúc Login (ở đây là "JWTtoken")
    const token = localStorage.getItem("JWTtoken");

    if (token) {
      // Nếu có token, gắn vào Header
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. (Tùy chọn) Xử lý khi Token hết hạn (401)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Nếu API trả về 401 Unauthorized -> Token hết hạn hoặc không hợp lệ
      console.warn("Token hết hạn hoặc không hợp lệ.");
      // Bạn có thể dispatch event để App.js biết và logout, hoặc xóa token tại đây
      // localStorage.removeItem("JWTtoken");
      // window.location.href = "/login"; // Force redirect nếu cần
    }
    return Promise.reject(error);
  }
);

// 4. Lấy danh sách tools
export const fetchTools = async () => {
  try {
    const response = await client.get("/api/tools");
    if (response.data.success) {
      return response.data.data.tools;
    }
    return [];
  } catch (error) {
    console.error("Error fetching tools:", error);
    // Ném lỗi ra để component xử lý (ví dụ: hiển thị thông báo lỗi)
    throw error;
  }
};

// 5. Thực thi tool
export const executeTool = async (toolName, args) => {
  try {
    const response = await client.post("/api/execute", {
      tool_name: toolName,
      arguments: args,
    });

    if (response.data.success) {
      return response.data.data.content[0].text;
    }
    return "Error execution failed";
  } catch (error) {
    console.error("Error executing tool:", error);
    // Trả về lỗi chi tiết để Gemini hiển thị
    return JSON.stringify(error.response?.data || error.message);
  }
};
