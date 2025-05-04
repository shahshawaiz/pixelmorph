// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import Meta from '../components/Meta';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    // // Preserve your Strapi fetch logic as comments:
    // const locale = ctx?.locale || 'en';
    // let metaData = { data: {} };
    // try {
    //   const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/faceswap?locale=${locale}`
    //   );
    //   if (!res.ok) {
    //     throw new Error(`HTTP error! status: ${res.status}`);
    //   }
    //   metaData = await res.json();
    // } catch (error) {
    //   console.error("Error fetching meta data from Strapi:", error);
    // }

    // Build dynamic canonical URL **without** ctx.req
    const siteUrl = (process.env.NEXT_PUBLIC_DOMAIN || '');
    const path = ctx.asPath || ctx.pathname;
    const canonicalUrl = `${siteUrl}${path}`;

    return {
      ...initialProps,
      canonicalUrl,
      // locale,
      // metaData,
    };
  }

  render() {
    // locale & metaData are still here if you uncomment above
    const { locale, metaData, canonicalUrl } = this.props;

    return (
      <Html lang={locale}>
        <Head>
          {/* Inject dynamic meta data from Strapi */}
          {/* <Meta content={metaData?.data} /> */}

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

          {/* Auto-generated canonical */}
          <link rel="canonical" href={canonicalUrl} />

          <link rel="icon" href="/logo.png" />
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
