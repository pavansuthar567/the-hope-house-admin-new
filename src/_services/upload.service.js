import { setFileUploadLoading } from 'src/store/slices/commonSlice';
import { toastError } from '.';
import axios from 'axios';

export const fileUpload = (files) => async (dispatch) => {
  try {
    dispatch(setFileUploadLoading(true));

    // Create a FormData object to hold multiple files
    const formData = new FormData();

    // Loop through each file and append it to the formData
    files.forEach((file) => {
      formData.append('files', file); // Note: 'files' is the key expected by the backend
    });

    // Make the API request to upload multiple files
    const res = await axios.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure the correct headers for file upload
      },
    });

    // Return the uploaded files data
    // toast.success(res?.data?.message);
    const urls = res?.data?.data?.map((x) => x?.url);
    return urls;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setFileUploadLoading(false));
  }
};

export const deleteFile =
  (array, type = 'image') =>
  async (dispatch) => {
    try {
      dispatch(setFileUploadLoading(true));

      // Make the API request to upload multiple files
      const payload = {
        urls: array?.map((x) => x?.image), // Array of image URLs
        resource_type: type, // Resource type (e.g., 'image' or 'video')
      };

      const res = await axios.delete('/upload', { data: payload });
      if (res) {
        return true;
      }
    } catch (e) {
      toastError(e);
      return false;
    } finally {
      dispatch(setFileUploadLoading(false));
    }
  };
