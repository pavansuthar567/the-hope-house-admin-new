import { toast } from 'react-toastify';

import { fhelper } from 'src/_helpers';
import axios from 'axios';
import { skills } from 'src/_helpers/constants';
import {
  setCrudTeamMembersLoading,
  setSelectedTeamMembers,
  setTeamMembersList,
  setTeamMembersLoading,
} from 'src/store/slices/teamMembersSlice';
import { toastError } from '.';
import { deleteFile, fileUpload } from './upload.service';

export const getTeamMembers = () => async (dispatch) => {
  try {
    dispatch(setTeamMembersLoading(true));
    const res = await axios.get('team-members');
    const updated = res?.data?.data?.map((x, i) => ({ srNo: i + 1, ...x }));
    await dispatch(setTeamMembersList(fhelper.sortByField(updated) || []));
    return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setTeamMembersLoading(false));
  }
};

export const deleteTeamMembers = (id) => async (dispatch) => {
  try {
    dispatch(setCrudTeamMembersLoading(true));
    const res = await axios.delete(`team-members/${id}`);
    if (res) {
      toast.success('A team member deleted successfully');
      return true;
    } else return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudTeamMembersLoading(false));
  }
};

export const createTeamMembers = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudTeamMembersLoading(true));
    let obj = { ...payload };
    let urls = [];

    let files = [...obj?.profilePictureUrl?.filter((x) => typeof x === 'object')];

    if (files?.length) {
      try {
        urls = await dispatch(fileUpload(files));
        if (urls?.length) obj.profilePictureUrl = urls?.[0];
      } catch (e) {
        toastError(e);
        return false;
      }
    } else {
      obj.profilePictureUrl = obj.profilePictureUrl?.[0];
    }

    delete obj.deleteUploadedProfilePic;
    const res = await axios.post('team-members', obj);

    if (res) {
      toast.success('A team member inserted successfully');
      return true;
    }
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudTeamMembersLoading(false));
  }
};

export const updateTeamMembers = (obj) => async (dispatch) => {
  try {
    if (obj && obj?._id) {
      const { _id, __v, ...payload } = obj;
      if (_id) {
        dispatch(setCrudTeamMembersLoading(true));
        let obj = { ...payload };
        let urls = [];

        // Delete old images from Cloudinary
        if (obj?.deleteUploadedProfilePic && obj?.deleteUploadedProfilePic?.length) {
          try {
            await dispatch(deleteFile(obj?.deleteUploadedProfilePic));
          } catch (e) {
            toastError(e);
            return false;
          }
        }

        let files = [...obj?.profilePictureUrl?.filter((x) => typeof x === 'object')];
        if (files?.length) {
          try {
            urls = await dispatch(fileUpload(files));
            if (urls?.length) obj.profilePictureUrl = urls?.[0];
          } catch (e) {
            toastError(e);
            return false;
          }
        } else {
          obj.profilePictureUrl = obj.profilePictureUrl?.[0];
        }
        delete obj.deleteUploadedProfilePic;
        const res = await axios.put(`team-members/${_id}`, obj);

        if (res) {
          toast.success('A team member updated successfully');
          return true;
        } else {
          toast.success('A team member Id is required');
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
    dispatch(setCrudTeamMembersLoading(false));
  }
};

export const getTeamMember = (id) => async (dispatch) => {
  try {
    dispatch(setTeamMembersLoading(true));
    const res = await axios.get(`team-members/${id}`);

    if (res) {
      let data = { ...res?.data?.data };
      const skillsVals = skills?.map((x) => x?.value);

      // Handling skills
      if (!skillsVals?.includes(data?.skills?.[0])) {
        data.otherSkill = data?.skills?.[0];
        data.skills = ['other'];
      }

      // Handling profile picture
      if (data?.profilePictureUrl) {
        data.deleteUploadedProfilePic = [];
        data.previewProfilePic = [{ image: data?.profilePictureUrl, type: 'old' }];
        data.profilePictureUrl = [data?.profilePictureUrl];
      } else {
        data.previewProfilePic = []; // Clear if no profile picture
      }

      // Optionally handle additional images (if applicable)
      if (data?.profilePictureUrl?.length) {
        data.previewProfilePic = data.profilePictureUrl?.map((image) => ({
          type: 'old',
          image,
        }));
      }

      dispatch(setSelectedTeamMembers(data));
      return res;
    }

    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setTeamMembersLoading(false));
  }
};
