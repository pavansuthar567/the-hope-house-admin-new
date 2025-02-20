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
import { dynamicImageKeys } from 'src/_helpers/constants';

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
      const { pageImages } = data || {};

      // Handle logo
      if (data?.logo) {
        data.deleteUploadedLogo = [];
        data.previewLogo = [{ image: data?.logo, type: 'old' }];
        data.logo = [data?.logo];
      } else {
        data.previewLogo = [];
      }

      // Handle logo
      if (data?.logo?.length) {
        data.previewLogo = data?.logo?.map((image) => ({
          type: 'old',
          image,
        }));
      }

      // Handle home section images
      const {
        homeImageKeys = [],
        aboutUsImageKeys = [],
        pageTitleBgKeys = [],
      } = dynamicImageKeys || {};

      // Handle home section images
      homeImageKeys.forEach((key) => {
        const value = pageImages?.home?.[key];
        if (value) {
          data[`deleteUploaded${key}`] = [];
          data[`preview${key}`] = [{ image: value, type: 'old' }];
          data[key] = [value];
        } else {
          data[`preview${key}`] = []; // Clear if no picture
        }
      });

      // Optionally handle additional home images (if applicable)
      homeImageKeys.forEach((key) => {
        if (data?.[key]?.length) {
          data[`preview${key}`] = data?.[key]?.map((image) => ({
            type: 'old',
            image,
          }));
        }
      });

      // Handle page title backgrounds
      aboutUsImageKeys.forEach((key) => {
        const value = pageImages?.aboutUsPage?.[key];
        if (value) {
          data[`deleteUploaded${key}Bg`] = [];
          data[`preview${key}Bg`] = [{ image: value, type: 'old' }];
          data[key] = [value];
        } else {
          data[`preview${key}Bg`] = []; // Clear if no picture
        }
      });

      // Optionally handle additional about images (if applicable)
      aboutUsImageKeys.forEach((key) => {
        if (data?.[key]?.length) {
          data[`preview${key}Bg`] = data?.[key]?.map((image) => ({
            type: 'old',
            image,
          }));
        }
      });

      // Handle about us page images
      pageTitleBgKeys.forEach((key) => {
        const value = pageImages?.pageTitleBackgrounds?.[key];
        if (value) {
          data[`deleteUploaded${key}`] = [];
          data[`preview${key}`] = [{ image: value, type: 'old' }];
          data[key] = [value];
        } else {
          data[`preview${key}`] = []; // Clear if no picture
        }
      });

      // Optionally handle additional title bg images (if applicable)
      pageTitleBgKeys.forEach((key) => {
        if (data?.[key]?.length) {
          data[`preview${key}`] = data?.[key]?.map((image) => ({
            type: 'old',
            image,
          }));
        }
      });

      // if (data?.heroSectionVideo) {
      //   data.deleteUploadedHeroSectionVideo = [];
      //   data.previewHeroSectionVideo = [{ image: data?.heroSectionVideo, type: 'old' }];
      //   data.heroSectionVideo = [data?.heroSectionVideo];
      // } else {
      //   data.heroSectionVideo = [];
      // }

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

    // Handle logo upload
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

    // Initialize pageImages structure
    obj.pageImages = {
      home: {},
      aboutUsPage: {},
      pageTitleBackgrounds: {},
    };

    // Handle home section images
    const {
      homeImageKeys = [],
      aboutUsImageKeys = [],
      pageTitleBgKeys = [],
    } = dynamicImageKeys || {};

    // Process home images
    for (const key of homeImageKeys) {
      const imageFiles = [...obj?.[key]?.filter((x) => typeof x === 'object')];
      if (imageFiles?.length) {
        try {
          const uploadedUrls = await dispatch(fileUpload(imageFiles));
          if (uploadedUrls?.length) {
            obj.pageImages.home[key] = uploadedUrls[0];
          }
        } catch (e) {
          toastError(e);
          return false;
        }
      } else if (obj?.[key]?.[0]?.image) {
        obj.pageImages.home[key] = obj[key][0].image;
      }
      delete obj[`deleteUploaded${key}`];
      delete obj[`preview${key}`];
      delete obj[key];
    }

    // Process about us page images
    for (const key of aboutUsImageKeys) {
      const imageFiles = [...obj?.[key]?.filter((x) => typeof x === 'object')];
      if (imageFiles?.length) {
        try {
          const uploadedUrls = await dispatch(fileUpload(imageFiles));
          if (uploadedUrls?.length) {
            obj.pageImages.aboutUsPage[key] = uploadedUrls[0];
          }
        } catch (e) {
          toastError(e);
          return false;
        }
      } else if (obj?.[key]?.[0]?.image) {
        obj.pageImages.aboutUsPage[key] = obj[key][0].image;
      }
      delete obj[`deleteUploaded${key}Bg`];
      delete obj[`preview${key}Bg`];
      delete obj[key];
    }

    // Process page title background images
    for (const key of pageTitleBgKeys) {
      const imageFiles = [...obj?.[key]?.filter((x) => typeof x === 'object')];
      if (imageFiles?.length) {
        try {
          const uploadedUrls = await dispatch(fileUpload(imageFiles));
          if (uploadedUrls?.length) {
            obj.pageImages.pageTitleBackgrounds[key] = uploadedUrls[0];
          }
        } catch (e) {
          toastError(e);
          return false;
        }
      } else if (obj?.[key]?.[0]?.image) {
        obj.pageImages.pageTitleBackgrounds[key] = obj[key][0].image;
      }
      delete obj[`deleteUploaded${key}`];
      delete obj[`preview${key}`];
      delete obj[key];
    }

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
        let updatedObj = { ...payload };

        const {
          homeImageKeys = [],
          aboutUsImageKeys = [],
          pageTitleBgKeys = [],
        } = dynamicImageKeys || {};

        updatedObj.pageImages = JSON.parse(JSON.stringify(updatedObj.pageImages));

        // Delete old images from Cloudinary
        if (updatedObj?.deleteUploadedLogo && updatedObj?.deleteUploadedLogo?.length) {
          try {
            await dispatch(deleteFile(updatedObj?.deleteUploadedLogo));
          } catch (e) {
            toastError(e);
            return false;
          }
        }

        // Handle logo upload
        let logoFiles = [
          ...(updatedObj?.logo || [])?.filter((x) => x instanceof File || x instanceof Blob),
        ];
        if (logoFiles?.length) {
          try {
            const urls = await dispatch(fileUpload(logoFiles));
            if (urls?.length) updatedObj.logo = urls[0];
          } catch (e) {
            toastError(e);
            return false;
          }
        } else {
          updatedObj.logo = updatedObj.logo?.[0] || '';
        }

        // Process home page images
        for (const key of homeImageKeys) {
          const imageFiles = [
            ...(updatedObj?.[key] || [])?.filter(
              (x) => typeof x === 'object' || x instanceof File || x instanceof Blob
            ),
          ];

          if (updatedObj?.[`deleteUploaded${key}`]?.length) {
            try {
              await dispatch(deleteFile(updatedObj[`deleteUploaded${key}`]));
            } catch (e) {
              toastError(e);
              return false;
            }
          }

          if (imageFiles?.length) {
            try {
              const uploadedUrls = await dispatch(fileUpload(imageFiles));
              if (uploadedUrls?.length) {
                if (!updatedObj.pageImages.home) updatedObj.pageImages.home = {};
                updatedObj.pageImages.home[key] = uploadedUrls[0];
              }
            } catch (e) {
              toastError(e);
              return false;
            }
          } else if (updatedObj?.[key]?.[0]?.image) {
            if (!updatedObj.pageImages.home) updatedObj.pageImages.home = {};

            updatedObj.pageImages.home[key] = updatedObj[key][0].image;
          } else if (!updatedObj?.[key]?.length) {
            updatedObj.pageImages.home[key] = '';
          }
          delete updatedObj[`deleteUploaded${key}`];
          delete updatedObj[`preview${key}`];
          delete updatedObj[key];
        }

        // Process about us page images
        for (const key of aboutUsImageKeys) {
          const baseKey = key.replace('Bg', '');
          const imageFiles = [
            ...(updatedObj?.[key] || [])?.filter((x) => x instanceof File || x instanceof Blob),
          ];

          if (updatedObj?.[`deleteUploaded${key}Bg`]?.length) {
            try {
              await dispatch(deleteFile(updatedObj[`deleteUploaded${key}Bg`]));
            } catch (e) {
              toastError(e);
              return false;
            }
          }

          if (imageFiles?.length) {
            try {
              const uploadedUrls = await dispatch(fileUpload(imageFiles));
              if (uploadedUrls?.length) {
                if (!updatedObj.pageImages.aboutUsPage) updatedObj.pageImages.aboutUsPage = {};
                updatedObj.pageImages.aboutUsPage[baseKey] = uploadedUrls[0];
              }
            } catch (e) {
              toastError(e);
              return false;
            }
          } else if (updatedObj?.[key]?.[0]?.image) {
            if (!updatedObj.pageImages.aboutUsPage) updatedObj.pageImages.aboutUsPage = {};

            updatedObj.pageImages.aboutUsPage[baseKey] = updatedObj[key][0].image;
          } else if (!updatedObj?.[key]?.length) {
            updatedObj.pageImages.aboutUsPage[baseKey] = '';
          }
          delete updatedObj[`deleteUploaded${key}Bg`];
          delete updatedObj[`preview${key}Bg`];
          // delete updatedObj[`${key}Bg`];
          delete updatedObj[key];
        }

        // Process page title background images
        for (const key of pageTitleBgKeys) {
          const imageFiles = [
            ...(updatedObj?.[key] || [])?.filter((x) => x instanceof File || x instanceof Blob),
          ];

          if (updatedObj?.[`deleteUploaded${key}`]?.length) {
            try {
              await dispatch(deleteFile(updatedObj[`deleteUploaded${key}`]));
            } catch (e) {
              toastError(e);
              return false;
            }
          }

          if (imageFiles?.length) {
            try {
              const uploadedUrls = await dispatch(fileUpload(imageFiles));
              if (uploadedUrls?.length) {
                if (!updatedObj.pageImages.pageTitleBackgrounds)
                  updatedObj.pageImages.pageTitleBackgrounds = {};
                updatedObj.pageImages.pageTitleBackgrounds[key] = uploadedUrls[0];
              }
            } catch (e) {
              toastError(e);
              return false;
            }
          } else if (updatedObj?.[key]?.[0]?.image) {
            if (!updatedObj.pageImages.pageTitleBackgrounds)
              updatedObj.pageImages.pageTitleBackgrounds = {};

            updatedObj.pageImages.pageTitleBackgrounds[key] = updatedObj[key][0].image;
          } else if (!updatedObj?.[key]?.length) {
            updatedObj.pageImages.pageTitleBackgrounds[key] = '';
          }
          delete updatedObj[`deleteUploaded${key}`];
          delete updatedObj[`preview${key}`];
          delete updatedObj[key];
        }

        delete updatedObj.deleteUploadedLogo;
        const res = await axios.put(`home-page/${_id}`, updatedObj);

        if (res) {
          toast.success('Home updated successfully');
          return true;
        } else {
          toast.error('Home Id is required');
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
