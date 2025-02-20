import { createSlice } from '@reduxjs/toolkit';

export const homeInitDetails = {
  quote: '',
  whoWeAre: '',
  whatWeDo: '',
  heroSectionVideo: '',
  // previewHeroSectionVideo: [],
  // deleteUploadedHeroSectionVideo: [],
  logo: [],
  previewLogo: [],
  deleteUploadedLogo: [],
  isActive: false,
  termsOfUse: '',
  privacyPolicy: '',
  statistics: {
    beneficiaryServed: '0',
    totalVolunteers: '0',
    cityPresence: '0',
    donationReceived: '0',
  },

  // Home section images
  whyChooseThumb1: [],
  previewWhyChooseThumb1: [],
  deleteUploadedWhyChooseThumb1: [],
  whyChooseThumb2: [],
  previewWhyChooseThumb2: [],
  deleteUploadedWhyChooseThumb2: [],
  togetherBg: [],
  previewTogetherBg: [],
  deleteUploadedTogetherBg: [],

  // Page title backgrounds
  aboutBg: [],
  previewAboutBg: [],
  deleteUploadedAboutBg: [],
  teamMembersBg: [],
  previewTeamMembersBg: [],
  deleteUploadedTeamMembersBg: [],
  eventBg: [],
  previewEventBg: [],
  deleteUploadedEventBg: [],
  galleryBg: [],
  previewGalleryBg: [],
  deleteUploadedGalleryBg: [],
  faqBg: [],
  previewFaqBg: [],
  deleteUploadedFaqBg: [],
  blogBg: [],
  previewBlogBg: [],
  deleteUploadedBlogBg: [],
  contactBg: [],
  previewContactBg: [],
  deleteUploadedContactBg: [],
  donateBg: [],
  previewDonateBg: [],
  deleteUploadedDonateBg: [],
  volunteerBg: [],
  previewVolunteerBg: [],
  deleteUploadedVolunteerBg: [],

  // About us page images
  empowerCommunities: [],
  previewEmpowerCommunities: [],
  deleteUploadedEmpowerCommunities: [],
  supportTheNextInitiative: [],
  previewSupportTheNextInitiative: [],
  deleteUploadedSupportTheNextInitiative: [],
};

const initialState = {
  homeList: [],
  perPageCount: 12,
  homeLoading: false,
  crudHomeLoading: false,
  exportExcelLoading: false,
  selectedHome: homeInitDetails,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setHomeList: (state, action) => {
      state.homeList = action.payload;
    },
    setSelectedHome: (state, action) => {
      state.selectedHome = action.payload;
    },
    setPerPageCount: (state, action) => {
      state.perPageCount = action.payload;
    },
    setHomeLoading: (state, action) => {
      state.homeLoading = action.payload;
    },
    setCrudHomeLoading: (state, action) => {
      state.crudHomeLoading = action.payload;
    },
    setExportExcelLoading: (state, action) => {
      state.exportExcelLoading = action.payload;
    },
  },
});

export const {
  setSelectedHome,
  setPerPageCount,
  setHomeList,
  setHomeLoading,
  setCrudHomeLoading,
  setExportExcelLoading,
} = homeSlice.actions;
export default homeSlice.reducer;
