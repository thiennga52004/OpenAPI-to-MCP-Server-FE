import React, { useState, useEffect, useRef } from "react";
import "../Dashboard.css";
import ErrorPage from "../ErrorPage";
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL = process.env.REACT_APP_API_DOMAIN;

export default function ApiSpecsTab() {
  const [specs, setSpecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);

  const jwtToken = localStorage.getItem("JWTtoken");

  useEffect(() => {
    fetchSpecs();
  }, []);

  const fetchSpecs = async () => {
    setError(null);
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/specs`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (!res.ok) {
        return setError({
          code: res.status,
          message: `Server returned status ${res.status}`,
        });
      }
      const data = await res.json();
      if (data.success && data.data?.specs) {
        setSpecs(data.data.specs);
      } else {
        console.error("Failed to fetch specs", data);
      }
    } catch (err) {
      setError({
        code: "NETWORK_ERROR",
        message: err.message,
      });
      console.error("Error fetching specs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("Uploading...");

    setLoading(true);
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Upload Success!", { id: toastId });
        fetchSpecs();
      } else {
        toast.error("Upload Failed: " + (data.message || "Server error"), {
          id: toastId,
        });
        console.error(data);
      }
    } catch (err) {
      console.error("Error uploading spec:", err);
      toast.error("Network Error", { id: toastId });
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const handleBuild = async (specId) => {
    setError(null);
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/build`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ spec_id: specId }),
      });

      if (!res.ok) throw new Error(`HTTP_ERROR_${res.status}`);

      const data = await res.json();

      if (data.success && data.data?.executable_path) {
        const fileUrl = data.data.executable_path;
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setError({
          code: "BUILD_FAILED",
          message: data.message || "Failed to build executable file.",
          detail: data.data || "No executable path returned.",
        });
      }
    } catch (err) {
      setError({
        code: "NETWORK_ERROR",
        message: err.message || "Unable to reach the server.",
        detail: "Please check your connection or API key.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (specId) => {
    // Xác nhận trước khi xoá
    if (!window.confirm("Are you sure you want to delete this API Spec?"))
      return;

    const toastId = toast.loading("Deleting spec...");

    try {
      const res = await fetch(`${API_BASE_URL}/api/specs/${specId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success("Deleted successfully", { id: toastId });
        setSpecs((prevSpecs) => prevSpecs.filter((spec) => spec.id !== specId));
      } else {
        toast.error(data.message || "Failed to delete", { id: toastId });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Network error while deleting", { id: toastId });
    }
  };

  if (error) {
    return <ErrorPage code={error.code} message={error.message} />;
  }

  return (
    <div className="api-specs">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="section-header">
        <h2>API Specifications</h2>
        <button
          className="btn-primary"
          onClick={handleUploadClick}
          disabled={loading}
        >
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

                {/* 3. Nút xoá với ClearIcon */}
                <button
                  className="btn-icon-delete"
                  onClick={() => handleDelete(spec.id)}
                  disabled={loading}
                  title="Delete Spec"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No API specs uploaded yet.</p> 
        )}
      </div>
    </div>
  );
}
