import { Helmet } from 'react-helmet-async';

import { AddQuote } from 'src/sections/quote/add';

// ----------------------------------------------------------------------

export default function AddQuotePage() {
  return (
    <>
      <Helmet>
        <title> Add Quote | The Hope House </title>
      </Helmet>

      <AddQuote />
    </>
  );
}
