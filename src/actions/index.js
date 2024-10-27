import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

export const toastError = (e) =>
  toast.error(e?.response?.data?.message || e?.message || 'something went wrong');

// ----------------------------------------------------------------------

