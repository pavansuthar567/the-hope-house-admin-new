import { toast } from 'react-toastify';

import {
  setVolunteerLoading,
  setVolunteerList,
  setCrudVolunteerLoading,
  setSelectedVolunteer,
} from 'src/store/slices/volunteerSlice';
import { fhelper } from 'src/_helpers';
import axios from 'axios';
import { toastError } from 'src/actions';
import { skills } from 'src/_helpers/constants';

export const getVolunteers = () => async (dispatch) => {
  try {
    dispatch(setVolunteerLoading(true));
    const res = await axios.get('volunteer');
    const updated = res?.data?.data?.map((x, i) => ({ srNo: i + 1, ...x }));
    await dispatch(setVolunteerList(fhelper.sortByField(updated) || []));
    return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setVolunteerLoading(false));
  }
};

export const deleteVolunteer = (id) => async (dispatch) => {
  try {
    dispatch(setCrudVolunteerLoading(true));
    const res = await axios.delete(`volunteer/${id}`);
    if (res) {
      toast.success('Volunteer deleted successfully');
      return true;
    } else return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudVolunteerLoading(false));
  }
};

export const createVolunteer = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudVolunteerLoading(true));
    const res = await axios.post('volunteer', payload);

    if (res) {
      toast.success('Volunteer inserted successfully');
      return true;
    }
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudVolunteerLoading(false));
  }
};

export const updateVolunteer = (obj) => async (dispatch) => {
  try {
    if (obj && obj?._id) {
      const { _id, __v, ...payload } = obj;
      if (_id) {
        dispatch(setCrudVolunteerLoading(true));
        const res = await axios.put(`volunteer/${_id}`, payload);

        if (res) {
          toast.success('Volunteer updated successfully');
          return true;
        } else {
          toast.success('Volunteer Id is required');
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
    dispatch(setCrudVolunteerLoading(false));
  }
};

export const getVolunteer = (id) => async (dispatch) => {
  try {
    dispatch(setVolunteerLoading(true));
    const res = await axios.get(`volunteer/${id}`);

    if (res) {
      let data = { ...res?.data?.data };
      const skillsVals = skills?.map((x) => x?.value);
      if (!skillsVals?.includes(data?.skills?.[0])) {
        data.otherSkill = data?.skills?.[0];
        data.skills = ['other'];
      }
      dispatch(setSelectedVolunteer(data));
      return res;
    }
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setVolunteerLoading(false));
  }
};
