// ./config/plugins.ts
export default ({ env }: { env: (key: string, defaultValue?: string) => string }) => ({
    i18n: {
      enabled: true,
      config: {
        defaultLocale: 'en',
        locales: ['en', 'ru', 'pt', 'es', 'de', 'id'],
      },
    },
  });
  