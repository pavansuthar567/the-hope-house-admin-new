import { createSlice } from '@reduxjs/toolkit';

export const volunteerInitDetails = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  address: {
    city: '',
    state: '',
  },
  gender: '',
  skills: [],
  otherSkill: '',
  availability: '',
  experience: '',
};

const initialState = {
  volunteerList: [],
  perPageCount: 12,
  volunteerLoading: false,
  crudVolunteerLoading: false,
  selectedVolunteer: volunteerInitDetails,
  exportExcelLoading: false,
};

const volunteerSlice = createSlice({
  name: 'volunteer',
  initialState,
  reducers: {
    setVolunteerList: (state, action) => {
      state.volunteerList = action.payload;
    },
    setPerPageCount: (state, action) => {
      state.perPageCount = action.payload;
    },
    setVolunteerLoading: (state, action) => {
      state.volunteerLoading = action.payload;
    },
    setSelectedVolunteer: (state, action) => {
      state.selectedVolunteer = action.payload;
    },
    setCrudVolunteerLoading: (state, action) => {
      state.crudVolunteerLoading = action.payload;
    },
    setExportExcelLoading: (state, action) => {
      state.exportExcelLoading = action.payload;
    },
  },
});

export const {
  setVolunteerList,
  setPerPageCount,
  setVolunteerLoading,
  setSelectedVolunteer,
  setCrudVolunteerLoading,
  setExportExcelLoading,
} = volunteerSlice.actions;
export default volunteerSlice.reducer;
