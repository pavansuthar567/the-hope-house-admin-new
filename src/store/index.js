import { combineReducers, configureStore } from '@reduxjs/toolkit';

import user from './slices/userSlice';
import event from './slices/eventSlice';
import common from './slices/commonSlice';
import volunteer from './slices/volunteerSlice';
import teamMembers from './slices/teamMembersSlice';
import testimonial from './slices/testimonialSlice';

// ----------------------------------------------------------------------

const reducers = combineReducers({
  event,
  user,
  common,
  volunteer,
  teamMembers,
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
