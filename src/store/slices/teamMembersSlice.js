import { createSlice } from '@reduxjs/toolkit';

export const teamMembersInitDetails = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
  },
  role: '',
  bio: '',
  dateOfJoining: '',
  socialMediaLinks: {
    linkedIn: '',
    twitter: '',
    instagram: '',
  },
  profilePictureUrl: [],
  previewProfilePic: [],
  deleteUploadedProfilePic: [],
};

const initialState = {
  teamMembersList: [],
  perPageCount: 12,
  teamMembersLoading: false,
  crudTeamMembersLoading: false,
  selectedTeamMembers: teamMembersInitDetails,
  exportExcelLoading: false,
};

const teamMembersSlice = createSlice({
  name: 'teamMembers',
  initialState,
  reducers: {
    setTeamMembersList: (state, action) => {
      state.teamMembersList = action.payload;
    },
    setPerPageCount: (state, action) => {
      state.perPageCount = action.payload;
    },
    setTeamMembersLoading: (state, action) => {
      state.teamMembersLoading = action.payload;
    },
    setSelectedTeamMembers: (state, action) => {
      state.selectedTeamMembers = action.payload;
    },
    setCrudTeamMembersLoading: (state, action) => {
      state.crudTeamMembersLoading = action.payload;
    },
    setExportExcelLoading: (state, action) => {
      state.exportExcelLoading = action.payload;
    },
  },
});

export const {
  setTeamMembersList,
  setPerPageCount,
  setTeamMembersLoading,
  setSelectedTeamMembers,
  setCrudTeamMembersLoading,
  setExportExcelLoading,
} = teamMembersSlice.actions;
export default teamMembersSlice.reducer;
