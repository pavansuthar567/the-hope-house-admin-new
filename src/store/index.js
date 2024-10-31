import { combineReducers, configureStore } from '@reduxjs/toolkit';

import event from './slices/eventSlice';
import common from './slices/commonSlice';
import volunteer from './slices/volunteerSlice';
import teamMembers from './slices/teamMembersSlice';
import user from './slices/userSlice';

// ----------------------------------------------------------------------

const reducers = combineReducers({
  event,
  user,
  common,
  volunteer,
  teamMembers,
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
