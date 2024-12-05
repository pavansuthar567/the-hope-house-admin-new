import { Helmet } from 'react-helmet-async';
import { MessageView } from 'src/sections/message/view';

// ----------------------------------------------------------------------

export default function MessagePage() {
  return (
    <>
      <Helmet>
        <title> Messages | The Hope House </title>
      </Helmet>

      <MessageView />
    </>
  );
}
