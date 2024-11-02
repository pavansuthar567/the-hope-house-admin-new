import { Helmet } from 'react-helmet-async';

import { AddRecognition } from 'src/sections/recognition/add';

// ----------------------------------------------------------------------

export default function AddRecognitionPage() {
  return (
    <>
      <Helmet>
        <title> Add Recognition | The Hope House </title>
      </Helmet>

      <AddRecognition />
    </>
  );
}
