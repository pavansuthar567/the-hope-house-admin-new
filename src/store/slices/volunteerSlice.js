import { createSlice } from '@reduxjs/toolkit';

export const volunteerInitDetails = {
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
  dateOfBirth: '',
  gender: '',
  skills: [],
  otherSkill: '',
  availability: '',
  joinedDate: '',
  experience: '',
  emergencyContact: {
    name: '',
    phoneNumber: '',
    relation: '',
  },
};

const initialState = {
  menuList: {},
  volunteerList: [],
  perPageCount: 12,
  categoriesList: [],
  volunteerTypesList: [],
  volunteerLoading: false,
  subCategoriesList: [],
  activeVolunteerList: [],
  crudVolunteerLoading: false,
  duplicateVolunteerLoading: false,
  customizationTypesList: [],
  customizationSubTypesList: [],
  selectedVolunteer: volunteerInitDetails,
  exportExcelLoading: false,
};

const volunteerSlice = createSlice({
  name: 'volunteer',
  initialState,
  reducers: {
    setMenuList: (state, action) => {
      state.menuList = action.payload;
    },
    setVolunteerList: (state, action) => {
      state.volunteerList = action.payload;
    },
    setPerPageCount: (state, action) => {
      state.perPageCount = action.payload;
    },
    setCategoriesList: (state, action) => {
      state.categoriesList = action.payload;
    },
    setVolunteerLoading: (state, action) => {
      state.volunteerLoading = action.payload;
    },
    setSelectedVolunteer: (state, action) => {
      state.selectedVolunteer = action.payload;
    },
    setVolunteerTypesList: (state, action) => {
      state.volunteerTypesList = action.payload;
    },
    setSubCategoriesList: (state, action) => {
      state.subCategoriesList = action.payload;
    },
    setActiveVolunteerList: (state, action) => {
      state.activeVolunteerList = action.payload;
    },
    setCrudVolunteerLoading: (state, action) => {
      state.crudVolunteerLoading = action.payload;
    },
    setDuplicateVolunteerLoading: (state, action) => {
      state.duplicateVolunteerLoading = action.payload;
    },
    setCustomizationTypesList: (state, action) => {
      state.customizationTypesList = action.payload;
    },
    setCustomizationSubTypesList: (state, action) => {
      state.customizationSubTypesList = action.payload;
    },
    setExportExcelLoading: (state, action) => {
      state.exportExcelLoading = action.payload;
    },
  },
});

export const {
  setMenuList,
  setVolunteerList,
  setPerPageCount,
  setVolunteerLoading,
  setCategoriesList,
  setSelectedVolunteer,
  setVolunteerTypesList,
  setActiveVolunteerList,
  setSubCategoriesList,
  setCrudVolunteerLoading,
  setCustomizationTypesList,
  setCustomizationSubTypesList,
  setExportExcelLoading,
  setDuplicateVolunteerLoading,
} = volunteerSlice.actions;
export default volunteerSlice.reducer;
