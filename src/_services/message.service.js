import { toast } from 'react-toastify';
import axios from 'axios';
import {
  setMessageLoading,
  setMessageList,
  setCrudMessageLoading,
  setSelectedMessage,
} from 'src/store/slices/messageSlice';

export const getMessages = () => async (dispatch) => {
  try {
    dispatch(setMessageLoading(true));
    const res = await axios.get('message');
    const updatedMessages = res?.data?.data?.map((x, i) => ({ srNo: i + 1, ...x })) || [];
    await dispatch(setMessageList(updatedMessages));
    return true;
  } catch (e) {
    toast.error('Failed to fetch messages');
    return false;
  } finally {
    dispatch(setMessageLoading(false));
  }
};

export const deleteMessage = (id) => async (dispatch) => {
  try {
    dispatch(setCrudMessageLoading(true));
    const res = await axios.delete(`message/${id}`);
    if (res) {
      toast.success('Message deleted successfully');
      return true;
    }
    return false;
  } catch (e) {
    toast.error('Failed to delete message');
    return false;
  } finally {
    dispatch(setCrudMessageLoading(false));
  }
};

export const createMessage = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudMessageLoading(true));
    const res = await axios.post('message', payload);
    if (res) {
      toast.success('Message created successfully');
      return true;
    }
    return false;
  } catch (e) {
    toast.error('Failed to create message');
    return false;
  } finally {
    dispatch(setCrudMessageLoading(false));
  }
};

export const getMessage = (id) => async (dispatch) => {
  try {
    dispatch(setMessageLoading(true));
    const res = await axios.get(`message/${id}`);
    if (res) {
      dispatch(setSelectedMessage(res.data.data));
      return res;
    }
    return false;
  } catch (e) {
    toast.error('Failed to fetch message');
    return false;
  } finally {
    dispatch(setMessageLoading(false));
  }
};
