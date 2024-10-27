import { Helmet } from 'react-helmet-async';

import SliderViewAdd from 'src/sections/brands/slider-view-add';

// ----------------------------------------------------------------------

export default function SliderViewAddPage() {
  return (
    <>
      <Helmet>
        <title> Brands | The Hope House </title>
      </Helmet>

      <SliderViewAdd />
    </>
  );
}
