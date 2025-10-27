"use client"

import "./Docs.css"

const Docs = ({ onNavigateHome }) => {
  return (
    <div className="docs-page">
      {/* Top Navigation */}
      <nav className="docs-nav">
        <div className="nav-brand">
          <div className="logo-icon">
            <div className="cube-outer">
              <div className="cube-inner"></div>
            </div>
          </div>
          <span className="brand-text">openapi-mcp</span>
        </div>
        <div className="nav-links">
          <a href="/" className="nav-link">
            Home
          </a>
          <span className="active">Documentation</span>
          <a href="/examples" className="nav-link">
            Examples
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="nav-link">
            GitHub
          </a>
        </div>
      </nav>

      <div className="docs-container">
        {/* Main Content - Introduction Only */}
        <main className="docs-main-full">
          <div className="docs-content">
            <h1>openapi-mcp Documentation</h1>
            <p className="intro-text">
              Welcome to the official documentation for openapi-mcp, a tool that transforms any OpenAPI 3.x
              specification into a powerful, AI-friendly MCP (Model Context Protocol) tool server.
            </p>

            <h2>What is openapi-mcp?</h2>
            <p>
              openapi-mcp is a tool that loads and validates OpenAPI specifications (YAML or JSON), generates MCP tools
              for each operation, and starts an MCP stdio or HTTP server. This enables AI agents and automation to
              interact with any API defined by an OpenAPI spec.
            </p>
            <p>
              In essence, it bridges the gap between API definitions and AI tools, making any API accessible to AI
              agents, LLMs, and automation tools with consistent, structured output.
            </p>

            <h2>Key Features</h2>
            <ul className="features-list">
              <li>
                <strong>Instant API to MCP Conversion:</strong> Parses any OpenAPI 3.x YAML/JSON spec and generates MCP
                tools automatically.
              </li>
              <li>
                <strong>Multiple Transport Options:</strong> Supports stdio (default) and HTTP server modes
                (StreamableHTTP is default for HTTP, SSE also available).
              </li>
              <li>
                <strong>Complete Parameter Support:</strong> Path, query, header, cookie, and body parameters.
              </li>
              <li>
                <strong>Security Headers:</strong> Automatically handles authentication tokens and API keys.
              </li>
              <li>
                <strong>Error Handling:</strong> Comprehensive error messages and validation.
              </li>
              <li>
                <strong>AI-Optimized:</strong> Designed for seamless integration with AI assistants.
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Docs;
