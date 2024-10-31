import { Helmet } from 'react-helmet-async';

import { UsersView } from 'src/sections/users/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Users | The Hope House </title>
      </Helmet>

      <UsersView />
    </>
  );
}
