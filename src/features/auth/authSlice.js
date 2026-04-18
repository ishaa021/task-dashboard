import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../../lib/firebase';

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  initialized: false,
};

const mapFirebaseError = (code) => {
  const messages = {
    'auth/configuration-not-found':
      'Firebase Authentication is not configured yet. Add your Firebase env values first.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/missing-password': 'Please enter your password.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/user-not-found': 'No account found for this email.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/wrong-password': 'Invalid email or password.',
  };

  return messages[code] || 'Authentication failed. Please try again.';
};

const mapUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    id: user.uid,
    name: user.displayName || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    location: 'Firebase Auth',
  };
};

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, {
        displayName: name.trim(),
      });

      return mapUser({
        ...credential.user,
        displayName: name.trim(),
      });
    } catch (error) {
      return rejectWithValue(mapFirebaseError(error.code));
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      return mapUser(credential.user);
    } catch (error) {
      return rejectWithValue(mapFirebaseError(error.code));
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await signOut(auth);
  } catch (error) {
    return rejectWithValue(mapFirebaseError(error.code));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    setAuthUser(state, action) {
      state.currentUser = action.payload;
      state.initialized = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to create account.';
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to login.';
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to logout.';
      });
  },
});

export const { clearAuthError, setAuthUser } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectIsAuthenticated = (state) => Boolean(state.auth.currentUser);
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthInitialized = (state) => state.auth.initialized;

export default authSlice.reducer;
