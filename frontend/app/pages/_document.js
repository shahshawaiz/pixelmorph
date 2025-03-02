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
        
            {/* Google Tag Manager - Paste immediately after opening <head> */}
            <GoogleTagManager />
        </Head>
        <body>
          {/* Google Tag Manager (noscript) - Paste immediately after opening <body> */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-TLFGXRTC"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
