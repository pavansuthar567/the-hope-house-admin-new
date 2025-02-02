import { Helmet } from 'react-helmet-async';

import { AlertView } from 'src/sections/market-alert/view';

// ----------------------------------------------------------------------

export default function AlertPage() {
  return (
    <>
      <Helmet>
        <title> Quotes | The Hope House </title>
      </Helmet>

      <AlertView />
    </>
  );
}
