import { createSlice } from '@reduxjs/toolkit';

export const quoteInitDetails = {
  text: '',
  author: '',
  source: '',
  category: '',
};

const initialState = {
  quoteList: [],
  perPageCount: 12,
  quoteLoading: false,
  crudQuoteLoading: false,
  selectedQuote: quoteInitDetails,
  exportExcelLoading: false,
};

const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    setQuoteList: (state, action) => {
      state.quoteList = action.payload;
    },
    setPerPageCount: (state, action) => {
      state.perPageCount = action.payload;
    },
    setQuoteLoading: (state, action) => {
      state.quoteLoading = action.payload;
    },
    setSelectedQuote: (state, action) => {
      state.selectedQuote = action.payload;
    },
    setCrudQuoteLoading: (state, action) => {
      state.crudQuoteLoading = action.payload;
    },
    setExportExcelLoading: (state, action) => {
      state.exportExcelLoading = action.payload;
    },
  },
});

export const {
  setQuoteList,
  setPerPageCount,
  setQuoteLoading,
  setSelectedQuote,
  setCrudQuoteLoading,
  setExportExcelLoading,
} = quoteSlice.actions;
export default quoteSlice.reducer;
