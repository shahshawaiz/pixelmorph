// components/Meta.js
import React from 'react';

const defaultContent = {
  // SEO
  seoTitle: "AI Face Swap Online for Photos | Free Face Swapper",
  metaDescription:
    "Easily swap faces in photos and videos with our free AI face swap online tool. Enjoy seamless face swapping — just click to start with our face swapper!",
  keywords: "AI Face Swap",

  // Open Graph (OG)
  ogTitle: "", // Will default to seoTitle if empty
  ogDescription: "", // Will default to metaDescription if empty
  ogUrl: "", // Will default to structureWebsiteUrl if empty

  // Site structure
  structureWebsiteUrl: "https://mydomain.com",
  structureWebsiteName: "AI Face Swap Online for Photos | Free Face Swapper",
  structureWebsiteImage: "/images/faceswap/IMAGE1.webp", // fallback preview image
  previewImageUrl: "/images/faceswap/IMAGE1.webp",       // fallback preview image

  // Image alt
  ogImgAlt: "AI Face Swap", // fallback alt text for social previews
  imageAlt: "AI Face Swap", // fallback alt text for in-page images

  // Twitter
  twitterTitle: "", // Will default to seoTitle if empty
  twitterDescription: "", // Will default to metaDescription if empty
};

const Meta = ({ content = {} }) => {
  // Merge defaults with user-provided content
  const mergedContent = { ...defaultContent, ...content };

  return (
    <>
      {/* Basic SEO */}
      <title>{mergedContent.seoTitle} - PixelMorph</title>
      <meta name="title" content={mergedContent.seoTitle} />
      <meta name="description" content={mergedContent.metaDescription} />
      <meta name="keywords" content={mergedContent.keywords} />

      {/* Open Graph meta tags */}
      <meta
        property="og:title"
        content={mergedContent.ogTitle || mergedContent.seoTitle}
      />
      <meta
        property="og:description"
        content={mergedContent.ogDescription || mergedContent.metaDescription}
      />
      <meta
        property="og:url"
        content={mergedContent.ogUrl || mergedContent.structureWebsiteUrl}
      />
      <meta
        property="og:image"
        content={
          mergedContent.structureWebsiteImage || mergedContent.previewImageUrl
        }
      />
      <meta
        property="og:image:alt"
        content={mergedContent.ogImgAlt || mergedContent.imageAlt}
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={mergedContent.structureWebsiteName} />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content={mergedContent.twitterTitle || mergedContent.seoTitle}
      />
      <meta
        name="twitter:description"
        content={
          mergedContent.twitterDescription || mergedContent.metaDescription
        }
      />
      <meta
        name="twitter:image"
        content={
          mergedContent.structureWebsiteImage || mergedContent.previewImageUrl
        }
      />

      <link rel="icon" href="/favicon.ico" />
    </>
  );
};

export default Meta;
