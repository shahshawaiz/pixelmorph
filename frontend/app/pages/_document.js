import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="robots" content="noindex, nofollow" />
          <meta name="googlebot" content="noindex, nofollow" />

          {/* Consent banner inline script */}
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                var _iub = _iub || [];
                _iub.csConfiguration = {
                  "siteId": 3951141,
                  "cookiePolicyId": 24621994,
                  "lang": "en",
                  "storage": {"useSiteId": true}
                };
              `,
            }}
          />

          <script type="text/javascript" src="https://cs.iubenda.com/autoblocking/3951141.js"></script>
          <script type="text/javascript" src="//cdn.iubenda.com/cs/gpp/stub.js"></script>
          <script type="text/javascript" src="//cdn.iubenda.com/cs/iubenda_cs.js" charSet="UTF-8" async></script>

          {/* Google Analytics script inserted directly in the head */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-DRR7EVG49B"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-DRR7EVG49B');
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
