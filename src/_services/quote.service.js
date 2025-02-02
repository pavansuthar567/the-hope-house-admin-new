import { toast } from 'react-toastify';

import {
  setQuoteLoading,
  setQuoteList,
  setCrudQuoteLoading,
  setSelectedQuote,
  setAlertList,
} from 'src/store/slices/quoteSlice';
import { fhelper } from 'src/_helpers';
import axios from 'axios';
import { toastError } from '.';
import _ from 'lodash';

export const getQuotes = () => async (dispatch) => {
  try {
    dispatch(setQuoteLoading(true));
    const res = await axios.get('quote');
    const updated = res?.data?.data?.map((x, i) => ({ srNo: i + 1, ...x }));
    await dispatch(setQuoteList(fhelper.sortByField(updated) || []));
    return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setQuoteLoading(false));
  }
};

export const deleteQuote = (id) => async (dispatch) => {
  try {
    dispatch(setCrudQuoteLoading(true));
    const res = await axios.delete(`quote/${id}`);
    if (res) {
      toast.success('Quote deleted successfully');
      return true;
    } else return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudQuoteLoading(false));
  }
};

export const createQuote = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudQuoteLoading(true));
    const res = await axios.post('quote', payload);

    if (res) {
      toast.success('Quote inserted successfully');
      return true;
    }
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudQuoteLoading(false));
  }
};

export const updateQuote = (obj) => async (dispatch) => {
  try {
    if (obj && obj?._id) {
      const { _id, __v, ...payload } = obj;
      if (_id) {
        dispatch(setCrudQuoteLoading(true));
        const res = await axios.put(`quote/${_id}`, payload);

        if (res) {
          toast.success('Quote updated successfully');
          return true;
        } else {
          toast.success('Quote Id is required');
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
    dispatch(setCrudQuoteLoading(false));
  }
};

export const getQuote = (id) => async (dispatch) => {
  try {
    dispatch(setQuoteLoading(true));
    const res = await axios.get(`quote/${id}`);

    if (res) {
      dispatch(setSelectedQuote(res?.data?.data));
      return res;
    }
    return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setQuoteLoading(false));
  }
};

export const getAlerts = () => async (dispatch) => {
  try {
    dispatch(setQuoteLoading(true));
    const res = await axios.get('dashboard/webhooks/tradingview');
    const data = res?.data?.data?.map((x, i) => ({ srNo: i + 1, ...x }));

    const updated = _.orderBy(data, ['createdAt'], ['desc']);
    await dispatch(setAlertList(updated || []));

    return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setQuoteLoading(false));
  }
};
