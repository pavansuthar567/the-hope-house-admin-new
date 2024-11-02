import { Helmet } from 'react-helmet-async';

import { RecognitionView } from 'src/sections/recognition/view';

// ----------------------------------------------------------------------

export default function RecognitionPage() {
  return (
    <>
      <Helmet>
        <title> Recognition | The Hope House </title>
      </Helmet>

      <RecognitionView />
    </>
  );
}
