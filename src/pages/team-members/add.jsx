import { Helmet } from 'react-helmet-async';

import { AddTeamMember } from 'src/sections/team-members/add';

// ----------------------------------------------------------------------

export default function AddVolunteerPage() {
  return (
    <>
      <Helmet>
        <title> Add Volunteer | The Hope House </title>
      </Helmet>

      <AddTeamMember />
    </>
  );
}
