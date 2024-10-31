import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fileUploadLoading: false,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setFileUploadLoading: (state, action) => {
      state.fileUploadLoading = action.payload;
    },
  },
});

export const { setFileUploadLoading } = commonSlice.actions;
export default commonSlice.reducer;
