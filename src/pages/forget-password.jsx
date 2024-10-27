import { Helmet } from 'react-helmet-async';

import { ForgetPassword } from 'src/sections/forgetPassword';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Signup | The Hope House </title>
      </Helmet>

      <ForgetPassword />
    </>
  );
}
