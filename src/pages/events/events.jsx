import { Helmet } from 'react-helmet-async';

import { EventView } from 'src/sections/events/view';

// ----------------------------------------------------------------------

export default function EventViewPage() {
  return (
    <>
      <Helmet>
        <title> Events | The Hope House </title>
      </Helmet>

      <EventView />
    </>
  );
}
