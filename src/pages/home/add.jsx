import { Helmet } from 'react-helmet-async';

import { AddHome } from 'src/sections/home/add';

// ----------------------------------------------------------------------

export default function AddHomePage() {
  return (
    <>
      <Helmet>
        <title> Add Home | The Hope House </title>
      </Helmet>

      <AddHome />
    </>
  );
}
