export interface StockData {
  name: string;
  averagePrice: number;
  priceHistory: {
    timestamp: string;
    price: number;
  }[];
}

export interface CorrelationData {
  correlation: number;
  stocks: StockData[];
}

const API_BASE_URL = 'http://localhost:9000';

export const fetchStockData = async (ticker: string, minutes?: number): Promise<StockData> => {
  const url = `${API_BASE_URL}/stocks/${ticker}${minutes ? `?minutes=${minutes}` : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch data for ${ticker}`);
  }
  
  const data = await response.json();
  return {
    name: ticker,
    averagePrice: data.averageStockPrice || 0,
    priceHistory: Array.isArray(data) ? data : data.priceHistory || []
  };
};

export const fetchStockCorrelation = async (tickers: string[], minutes?: number): Promise<CorrelationData> => {
  const tickerParam = tickers.join(',');
  const url = `${API_BASE_URL}/stockcorrelation?ticker=${tickerParam}${minutes ? `&minutes=${minutes}` : ''}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch correlation data');
  }
  
  return await response.json();
};