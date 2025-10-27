import { useState, useEffect, useRef, use } from "react"
import "../Dashboard.css"
import ErrorPage from "../ErrorPage"

const API_BASE_URL = process.env.REACT_APP_API_DOMAIN || "https://your-domain.com"

export default function ApiSpecsTab() {
  const [specs, setSpecs] = useState([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)
  const [error, setError] = useState(null)

  // 🔑 API key — giả sử lưu trong localStorage sau khi login
  //const apiKey = localStorage.getItem("X-API-KEY")
    // for test REPLACE THIS WHEN DEPLOYING
  const apiKey = "6ba0891cf77e90eb93b42c597d6cb1f448f8321aa2e4230b3c91fe09763635e6"
  // 📦 Gọi API specs khi load
  useEffect(() => {
    fetchSpecs()
  }, [])

  const fetchSpecs = async () => {
    setError(null)
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE_URL}/api/specs`, {
        headers: {
          "X-API-Key": apiKey,
        },
      })
      if (!res.ok) {
        return setError({
          code: res.status,
          message: `Server returned status ${res.status}`,
        });
      }
      const data = await res.json()
      if (data.success && data.data?.specs) {
        setSpecs(data.data.specs)
      } else {
        console.error("Failed to fetch specs", data)
      }
    } catch (err) {
         setError({
        code: "NETWORK_ERROR",
        message: err.message,
      });
      console.error("Error fetching specs:", err)
    } finally {
      setLoading(false)
    }
  }

  // 📤 Xử lý upload file
  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      setLoading(true)
      const res = await fetch(`${API_BASE_URL}/api/spec`, {
        method: "POST",
        headers: {
          Authorization: `X-API-KEY ${apiKey}`,
        },
        body: formData,
      })

      const data = await res.json()
      if (data.success) {
        alert("Upload thành công!")
        fetchSpecs() // reload lại danh sách
      } else {
        alert("Upload thất bại!")
        console.error(data)
      }
    } catch (err) {
      console.error("Error uploading spec:", err)
    } finally {
      setLoading(false)
      e.target.value = "" // reset input file
    }
  }

  // ⚙️ Build exe cho từng spec
  const handleBuild = async (specId) => {
  setError(null);

  try {
    setLoading(true);

    const res = await fetch(`${API_BASE_URL}/api/build`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({ spec_id: specId }),
    });

    // Nếu HTTP status không phải 2xx → lỗi
    if (!res.ok) {
      throw new Error(`HTTP_ERROR_${res.status}`);
    }

    const data = await res.json();

    // Kiểm tra success và đường dẫn file
    if (data.success && data.data?.executable_path) {
      const fileUrl = data.data.executable_path;

      // Tạo link tải file tự động
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = ""; // backend sẽ cung cấp filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Trường hợp success=false hoặc thiếu file path
      setError({
        code: "BUILD_FAILED",
        message: data.message || "Failed to build executable file.",
        detail: data.data || "No executable path returned.",
      });
      console.error("Build response error:", data);
    }
  } catch (err) {
    // Bắt lỗi network hoặc parse JSON
    setError({
      code: "NETWORK_ERROR",
      message: err.message || "Unable to reach the server.",
      detail: "Please check your connection or API key.",
    });
    console.error("Error building exe:", err);
  } finally {
    setLoading(false);
  }
};


   if (error) {
    return <ErrorPage code={error.code} message={error.message} />;
  }

  return (
    <div className="api-specs">
      <div className="section-header">
        <h2>API Specifications</h2>
        <button className="btn-primary" onClick={handleUploadClick} disabled={loading}>
          {loading ? "Processing..." : "Upload New Spec"}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept=".json,.yaml,.yml"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      <div className="specs-list">
        {loading && specs.length === 0 ? (
          <p>Loading...</p>
        ) : specs.length > 0 ? (
          specs.map((spec) => (
            <div key={spec.id} className="spec-item">
              <div className="spec-info">
                <h3>{spec.spec_name}</h3>
                <p>ID: {spec.id}</p>
              </div>
              <div className="spec-actions">
                <button
                  className="btn-secondary"
                  onClick={() => handleBuild(spec.id)}
                  disabled={loading}
                >
                  Build EXE
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No API specs uploaded yet.</p>
        )}
      </div>
    </div>
  )
}
