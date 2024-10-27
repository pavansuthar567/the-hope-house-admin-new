import { Helmet } from 'react-helmet-async';

import { VolunteerView } from 'src/sections/volunteer/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Volunteers | The Hope House </title>
      </Helmet>

      <VolunteerView />
    </>
  );
}
