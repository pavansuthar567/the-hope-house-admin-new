import axios from 'axios';
import { toast } from 'react-toastify';

import { toastError } from '.';
import { fhelper } from 'src/_helpers';
import {
  setRecognitionList,
  setRecognitionLoading,
  setSelectedRecognition,
  setCrudRecognitionLoading,
} from 'src/store/slices/recognitionSlice';
import { deleteFile, fileUpload } from './upload.service';

export const getRecognitions = () => async (dispatch) => {
  try {
    dispatch(setRecognitionLoading(true));
    const res = await axios.get('recognition');
    const updated = res?.data?.data?.map((x, i) => ({ srNo: i + 1, ...x }));
    await dispatch(setRecognitionList(fhelper.sortByField(updated) || []));
    return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setRecognitionLoading(false));
  }
};

export const deleteRecognition = (id) => async (dispatch) => {
  try {
    dispatch(setCrudRecognitionLoading(true));
    const res = await axios.delete(`recognition/${id}`);
    if (res) {
      toast.success('Recognition deleted successfully');
      return true;
    } else return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudRecognitionLoading(false));
  }
};

export const createRecognition = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudRecognitionLoading(true));
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
    const res = await axios.post('recognition', obj);

    if (res) {
      toast.success('Recognition inserted successfully');
      return true;
    }
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudRecognitionLoading(false));
  }
};

export const updateRecognition = (obj) => async (dispatch) => {
  try {
    if (obj && obj?._id) {
      const { _id, __v, ...payload } = obj;
      if (_id) {
        dispatch(setCrudRecognitionLoading(true));
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

        let files = [
          ...(obj?.imageUrl || [])?.filter((x) => x instanceof File || x instanceof Blob),
        ];

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
        const res = await axios.put(`recognition/${_id}`, obj);

        if (res) {
          toast.success('Recognition updated successfully');
          return true;
        } else {
          toast.success('Recognition Id is required');
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
    dispatch(setCrudRecognitionLoading(false));
  }
};

export const getRecognition = (id) => async (dispatch) => {
  try {
    dispatch(setRecognitionLoading(true));
    const res = await axios.get(`recognition/${id}`);

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

      dispatch(setSelectedRecognition(data));
      return res;
    }

    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setRecognitionLoading(false));
  }
};
