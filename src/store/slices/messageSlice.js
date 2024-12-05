import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messageList: [],
  messageLoading: false,
  selectedMessage: null,
  crudMessageLoading: false,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessageList: (state, action) => {
      state.messageList = action.payload;
    },
    setMessageLoading: (state, action) => {
      state.messageLoading = action.payload;
    },
    setSelectedMessage: (state, action) => {
      state.selectedMessage = action.payload;
    },
    setCrudMessageLoading: (state, action) => {
      state.crudMessageLoading = action.payload;
    },
  },
});

export const { setMessageList, setMessageLoading, setSelectedMessage, setCrudMessageLoading } =
  messageSlice.actions;

export default messageSlice.reducer;
