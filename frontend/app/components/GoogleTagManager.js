import Script from 'next/script';

export default function GoogleTagManager() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-DRR7EVG49B"
        strategy="afterInteractive"
      />

      {/* Initialize Google Analytics */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-DRR7EVG49B', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
