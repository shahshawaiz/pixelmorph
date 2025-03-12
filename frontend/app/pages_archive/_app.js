// pages/_app.js
import '../styles/globals.css';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Iubenda Scripts */}
      <Script
        src="https://cs.iubenda.com/autoblocking/3951141.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.iubenda.com/cs/gpp/stub.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.iubenda.com/cs/iubenda_cs.js"
        charSet="UTF-8"
        strategy="afterInteractive"
      />

      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-DRR7EVG49B"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-DRR7EVG49B');
        `}
      </Script>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
