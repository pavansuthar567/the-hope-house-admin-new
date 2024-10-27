/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';
import 'react-toastify/dist/ReactToastify.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Toast from './components/toast';
import ThemeProvider from 'src/theme';
import Router from 'src/routes/sections';
import Spinner from './components/spinner';
import { apiUrl } from './_helpers';
import { setAuthToken } from './interceptors/httpInterceptor';
import errorInterceptor from './interceptors/errorInterceptor';
// import { setAdminPermissionsLoader } from './store/slices/adminSlice';
// import { adminService, getPermissionsDataByAdminId, customizationTypeService } from './_services';

// ----------------------------------------------------------------------

axios.defaults.baseURL = apiUrl;

export default function App() {
  useScrollToTop();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const currentUser = fhelper.getCurrentUser();
  // let { adminPermisisonsLoader } = useSelector(({ admin }) => admin);

  setAuthToken();
  errorInterceptor(navigate);

  // const loadData = useCallback(() => {
  //   if (currentUser) {
  //     const payload = {
  //       adminId: currentUser?.id,
  //     };
  //     dispatch(getPermissionsDataByAdminId(payload));
  //   } else {
  //     dispatch(setAdminPermissionsLoader(false));
  //   }
  // }, [currentUser, dispatch]);

  // useEffect(() => {
  //   loadData();
  //   adminService.createSuperAdmin();
  //   customizationTypeService.createCommonCustomizations();
  //   // getAppCheckToken(storageUrl);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <ThemeProvider>
      {/* {adminPermisisonsLoader ? (
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      ) : ( */}
      <Router />
      {/* )} */}
      <Toast />
    </ThemeProvider>
  );
}
