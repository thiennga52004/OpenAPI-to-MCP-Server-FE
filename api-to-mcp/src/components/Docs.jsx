"use client";
import { useState } from "react";
import Header from "./Header";



import { Box, Typography } from "@mui/material";
import DocsSidebar from "./doc-sidebar";
import DocsContent from "./docs-content";

export default function DocsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
  
  <Header/>

  {/* Body */}
  <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
    <DocsSidebar open={sidebarOpen} onToggle={setSidebarOpen} />

    <Box
      component="main"
      sx={{
        flex: 1,
        overflowY: "auto",
        p: 4,
      }}
    >
      <Box sx={{ maxWidth: "1500px", mx: "auto" }}>
        <DocsContent />
      </Box>
    </Box>
  </Box>

</Box>

  );
}
