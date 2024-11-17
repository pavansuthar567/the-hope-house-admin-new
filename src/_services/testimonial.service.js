import { toast } from 'react-toastify';

import {
  setTestimonialLoading,
  setTestimonialList,
  setCrudTestimonialLoading,
  setSelectedTestimonial,
} from 'src/store/slices/testimonialSlice';
import { fhelper } from 'src/_helpers';
import { toastError } from '.';
import axios from 'axios';
import { fileUpload, deleteFile } from './upload.service';

export const getTestimonials = () => async (dispatch) => {
  try {
    dispatch(setTestimonialLoading(true));
    const res = await axios.get('testimonial');
    const updated = res?.data?.data?.map((x, i) => ({ srNo: i + 1, ...x }));
    await dispatch(setTestimonialList(fhelper.sortByField(updated) || []));
    return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setTestimonialLoading(false));
  }
};

export const deleteTestimonial = (id) => async (dispatch) => {
  try {
    dispatch(setCrudTestimonialLoading(true));
    const res = await axios.delete(`testimonial/${id}`);
    if (res) {
      toast.success('Testimonial deleted successfully');
      return true;
    } else return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudTestimonialLoading(false));
  }
};

export const createTestimonial = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudTestimonialLoading(true));
    let obj = { ...payload };
    let urls = [];

    // Handle image upload
    let files = [...obj?.image?.filter((x) => typeof x === 'object')];

    if (files?.length) {
      urls = await dispatch(fileUpload(files));
      if (urls?.length) obj.image = urls?.[0];
    } else {
      obj.image = obj.image?.[0];
    }

    delete obj.deleteUploadedImage;
    const res = await axios.post('testimonial', obj);

    if (res) {
      toast.success('Testimonial inserted successfully');
      return true;
    }
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudTestimonialLoading(false));
  }
};

export const updateTestimonial = (obj) => async (dispatch) => {
  if (!obj || !obj._id) return false;

  dispatch(setCrudTestimonialLoading(true));
  const { _id, srNo, __v, ...payload } = obj;

  try {
    // Handle image upload
    let urls = [];
    let files = [...payload?.image?.filter((x) => typeof x === 'object')];

    // Delete old images if any
    if (payload.deleteUploadedImage && payload.deleteUploadedImage.length) {
      await dispatch(deleteFile(payload.deleteUploadedImage));
    }

    if (files?.length) {
      urls = await dispatch(fileUpload(files));
      if (urls?.length) payload.image = urls[0];
    } else {
      payload.image = payload.image?.[0];
    }

    delete payload.deleteUploadedImage;
    const res = await axios.put(`testimonial/${_id}`, {
      ...payload,
      createdBy: payload.createdBy?._id,
      updatedBy: payload.updatedBy?._id,
    });

    if (res) {
      toast.success('Testimonial updated successfully');
      return true;
    }

    toast.error('Testimonial update failed: ID is required');
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudTestimonialLoading(false));
  }
};

export const getTestimonial = (id) => async (dispatch) => {
  try {
    dispatch(setTestimonialLoading(true));
    const res = await axios.get(`testimonial/${id}`);

    if (res) {
      let data = { ...res?.data?.data };

      // Handling preview image
      if (data?.image) {
        data.deleteUploadedImage = [];
        data.previewImage = [{ image: data?.image, type: 'old' }];
        data.image = [data?.image];
      } else {
        data.previewImage = []; // Clear if no image
      }

      // Optionally handle additional images (if applicable)
      if (data?.image?.length) {
        data.previewImage = data.image?.map((image) => ({
          type: 'old',
          image,
        }));
      }

      dispatch(setSelectedTestimonial(data));
      return res;
    }
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setTestimonialLoading(false));
  }
};
