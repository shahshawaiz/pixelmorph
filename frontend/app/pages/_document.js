import Document, { Html, Head, Main, NextScript } from 'next/document';
import GoogleTagManager from '../components/GoogleTagManager';
class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
            <meta name="robots" content="noindex, nofollow" />
            <meta name="googlebot" content="noindex, nofollow" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />            
        </Head>
        <body>          
          <GoogleTagManager />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
