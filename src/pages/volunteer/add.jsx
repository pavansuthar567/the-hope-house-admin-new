import { Helmet } from 'react-helmet-async';

import { AddVolunteer } from 'src/sections/volunteer/add';

// ----------------------------------------------------------------------

export default function AddVolunteerPage() {
  return (
    <>
      <Helmet>
        <title> Add Volunteer | The Hope House </title>
      </Helmet>

      <AddVolunteer />
    </>
  );
}
