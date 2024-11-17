import { toast } from 'react-toastify';

import { fhelper } from 'src/_helpers';
import axios from 'axios';
import {
  setCrudEventLoading,
  setSelectedEvent,
  setEventList,
  setEventLoading,
} from 'src/store/slices/eventSlice';
import { toastError } from '.';
import { deleteFile, fileUpload } from './upload.service';

export const getEvents = () => async (dispatch) => {
  try {
    dispatch(setEventLoading(true));
    const res = await axios.get('event');
    const updated = res?.data?.data?.map((x, i) => ({ srNo: i + 1, ...x }));
    await dispatch(setEventList(fhelper.sortByField(updated) || []));
    return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setEventLoading(false));
  }
};

export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch(setCrudEventLoading(true));
    const res = await axios.delete(`event/${id}`);
    if (res) {
      toast.success('A event deleted successfully');
      return true;
    } else return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudEventLoading(false));
  }
};

export const createEvent = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudEventLoading(true));
    let obj = { ...payload };
    let urls = [];

    let files = [...obj?.featuredImage?.filter((x) => typeof x === 'object')] || [];

    if (files?.length) {
      try {
        urls = await dispatch(fileUpload(files));
        if (urls?.length) obj.featuredImage = urls;
      } catch (e) {
        toastError(e);
        return false;
      }
    } else {
      obj.featuredImage = [];
    }

    delete obj.deleteUploadedfeaturedImage;
    const res = await axios.post('event', obj);

    if (res) {
      toast.success('Event inserted successfully');
      return true;
    }
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudEventLoading(false));
  }
};

export const updateEvent = (obj) => async (dispatch) => {
  try {
    if (obj && obj?._id) {
      const { _id, __v, deleteUploadedfeaturedImage, ...payload } = obj;
      if (_id) {
        dispatch(setCrudEventLoading(true));
        let obj = { ...payload };
        let urls = [];

        // Delete old images from Cloudinary
        if (deleteUploadedfeaturedImage && deleteUploadedfeaturedImage.length) {
          try {
            await dispatch(deleteFile(deleteUploadedfeaturedImage));
          } catch (e) {
            toastError(e);
            return false;
          }
        }

        // let files = [...obj?.featuredImage?.filter((x) => typeof x === 'object')];
        let files = [
          ...(obj?.featuredImage || [])?.filter((x) => x instanceof File || x instanceof Blob),
        ];

        if (files?.length) {
          try {
            urls = await dispatch(fileUpload(files));
            if (urls?.length)
              obj.featuredImage = [
                ...obj?.featuredImage?.filter((x) => x?.image),
                ...urls?.map((x) => ({
                  image: x,
                })),
              ];
          } catch (e) {
            toastError(e);
            return false;
          }
        }

        obj.featuredImage = obj?.featuredImage?.map((x) => x?.image) || [];
        delete obj.deleteUploadedfeaturedImage;

        const res = await axios.put(`event/${_id}`, obj);
        if (res) {
          toast.success('Event updated successfully');
          return true;
        } else {
          toast.success('Event ID is required');
          return false;
        }
      }
      return false;
    }
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudEventLoading(false));
  }
};

export const getEvent = (id) => async (dispatch) => {
  try {
    dispatch(setEventLoading(true));
    const res = await axios.get(`event/${id}`);

    if (res) {
      let data = { ...res?.data?.data };

      // Handling profile picture
      if (data?.featuredImage) {
        data.deleteUploadedfeaturedImage = [];
        data.previewfeaturedImage =
          data?.featuredImage?.map((image) => ({ image, type: 'old' })) || [];
        data.featuredImage = data?.featuredImage || [];
      } else {
        data.featuredImage = []; // Clear if no profile picture
      }

      // Optionally handle additional images (if applicable)
      if (data?.featuredImage?.length) {
        data.featuredImage = data.featuredImage?.map((image) => ({
          type: 'old',
          image,
        }));
      }

      dispatch(setSelectedEvent(data));
      return res;
    }

    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setEventLoading(false));
  }
};
