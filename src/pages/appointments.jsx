import { Helmet } from 'react-helmet-async';

import { Appointments } from 'src/sections/appointments';

// ----------------------------------------------------------------------

export default function AppointmentsPage() {
  return (
    <>
      <Helmet>
        <title> Appointments | The Hope House </title>
      </Helmet>

      <Appointments />
    </>
  );
}
