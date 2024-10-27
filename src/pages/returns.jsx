import { Helmet } from 'react-helmet-async';

import { ReturnsPage } from 'src/sections/returns';

// ----------------------------------------------------------------------

export default function Returns() {
  return (
    <>
      <Helmet>
        <title> Returns | The Hope House </title>
      </Helmet>

      <ReturnsPage />
    </>
  );
}
