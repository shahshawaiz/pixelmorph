import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    // Retrieve the locale from Next.js data (defaulting to "en")
    const locale = this.props.__NEXT_DATA__.locale || 'en';

    return (
      <Html>
        <Head>
          {/* Consent banner inline script with cookie check */}
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                // Only configure Iubenda if the consent cookie is not already set
                if (document.cookie.indexOf('iubenda_consent') === -1) {
                  var _iub = _iub || [];
                  _iub.csConfiguration = {
                    "siteId": 3951141,
                    "cookiePolicyId": 24621994,
                    "lang": "${locale}",
                    "storage": {"useSiteId": true}
                  };
                }
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
