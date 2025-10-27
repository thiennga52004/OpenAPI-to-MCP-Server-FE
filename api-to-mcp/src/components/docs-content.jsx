"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import "./DocsContent.css"

export default function DocsContent() {
  const [copiedCode, setCopiedCode] = useState(null)

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const codeSnippet1 = `{
  "mcpServers": {
    "VN-API": {
      "command": "path to your exe file"
    }
  }
}`

  const codeSnippet2 = `{
  "mcpServers": {
    "VN-API": {
      "command": "C:\\\\Tools\\\\VN-API.exe"
    }
  }
}`

  return (
    <div className="docs-container">
      {/* Overview */}
      <section id="overview" className="docs-section">
        <h1 className="docs-title">openapi-mcp Documentation</h1>
        <p className="docs-paragraph">
          Welcome to the official documentation for <strong>openapi-mcp</strong>, a tool that transforms any OpenAPI 3.x
          specification into a powerful, AI-friendly MCP (Model Context Protocol) tool server.
        </p>
      </section>

      {/* What is */}
      <section id="what-is" className="docs-section">
        <h2 className="docs-subtitle">What is openapi-mcp?</h2>
        <p className="docs-paragraph">
          <strong>openapi-mcp</strong> is a tool that loads and validates OpenAPI specifications (YAML or JSON),
          generates MCP tools for each operation, and starts an MCP stdio or HTTP server. This enables AI agents and
          automation to interact with any API defined by an OpenAPI spec.
        </p>
        <p className="docs-paragraph">
          In essence, it bridges the gap between API definitions and AI tools, making any API accessible to AI agents,
          LLMs, and automation tools with consistent, structured output.
        </p>
      </section>

      {/* Features */}
      <section id="features" className="docs-section">
        <h2 className="docs-subtitle">Key Features</h2>
        <div className="feature-grid">
          {[
            { title: "Instant API to MCP Conversion", desc: "Parses any OpenAPI 3.x YAML/JSON spec and generates MCP tools automatically." },
            { title: "Multiple Transport Options", desc: "Supports stdio (default) and HTTP server modes (StreamableHTTP is default for HTTP, SSE also available)." },
            { title: "Complete Parameter Support", desc: "Path, query, header, cookie, and body parameters." },
            { title: "Security Headers", desc: "Automatically handles authentication tokens and API keys." },
            { title: "Error Handling", desc: "Comprehensive error messages and validation." },
            { title: "AI-Optimized", desc: "Designed for seamless integration with AI assistants." },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Setup */}
      <section id="claude-setup" className="docs-section">
        <h2 className="docs-subtitle">Setup for Claude Desktop (Windows)</h2>
        <p className="docs-paragraph">
          To integrate your generated MCP executable with <strong>Claude Desktop</strong> on Windows, follow these steps:
        </p>
        <ol className="setup-steps">
          {[
            "Upload your OpenAPI document (YAML or JSON) using the web interface.",
            'Click "Get Execution File from OpenAPI doc" to generate your executable file.',
            "Download the generated execution file to a known directory (e.g., C:\\Tools\\VN-API.exe).",
            "Press Windows + R, type %APPDATA%, and press Enter.",
            "Navigate to the claude folder (create it if it doesn’t exist).",
            "Create a new file named claude_desktop_config.json.",
            "Add the following configuration content:",
          ].map((step, idx) => (
            <li key={idx}>
              <span className="step-number">{idx + 1}</span> {step}
            </li>
          ))}
        </ol>
      </section>

      {/* Config examples */}
      <section id="configuration" className="docs-section">
        <h3 className="docs-subsubtitle">Configuration Example</h3>
        <p className="docs-paragraph">Basic configuration:</p>
        <CodeBlock code={codeSnippet1} id="config1" onCopy={copyToClipboard} copied={copiedCode === "config1"} />
        <p className="docs-paragraph">Windows path example:</p>
        <CodeBlock code={codeSnippet2} id="config2" onCopy={copyToClipboard} copied={copiedCode === "config2"} />
        <div className="note-box">
          <p>
            Save the file and restart <strong>Claude Desktop</strong>. Your MCP server will now appear as a connected
            tool within Claude, allowing direct interaction with your API.
          </p>
        </div>
      </section>

      <footer className="docs-footer">
        <p>Need help? Check the GitHub repository or open an issue for support.</p>
      </footer>
    </div>
  )
}

function CodeBlock({ code, id, onCopy, copied }) {
  return (
    <div className="code-block">
      <button className="copy-button" onClick={() => onCopy(code, id)} title="Copy code">
        {copied ? <Check size={16} color="green" /> : <Copy size={16} />}
      </button>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}
