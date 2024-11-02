import { Helmet } from 'react-helmet-async';

import { GalleryView } from 'src/sections/gallery/view';

// ----------------------------------------------------------------------

export default function GalleryPage() {
  return (
    <>
      <Helmet>
        <title> Gallery | The Hope House </title>
      </Helmet>

      <GalleryView />
    </>
  );
}
