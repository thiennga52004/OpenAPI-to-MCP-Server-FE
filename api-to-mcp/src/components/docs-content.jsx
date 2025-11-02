"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { Box, Typography, Container, Paper } from "@mui/material"

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
    <Box
      sx={{
        
        flex: 1,
        overflowY: "auto",
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <Container maxWidth="" sx={{ py: 6, px: { xs: 2, sm: 4 } }}>
        {/* Overview */}
        <Box component="section" id="overview" sx={{ mb: 8 }}>
          <Typography
          color="black"
            variant="h1"
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              fontWeight: 700,
              mb: 4,
              background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
              backgroundClip: "text",
              
              
              
            }}
          >
            openapi-mcp Documentation
          </Typography>
          <Typography
            sx={{
              fontSize: "1.0625rem",
              lineHeight: 1.7,
              color: "var(--foreground)",
              opacity: 0.9,
            }}
          >
            Welcome to the official documentation for{" "}
            <Box component="strong" sx={{ fontWeight: 600, color: "var(--primary)" }}>
              openapi-mcp
            </Box>
            , a tool that transforms any OpenAPI 3.x specification into a powerful, AI-friendly MCP (Model Context
            Protocol) tool server.
          </Typography>
        </Box>

        {/* What is */}
        <Box component="section" id="what-is" sx={{ mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.75rem", md: "2rem" },
              fontWeight: 700,
              mb: 3,
              color: "var(--foreground)",
            }}
          >
            What is openapi-mcp?
          </Typography>
          <Typography
            sx={{
              fontSize: "1rem",
              lineHeight: 1.7,
              mb: 3,
              color: "var(--foreground)",
              opacity: 0.85,
            }}
          >
            <Box component="strong" sx={{ fontWeight: 600, color: "var(--primary)" }}>
              openapi-mcp
            </Box>{" "}
            is a tool that loads and validates OpenAPI specifications (YAML or JSON), generates MCP tools for each
            operation, and starts an MCP stdio or HTTP server. This enables AI agents and automation to interact with
            any API defined by an OpenAPI spec.
          </Typography>
          <Typography
            sx={{
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "var(--foreground)",
              opacity: 0.85,
            }}
          >
            In essence, it bridges the gap between API definitions and AI tools, making any API accessible to AI agents,
            LLMs, and automation tools with consistent, structured output.
          </Typography>
        </Box>

        {/* Features */}
        <Box component="section" id="features" sx={{ mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.75rem", md: "2rem" },
              fontWeight: 700,
              mb: 4,
              color: "var(--foreground)",
            }}
          >
            Key Features
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 3,
            }}
          >
            {[
              {
                title: "Instant API to MCP Conversion",
                desc: "Parses any OpenAPI 3.x YAML/JSON spec and generates MCP tools automatically.",
              },
              {
                title: "Multiple Transport Options",
                desc: "Supports stdio (default) and HTTP server modes (StreamableHTTP is default for HTTP, SSE also available).",
              },
              {
                title: "Complete Parameter Support",
                desc: "Path, query, header, cookie, and body parameters.",
              },
              {
                title: "Security Headers",
                desc: "Automatically handles authentication tokens and API keys.",
              },
              {
                title: "Error Handling",
                desc: "Comprehensive error messages and validation.",
              },
              {
                title: "AI-Optimized",
                desc: "Designed for seamless integration with AI assistants.",
              },
            ].map((feature, i) => (
              <Paper
                key={i}
                sx={{
                  p: 3,
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "var(--primary)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    mb: 1.5,
                    color: "var(--primary)",
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    color: "var(--foreground)",
                    opacity: 0.75,
                  }}
                >
                  {feature.desc}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Setup */}
        <Box component="section" id="claude-setup" sx={{ mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.75rem", md: "2rem" },
              fontWeight: 700,
              mb: 3,
              color: "var(--foreground)",
            }}
          >
            Setup for Claude Desktop (Windows)
          </Typography>
          <Typography
            sx={{
              fontSize: "1rem",
              lineHeight: 1.7,
              mb: 4,
              color: "var(--foreground)",
              opacity: 0.85,
            }}
          >
            To integrate your generated MCP executable with{" "}
            <Box component="strong" sx={{ fontWeight: 600 }}>
              Claude Desktop
            </Box>{" "}
            on Windows, follow these steps:
          </Typography>
          <Box component="ol" sx={{ pl: 2, mb: 4 }}>
            {[
              "Upload your OpenAPI document (YAML or JSON) using the web interface.",
              'Click "Get Execution File from OpenAPI doc" to generate your executable file.',
              "Download the generated execution file to a known directory (e.g., C:\\Tools\\VN-API.exe).",
              "Press Windows + R, type %APPDATA%, and press Enter.",
              "Navigate to the claude folder (create it if it doesn't exist).",
              "Create a new file named claude_desktop_config.json.",
              "Add the following configuration content:",
            ].map((step, idx) => (
              <Box
                component="li"
                key={idx}
                sx={{
                  mb: 2,
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  color: "var(--foreground)",
                  opacity: 0.85,
                }}
              >
                <Box component="span" sx={{ fontWeight: 600, color: "var(--primary)", mr: 1 }}>
                  {idx + 1}.
                </Box>
                {step}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Config examples */}
        <Box component="section" id="configuration" sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: "1.25rem",
              fontWeight: 700,
              mb: 3,
              color: "var(--foreground)",
            }}
          >
            Configuration Example
          </Typography>
          <Typography
            sx={{
              fontSize: "0.9375rem",
              mb: 2,
              color: "var(--foreground)",
              opacity: 0.85,
            }}
          >
            Basic configuration:
          </Typography>
          <CodeBlock code={codeSnippet1} id="config1" onCopy={copyToClipboard} copied={copiedCode === "config1"} />
          <Typography
            sx={{
              fontSize: "0.9375rem",
              mb: 2,
              mt: 4,
              color: "var(--foreground)",
              opacity: 0.85,
            }}
          >
            Windows path example:
          </Typography>
          <CodeBlock code={codeSnippet2} id="config2" onCopy={copyToClipboard} copied={copiedCode === "config2"} />
          <Paper
            sx={{
              p: 3,
              mt: 4,
              backgroundColor: "var(--accent)",
              borderLeft: "4px solid var(--primary)",
              borderRadius: "0.375rem",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.9375rem",
                lineHeight: 1.6,
                color: "var(--accent-foreground)",
              }}
            >
              Save the file and restart{" "}
              <Box component="strong" sx={{ fontWeight: 600 }}>
                Claude Desktop
              </Box>
              . Your MCP server will now appear as a connected tool within Claude, allowing direct interaction with your
              API.
            </Typography>
          </Paper>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            pt: 6,
            mt: 8,
            borderTop: "1px solid var(--border)",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: "var(--foreground)",
              opacity: 0.6,
            }}
          >
            Need help? Check the GitHub repository or open an issue for support.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

function CodeBlock({ code, id, onCopy, copied }) {
  return (
    <Paper
      sx={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "0.5rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        component="button"
        onClick={() => onCopy(code, id)}
        title="Copy code"
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 10,
          backgroundColor: "var(--secondary)",
          border: "1px solid var(--border)",
          borderRadius: "0.375rem",
          p: 1,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
          },
        }}
      >
        {copied ? <Check size={16} color="currentColor" /> : <Copy size={16} color="currentColor" />}
      </Box>
      <Box
        component="pre"
        sx={{
          p: 4,
          overflowX: "auto",
          fontSize: "0.875rem",
          lineHeight: 1.5,
          color: "var(--foreground)",
          m: 0,
        }}
      >
        <Box component="code" sx={{ fontFamily: "var(--font-mono)" }}>
          {code}
        </Box>
      </Box>
    </Paper>
  )
}
