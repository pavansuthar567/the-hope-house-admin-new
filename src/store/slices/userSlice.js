import { createSlice } from '@reduxjs/toolkit';

export const userInitDetails = {
  name: '',
  email: '',
  password: '',
};

const initialState = {
  userList: [],
  perPageCount: 12,
  userLoading: false,
  crudUserLoading: false,
  selectedUser: userInitDetails,
  exportExcelLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
    setPerPageCount: (state, action) => {
      state.perPageCount = action.payload;
    },
    setUserLoading: (state, action) => {
      state.userLoading = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setCrudUserLoading: (state, action) => {
      state.crudUserLoading = action.payload;
    },
    setExportExcelLoading: (state, action) => {
      state.exportExcelLoading = action.payload;
    },
  },
});

export const {
  setUserList,
  setPerPageCount,
  setUserLoading,
  setSelectedUser,
  setCrudUserLoading,
  setExportExcelLoading,
} = userSlice.actions;
export default userSlice.reducer;
