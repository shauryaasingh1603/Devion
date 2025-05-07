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

export interface WatchlistStock {
  symbol: string;
  name: string;
  addedAt: number;
  currentPrice?: number;
  change?: number;
  changePercent?: number;
  riskScore?: number;
}

export interface Watchlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  stocks: WatchlistStock[];
  createdAt: number;
  updatedAt: number;
}

interface WatchlistState {
  watchlists: Watchlist[];
  currentWatchlist: Watchlist | null;
  loading: boolean;
  error: string | null;
}

const initialState: WatchlistState = {
  watchlists: [],
  currentWatchlist: null,
  loading: false,
  error: null
};

export const fetchUserWatchlists = createAsyncThunk(
  'watchlist/fetchUserWatchlists',
  async (userId: string, { rejectWithValue }) => {
    try {
      const watchlistsQuery = query(
        collection(firestore, 'watchlists'),
        where('userId', '==', userId)
      );
      
      const watchlistsSnapshot = await getDocs(watchlistsQuery);
      const watchlists: Watchlist[] = [];
      
      watchlistsSnapshot.forEach((doc) => {
        watchlists.push({ id: doc.id, ...doc.data() } as Watchlist);
      });
      
      return watchlists;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWatchlist = createAsyncThunk(
  'watchlist/fetchWatchlist',
  async (watchlistId: string, { rejectWithValue }) => {
    try {
      const watchlistDoc = await getDoc(doc(firestore, 'watchlists', watchlistId));
      
      if (watchlistDoc.exists()) {
        return { id: watchlistDoc.id, ...watchlistDoc.data() } as Watchlist;
      } else {
        throw new Error('Watchlist not found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createWatchlist = createAsyncThunk(
  'watchlist/createWatchlist',
  async ({ userId, watchlistData }: { userId: string; watchlistData: Omit<Watchlist, 'id' | 'userId' | 'createdAt' | 'updatedAt'> }, { rejectWithValue }) => {
    try {
      const watchlistRef = doc(collection(firestore, 'watchlists'));
      const timestamp = Date.now();
      
      const newWatchlist: Watchlist = {
        id: watchlistRef.id,
        userId,
        ...watchlistData,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      await setDoc(watchlistRef, newWatchlist);
      
      return newWatchlist;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateWatchlist = createAsyncThunk(
  'watchlist/updateWatchlist',
  async ({ watchlistId, watchlistData }: { watchlistId: string; watchlistData: Partial<Watchlist> }, { rejectWithValue }) => {
    try {
      const watchlistRef = doc(firestore, 'watchlists', watchlistId);
      const timestamp = Date.now();
      
      const updatedData = {
        ...watchlistData,
        updatedAt: timestamp
      };
      
      await updateDoc(watchlistRef, updatedData);
      
      const updatedWatchlistDoc = await getDoc(watchlistRef);
      
      if (updatedWatchlistDoc.exists()) {
        return { id: updatedWatchlistDoc.id, ...updatedWatchlistDoc.data() } as Watchlist;
      } else {
        throw new Error('Watchlist not found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteWatchlist = createAsyncThunk(
  'watchlist/deleteWatchlist',
  async (watchlistId: string, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(firestore, 'watchlists', watchlistId));
      return watchlistId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addStockToWatchlist = createAsyncThunk(
  'watchlist/addStockToWatchlist',
  async ({ watchlistId, stock }: { watchlistId: string; stock: Omit<WatchlistStock, 'addedAt'> }, { rejectWithValue }) => {
    try {
      const watchlistRef = doc(firestore, 'watchlists', watchlistId);
      const watchlistDoc = await getDoc(watchlistRef);
      
      if (!watchlistDoc.exists()) {
        throw new Error('Watchlist not found');
      }
      
      const watchlist = watchlistDoc.data() as Watchlist;
      const timestamp = Date.now();
      
      const stockExists = watchlist.stocks.some(s => s.symbol === stock.symbol);
      
      if (stockExists) {
        throw new Error('Stock already exists in watchlist');
      }
      
      const newStock: WatchlistStock = {
        ...stock,
        addedAt: timestamp
      };
      
      const updatedStocks = [...watchlist.stocks, newStock];
      
      await updateDoc(watchlistRef, {
        stocks: updatedStocks,
        updatedAt: timestamp
      });
      
      const updatedWatchlistDoc = await getDoc(watchlistRef);
      
      if (updatedWatchlistDoc.exists()) {
        return { id: updatedWatchlistDoc.id, ...updatedWatchlistDoc.data() } as Watchlist;
      } else {
        throw new Error('Watchlist not found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeStockFromWatchlist = createAsyncThunk(
  'watchlist/removeStockFromWatchlist',
  async ({ watchlistId, symbol }: { watchlistId: string; symbol: string }, { rejectWithValue }) => {
    try {
      const watchlistRef = doc(firestore, 'watchlists', watchlistId);
      const watchlistDoc = await getDoc(watchlistRef);
      
      if (!watchlistDoc.exists()) {
        throw new Error('Watchlist not found');
      }
      
      const watchlist = watchlistDoc.data() as Watchlist;
      const timestamp = Date.now();
      
      const updatedStocks = watchlist.stocks.filter(s => s.symbol !== symbol);
      
      await updateDoc(watchlistRef, {
        stocks: updatedStocks,
        updatedAt: timestamp
      });
      
      const updatedWatchlistDoc = await getDoc(watchlistRef);
      
      if (updatedWatchlistDoc.exists()) {
        return { id: updatedWatchlistDoc.id, ...updatedWatchlistDoc.data() } as Watchlist;
      } else {
        throw new Error('Watchlist not found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    setCurrentWatchlist: (state, action: PayloadAction<Watchlist | null>) => {
      state.currentWatchlist = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserWatchlists.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserWatchlists.fulfilled, (state, action) => {
      state.watchlists = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchUserWatchlists.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    builder.addCase(fetchWatchlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWatchlist.fulfilled, (state, action) => {
      state.currentWatchlist = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchWatchlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    builder.addCase(createWatchlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createWatchlist.fulfilled, (state, action) => {
      state.watchlists.push(action.payload);
      state.currentWatchlist = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(createWatchlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    builder.addCase(updateWatchlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateWatchlist.fulfilled, (state, action) => {
      const index = state.watchlists.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.watchlists[index] = action.payload;
      }
      state.currentWatchlist = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(updateWatchlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    builder.addCase(deleteWatchlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteWatchlist.fulfilled, (state, action) => {
      state.watchlists = state.watchlists.filter(w => w.id !== action.payload);
      if (state.currentWatchlist && state.currentWatchlist.id === action.payload) {
        state.currentWatchlist = null;
      }
      state.loading = false;
      state.error = null;
    });
    builder.addCase(deleteWatchlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    builder.addCase(addStockToWatchlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addStockToWatchlist.fulfilled, (state, action) => {
      const index = state.watchlists.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.watchlists[index] = action.payload;
      }
      state.currentWatchlist = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(addStockToWatchlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    builder.addCase(removeStockFromWatchlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeStockFromWatchlist.fulfilled, (state, action) => {
      const index = state.watchlists.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.watchlists[index] = action.payload;
      }
      state.currentWatchlist = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(removeStockFromWatchlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

export const { setCurrentWatchlist, clearError } = watchlistSlice.actions;
export default watchlistSlice.reducer;
