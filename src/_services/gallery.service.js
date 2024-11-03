import axios from 'axios';
import { toast } from 'react-toastify';

import {
  setGalleryList,
  setGalleryLoading,
  setSelectedGallery,
  setCrudGalleryLoading,
} from 'src/store/slices/gallerySlice';
import { toastError } from '.';
import { fhelper } from 'src/_helpers';
import { deleteFile, fileUpload } from './upload.service';

export const getGalleries = () => async (dispatch) => {
  try {
    dispatch(setGalleryLoading(true));
    const res = await axios.get('gallery');
    const updated = res?.data?.data?.map((x, i) => ({ srNo: i + 1, ...x }));
    await dispatch(setGalleryList(fhelper.sortByField(updated) || []));
    return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setGalleryLoading(false));
  }
};

export const deleteGallery = (id) => async (dispatch) => {
  try {
    dispatch(setCrudGalleryLoading(true));
    const res = await axios.delete(`gallery/${id}`);
    if (res) {
      toast.success('Gallery deleted successfully');
      return true;
    } else return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudGalleryLoading(false));
  }
};

export const createGallery = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudGalleryLoading(true));
    let obj = { ...payload };
    let urls = [];

    let files = [...obj?.imageUrl?.filter((x) => typeof x === 'object')];

    if (files?.length) {
      try {
        urls = await dispatch(fileUpload(files));
        if (urls?.length) obj.imageUrl = urls?.[0];
      } catch (e) {
        toastError(e);
        return false;
      }
    } else {
      obj.imageUrl = obj.imageUrl?.[0];
    }

    delete obj.deleteUploadedImageUrl;
    const res = await axios.post('gallery', obj);

    if (res) {
      toast.success('Gallery inserted successfully');
      return true;
    }
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudGalleryLoading(false));
  }
};

export const updateGallery = (obj) => async (dispatch) => {
  try {
    if (obj && obj?._id) {
      const { _id, __v, ...payload } = obj;
      if (_id) {
        dispatch(setCrudGalleryLoading(true));
        let obj = { ...payload };
        let urls = [];

        // Delete old images from Cloudinary
        if (obj?.deleteUploadedImageUrl && obj?.deleteUploadedImageUrl?.length) {
          try {
            await dispatch(deleteFile(obj?.deleteUploadedImageUrl));
          } catch (e) {
            toastError(e);
            return false;
          }
        }

        let files = [...obj?.imageUrl?.filter((x) => typeof x === 'object')];
        if (files?.length) {
          try {
            urls = await dispatch(fileUpload(files));
            if (urls?.length) obj.imageUrl = urls?.[0];
          } catch (e) {
            toastError(e);
            return false;
          }
        } else {
          obj.imageUrl = obj.imageUrl?.[0];
        }
        delete obj.deleteUploadedImageUrl;
        const res = await axios.put(`gallery/${_id}`, obj);

        if (res) {
          toast.success('Gallery updated successfully');
          return true;
        } else {
          toast.success('Gallery Id is required');
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
    dispatch(setCrudGalleryLoading(false));
  }
};

export const getGallery = (id) => async (dispatch) => {
  try {
    dispatch(setGalleryLoading(true));
    const res = await axios.get(`gallery/${id}`);

    if (res) {
      let data = { ...res?.data?.data };

      // Handling profile picture
      if (data?.imageUrl) {
        data.deleteUploadedImageUrl = [];
        data.previewImageUrl = [{ image: data?.imageUrl, type: 'old' }];
        data.imageUrl = [data?.imageUrl];
      } else {
        data.previewImageUrl = []; // Clear if no profile picture
      }

      // Optionally handle additional images (if applicable)
      if (data?.imageUrl?.length) {
        data.previewImageUrl = data.imageUrl?.map((image) => ({
          type: 'old',
          image,
        }));
      }

      dispatch(setSelectedGallery(data));
      return res;
    }

    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setGalleryLoading(false));
  }
};
