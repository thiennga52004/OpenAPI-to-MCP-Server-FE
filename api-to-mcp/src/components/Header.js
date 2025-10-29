import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar  position="static" color="inherit" elevation={0} sx={{height: 80, justifyContent: "center", }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between",color: "667eea" }}>

        {/* Logo sát bên trái */}
        <Box sx={{ cursor: "pointer", ml: 1 }} onClick={() => navigate("/")}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            API to MCP
          </Typography>
        </Box>

        {/* Menu bên phải */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mr: 2 }}>
          <Typography
            component="a"
            href="#pricing"
            sx={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
          >
            Pricing
          </Typography>

          <Typography
            component="a"
            href="/docs"
            sx={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
          >
            Docs
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Get Started
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
