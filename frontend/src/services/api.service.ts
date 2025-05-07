import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class ApiService {
  static async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.get(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.post(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.put(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.delete(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static handleError(error: any): never {
    if (error.response) {
      const message = error.response.data.message || error.response.data.error || 'Server error';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('No response from server. Please check your internet connection.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const StockService = {
  getStockData: (symbol: string) => ApiService.get(`/insights/stock/${symbol}`),
  getStockRiskAnalysis: (symbol: string) => ApiService.get(`/insights/stock/${symbol}/risk`),
  getTechnicalIndicators: (symbol: string) => ApiService.get(`/insights/stock/${symbol}/technical`),
  getStockNews: (symbol: string) => ApiService.get(`/insights/stock/${symbol}/news`),
  getMultipleStocks: (symbols: string[]) => ApiService.get(`/insights/stocks?symbols=${symbols.join(',')}`)
};

export const PortfolioService = {
  getPortfolioRisk: (symbols: string[]) => ApiService.post('/insights/portfolio/risk', { symbols }),
  getUserPortfolios: () => ApiService.get('/firebase/portfolios'),
  getPortfolio: (id: string) => ApiService.get(`/firebase/portfolios/${id}`),
  createPortfolio: (data: any) => ApiService.post('/firebase/portfolios', data),
  updatePortfolio: (id: string, data: any) => ApiService.put(`/firebase/portfolios/${id}`, data),
  deletePortfolio: (id: string) => ApiService.delete(`/firebase/portfolios/${id}`)
};

export const WatchlistService = {
  getUserWatchlists: () => ApiService.get('/firebase/watchlists'),
  getWatchlist: (id: string) => ApiService.get(`/firebase/watchlists/${id}`),
  createWatchlist: (data: any) => ApiService.post('/firebase/watchlists', data),
  updateWatchlist: (id: string, data: any) => ApiService.put(`/firebase/watchlists/${id}`, data),
  deleteWatchlist: (id: string) => ApiService.delete(`/firebase/watchlists/${id}`),
  addStockToWatchlist: (id: string, stock: any) => ApiService.post(`/firebase/watchlists/${id}/stocks`, stock),
  removeStockFromWatchlist: (id: string, symbol: string) => ApiService.delete(`/firebase/watchlists/${id}/stocks/${symbol}`)
};

export const MarketService = {
  getMarketIndices: () => ApiService.get('/insights/market/indices'),
  getCurrencyRates: () => ApiService.get('/insights/market/currencies'),
  getCommodityPrices: () => ApiService.get('/insights/market/commodities'),
  getMarketData: () => ApiService.get('/insights/market/data')
};

export default ApiService;
