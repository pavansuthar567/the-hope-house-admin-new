// ----------------------------------------------------------------------

// export const getAllCustomizationTypeList = () => async (dispatch) => {
//   try {
//     dispatch(setVolunteerLoading(true));
//     const res = await customizationTypeService.getAllCustomizationTypes();

//     dispatch(setCustomizationTypesList(res || []));
//     return true;
//   } catch (e) {
//     toastError(e);
//     return false;
//   } finally {
//     dispatch(setVolunteerLoading(false));
//   }
// };

// export const createVolunteer = (payload) => async (dispatch) => {
//   try {
//     dispatch(setCrudVolunteerLoading(true));
//     const res = await productService.insertVolunteer(payload);

//     if (res) {
//       toast.success('Volunteer inserted successfully');
//       return true;
//     }
//   } catch (e) {
//     toastError(e);
//     return false;
//   } finally {
//     dispatch(setCrudVolunteerLoading(false));
//   }
// };

// export const getSingleVolunteer = (productId) => async (dispatch) => {
//   try {
//     dispatch(setCrudVolunteerLoading(true));
//     const res = await productService.getSingleVolunteer(productId);

//     if (res) {
//       let product = { ...res };

//       if (res?.images?.length) {
//         const imagesArray = res?.images?.map((image) => {
//           return {
//             type: 'old',
//             image: image.image,
//           };
//         });
//         product = {
//           ...product,
//           imageFiles: [],
//           previewImages: imagesArray,
//           uploadedDeletedImages: [],
//         };
//       }

//       const videoUrl = res?.video;
//       if (videoUrl) {
//         const url = new URL(videoUrl);
//         const fileExtension = url.pathname.split('.').pop();

//         const previewVideoObj = {
//           type: 'old',
//           mimeType: `video/${fileExtension}`,
//           video: videoUrl,
//         };
//         product = {
//           ...product,
//           videoFile: [],
//           deleteUploadedVideo: [],
//           previewVideo: [previewVideoObj],
//         };
//       }
//       dispatch(setSelectedVolunteer(product));
//       return res;
//     }
//   } catch (e) {
//     toastError(e);
//     return false;
//   } finally {
//     dispatch(setCrudVolunteerLoading(false));
//   }
// };

// export const updateStatusVolunteer = (payload) => async (dispatch) => {
//   try {
//     dispatch(setCrudVolunteerLoading(true));
//     const res = await productService.activeDeactiveVolunteer(payload);

//     if (res) return res;
//   } catch (e) {
//     toastError(e);
//     return false;
//   } finally {
//     dispatch(setCrudVolunteerLoading(false));
//   }
// };

// export const updateVolunteer = (payload) => async (dispatch) => {
//   try {
//     dispatch(setCrudVolunteerLoading(true));
//     const res = await productService.updateVolunteer(payload);

//     if (res) {
//       toast.success('Volunteer updated successfully');
//       return true;
//     }
//   } catch (e) {
//     toastError(e);
//     return false;
//   } finally {
//     dispatch(setCrudVolunteerLoading(false));
//   }
// };

// export const updateVolunteerPhotosAction = (payload) => async (dispatch) => {
//   try {
//     dispatch(setCrudVolunteerLoading(true));
//     const res = await productService.updateVolunteerPhotos(payload);

//     if (res) {
//       toast.success('Volunteer updated successfully');
//       return true;
//     }
//   } catch (e) {
//     toastError(e);
//     return false;
//   } finally {
//     dispatch(setCrudVolunteerLoading(false));
//   }
// };

// export const updateVolunteerVideoAction = (payload) => async (dispatch) => {
//   try {
//     dispatch(setCrudVolunteerLoading(true));
//     const res = await productService.updateVolunteerVideo(payload);

//     if (res) {
//       toast.success('Volunteer video updated successfully');
//       return true;
//     }
//   } catch (e) {
//     toastError(e);
//     return false;
//   } finally {
//     dispatch(setCrudVolunteerLoading(false));
//   }
// };

// export const getActiveVolunteers = () => async (dispatch) => {
//   try {
//     dispatch(setVolunteerLoading(true));
//     const res = await productService.getAllActiveVolunteers();

//     if (res) {
//       dispatch(setActiveVolunteerList(fhelper.sortByField(res) || []));
//       return true;
//     }
//   } catch (e) {
//     toastError(e);
//     return false;
//   } finally {
//     dispatch(setVolunteerLoading(false));
//   }
// };
