import axios from 'axios';
import { fhelper } from '../_helpers/fhelper';

// Header Methods
export const setAuthToken = async () => {
  try {
    const adminData = fhelper.getCurrentUser();
    const access_Token = adminData?.token;
    axios.defaults.headers.common['Authorization'] = `Bearer ` + access_Token;
  } catch (e) {
    console.log('Error while setup token', e);
  }
};
