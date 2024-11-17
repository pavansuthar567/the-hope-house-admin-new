import { createSlice } from '@reduxjs/toolkit';

export const galleryInitDetails = {
  eventId: null,
  caption: '',
  imageUrl: [],
  previewImageUrl: [],
  deleteUploadedImageUrl: [],
};

const initialState = {
  galleryList: [],
  perPageCount: 4,
  galleryLoading: false,
  crudGalleryLoading: false,
  selectedGallery: galleryInitDetails,
  exportExcelLoading: false,
};

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    setGalleryList: (state, action) => {
      state.galleryList = action.payload;
    },
    setPerPageCount: (state, action) => {
      state.perPageCount = action.payload;
    },
    setGalleryLoading: (state, action) => {
      state.galleryLoading = action.payload;
    },
    setSelectedGallery: (state, action) => {
      state.selectedGallery = action.payload;
    },
    setCrudGalleryLoading: (state, action) => {
      state.crudGalleryLoading = action.payload;
    },
    setExportExcelLoading: (state, action) => {
      state.exportExcelLoading = action.payload;
    },
  },
});

export const {
  setGalleryList,
  setPerPageCount,
  setGalleryLoading,
  setSelectedGallery,
  setCrudGalleryLoading,
  setExportExcelLoading,
} = gallerySlice.actions;
export default gallerySlice.reducer;
