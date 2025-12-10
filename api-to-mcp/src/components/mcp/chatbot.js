import React, { useState, useEffect, useRef } from 'react';
import { fetchTools, executeTool } from './services/api'; // API backend của bạn
import { callGeminiAPI } from './services/geminiService'; // Hàm fetch ở trên
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Hỗ trợ GitHub Flavored Markdown (danh sách, bảng, task list, v.v.)

const Chatbot = () => {
  const [messages, setMessages] = useState([]); // Để hiển thị UI
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Ref lưu tools và lịch sử chat chuẩn format Google để gửi đi
  const toolsRef = useRef([]);
  const chatHistoryRef = useRef([]); 

  // 1. Load tools lúc đầu
  useEffect(() => {
    const init = async () => {
      const myTools = await fetchTools();
      toolsRef.current = myTools;
      console.log("Tools loaded:", myTools.length);
    };
    init();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    setLoading(true);

    // 1. Cập nhật UI và History
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    
    // Thêm tin nhắn user vào lịch sử gửi đi
    chatHistoryRef.current.push({
      role: "user",
      parts: [{ text: userText }]
    });

    try {
      await processGeminiLoop();
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Lỗi kết nối: " + error.message }]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý vòng lặp: Gọi Gemini -> Kiểm tra Tool -> Gọi lại Gemini nếu cần
  const processGeminiLoop = async () => {
    // Gọi API fetch
    const data = await callGeminiAPI(chatHistoryRef.current, toolsRef.current);
    
    // Lấy candidate đầu tiên
    const candidate = data.candidates?.[0];
    const content = candidate?.content; // { role: "model", parts: [...] }
    
    if (!content) throw new Error("No content in response");

    // Thêm câu trả lời của Model vào lịch sử ngay lập tức (để giữ context)
    chatHistoryRef.current.push(content);

    // Kiểm tra xem trong parts có functionCall không
    const functionCalls = content.parts.filter(part => part.functionCall);

    if (functionCalls.length > 0) {
      // --- TRƯỜNG HỢP GỌI TOOL ---
      console.log("Gemini yêu cầu gọi tools:", functionCalls);
      
      // Tạo mảng chứa kết quả để gửi lại
      const functionResponses = [];

      // Xử lý từng tool (chạy song song)
      await Promise.all(functionCalls.map(async (part) => {
        const call = part.functionCall;
        const toolName = call.name;
        const args = call.args; // Google đã parse sẵn thành object

        // Gọi Backend của bạn
        const apiResult = await executeTool(toolName, args);

        // Đóng gói kết quả chuẩn format REST API
        functionResponses.push({
          functionResponse: {
            name: toolName,
            response: { content: apiResult } // Kết quả phải bọc trong object
          }
        });
      }));

      // Thêm kết quả tool vào lịch sử
      chatHistoryRef.current.push({
        role: "function", // Lưu ý: REST API dùng role 'function', SDK dùng 'tool' (hơi khác nhau tùy version, nhưng 'function' chuẩn cho REST v1beta)
        parts: functionResponses
      });

      // Gọi lại Gemini đệ quy để nó tổng hợp kết quả
      await processGeminiLoop(); 

    } else {
      // --- TRƯỜNG HỢP TRẢ LỜI TEXT ---
      const textPart = content.parts.find(p => p.text);
      if (textPart) {
        setMessages(prev => [...prev, { role: 'model', content: textPart.text }]);
      }
    }
  };

  // --- UI RENDER (Giữ nguyên) ---
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '10px' }}>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
        <div key={index} style={{ 
            textAlign: msg.role === 'user' ? 'right' : 'left', 
            marginBottom: '10px' 
        }}>
            <div style={{ 
                background: msg.role === 'user' ? '#007bff' : '#f1f1f1',
                color: msg.role === 'user' ? 'white' : 'black',
                padding: '10px 15px', 
                borderRadius: '15px', 
                display: 'inline-block', 
                maxWidth: '85%',
                textAlign: 'left', // Nội dung bên trong luôn căn trái cho dễ đọc
                wordWrap: 'break-word'
            }}>
                {/* THAY ĐỔI Ở ĐÂY: Dùng ReactMarkdown */}
                {msg.role === 'model' ? (
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            // Custom style cho các thẻ HTML bên trong markdown
                            ul: ({node, ...props}) => <ul style={{paddingLeft: '20px', margin: '5px 0'}} {...props} />,
                            ol: ({node, ...props}) => <ol style={{paddingLeft: '20px', margin: '5px 0'}} {...props} />,
                            li: ({node, ...props}) => <li style={{marginBottom: '5px'}} {...props} />,
                            p: ({node, ...props}) => <p style={{margin: '0 0 10px 0'}} {...props} />,
                            code: ({node, inline, className, children, ...props}) => {
                                return (
                                    <code style={{
                                        backgroundColor: 'rgba(0,0,0,0.1)',
                                        padding: '2px 4px',
                                        borderRadius: '4px',
                                        fontFamily: 'monospace',
                                        fontSize: '0.9em'
                                    }} {...props}>
                                        {children}
                                    </code>
                                )
                            }
                        }}
                    >
                        {msg.content}
                    </ReactMarkdown>
                ) : (
                    // Tin nhắn của user thì giữ nguyên text thường
                    msg.content
                )}
            </div>
        </div>
    ))}
        {loading && <div style={{color: '#888'}}>Gemini đang xử lý...</div>}
      </div>
      
      <div style={{ display: 'flex', borderTop: '1px solid #eee', paddingTop: '10px' }}>
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{ flex: 1, padding: '8px' }} placeholder="Nhập tin nhắn..." 
        />
        <button onClick={handleSend} style={{ marginLeft: '5px', padding: '8px 12px' }}>Gửi</button>
      </div>
    </div>
  );
};

export default Chatbot;