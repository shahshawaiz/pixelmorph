// components/Meta.js
const Meta = ({ content }) => (
  <>
    <link rel="icon" href="/favicon.ico" />
    <title>{content.seoTitle} - PixelMorph</title>
    <meta name="title" content={content.seoTitle} />
    <meta name="description" content={content.metaDescription} />
    <meta name="keywords" content={content.keywords} />
    
    {/* Open Graph meta tags */}
    <meta property="og:title" content={content.ogTitle || content.seoTitle} />
    <meta property="og:description" content={content.ogDescription || content.metaDescription} />
    <meta property="og:url" content={content.ogUrl || content.structureWebsiteUrl} />
    <meta property="og:image" content={content.structureWebsiteImage || content.previewImageUrl} />
    <meta property="og:image:alt" content={content.ogImgAlt || content.imageAlt} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={content.structureWebsiteName} />

    {/* Twitter Card meta tags */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={content.twitterTitle || content.seoTitle} />
    <meta name="twitter:description" content={content.twitterDescription || content.metaDescription} />
    <meta name="twitter:image" content={content.structureWebsiteImage || content.previewImageUrl} />
  </>
);

export default Meta;
