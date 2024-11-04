import axios from 'axios';
import { toast } from 'react-toastify';

import { toastError } from '.';
import {
  setHomeList,
  setHomeLoading,
  setSelectedHome,
  setCrudHomeLoading,
} from 'src/store/slices/homeSlice';
import { fhelper } from 'src/_helpers';
import { deleteFile, fileUpload } from './upload.service';

export const getHomeList = () => async (dispatch) => {
  try {
    dispatch(setHomeLoading(true));
    const res = await axios.get('home-page');
    const updated = res?.data?.data?.map((x, i) => ({ srNo: i + 1, ...x }));
    await dispatch(setHomeList(fhelper.sortByField(updated) || []));
    return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setHomeLoading(false));
  }
};

export const getHome = (id) => async (dispatch) => {
  try {
    dispatch(setHomeLoading(true));
    const res = await axios.get(`home-page/${id}`);

    if (res) {
      let data = { ...res?.data?.data };

      if (data?.logo) {
        data.deleteUploadedLogo = [];
        data.previewLogo = [{ image: data?.logo, type: 'old' }];
        data.logo = [data?.logo];
      } else {
        data.logo = [];
      }

      // if (data?.heroSectionVideo) {
      //   data.deleteUploadedHeroSectionVideo = [];
      //   data.previewHeroSectionVideo = [{ image: data?.heroSectionVideo, type: 'old' }];
      //   data.heroSectionVideo = [data?.heroSectionVideo];
      // } else {
      //   data.heroSectionVideo = [];
      // }

      if (data?.logo?.length) {
        data.logo = data?.logo?.map((image) => ({
          type: 'old',
          image,
        }));
      }

      // if (data?.heroSectionVideo?.length) {
      //   data.heroSectionVideo = data?.heroSectionVideo?.map((video) => ({
      //     type: 'old',
      //     video,
      //   }));
      // }

      await dispatch(setSelectedHome(data));
      return true;
    }
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setHomeLoading(false));
  }
};

export const deleteHome = (id) => async (dispatch) => {
  try {
    dispatch(setCrudHomeLoading(true));
    const res = await axios.delete(`home-page/${id}`);
    if (res) {
      toast.success('Home deleted successfully');
      return true;
    } else return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudHomeLoading(false));
  }
};

export const createHome = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudHomeLoading(true));
    let obj = { ...payload };
    let urls = [];

    let files = [...obj?.logo?.filter((x) => typeof x === 'object')];
    // let videoFiles = [...obj?.heroSectionVideo?.filter((x) => typeof x === 'object')];

    if (files?.length) {
      try {
        urls = await dispatch(fileUpload(files));
        if (urls?.length) obj.logo = urls?.[0];
      } catch (e) {
        toastError(e);
        return false;
      }
    } else {
      obj.logo = obj.logo?.[0];
    }

    // // Upload video files if there are any new files to upload
    // if (videoFiles?.length) {
    //   try {
    //     videoUrls = await dispatch(fileUpload(videoFiles));
    //     if (videoUrls?.length) obj.heroSectionVideo = videoUrls?.[0];
    //   } catch (e) {
    //     toastError(e);
    //     return false;
    //   }
    // } else {
    //   obj.heroSectionVideo = obj.heroSectionVideo?.[0];
    // }

    delete obj.deleteUploadedLogo;
    // delete obj.deleteUploadedHeroSectionVideo;
    const res = await axios.post('home-page', obj);

    if (res) {
      toast.success('Home inserted successfully');
      return true;
    }
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudHomeLoading(false));
  }
};

export const updateHome = (obj) => async (dispatch) => {
  try {
    if (obj && obj?._id) {
      const { _id, __v, ...payload } = obj;
      if (_id) {
        dispatch(setCrudHomeLoading(true));
        let obj = { ...payload };
        let urls = [];

        // Delete old images from Cloudinary
        if (obj?.deleteUploadedLogo && obj?.deleteUploadedLogo?.length) {
          try {
            await dispatch(deleteFile(obj?.deleteUploadedLogo));
          } catch (e) {
            toastError(e);
            return false;
          }
        }

        let files = [...(obj?.logo || [])?.filter((x) => x instanceof File || x instanceof Blob)];

        if (files?.length) {
          try {
            urls = await dispatch(fileUpload(files));
            if (urls?.length) obj.logo = urls?.[0];
          } catch (e) {
            toastError(e);
            return false;
          }
        } else {
          obj.logo = obj.logo?.[0]?.image;
        }
        delete obj.deleteUploadedLogo;
        const res = await axios.put(`home-page/${_id}`, obj);

        if (res) {
          toast.success('Home updated successfully');
          return true;
        } else {
          toast.success('Home Id is required');
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
    dispatch(setCrudHomeLoading(false));
  }
};
