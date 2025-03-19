/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://faceswaponline.ai',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  exclude: ['/404'],
  transform: async (config, path) => {
    // Avoid adding alternate refs for pages that already include a locale prefix
    const defaultLocale = 'en';
    const locales = ['de', 'ru', 'pt', 'es', 'id'];
    const alternateRefs =
      path === '/' || path.indexOf(`/${defaultLocale}/`) === 0
        ? locales.map((locale) => ({
            href:
              locale === defaultLocale
                ? `${config.siteUrl}${path}`
                : `${config.siteUrl}/${locale}${path === '/' ? '' : path}`,
            hreflang: locale,
          }))
        : [];
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: 0.7,
      alternateRefs,
    };
  },
};
