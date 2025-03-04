import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
            <meta name="robots" content="noindex, nofollow" />
            <meta name="googlebot" content="noindex, nofollow" />
            
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
