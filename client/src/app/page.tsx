"use client";

import { Box, Button, Container, Typography, Paper } from "@mui/material";
import Link from "next/link";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const Home = () => {
  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        Stock Price Aggregation Dashboard
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          justifyContent: "center",
        }}
      >
        <StyledPaper
          elevation={3}
          sx={{ flex: 1, maxWidth: { xs: "100%", md: "45%" } }}
        >
          <Typography variant="h5" gutterBottom>
            Stock Price Charts
          </Typography>
          <Typography variant="body1" paragraph>
            View detailed price charts for individual stocks with time interval
            selection
          </Typography>
          <Link href="/stock" passHref>
            <Button variant="contained" color="primary" fullWidth>
              View Stock Charts
            </Button>
          </Link>
        </StyledPaper>

        <StyledPaper
          elevation={3}
          sx={{ flex: 1, maxWidth: { xs: "100%", md: "45%" } }}
        >
          <Typography variant="h5" gutterBottom>
            Correlation Heatmap
          </Typography>
          <Typography variant="body1" paragraph>
            Analyze correlation between different stocks through an interactive
            heatmap
          </Typography>
          <Link href="/correlation" passHref>
            <Button variant="contained" color="secondary" fullWidth>
              View Correlation Heatmap
            </Button>
          </Link>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default Home;
