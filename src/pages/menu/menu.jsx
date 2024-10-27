import { Helmet } from 'react-helmet-async';

import { MenuView } from 'src/sections/menu';

// ----------------------------------------------------------------------

export default function MenuPage() {
  return (
    <>
      <Helmet>
        <title> Menu | The Hope House </title>
      </Helmet>

      <MenuView />
    </>
  );
}
