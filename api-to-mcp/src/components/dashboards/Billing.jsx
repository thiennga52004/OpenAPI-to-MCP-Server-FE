import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

export default function Billing() {
  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Billing
      </Typography>

      <Paper
        sx={{
          p: 4,
          borderRadius: "16px",
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          maxWidth: 420,
        }}
      >
        <Box textAlign="center" py={4}>
          <Typography variant="h3" fontWeight={800}>
            0 VND / month
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={4}
            mt={4}
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              p: 1.3,
              display: "inline-block",
              width: 180,
            }}
          >
            Your current plan
          </Typography>

          <List>
            {[
              "Free 5 APISpecs Uploads",
              "200 Requests / Day",
            ].map((text, i) => (
              <ListItem key={i} sx={{ py: 0 }}>
                <ListItemIcon>
                  <CheckIcon sx={{ color: "#6366f1" }} />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </Box>
  );
}
