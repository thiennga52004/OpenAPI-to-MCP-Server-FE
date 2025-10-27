"use client";

import { Box, Button, Card, CardContent, Typography, Stack, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function ErrorPage({ code = "NETWORK_ERROR", message = "Something Went Wrong", detail = "Please try again later.", onRetry }) {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (onRetry) onRetry();
    else window.location.reload();
  };

  const handleBack = () => navigate(-1);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f8f9fa",
        p: 3,
      }}
    >
      <Card
        sx={{
          width: 400,
          position: "relative",
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          textAlign: "center",
          p: 3,
        }}
      >
        {/* Nút X góc phải */}
        <IconButton
          onClick={handleBack}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "grey.500",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ mb: 2 }}>
          <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
        </Box>

        <Typography variant="h4" color="error.main" sx={{ fontWeight: "bold" }}>
          {code}
        </Typography>

        <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
          {message}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          {detail}
        </Typography>

        <CardContent>
          <Stack spacing={2} direction="row" justifyContent="center">
            <Button
              variant="contained"
              color="error"
              startIcon={<ReplayIcon />}
              onClick={handleRetry}
            >
              Retry
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Go Back
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
