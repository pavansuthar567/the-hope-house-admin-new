import { createSlice } from '@reduxjs/toolkit';

export const recognitionInitDetails = {
  title: '',
  type: '',
  description: '',
  date: null,
  imageUrl: '',
  previewImageUrl: '',
  imageUrl: '',
};

const initialState = {
  recognitionList: [],
  perPageCount: 12,
  recognitionLoading: false,
  crudRecognitionLoading: false,
  selectedRecognition: recognitionInitDetails,
  exportExcelLoading: false,
};

const recognitionSlice = createSlice({
  name: 'recognition',
  initialState,
  reducers: {
    setRecognitionList: (state, action) => {
      state.recognitionList = action.payload;
    },
    setPerPageCount: (state, action) => {
      state.perPageCount = action.payload;
    },
    setRecognitionLoading: (state, action) => {
      state.recognitionLoading = action.payload;
    },
    setSelectedRecognition: (state, action) => {
      state.selectedRecognition = action.payload;
    },
    setCrudRecognitionLoading: (state, action) => {
      state.crudRecognitionLoading = action.payload;
    },
    setExportExcelLoading: (state, action) => {
      state.exportExcelLoading = action.payload;
    },
  },
});

export const {
  setRecognitionList,
  setPerPageCount,
  setRecognitionLoading,
  setSelectedRecognition,
  setCrudRecognitionLoading,
  setExportExcelLoading,
} = recognitionSlice.actions;
export default recognitionSlice.reducer;
