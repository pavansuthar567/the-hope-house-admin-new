import { createSlice } from '@reduxjs/toolkit';

export const eventInitDetails = {
  eventName: '',
  description: '',
  organizer: '',
  endDate: null,
  startDate: null,
  location: {
    venue: '',
    city: '',
  },
  capacity: 0,
  participantsRegistered: 0,
  registrationLink: '',
  eventType: 'Virtual',
  content: '',
  featuredImage: [],
  previewfeaturedImage: [],
  deleteUploadedfeaturedImage: [],
  status: '',
};

const initialState = {
  eventList: [],
  perPageCount: 12,
  eventLoading: false,
  crudEventLoading: false,
  selectedEvent: eventInitDetails,
  exportExcelLoading: false,
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEventList: (state, action) => {
      state.eventList = action.payload;
    },
    setPerPageCount: (state, action) => {
      state.perPageCount = action.payload;
    },
    setEventLoading: (state, action) => {
      state.eventLoading = action.payload;
    },
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    setCrudEventLoading: (state, action) => {
      state.crudEventLoading = action.payload;
    },
    setExportExcelLoading: (state, action) => {
      state.exportExcelLoading = action.payload;
    },
  },
});

export const {
  setEventList,
  setPerPageCount,
  setEventLoading,
  setSelectedEvent,
  setCrudEventLoading,
  setExportExcelLoading,
} = eventSlice.actions;
export default eventSlice.reducer;
