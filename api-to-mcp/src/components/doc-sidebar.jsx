import {
  Drawer,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemButton,
  Typography,
  IconButton,
  Collapse,
} from "@mui/material";
import { Menu, Close, ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
];

export default function DocsSidebar({ open, onToggle }) {
  const [expandedSections, setExpandedSections] = useState({
    "Getting Started": true,
    "Setup & Installation": false,
  })

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const handleItemClick = (id) => {
    document.querySelector(`#${id}`)?.scrollIntoView({
      behavior: "smooth",
    })
    if (window.innerWidth < 960) {
      onToggle(false)
    }
  }

  const sidebarContent = (
    <Box
    
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        py: 3,
        px: 2,
      }}
    >
      {/* Close button (mobile) */}
      <IconButton
        onClick={() => onToggle(false)}
        sx={{
          display: { md: "none" },
          mb: 2,
          alignSelf: "flex-end",
          color: "var(--sidebar-foreground)",
        }}
      >
        <Close />
      </IconButton>

      {/* Logo/Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 3,
          color: "var(--sidebar-foreground)",
          fontSize: "0.875rem",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        Documentation
      </Typography>

      {/* Navigation Sections */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {sections.map((section) => (
          <Box key={section.title} sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => toggleSection(section.title)}
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: "0.375rem",
                color: "var(--sidebar-foreground)",
                fontSize: "0.875rem",
                fontWeight: 600,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "var(--sidebar-accent)",
                  color: "var(--sidebar-accent-foreground)",
                },
              }}
            >
              <span>{section.title}</span>
              <ChevronDown
                sx={{
                  fontSize: "1.25rem",
                  transform: expandedSections[section.title] ? "rotate(0deg)" : "rotate(-90deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </ListItemButton>

            <Collapse in={expandedSections[section.title]} timeout="auto">
              <List sx={{ pl: 2 }}>
                {section.items.map((item) => (
                  <ListItemButton
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: "0.375rem",
                      color: "var(--sidebar-foreground)",
                      fontSize: "0.8125rem",
                      opacity: 0.7,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        opacity: 1,
                        backgroundColor: "var(--sidebar-accent)",
                        color: "var(--sidebar-primary)",
                        pl: 3,
                      },
                    }}
                  >
                    {item.label}
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </Box>
    </Box>
  )

  return (
    <Box>
      {/* Mobile Open Button */}
      <IconButton
        onClick={() => onToggle(true)}
        sx={{
          display: { md: "none", xs: "inline-flex" },
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1200,
          color: "var(--foreground)",
          backgroundColor: "var(--card)",
          "&:hover": {
            backgroundColor: "var(--secondary)",
          },
        }}
      >
        <Menu />
      </IconButton>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          width: 280,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 280,
            backgroundColor: "var(--sidebar)",
            borderRight: "1px solid var(--sidebar-border)",
            boxSizing: "border-box",
            zIndex: 900,
            position: "relative",
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={() => onToggle(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 280,
            backgroundColor: "var(--sidebar)",
            borderRight: "1px solid var(--sidebar-border)",
          },
          zIndex: 900
        }}
      >
        {sidebarContent}
      </Drawer>
    </Box>
  )
}