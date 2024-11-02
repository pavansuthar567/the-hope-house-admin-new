import { Helmet } from 'react-helmet-async';

import { AddGallery } from 'src/sections/gallery/add';

// ----------------------------------------------------------------------

export default function AddGalleryPage() {
  return (
    <>
      <Helmet>
        <title> Add Gallery | The Hope House </title>
      </Helmet>

      <AddGallery />
    </>
  );
}
