const axios = require("axios");
const { calculateCorrelation } = require("../utils/getCorrelation");

const BASE_URL = "http://20.244.56.144/evaluation-service";
const TOKEN = process.env.TOKEN;

exports.getStocks = async (req, res) => {
  try {
    const { ticker } = req.params;
    const { minutes, aggregation } = req.query;

    const url = `${BASE_URL}/stocks/${ticker.toUpperCase()}${
      minutes ? `?minutes=${minutes}` : ""
    }`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    // if query has aggregation parameter then sending aggregated data
    if (aggregation === "average" && Array.isArray(response.data)) {
      const priceHistory = response.data;

      const totalPrice = priceHistory.reduce(
        (sum, item) => sum + item.price,
        0
      );
      const averageStockPrice =
        priceHistory.length > 0 ? totalPrice / priceHistory.length : 0;

      return res.json({
        averageStockPrice,
        priceHistory,
      });
    }

    // sending direct data
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.message ||
        error.message ||
        "Error fetching stock data",
    });
  }
};

exports.getCorrelation = async (req, res) => {
  try {
    const { minutes, ticker } = req.query;

    if (!ticker) {
      return res
        .status(400)
        .json({ message: "Please provide tickers for correlation." });
    }

    const tickers = Array.isArray(ticker) ? ticker : ticker.split(",");

    if (tickers.length < 2) {
      return res.status(400).json({
        message: "Please provide at least two tickers for correlation.",
      });
    }

    const fetchStockData = async (ticker, minutes) => {
      try {
        const url = `${BASE_URL}/stocks/${ticker.toUpperCase()}${
          minutes ? `?minutes=${minutes}` : ""
        }`;

        console.log(`Fetching data for ${ticker} from URL: ${url}`);

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });

        const priceHistory = Array.isArray(response.data) ? response.data : [];
        const totalPrice = priceHistory.reduce(
          (sum, item) => sum + item.price,
          0
        );
        const averagePrice =
          priceHistory.length > 0 ? totalPrice / priceHistory.length : 0;

        return { name: ticker, averagePrice, priceHistory };
      } catch (error) {
        console.error(
          `Error fetching data for ticker ${ticker}:`,
          error.response?.data || error.message
        );
        return {
          name: ticker,
          error: error.response?.data?.message || error.message,
          averagePrice: 0,
          priceHistory: [],
        };
      }
    };

    const stocksData = await Promise.all(
      tickers.map((ticker) => fetchStockData(ticker.trim(), minutes))
    );

    const validStocks = stocksData.filter(
      (stock) => !stock.error && stock.priceHistory.length > 0
    );

    if (validStocks.length < 2) {
      return res.status(400).json({
        message:
          "Unable to calculate correlation: insufficient valid price data.",
        stocks: stocksData,
      });
    }

    const series1 = validStocks[0].priceHistory.map((item) => item.price);
    const series2 = validStocks[1].priceHistory.map((item) => item.price);
    const minLength = Math.min(series1.length, series2.length);

    const correlation = calculateCorrelation(
      series1.slice(0, minLength),
      series2.slice(0, minLength)
    );

    res.json({ correlation, stocks: stocksData });
  } catch (error) {
    console.error("Correlation calculation error:", error);
    res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.message ||
        error.message ||
        "Error fetching stock correlation data",
    });
  }
};
