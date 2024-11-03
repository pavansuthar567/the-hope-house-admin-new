import { combineReducers, configureStore } from '@reduxjs/toolkit';

import user from './slices/userSlice';
import faqs from './slices/faqsSlice';
import event from './slices/eventSlice';
import quote from './slices/quoteSlice';
import common from './slices/commonSlice';
import gallery from './slices/gallerySlice';
import volunteer from './slices/volunteerSlice';
import teamMembers from './slices/teamMembersSlice';
import testimonial from './slices/testimonialSlice';
import recognition from './slices/recognitionSlice';
import blog from './slices/blogSlice';

// ----------------------------------------------------------------------

const reducers = combineReducers({
  faqs,
  user,
  event,
  quote,
  common,
  gallery,
  volunteer,
  teamMembers,
  recognition,
  testimonial,
  blog,
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
