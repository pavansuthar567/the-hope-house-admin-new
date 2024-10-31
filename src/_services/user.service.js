import { toast } from 'react-toastify';

import {
  setUserLoading,
  setUserList,
  setCrudUserLoading,
  setSelectedUser,
} from 'src/store/slices/userSlice';
import { fhelper } from 'src/_helpers';
import axios from 'axios';
import { skills } from 'src/_helpers/constants';
import { toastError } from '.';

export const getUsers = () => async (dispatch) => {
  try {
    dispatch(setUserLoading(true));
    const res = await axios.get('user');
    const updated = res?.data?.data?.map((x, i) => ({ srNo: i + 1, ...x }));
    await dispatch(setUserList(fhelper.sortByField(updated) || []));
    return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setUserLoading(false));
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch(setCrudUserLoading(true));
    const res = await axios.delete(`user/${id}`);
    if (res) {
      toast.success('User deleted successfully');
      return true;
    } else return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudUserLoading(false));
  }
};

export const createUser = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudUserLoading(true));
    const res = await axios.post('user', payload);

    if (res) {
      toast.success('User inserted successfully');
      return true;
    }
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudUserLoading(false));
  }
};

export const updateUser = (obj) => async (dispatch) => {
  try {
    if (obj && obj?._id) {
      const { _id, __v, ...payload } = obj;
      if (_id) {
        dispatch(setCrudUserLoading(true));
        const res = await axios.put(`user/${_id}`, payload);

        if (res) {
          toast.success('User updated successfully');
          return true;
        } else {
          toast.success('User Id is required');
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
    dispatch(setCrudUserLoading(false));
  }
};

export const getUser = (id) => async (dispatch) => {
  try {
    dispatch(setUserLoading(true));
    const res = await axios.get(`user/${id}`);

    if (res) {
      dispatch(setSelectedUser(res?.data?.data));
      return res;
    }
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setUserLoading(false));
  }
};
