import { Helmet } from 'react-helmet-async';

import { User } from 'src/sections/user';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> User | The Hope House </title>
      </Helmet>

      <User />
    </>
  );
}
