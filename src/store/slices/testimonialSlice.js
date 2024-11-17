import { createSlice } from '@reduxjs/toolkit';

export const testimonialInitDetails = {
  name: '',
  designation: '',
  message: '',
  image: [],
  previewImage: [],
  deleteUploadedImage: [],
};

const initialState = {
  testimonialList: [],
  perPageCount: 12,
  testimonialLoading: false,
  selectedTestimonial: testimonialInitDetails,
  crudTestimonialLoading: false,
  duplicateTestimonialLoading: false,
  exportExcelLoading: false,
};

const testimonialSlice = createSlice({
  name: 'testimonial',
  initialState,
  reducers: {
    setTestimonialList: (state, action) => {
      state.testimonialList = action.payload;
    },
    setPerPageCount: (state, action) => {
      state.perPageCount = action.payload;
    },
    setTestimonialLoading: (state, action) => {
      state.testimonialLoading = action.payload;
    },
    setSelectedTestimonial: (state, action) => {
      state.selectedTestimonial = action.payload;
    },
    setCrudTestimonialLoading: (state, action) => {
      state.crudTestimonialLoading = action.payload;
    },
    setDuplicateTestimonialLoading: (state, action) => {
      state.duplicateTestimonialLoading = action.payload;
    },
    setExportExcelLoading: (state, action) => {
      state.exportExcelLoading = action.payload;
    },
  },
});

export const {
  setTestimonialList,
  setPerPageCount,
  setTestimonialLoading,
  setSelectedTestimonial,
  setCrudTestimonialLoading,
  setDuplicateTestimonialLoading,
  setExportExcelLoading,
} = testimonialSlice.actions;

export default testimonialSlice.reducer;
