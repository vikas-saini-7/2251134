"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { fetchStockData, StockData } from "@/services/stcok-services";
import StockChart from "@/components/StockChart";

const StockPage = () => {
  const [ticker, setTicker] = useState("AAPL");
  const [minutes, setMinutes] = useState(60);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputTicker, setInputTicker] = useState("AAPL");

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchStockData(ticker, minutes);
      setStockData(data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setError("Failed to fetch stock data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [ticker, minutes]);

  const handleTickerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicker(inputTicker.toUpperCase());
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Stock Price Analysis
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mb: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
          <form onSubmit={handleTickerSubmit}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              <TextField
                label="Stock Ticker"
                variant="outlined"
                value={inputTicker}
                onChange={(e) => setInputTicker(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
              />
              <Button type="submit" variant="contained" color="primary">
                Fetch
              </Button>
            </Box>
          </form>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="minutes-select-label">
              Time Range (minutes)
            </InputLabel>
            <Select
              labelId="minutes-select-label"
              value={minutes}
              label="Time Range (minutes)"
              onChange={(e) => setMinutes(Number(e.target.value))}
            >
              <MenuItem value={30}>Last 30 minutes</MenuItem>
              <MenuItem value={60}>Last 1 hour</MenuItem>
              <MenuItem value={120}>Last 2 hours</MenuItem>
              <MenuItem value={240}>Last 4 hours</MenuItem>
              <MenuItem value={480}>Last 8 hours</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : stockData ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">{stockData.name} Stock Price</Typography>
              <Typography variant="body1" color="text.secondary">
                Average Price: ${stockData.averagePrice.toFixed(2)}
              </Typography>
            </Box>

            <StockChart stockData={stockData} />

            {stockData.priceHistory.length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                No price data available for the selected time range.
              </Alert>
            )}
          </>
        ) : (
          <Alert severity="info">
            Please select a stock ticker to view data.
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default StockPage;
