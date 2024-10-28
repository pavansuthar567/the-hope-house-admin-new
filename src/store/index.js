import { combineReducers, configureStore } from '@reduxjs/toolkit';

import volunteer from './slices/volunteerSlice';
import testimonial from './slices/testimonialSlice';

// ----------------------------------------------------------------------

const reducers = combineReducers({
  volunteer,
  testimonial,
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
