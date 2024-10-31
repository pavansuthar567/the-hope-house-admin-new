import { Helmet } from 'react-helmet-async';

import { TeamMembersView } from 'src/sections/team-members/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Team Members | The Hope House </title>
      </Helmet>

      <TeamMembersView />
    </>
  );
}
