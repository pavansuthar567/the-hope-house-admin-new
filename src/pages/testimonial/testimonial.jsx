import { Helmet } from 'react-helmet-async';

import { TestimonialView } from 'src/sections/testimonial/view';

// ----------------------------------------------------------------------

export default function TestimonialPage() {
  return (
    <>
      <Helmet>
        <title> Testimonials | The Hope House </title>
      </Helmet>

      <TestimonialView />
    </>
  );
}
