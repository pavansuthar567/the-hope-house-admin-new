import { toast } from 'react-toastify';

import {
  setTestimonialLoading,
  setTestimonialList,
  setCrudTestimonialLoading,
  setSelectedTestimonial,
} from 'src/store/slices/testimonialSlice';
import { fhelper } from 'src/_helpers';
import axios from 'axios';
import { toastError } from 'src/actions';

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
    const res = await axios.post('testimonial', payload);

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
