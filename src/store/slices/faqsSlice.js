import { createSlice } from '@reduxjs/toolkit';

export const faqsInitDetails = {
  question: '',
  answer: '',
  category: 'General',
};

const initialState = {
  faqsList: [],
  perPageCount: 12,
  faqsLoading: false,
  crudFaqsLoading: false,
  selectedFaqs: faqsInitDetails,
  exportExcelLoading: false,
};

const faqsSlice = createSlice({
  name: 'faqs',
  initialState,
  reducers: {
    setFaqsList: (state, action) => {
      state.faqsList = action.payload;
    },
    setPerPageCount: (state, action) => {
      state.perPageCount = action.payload;
    },
    setFaqsLoading: (state, action) => {
      state.faqsLoading = action.payload;
    },
    setSelectedFaqs: (state, action) => {
      state.selectedFaqs = action.payload;
    },
    setCrudFaqsLoading: (state, action) => {
      state.crudFaqsLoading = action.payload;
    },
    setExportExcelLoading: (state, action) => {
      state.exportExcelLoading = action.payload;
    },
  },
});

export const {
  setFaqsList,
  setPerPageCount,
  setFaqsLoading,
  setSelectedFaqs,
  setCrudFaqsLoading,
  setExportExcelLoading,
} = faqsSlice.actions;
export default faqsSlice.reducer;
