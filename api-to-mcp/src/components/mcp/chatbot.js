import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import { fetchTools, executeTool } from "./services/api";
import { callGeminiAPI } from "./services/geminiService";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// MUI Imports
import {
  Box,
  TextField,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Container,
} from "@mui/material";
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

const Chatbot = () => {
  const navigate = useNavigate(); 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null); 

  const toolsRef = useRef([]);
  const chatHistoryRef = useRef([]);

  // 1. Kiểm tra Auth & Load Tools
  useEffect(() => {
    // --- THÊM LOGIC XÁC MINH Ở ĐÂY ---
    const token = localStorage.getItem("JWTtoken");

    if (!token) {
      console.warn("No token found, redirecting to login...");
      navigate("/login"); // Chuyển hướng nếu không có token
      return; // Dừng lại, không chạy tiếp logic load tools
    }
    // ---------------------------------

    const init = async () => {
      try {
        // Mẹo: Bạn có thể cần truyền token vào hàm fetchTools nếu API yêu cầu
        // const myTools = await fetchTools(token); 
        const myTools = await fetchTools();
        toolsRef.current = myTools;
        console.log("Tools loaded:", myTools.length);
      } catch (e) {
        console.error("Lỗi load tools", e);
        // Nếu API trả về lỗi 401 (Unauthorized) khi load tools, cũng nên đá về login
        if (e.message && e.message.includes("401")) {
             localStorage.removeItem("JWTtoken"); // Xóa token cũ
             navigate("/login");
        }
      }
    };
    init();
  }, [navigate]); // Thêm navigate vào dependency

  // Auto-scroll khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: userText }]);

    chatHistoryRef.current.push({
      role: "user",
      parts: [{ text: userText }],
    });

    try {
      await processGeminiLoop();
    } catch (error) {
      // Xử lý lỗi Token hết hạn trong quá trình chat
      if (error.message && error.message.includes("401")) {
         setMessages((prev) => [
            ...prev,
            { role: "model", content: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại." },
          ]);
         setTimeout(() => {
             localStorage.removeItem("JWTtoken");
             navigate("/login");
         }, 2000);
      } else {
          setMessages((prev) => [
            ...prev,
            { role: "model", content: "⚠️ Lỗi kết nối: " + error.message },
          ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const processGeminiLoop = async () => {
    // Gọi API fetch (Lưu ý: Bạn cần sửa callGeminiAPI để lấy token từ localStorage và gắn vào Header)
    const data = await callGeminiAPI(chatHistoryRef.current, toolsRef.current);
    const candidate = data.candidates?.[0];
    const content = candidate?.content;

    if (!content) throw new Error("No content in response");

    chatHistoryRef.current.push(content);
    const functionCalls = content.parts.filter((part) => part.functionCall);

    if (functionCalls.length > 0) {
      console.log("Gemini yêu cầu gọi tools:", functionCalls);
      const functionResponses = [];

      await Promise.all(
        functionCalls.map(async (part) => {
          const call = part.functionCall;
          const toolName = call.name;
          const args = call.args;
          const apiResult = await executeTool(toolName, args);

          functionResponses.push({
            functionResponse: {
              name: toolName,
              response: { content: apiResult },
            },
          });
        })
      );

      chatHistoryRef.current.push({
        role: "function",
        parts: functionResponses,
      });

      await processGeminiLoop();
    } else {
      const textPart = content.parts.find((p) => p.text);
      if (textPart) {
        setMessages((prev) => [
          ...prev,
          { role: "model", content: textPart.text },
        ]);
      }
    }
  };

  // --- CẤU HÌNH RENDER MARKDOWN ---
  const MarkdownComponents = {
    ul: ({ node, ...props }) => (
      <ul style={{ paddingLeft: "20px", margin: "5px 0" }} {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol style={{ paddingLeft: "20px", margin: "5px 0" }} {...props} />
    ),
    li: ({ node, ...props }) => <li style={{ marginBottom: "5px" }} {...props} />,
    p: ({ node, ...props }) => <p style={{ margin: "0 0 10px 0" }} {...props} />,
    a: ({ node, ...props }) => (
      <a style={{ color: "inherit", textDecoration: "underline" }} {...props} />
    ),
    code: ({ node, inline, className, children, ...props }) => (
      <code
        style={{
          backgroundColor: inline ? "rgba(0,0,0,0.1)" : "#2d2d2d",
          color: inline ? "inherit" : "#f8f8f2",
          padding: "2px 4px",
          borderRadius: "4px",
          fontFamily: "monospace",
          fontSize: "0.9em",
          display: inline ? "inline" : "block",
          overflowX: "auto",
          margin: inline ? "0" : "10px 0",
          padding: inline ? "2px 4px" : "10px",
        }}
        {...props}
      >
        {children}
      </code>
    ),
  };

  // --- GIAO DIỆN CHÍNH (MUI) ---
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#f5f7fa", 
      }}
    >
      {/* 1. HEADER */}
      <AppBar
        position="static"
        color="inherit" 
        elevation={1}
        sx={{ bgcolor: "white", borderBottom: "1px solid #e0e0e0" }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => navigate("/dashboard")}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            AI Assistant
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 2. MESSAGE LIST AREA */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              {!isUser && (
                <Avatar sx={{ bgcolor: "#1976d2", width: 32, height: 32 }}>
                  <BotIcon fontSize="small" />
                </Avatar>
              )}

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  maxWidth: "75%",
                  borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                  bgcolor: isUser ? "#1976d2" : "#ffffff", 
                  color: isUser ? "#fff" : "#1a1a1a",
                  boxShadow: isUser ? "none" : "0px 2px 4px rgba(0,0,0,0.05)",
                  wordWrap: "break-word",
                }}
              >
                {msg.role === "model" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={MarkdownComponents}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <Typography variant="body1">{msg.content}</Typography>
                )}
              </Paper>

              {isUser && (
                <Avatar sx={{ bgcolor: "#e0e0e0", width: 32, height: 32 }}>
                  <PersonIcon sx={{ color: "#757575" }} fontSize="small" />
                </Avatar>
              )}
            </Box>
          );
        })}

        {loading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 5 }}>
            <CircularProgress size={20} color="inherit" sx={{ color: "#888" }} />
            <Typography variant="caption" color="text.secondary">
              Đang suy nghĩ...
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* 3. INPUT AREA */}
      <Box
        sx={{
          p: 2,
          bgcolor: "white",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Container maxWidth="lg" disableGutters>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "#f0f2f5",
              borderRadius: "24px",
              px: 2,
              py: 0.5,
            }}
          >
            <TextField
              fullWidth
              placeholder="Nhập tin nhắn..."
              variant="standard"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
              InputProps={{
                disableUnderline: true,
                sx: { py: 1 },
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!input.trim() || loading}
              sx={{
                bgcolor: input.trim() ? "#1976d2" : "transparent",
                color: input.trim() ? "white" : "inherit",
                "&:hover": {
                  bgcolor: input.trim() ? "#1565c0" : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Chatbot;