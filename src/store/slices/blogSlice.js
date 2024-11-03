import { createSlice } from '@reduxjs/toolkit';

export const blogInitDetails = {
  title: '',
  content: '',
  author: '',
  category: '',
  tags: [],
  publishedDate: '',
  status: 'Draft',
  featuredImage: '',
  comments: [],
  likes: 0,
  views: 0,
};

const initialState = {
  blogList: [],
  perPageCount: 10,
  blogLoading: false,
  selectedBlog: blogInitDetails,
  crudBlogLoading: false,
  duplicateBlogLoading: false,
  exportExcelLoading: false,
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setBlogList: (state, action) => {
      state.blogList = action.payload;
    },
    setPerPageCount: (state, action) => {
      state.perPageCount = action.payload;
    },
    setBlogLoading: (state, action) => {
      state.blogLoading = action.payload;
    },
    setSelectedBlog: (state, action) => {
      state.selectedBlog = action.payload;
    },
    setCrudBlogLoading: (state, action) => {
      state.crudBlogLoading = action.payload;
    },
    setDuplicateBlogLoading: (state, action) => {
      state.duplicateBlogLoading = action.payload;
    },
    setExportExcelLoading: (state, action) => {
      state.exportExcelLoading = action.payload;
    },
  },
});

export const {
  setBlogList,
  setPerPageCount,
  setBlogLoading,
  setSelectedBlog,
  setCrudBlogLoading,
  setDuplicateBlogLoading,
  setExportExcelLoading,
} = blogSlice.actions;

export default blogSlice.reducer;
