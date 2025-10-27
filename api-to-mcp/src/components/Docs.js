"use client"

import { useState } from "react"
import Header from "./Header"

import "./Docs.css"
import DocsSidebar from "./doc-sidebar"
import DocsContent from "./docs-content"

export default function DocsPage({ onNavigateToLogin, onNavigateToDocs, onNavigateToHome }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="docs-page">
      <Header
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToDocs={onNavigateToDocs}
        onNavigateToHome={onNavigateToHome}
      />

      <div className="docs-body">
        <DocsSidebar open={sidebarOpen} onToggle={setSidebarOpen} />

        <main className="docs-main">
          <DocsContent />
        </main>
      </div>
    </div>
  )
}
