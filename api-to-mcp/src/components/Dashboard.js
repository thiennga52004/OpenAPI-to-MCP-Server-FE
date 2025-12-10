"use client";

import { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Avatar,
  Divider,
  Paper,
  Grid,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import BuildIcon from "@mui/icons-material/Build";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LogoutIcon from "@mui/icons-material/Logout";
import { ChatBubble } from "@mui/icons-material";

import ApiSpecsTab from "./dashboards/ApiSpecs";
import DocsPage from "./Docs";
import Billing from "./dashboards/Billing";
import { Navigate, useNavigate } from "react-router-dom";

const drawerWidth = 240;
const drawerWidthCollapsed = 72;

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366f1", // Modern indigo
      light: "#818cf8",
      dark: "#4f46e5",
    },
    secondary: {
      main: "#ec4899", // Modern pink
    },
    background: {
      default: "#f8fafc",
    },
    divider: "#e2e8f0",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
      fontSize: "1.1rem",
    },
    subtitle2: {
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#1e293b",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
          borderBottom: "1px solid #e2e8f0",
          height: 70,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1e293b",
          color: "#f1f5f9",
          borderRight: "1px solid #0f172a",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          margin: "4px 0",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(99, 102, 241, 0.1)",
          },
          "&.Mui-selected": {
            backgroundColor: "#6366f1",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#4f46e5",
            },
          },
        },
      },
    },
  },
});

const SidebarItems = [
  { id: "overview", label: "Overview", icon: <BarChartIcon /> },
  { id: "api-specs", label: "API Specs", icon: <DescriptionIcon /> },
  { id: "api-key", label: "API Key", icon: <VpnKeyIcon /> },
  { id: "tools", label: "Tools", icon: <BuildIcon /> },
  { id: "billing", label: "Billing", icon: <CreditCardIcon /> },
  { id: "settings", label: "Settings", icon: <SettingsIcon /> },
  { id: "docs", label: "Docs", icon: <MenuBookIcon /> },
  { id: "chatbot", label: "Chatbot", icon: <ChatBubble /> },
];

export default function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const renderContent = () => {
    switch (activeTab) {
      case "api-specs":
        return <ApiSpecsTab />;
      case "overview":
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Overview
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Welcome back! Here's your API dashboard.
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: "Total Requests", value: "2.4M", change: "+12%" },
                { label: "Success Rate", value: "99.8%", change: "+0.2%" },
                { label: "Avg Response", value: "145ms", change: "-8%" },
                { label: "Active Keys", value: "12", change: "0" },
              ].map((stat, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Paper
                    sx={{
                      p: 2.5,
                      borderRadius: "12px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                        borderColor: "#cbd5e1",
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mt: 1, mb: 0.5 }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: stat.change.startsWith("+")
                          ? "#10b981"
                          : "#ef4444",
                        fontWeight: 500,
                      }}
                    >
                      {stat.change} from last month
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case "docs":
        navigate("/docs");
      case "billing":
        return <Billing />;
      case "settings":
        return <Typography>Will be updated soon</Typography>;
      case "api-key":
        return <Typography>Will be updated soon</Typography>;
      case "tools":
        return <Typography>Will be updated soon</Typography>;
      case "chatbot":
        navigate("/chat");
      default:
        return <Typography>Hiển thị nội dung tab: {activeTab}</Typography>;
    }
  };

  const drawer = (
    <Box display="flex" flexDirection="column" height="100%">
      {/* Header + Collapse Button */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={2}
        py={2}
        sx={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {!isCollapsed && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            API to MCP
          </Typography>
        )}
        <IconButton
          onClick={toggleCollapse}
          sx={{
            color: "#f1f5f9",
            "&:hover": {
              backgroundColor: "rgba(99, 102, 241, 0.1)",
            },
          }}
        >
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* Menu */}
      {/* Menu */}
      <List sx={{ px: 1, py: 2, flex: 1 }}>
        {SidebarItems.map((item) => (
          <ListItemButton
            key={item.id}
            selected={activeTab === item.id}
            onClick={() => {
              setActiveTab(item.id);
              setMobileOpen(false);
            }}
            sx={{
              justifyContent: isCollapsed ? "center" : "flex-start",
              mb: 0.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isCollapsed ? 0 : 2,
                color: activeTab === item.id ? "#ffffff" : "#cbd5e1",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary={item.label} />}
          </ListItemButton>
        ))}
      </List>

      {/* Bottom Section */}
      <Box mt="auto">
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

        {/* User Section */}
        <Box
          px={2}
          py={2}
          display="flex"
          alignItems="center"
          justifyContent={isCollapsed ? "center" : "flex-start"}
          gap={1}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
              fontWeight: 600,
            }}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </Avatar>

          {!isCollapsed && (
            <Box>
              <Typography variant="subtitle2" sx={{ color: "#f1f5f9" }}>
                {user?.name || "User"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#cbd5e1" }}>
                {user?.plan || "Free"} Plan
              </Typography>
            </Box>
          )}
        </Box>

        {/* Logout */}
        <ListItemButton
          onClick={onLogout}
          sx={{
            justifyContent: isCollapsed ? "center" : "flex-start",
            px: 2,
            py: 1,
            mx: 1,
            mb: 1,
            borderRadius: "8px",
            color: "#fca5a5",
            "&:hover": {
              backgroundColor: "rgba(239, 68, 68, 0.1)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: isCollapsed ? 0 : 1.5,
              display: "flex",
              alignItems: "center",
              color: "#fca5a5",
            }}
          >
            <LogoutIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>

          {!isCollapsed && (
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
            />
          )}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex">
        {/* Top AppBar */}
        <AppBar position="fixed" sx={{ zIndex: 1201 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              sx={{ color: "#1e293b", fontWeight: 600 }}
            >
              {SidebarItems.find((i) => i.id === activeTab)?.label ||
                "Dashboard"}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Sidebar Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            width: isCollapsed ? drawerWidthCollapsed : drawerWidth,
            transition: "width 0.3s ease",
            "& .MuiDrawer-paper": {
              width: isCollapsed ? drawerWidthCollapsed : drawerWidth,
              transition: "width 0.3s ease",
              boxSizing: "border-box",
            },
            display: { xs: "none", md: "block" },
          }}
          open
        >
          {drawer}
        </Drawer>

        {/* Sidebar Mobile */}
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          flexGrow={1}
          p={3}
          sx={{
            mt: 8,
            ml: {
              md: isCollapsed
                ? `${drawerWidthCollapsed}px`
                : `${drawerWidth}px`,
            },
            transition: "margin 0.3s ease",
            marginLeft: { xs: 0, md: 0 },
            backgroundColor: "#f8fafc",
            alignItems: "center",
            flex: 1,
            width: "100%",
            height: "100%",
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
