import { Helmet } from 'react-helmet-async';

import { AddTestimonial } from 'src/sections/testimonial/add';

// ----------------------------------------------------------------------

export default function AddTestimonialPage() {
  return (
    <>
      <Helmet>
        <title> Add Testimonial | The Hope House </title>
      </Helmet>

      <AddTestimonial />
    </>
  );
}
