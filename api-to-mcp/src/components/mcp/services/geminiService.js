// services/geminiService.js

// Hàm giúp tạm dừng (sleep)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const callGeminiAPI = async (history, tools = [], retryCount = 0) => {
    const apiKey = "AIzaSyCa7_xXIGcOSFAjt_1JAYivpuxh1Sb-hrw"; // API Key của bạn
    
    // --- SỬA 1: Dùng Model ổn định thay vì bản 2.0 Experimental ---
    // gemini-1.5-flash: Nhanh, rẻ (free), quota cao, gọi tool tốt.
    const modelName = "gemini-2.5-flash"; 
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const payload = {
        contents: history,
        systemInstruction: {
    parts: [{ 
        text: `Bạn là trợ lý ảo hữu ích hỗ trợ developer hiểu các tool trong api.
        - khi 1 người dùng muốn dùng 1 tool nào đó mà không nói rõ tham số, hãy hỏi lại họ để lấy tham số.
        - hỏi người dùng có cần hiểu rõ từng tham số, body, response của tool không, nếu có thì trả về theo đúng dạng json để
        - nếu không rõ tham số, đừng đoán mò mà hãy hỏi lại người dùng. 
        - Khi liệt kê danh sách, HÃY sử dụng Markdown bullet points (-) hoặc số thứ tự (1.).
        - Khi nhắc đến tên kỹ thuật (như tên hàm API, mã code), hãy để trong dấu backtick (\`).
        - Trình bày câu trả lời ngắn gọn, rõ ràng, thoáng mắt.
        - Nếu dữ liệu có cấu trúc so sánh, hãy dùng Markdown Table.` 
    }]
}
    };

    if (tools.length > 0) {
        payload.tools = [{
            function_declarations: tools.map(tool => ({
                name: tool.name,
                description: tool.description,
                parameters: tool.input_schema
            }))
        }];
        // Force model tự động chọn tool
        payload.tool_config = { function_calling_config: { mode: "AUTO" } };
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // --- SỬA 2: Xử lý lỗi 429 (Quá tải) ---
        if (response.status === 429) {
            if (retryCount < 3) { // Thử lại tối đa 3 lần
                console.warn(`Gặp lỗi 429 (Quá tải). Đang chờ 5s để thử lại lần ${retryCount + 1}...`);
                await delay(5000); // Chờ 5 giây
                return callGeminiAPI(history, tools, retryCount + 1); // Gọi đệ quy lại
            } else {
                throw new Error("Server Google quá tải, vui lòng thử lại sau.");
            }
        }

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Gemini Fetch Error:", error);
        throw error;
    }
};