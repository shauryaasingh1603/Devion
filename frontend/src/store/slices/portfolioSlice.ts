import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { firestore } from '../../config/firebase';

export interface Stock {
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice?: number;
  change?: number;
  changePercent?: number;
  value?: number;
  investmentValue?: number;
  riskScore?: number;
}

export interface RiskFactor {
  name: string;
  description: string;
  severity: number; // 0-100
}

export interface RiskAnalysis {
  overallRiskScore: number; // 0-100
  technicalRiskScore: number; // 0-100
  sentimentRiskScore: number; // 0-100
  marketRiskScore: number; // 0-100
  riskFactors: RiskFactor[];
  recommendations: string[];
  timestamp: number;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
}

export interface Currency {
  symbol: string;
  name: string;
  rate: number;
  change: number;
  changePercent: number;
}

export interface Commodity {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface MarketData {
  indices: MarketIndex[];
  currencies: Record<string, Currency>;
  commodities: Record<string, Commodity>;
  timestamp: number;
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description?: string;
  stocks: Stock[];
  totalValue?: number;
  totalChange?: number;
  totalChangePercent?: number;
  riskScore?: number;
  createdAt: number;
  updatedAt: number;
}

interface PortfolioState {
  portfolios: Portfolio[];
  currentPortfolio: Portfolio | null;
  portfolio: Portfolio | null; // For dashboard components
  riskAnalysis: RiskAnalysis | null; // For risk analysis component
  marketData: MarketData | null; // For market overview component
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  portfolios: [],
  currentPortfolio: null,
  portfolio: null,
  riskAnalysis: null,
  marketData: null,
  loading: false,
  error: null
};

export const fetchUserPortfolios = createAsyncThunk(
  'portfolio/fetchUserPortfolios',
  async (userId: string, { rejectWithValue }) => {
    try {
      const portfoliosQuery = query(
        collection(firestore, 'portfolios'),
        where('userId', '==', userId)
      );
      
      const portfoliosSnapshot = await getDocs(portfoliosQuery);
      const portfolios: Portfolio[] = [];
      
      portfoliosSnapshot.forEach((doc) => {
        portfolios.push({ id: doc.id, ...doc.data() } as Portfolio);
      });
      
      return portfolios;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async (portfolioId: string, { rejectWithValue }) => {
    try {
      const portfolioDoc = await getDoc(doc(firestore, 'portfolios', portfolioId));
      
      if (portfolioDoc.exists()) {
        return { id: portfolioDoc.id, ...portfolioDoc.data() } as Portfolio;
      } else {
        throw new Error('Portfolio not found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPortfolio = createAsyncThunk(
  'portfolio/createPortfolio',
  async ({ userId, portfolioData }: { userId: string; portfolioData: Omit<Portfolio, 'id' | 'userId' | 'createdAt' | 'updatedAt'> }, { rejectWithValue }) => {
    try {
      const portfolioRef = doc(collection(firestore, 'portfolios'));
      const timestamp = Date.now();
      
      const newPortfolio: Portfolio = {
        id: portfolioRef.id,
        userId,
        ...portfolioData,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      await setDoc(portfolioRef, newPortfolio);
      
      return newPortfolio;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePortfolio = createAsyncThunk(
  'portfolio/updatePortfolio',
  async ({ portfolioId, portfolioData }: { portfolioId: string; portfolioData: Partial<Portfolio> }, { rejectWithValue }) => {
    try {
      const portfolioRef = doc(firestore, 'portfolios', portfolioId);
      const timestamp = Date.now();
      
      const updatedData = {
        ...portfolioData,
        updatedAt: timestamp
      };
      
      await updateDoc(portfolioRef, updatedData);
      
      const updatedPortfolioDoc = await getDoc(portfolioRef);
      
      if (updatedPortfolioDoc.exists()) {
        return { id: updatedPortfolioDoc.id, ...updatedPortfolioDoc.data() } as Portfolio;
      } else {
        throw new Error('Portfolio not found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePortfolio = createAsyncThunk(
  'portfolio/deletePortfolio',
  async (portfolioId: string, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(firestore, 'portfolios', portfolioId));
      return portfolioId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setCurrentPortfolio: (state, action: PayloadAction<Portfolio | null>) => {
      state.currentPortfolio = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserPortfolios.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserPortfolios.fulfilled, (state, action) => {
      state.portfolios = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchUserPortfolios.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    builder.addCase(fetchPortfolio.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPortfolio.fulfilled, (state, action) => {
      state.currentPortfolio = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchPortfolio.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    builder.addCase(createPortfolio.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPortfolio.fulfilled, (state, action) => {
      state.portfolios.push(action.payload);
      state.currentPortfolio = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(createPortfolio.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    builder.addCase(updatePortfolio.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePortfolio.fulfilled, (state, action) => {
      const index = state.portfolios.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.portfolios[index] = action.payload;
      }
      state.currentPortfolio = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(updatePortfolio.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    builder.addCase(deletePortfolio.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deletePortfolio.fulfilled, (state, action) => {
      state.portfolios = state.portfolios.filter(p => p.id !== action.payload);
      if (state.currentPortfolio && state.currentPortfolio.id === action.payload) {
        state.currentPortfolio = null;
      }
      state.loading = false;
      state.error = null;
    });
    builder.addCase(deletePortfolio.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

export const { setCurrentPortfolio, clearError } = portfolioSlice.actions;
export default portfolioSlice.reducer;
