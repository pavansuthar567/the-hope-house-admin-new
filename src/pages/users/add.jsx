import { Helmet } from 'react-helmet-async';

import { AddUser } from 'src/sections/users/add';

// ----------------------------------------------------------------------

export default function AddVolunteerPage() {
  return (
    <>
      <Helmet>
        <title> Add User | The Hope House </title>
      </Helmet>

      <AddUser />
    </>
  );
}
