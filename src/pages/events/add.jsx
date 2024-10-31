import { Helmet } from 'react-helmet-async';

import { AddEvent } from 'src/sections/events/add';

// ----------------------------------------------------------------------

export default function AddEventPage() {
  return (
    <>
      <Helmet>
        <title> Add Event | The Hope House </title>
      </Helmet>

      <AddEvent />
    </>
  );
}
