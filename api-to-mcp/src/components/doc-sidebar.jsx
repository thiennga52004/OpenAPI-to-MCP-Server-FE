import { ChevronDown, Menu, X } from "lucide-react"
import { useState } from "react"
import "./DocsSidebar.css"

const sections = [
  {
    title: "Getting Started",
    items: [
      { label: "Overview", id: "overview" },
      { label: "What is openapi-mcp?", id: "what-is" },
      { label: "Key Features", id: "features" },
    ],
  },
  {
    title: "Setup & Installation",
    items: [
      { label: "Claude Desktop Setup", id: "claude-setup" },
      { label: "Configuration", id: "configuration" },
    ],
  },
]

export default function DocsSidebar({ open, onToggle }) {
  const [expandedSections, setExpandedSections] = useState({
    "Getting Started": true,
    "Setup & Installation": true,
  })

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <>
      {/* Nút mở sidebar cho mobile */}
      <button className="sidebar-toggle-btn" onClick={() => onToggle(!open)}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar chính */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <nav className="sidebar-nav">
          {sections.map((section) => (
            <div key={section.title} className="sidebar-section">
              <button
                onClick={() => toggleSection(section.title)}
                className="sidebar-section-header"
              >
                <span>{section.title}</span>
                <ChevronDown
                  size={16}
                  className={`chevron ${expandedSections[section.title] ? "rotated" : ""}`}
                />
              </button>

              {expandedSections[section.title] && (
                <ul className="sidebar-list">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="sidebar-link">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Overlay cho mobile */}
      {open && <div className="sidebar-overlay" onClick={() => onToggle(false)} />}
    </>
  )
}
