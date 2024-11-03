import { Helmet } from 'react-helmet-async';

import { AddBlog } from 'src/sections/blog/add';

// ----------------------------------------------------------------------

export default function AddBlogPage() {
  return (
    <>
      <Helmet>
        <title> Add Blog | The Hope House </title>
      </Helmet>

      <AddBlog />
    </>
  );
}
