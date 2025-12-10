"use client"
import Header from "./Header"
import "./HomePage.css"

const HomePage = ({ onNavigateToLogin, onNavigateToDocs, onNavigateToHome }) => {
  return (
    <div className="homepage">
      {/* Navigation */}
      <Header/>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Transform Your OpenAPI Documentation into
              <span className="highlight"> MCP Servers</span>
            </h1>
            <p className="hero-description">
              Seamlessly convert your OpenAPI specifications into Model Context Protocol (MCP) servers, enabling AI
              assistants to interact with your APIs through intelligent tool calling.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={onNavigateToLogin}>
                Start Converting
              </button>
              <button className="btn-secondary">View Demo</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="code-block">
              <div className="code-header">
                <div className="code-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="code-title">openapi.yaml</span>
              </div>
              <div className="code-content">
                <pre>{`paths:
  /users:
    get:
      summary: Get users
      responses:
        200:
          description: Success`}</pre>
              </div>
            </div>
            <div className="arrow">→</div>
            <div className="code-block">
              <div className="code-header">
                <div className="code-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="code-title">mcp-server.js</span>
              </div>
              <div className="code-content">
                <pre>{`tools: {
  get_users: {
    description: "Get users",
    parameters: {...}
  }
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title">Why Choose API to MCP?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Convert your OpenAPI specs to MCP servers in seconds with our intelligent parser and generator.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Ready</h3>
              <p>
                Generate MCP servers optimized for AI tool calling with proper parameter validation and error handling.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔧</div>
              <h3>Easy Integration</h3>
              <p>Deploy your MCP servers instantly with our cloud platform or download for self-hosting.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics</h3>
              <p>
                Track API usage, monitor performance, and get insights into how AI assistants interact with your tools.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure</h3>
              <p>Enterprise-grade security with authentication, rate limiting, and comprehensive audit logs.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Scalable</h3>
              <p>Handle millions of requests with our auto-scaling infrastructure and global CDN.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Upload Your OpenAPI</h3>
                <p>Simply paste your OpenAPI specification or upload your YAML/JSON file.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>AI-Powered Conversion</h3>
                <p>Our intelligent engine analyzes your API and generates optimized MCP server code.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Deploy & Connect</h3>
                <p>Deploy your MCP server and connect it to your AI assistant for instant tool calling.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your APIs?</h2>
            <p>Join thousands of developers who are already using API to MCP to make their APIs AI-ready.</p>
            <button className="btn-primary large" onClick={onNavigateToLogin}>
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>API to MCP</h3>
              <p>Making APIs accessible to AI assistants through Model Context Protocol.</p>
            </div>
            <div className="footer-section">
              <h4>Product</h4>
              <ul>
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="/docs">Documentation</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li>
                  <a href="#help">Help Center</a>
                </li>
                <li>
                  <a href="#contact">Contact Us</a>
                </li>
                <li>
                  <a href="#status">Status</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#blog">Blog</a>
                </li>
                <li>
                  <a href="#careers">Careers</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 API to MCP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
