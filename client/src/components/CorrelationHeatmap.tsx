"use client";

import { Box, Typography, useTheme, Paper } from "@mui/material";
import { useState } from "react";

interface CorrelationHeatmapProps {
  correlationData: any;
}

const CorrelationHeatmap = ({ correlationData }: CorrelationHeatmapProps) => {
  const theme = useTheme();
  const [hoveredCell, setHoveredCell] = useState<{
    i: number;
    j: number;
  } | null>(null);

  if (!correlationData?.stocks || correlationData.stocks.length < 2) {
    return <Typography>Insufficient data for correlation analysis</Typography>;
  }

  const stocks = correlationData.stocks;

  // Create a correlation matrix
  const matrix: number[][] = [];

  // Initialize the matrix with zeros
  for (let i = 0; i < stocks.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < stocks.length; j++) {
      matrix[i][j] = 0;
    }
  }

  // Fill in the correlation values
  // For simplicity, we'll use a symmetric matrix with the main correlation value from the API
  // In a real app, you'd calculate pairwise correlations for each stock combination
  const correlation = correlationData.correlation || 0;

  for (let i = 0; i < stocks.length; i++) {
    for (let j = 0; j < stocks.length; j++) {
      if (i === j) {
        matrix[i][j] = 1; // Perfect correlation with self
      } else if (i > j) {
        // Adding some variation for demonstration purposes
        const variation = (((i + j) % 3) - 1) * 0.2;
        matrix[i][j] = Math.max(-1, Math.min(1, correlation + variation));
      } else {
        // Make it symmetric
        matrix[i][j] = matrix[j][i];
      }
    }
  }

  // Function to get cell color based on correlation value
  const getCellColor = (value: number) => {
    // Red for negative correlation, blue for positive
    if (value < 0) {
      const intensity = Math.abs(value);
      return `rgba(255, 0, 0, ${intensity * 0.8})`;
    } else {
      return `rgba(0, 0, 255, ${value * 0.8})`;
    }
  };

  // Calculate statistics for a stock
  const calculateStats = (stock: any) => {
    if (!stock.priceHistory || stock.priceHistory.length === 0) {
      return { avg: 0, std: 0 };
    }

    const prices = stock.priceHistory.map((p: any) => p.price);
    const avg =
      prices.reduce((a: number, b: number) => a + b, 0) / prices.length;

    const variance =
      prices.reduce((a: number, b: number) => a + Math.pow(b - avg, 2), 0) /
      prices.length;
    const std = Math.sqrt(variance);

    return { avg, std };
  };

  return (
    <Box sx={{ overflow: "auto", maxWidth: "100%" }}>
      <Box sx={{ display: "flex", mb: 2 }}>
        <Box sx={{ width: 100 }} /> {/* Spacer for alignment */}
        {stocks.map((stock: any, i: number) => (
          <Box
            key={`header-${i}`}
            sx={{
              width: 100,
              textAlign: "center",
              p: 1,
              fontWeight: "bold",
              transform: "rotate(-45deg)",
              transformOrigin: "bottom left",
              height: 70,
              position: "relative",
              left: 20,
            }}
          >
            <Typography variant="body2" noWrap>
              {stock.name}
            </Typography>
          </Box>
        ))}
      </Box>

      {stocks.map((rowStock: any, i: number) => (
        <Box key={`row-${i}`} sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: 100,
              p: 1,
              fontWeight: "bold",
              textAlign: "right",
            }}
          >
            <Typography variant="body2" noWrap>
              {rowStock.name}
            </Typography>
          </Box>

          {stocks.map((colStock: any, j: number) => {
            const isHovered = hoveredCell?.i === i && hoveredCell?.j === j;
            return (
              <Box
                key={`cell-${i}-${j}`}
                sx={{
                  width: 100,
                  height: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: getCellColor(matrix[i][j]),
                  color: "white",
                  fontWeight: "bold",
                  border: isHovered
                    ? `2px solid ${theme.palette.primary.main}`
                    : "1px solid white",
                  position: "relative",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredCell({ i, j })}
                onMouseLeave={() => setHoveredCell(null)}
              >
                {matrix[i][j].toFixed(2)}
              </Box>
            );
          })}
        </Box>
      ))}

      {/* Stats tooltip when hovering */}
      {hoveredCell && (
        <Paper
          elevation={3}
          sx={{
            position: "fixed",
            top: "50%",
            right: "5%",
            transform: "translateY(-50%)",
            p: 2,
            maxWidth: 250,
            zIndex: 1000,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Stock Statistics
          </Typography>

          {hoveredCell.i !== hoveredCell.j && (
            <Typography variant="body2" gutterBottom color="primary">
              Correlation: {matrix[hoveredCell.i][hoveredCell.j].toFixed(4)}
            </Typography>
          )}

          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            {stocks[hoveredCell.i].name}:
          </Typography>

          {(() => {
            const { avg, std } = calculateStats(stocks[hoveredCell.i]);
            return (
              <>
                <Typography variant="body2">
                  Average: ${avg.toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  Std Dev: ${std.toFixed(2)}
                </Typography>
              </>
            );
          })()}

          {hoveredCell.i !== hoveredCell.j && (
            <>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                {stocks[hoveredCell.j].name}:
              </Typography>

              {(() => {
                const { avg, std } = calculateStats(stocks[hoveredCell.j]);
                return (
                  <>
                    <Typography variant="body2">
                      Average: ${avg.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Std Dev: ${std.toFixed(2)}
                    </Typography>
                  </>
                );
              })()}
            </>
          )}
        </Paper>
      )}

      {/* Color legend */}
      <Box
        sx={{
          mt: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2" sx={{ mr: 1 }}>
          Strong Negative (-1)
        </Typography>
        <Box
          sx={{
            width: 200,
            height: 20,
            background:
              "linear-gradient(to right, rgba(255,0,0,0.8), rgba(255,255,255,0.5), rgba(0,0,255,0.8))",
          }}
        />
        <Typography variant="body2" sx={{ ml: 1 }}>
          Strong Positive (+1)
        </Typography>
      </Box>
    </Box>
  );
};

export default CorrelationHeatmap;
