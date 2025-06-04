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
  Chip,
} from "@mui/material";
import { fetchStockCorrelation } from "@/services/stcok-services";
import CorrelationHeatmap from "@/components/CorrelationHeatmap";

const CorrelationPage = () => {
  const [tickers, setTickers] = useState<string[]>(["AAPL", "MSFT", "GOOGL"]);
  const [minutes, setMinutes] = useState(60);
  const [correlationData, setCorrelationData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputTicker, setInputTicker] = useState("");

  useEffect(() => {
    fetchData();
  }, [minutes, tickers]);

  const fetchData = async () => {
    if (tickers.length < 2) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchStockCorrelation(tickers, minutes);
      setCorrelationData(data);
    } catch (error) {
      console.error("Error fetching correlation data:", error);
      setError("Failed to fetch correlation data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addTicker = () => {
    if (!inputTicker || tickers.includes(inputTicker.toUpperCase())) return;
    setTickers([...tickers, inputTicker.toUpperCase()]);
    setInputTicker("");
  };

  const removeTicker = (tickerToRemove: string) => {
    setTickers(tickers.filter((t) => t !== tickerToRemove));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Stock Correlation Analysis
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
          <Typography variant="h6" gutterBottom>
            Stock Tickers
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {tickers.map((ticker) => (
              <Chip
                key={ticker}
                label={ticker}
                onDelete={
                  tickers.length > 2 ? () => removeTicker(ticker) : undefined
                }
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="Add Ticker"
              variant="outlined"
              size="small"
              value={inputTicker}
              onChange={(e) => setInputTicker(e.target.value.toUpperCase())}
              sx={{ flex: 1 }}
            />
            <Button onClick={addTicker} variant="contained">
              Add
            </Button>
          </Box>
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

      <Paper elevation={3} sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : correlationData ? (
          <>
            <Typography variant="h6" gutterBottom>
              Correlation Heatmap
            </Typography>

            <CorrelationHeatmap correlationData={correlationData} />

            {correlationData.stocks?.some(
              (stock: any) =>
                !stock.priceHistory || stock.priceHistory.length === 0
            ) && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Some stocks have insufficient data for the selected time range.
              </Alert>
            )}
          </>
        ) : (
          <Alert severity="info">
            Please select at least two stock tickers to view correlation data.
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default CorrelationPage;
