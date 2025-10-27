import { useNavigate } from "react-router-dom";

const Header = ( ) => {
    const navigate = useNavigate();
    return(
        <div>
            {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate("/")} >
            <h2 >API to MCP</h2>
          </div>
          <div className="nav-menu">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#how-it-works" className="nav-link">
              How it Works
            </a>
            <a href="#pricing" className="nav-link">
              Pricing
            </a>
            <a href="/docs" className="nav-link">
              Docs
            </a>
            <button className="nav-button" onClick={() => navigate("/login")}>
              Get Started
            </button>
          </div>
        </div>
      </nav>
        </div>
    )
}

export default Header;