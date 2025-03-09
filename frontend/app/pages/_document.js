import Document, { Html, Head, Main, NextScript } from 'next/document';
import Meta from '../components/Meta';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // Get the initial props from Next.js
    const initialProps = await Document.getInitialProps(ctx);
    // Retrieve the locale from the context (defaulting to "en")
    const locale = ctx?.locale || 'en';
    
    let metaData = { data: {} }; // fallback meta data

    try {
      // Fetch meta data from Strapi.
      // Make sure to set NEXT_PUBLIC_STRAPI_API_URL in your environment variables.
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/faceswap?locale=${locale}`
      );
      // Only update metaData if the response is successful.
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      metaData = await res.json();
      console.log(metaData?.data?.seoTitle);
    } catch (error) {
      console.error("Error fetching meta data from Strapi:", error);
      // You can customize the fallback metaData object here if desired.
    }

    return { ...initialProps, metaData, locale };
  }

  render() {
    const { locale, metaData } = this.props;

    return (
      <Html lang={locale}>
        <Head>
          {/* Inject the dynamic meta data from Strapi */}
          <Meta content={metaData?.data} />          

          {/* Inline Iubenda configuration script (critical for cookie consent) */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
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
          {/* Load Iubenda scripts with async/defer to reduce render-blocking */}
          <script src="https://cs.iubenda.com/autoblocking/3951141.js" defer></script>
          <script src="https://cdn.iubenda.com/cs/gpp/stub.js" defer></script>
          <script src="https://cdn.iubenda.com/cs/iubenda_cs.js" charSet="UTF-8" async defer></script>

          {/* Google Analytics: load asynchronously */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-DRR7EVG49B"></script>
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
