import { Helmet } from 'react-helmet-async';

import { AddFaqs } from 'src/sections/faqs/add';

// ----------------------------------------------------------------------

export default function AddFaqsPage() {
  return (
    <>
      <Helmet>
        <title> Add Faqs | The Hope House </title>
      </Helmet>

      <AddFaqs />
    </>
  );
}
