"use client";

import { Box, Typography, useTheme } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { StockData } from "@/services/stcok-services";
import { useState } from "react";

interface StockChartProps {
  stockData: StockData;
}

const StockChart = ({ stockData }: StockChartProps) => {
  const theme = useTheme();
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);

  if (!stockData.priceHistory || stockData.priceHistory.length === 0) {
    return <Typography>No data available</Typography>;
  }

  const chartData = stockData.priceHistory.map((item) => ({
    timestamp: new Date(item.timestamp).toLocaleTimeString(),
    price: item.price,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 1,
            border: 1,
            borderColor: "grey.300",
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Time:</strong> {data.timestamp}
          </Typography>
          <Typography variant="body2" color="primary">
            <strong>Price:</strong> ${data.price.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Avg:</strong> ${stockData.averagePrice.toFixed(2)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ height: 400, width: "100%", position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
          onMouseMove={(e) => {
            if (e?.activePayload?.[0]) {
              setHoveredPoint(e.activePayload[0].payload);
            }
          }}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis
            dataKey="timestamp"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            domain={["auto", "auto"]}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <ReferenceLine
            y={stockData.averagePrice}
            stroke={theme.palette.secondary.main}
            strokeDasharray="3 3"
            label={{
              value: "Average",
              position: "insideBottomRight",
              fill: theme.palette.secondary.main,
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={theme.palette.primary.main}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6, stroke: theme.palette.primary.dark }}
            name={`${stockData.name} Price`}
          />
        </LineChart>
      </ResponsiveContainer>

      {hoveredPoint && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            bgcolor: "background.paper",
            p: 1,
            borderRadius: 1,
            boxShadow: 1,
            border: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="body2">
            <strong>Date:</strong> {hoveredPoint.timestamp}
          </Typography>
          <Typography variant="body2" color="primary">
            <strong>Price:</strong> ${hoveredPoint.price.toFixed(2)}
          </Typography>
          <Typography
            variant="body2"
            color={
              hoveredPoint.price > stockData.averagePrice
                ? "success.main"
                : "error.main"
            }
          >
            <strong>vs Avg:</strong>{" "}
            {(
              ((hoveredPoint.price - stockData.averagePrice) /
                stockData.averagePrice) *
              100
            ).toFixed(2)}
            %
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default StockChart;
