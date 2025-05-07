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

export interface Alert {
  id: string;
  userId: string;
  type: 'price' | 'technical' | 'sentiment' | 'institutional' | 'risk';
  symbol: string;
  condition: {
    metric: string;
    operator: '>' | '<' | '==' | '>=' | '<=';
    value: number;
  };
  message: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  lastTriggeredAt?: number;
}

interface AlertsState {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
}

const initialState: AlertsState = {
  alerts: [],
  loading: false,
  error: null
};

export const fetchUserAlerts = createAsyncThunk(
  'alerts/fetchUserAlerts',
  async (userId: string, { rejectWithValue }) => {
    try {
      const alertsQuery = query(
        collection(firestore, 'alerts'),
        where('userId', '==', userId)
      );
      
      const alertsSnapshot = await getDocs(alertsQuery);
      const alerts: Alert[] = [];
      
      alertsSnapshot.forEach((doc) => {
        alerts.push({ id: doc.id, ...doc.data() } as Alert);
      });
      
      return alerts;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createAlert = createAsyncThunk(
  'alerts/createAlert',
  async ({ userId, alertData }: { userId: string; alertData: Omit<Alert, 'id' | 'userId' | 'createdAt' | 'updatedAt'> }, { rejectWithValue }) => {
    try {
      const alertRef = doc(collection(firestore, 'alerts'));
      const timestamp = Date.now();
      
      const newAlert: Alert = {
        id: alertRef.id,
        userId,
        ...alertData,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      await setDoc(alertRef, newAlert);
      
      return newAlert;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAlert = createAsyncThunk(
  'alerts/updateAlert',
  async ({ alertId, alertData }: { alertId: string; alertData: Partial<Alert> }, { rejectWithValue }) => {
    try {
      const alertRef = doc(firestore, 'alerts', alertId);
      const timestamp = Date.now();
      
      const updatedData = {
        ...alertData,
        updatedAt: timestamp
      };
      
      await updateDoc(alertRef, updatedData);
      
      const updatedAlertDoc = await getDoc(alertRef);
      
      if (updatedAlertDoc.exists()) {
        return { id: updatedAlertDoc.id, ...updatedAlertDoc.data() } as Alert;
      } else {
        throw new Error('Alert not found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAlert = createAsyncThunk(
  'alerts/deleteAlert',
  async (alertId: string, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(firestore, 'alerts', alertId));
      return alertId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserAlerts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserAlerts.fulfilled, (state, action) => {
      state.alerts = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchUserAlerts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    builder.addCase(createAlert.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createAlert.fulfilled, (state, action) => {
      state.alerts.push(action.payload);
      state.loading = false;
      state.error = null;
    });
    builder.addCase(createAlert.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    builder.addCase(updateAlert.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateAlert.fulfilled, (state, action) => {
      const index = state.alerts.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.alerts[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    });
    builder.addCase(updateAlert.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    builder.addCase(deleteAlert.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteAlert.fulfilled, (state, action) => {
      state.alerts = state.alerts.filter(a => a.id !== action.payload);
      state.loading = false;
      state.error = null;
    });
    builder.addCase(deleteAlert.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

export const { clearError } = alertsSlice.actions;
export default alertsSlice.reducer;
