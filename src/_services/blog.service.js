import { toast } from 'react-toastify';
import {
  setBlogLoading,
  setBlogList,
  setCrudBlogLoading,
  setSelectedBlog,
} from 'src/store/slices/blogSlice';
import { fhelper } from 'src/_helpers';
import { toastError } from '.';
import axios from 'axios';
import { deleteFile, fileUpload } from './upload.service';

export const getBlogs = () => async (dispatch) => {
  try {
    dispatch(setBlogLoading(true));
    const res = await axios.get('blog');
    const updated = res?.data?.data?.map((x, i) => ({ srNo: i + 1, ...x }));
    await dispatch(setBlogList(fhelper.sortByField(updated) || []));
    return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setBlogLoading(false));
  }
};

export const deleteBlog = (id) => async (dispatch) => {
  try {
    dispatch(setCrudBlogLoading(true));
    const res = await axios.delete(`blog/${id}`);
    if (res) {
      toast.success('Blog deleted successfully');
      return true;
    }
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudBlogLoading(false));
  }
};

export const createBlog = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudBlogLoading(true));
    let obj = { ...payload };
    let urls = [];

    let files = [...obj?.featuredImage?.filter((x) => typeof x === 'object')];

    if (files?.length) {
      urls = await dispatch(fileUpload(files));
      if (urls?.length) obj.featuredImage = urls?.[0];
    } else {
      obj.featuredImage = obj.featuredImage?.[0];
    }

    delete obj.deleteUploadedFeaturedImage;
    const res = await axios.post('blog', obj);

    if (res) {
      toast.success('Blog created successfully');
      return true;
    }
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudBlogLoading(false));
  }
};

export const updateBlog = (obj) => async (dispatch) => {
  try {
    if (!obj || !obj._id) return false;
    const { _id, srNo, __v, ...payload } = obj;

    if (_id) {
      dispatch(setCrudBlogLoading(true));
      let obj = {
        ...payload,
        createdBy: payload?.createdBy?._id || payload?.createdBy,
        updatedBy: payload?.updatedBy?._id || payload?.updatedBy,
      };
      let urls = [];

      // Delete old images from Cloudinary
      if (obj?.deleteUploadedFeaturedImage && obj?.deleteUploadedFeaturedImage?.length) {
        await dispatch(deleteFile(obj?.deleteUploadedFeaturedImage));
      }

      let files = [...obj?.featuredImage?.filter((x) => typeof x === 'object')];
      if (files?.length) {
        urls = await dispatch(fileUpload(files));
        if (urls?.length) obj.featuredImage = urls?.[0];
      } else {
        obj.featuredImage = obj.featuredImage?.[0] || '';
      }

      delete obj.deleteUploadedFeaturedImage;
      const res = await axios.put(`blog/${_id}`, obj);

      if (res) {
        toast.success('Blog updated successfully');
        return true;
      }
    }

    toast.error('Blog update failed: ID is required');
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudBlogLoading(false));
  }
};

export const getBlog = (id) => async (dispatch) => {
  try {
    dispatch(setBlogLoading(true));

    const res = await axios.get(`blog/${id}`);
    const { data } = res?.data || {};

    if (res) {
      let blog = { ...data, tags: data?.tags?.join(', ') };

      // Handling profile picture
      if (blog?.featuredImage) {
        blog.deleteUploadedFeaturedImage = [];
        blog.previewFeaturedImage = [{ image: blog?.featuredImage, type: 'old' }];
        blog.featuredImage = [blog?.featuredImage];
      } else {
        blog.previewFeaturedImage = []; // Clear if no profile picture
      }

      // Optionally handle additional images (if applicable)
      if (blog?.featuredImage?.length) {
        blog.previewFeaturedImage = blog.featuredImage?.map((image) => ({
          type: 'old',
          image,
        }));
      }

      dispatch(setSelectedBlog(blog));
      return res;
    }
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setBlogLoading(false));
  }
};
