import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Đảm bảo bạn đã npm install axios

// --- CẤU HÌNH DOMAIN API CỦA BẠN ---
const API_DOMAIN = process.env.REACT_APP_API_DOMAIN 

const ToolsPage = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const token = localStorage.getItem('JWTtoken');
        
        if (!token) {
          throw new Error("Không tìm thấy JWT Token. Vui lòng đăng nhập.");
        }

        const response = await axios.get(`${API_DOMAIN}/api/tools`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setTools(response.data.data.tools);
        } else {
          throw new Error("API trả về lỗi success: false");
        }
      } catch (err) {
        console.error("Error fetching tools:", err);
        setError(err.response?.data?.message || err.message || "Lỗi kết nối server");
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  if (loading) return <div style={styles.centerBox}>Wait a moment... Loading tools...</div>;
  if (error) return <div style={{...styles.centerBox, color: 'red'}}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>MCP TOOLS LIST</h1>
        <p style={styles.subtitle}>Find <strong>{tools.length}</strong> tools in system.</p>
      </header>

      <div style={styles.grid}>
        {tools.map((tool, index) => (
          <ToolCard key={index} tool={tool} />
        ))}
      </div>
    </div>
  );
};

// --- COMPONENT CON: THẺ TOOL (CARD) ---
const ToolCard = ({ tool }) => {
  const properties = tool.input_schema?.properties || {};
  const requiredFields = tool.input_schema?.required || [];

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.toolName} title={tool.name}>{tool.name}</h3>
        <span style={styles.badge}>Function</span>
      </div>
      
      <p style={styles.description}>{tool.description || "Không có mô tả"}</p>

      <div style={styles.schemaContainer}>
        <h4 style={styles.schemaTitle}>Inputs argument:</h4>
        {Object.keys(properties).length === 0 ? (
          <p style={{fontStyle: 'italic', color: '#666', fontSize: '13px'}}>argument not required</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Desc</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(properties).map(([key, value]) => (
                <tr key={key}>
                  <td style={styles.td}>
                    <span style={styles.paramName}>{key}</span>
                    {requiredFields.includes(key) && <span style={styles.requiredStar}>*</span>}
                  </td>
                  <td style={styles.td}>
                    <code style={styles.code}>{value.type}</code>
                  </td>
                  <td style={styles.td} title={value.description}>
                    {value.description ? (
                        value.description.length > 20 
                        ? value.description.substring(0, 20) + '...' 
                        : value.description
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// --- STYLES (CSS-in-JS) ---
// Bạn có thể thay thế bằng file .css riêng hoặc Tailwind
const styles = {
  container: {
    padding: '40px',
    backgroundColor: '#f4f7f6',
    minHeight: '100vh',
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center',
  },
  title: {
    color: '#2c3e50',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: '16px',
  },
  centerBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#555',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', // Responsive Grid
    gap: '25px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  toolName: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '700',
    color: '#3498db',
    wordBreak: 'break-word', // Tránh tên hàm quá dài làm vỡ layout
    maxWidth: '75%',
  },
  badge: {
    backgroundColor: '#eaf2f8',
    color: '#3498db',
    fontSize: '10px',
    padding: '4px 8px',
    borderRadius: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  description: {
    color: '#555',
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '20px',
    flexGrow: 1, // Đẩy phần schema xuống đáy nếu description ngắn
  },
  schemaContainer: {
    backgroundColor: '#fafafa',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #f0f0f0',
  },
  schemaTitle: {
    margin: '0 0 10px 0',
    fontSize: '12px',
    textTransform: 'uppercase',
    color: '#95a5a6',
    letterSpacing: '0.5px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  th: {
    textAlign: 'left',
    padding: '5px',
    color: '#95a5a6',
    fontWeight: '600',
    borderBottom: '1px solid #eee',
    fontSize: '11px',
  },
  td: {
    padding: '6px 5px',
    borderBottom: '1px solid #f9f9f9',
    verticalAlign: 'middle',
  },
  paramName: {
    fontWeight: '600',
    color: '#34495e',
  },
  requiredStar: {
    color: 'red',
    marginLeft: '3px',
    fontWeight: 'bold',
  },
  code: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: '2px 4px',
    borderRadius: '4px',
    color: '#e74c3c',
    fontFamily: 'monospace',
    fontSize: '11px',
  },
};

export default ToolsPage;