import { configureStore } from '@reduxjs/toolkit';
import boardReducer from '../features/board/boardSlice';
import authReducer from '../features/auth/authSlice';
import { loadAppState, saveAppState } from '../utils/localStorage';

const preloadedState = loadAppState();

export const store = configureStore({
  reducer: {
    board: boardReducer,
    auth: authReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveAppState(store.getState());
});
