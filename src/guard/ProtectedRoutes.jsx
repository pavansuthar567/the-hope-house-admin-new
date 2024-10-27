import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { fhelper } from '../_helpers';

const ProtectedRoutes = ({ children, pageId }) => {
  const currentUser = fhelper.getCurrentUser();

  let { adminWisePermisisons } = useSelector(({ admin }) => admin);
  if (!currentUser) {
    return <Navigate to="/login" replace={true} />;
  } else {
    return fhelper.checkUserPermission(adminWisePermisisons, pageId) ? (
      children
    ) : (
      <Navigate to="/unAuthorized" replace={true} />
    );
  }
};

export default ProtectedRoutes;
