import { Helmet } from 'react-helmet-async';

import { QuoteView } from 'src/sections/quote/view';

// ----------------------------------------------------------------------

export default function QuotePage() {
  return (
    <>
      <Helmet>
        <title> Quotes | The Hope House </title>
      </Helmet>

      <QuoteView />
    </>
  );
}
