// services/api.js
import axios from 'axios';
const API_DOMAIN = process.env.REACT_APP_API_DOMAIN
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJYLUFQSS1LRVkiOiI2YmEwODkxY2Y3N2U5MGViOTNiNDJjNTk3ZDZjYjFmNDQ4ZjgzMjFhYTJlNDIzMGIzYzkxZmUwOTc2MzYzNWU2IiwiZXhwIjoxNzY1MzQyMzg5LCJ1c2VyX2lkIjoiNGU1ZjQyYjItYWRkZS00ZTBhLTgxMjItNDI1NDBmZDliMmQ5In0.PpoVDUQkobIYP1XCWvoVhMf7SNmpw5i3QbHdKnSwRK4'; // Thay token hoặc lấy từ localStorage

const client = axios.create({
  baseURL: API_DOMAIN,
  headers: {
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// 1. Lấy danh sách tools
export const fetchTools = async () => {
  try {
    const response = await client.get('/api/tools');
    if (response.data.success) {
      return response.data.data.tools;
    }
    return [];
  } catch (error) {
    console.error("Error fetching tools:", error);
    return [];
  }
};

// 2. Thực thi tool
export const executeTool = async (toolName, args) => {
  try {
    const response = await client.post('/api/execute', {
      tool_name: toolName,
      arguments: args
    });
    
    if (response.data.success) {
      // Trả về nội dung text từ response của bạn
      return response.data.data.content[0].text; 
    }
    return "Error execution failed";
  } catch (error) {
    console.error("Error executing tool:", error);
    return JSON.stringify(error.response?.data || error.message);
  }
};