import { combineReducers, configureStore } from '@reduxjs/toolkit';

import volunteer from './slices/volunteerSlice';

// ----------------------------------------------------------------------

const reducers = combineReducers({
  volunteer,
});

// ----------------------------------------------------------------------

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
