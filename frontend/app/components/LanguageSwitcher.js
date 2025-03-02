import { useEffect } from 'react';
import { useRouter } from 'next/router';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale, locales, asPath, defaultLocale, isReady } = router;

  const handleLocaleChange = (newLocale) => {
    router.replace(asPath, asPath, { locale: newLocale });
  };

  useEffect(() => {
    if (!isReady) return;

    // Check if we’ve already auto-detected the locale in this session.
    if (localStorage.getItem('autoDetected')) return;

    // If the current locale isn’t the default, assume it’s already been set.
    if (locale !== defaultLocale) {
      localStorage.setItem('autoDetected', 'true');
      return;
    }

    const deviceLang = navigator.language.split('-')[0];
    if (locales.includes(deviceLang) && deviceLang !== locale) {
      handleLocaleChange(deviceLang);
    }
    localStorage.setItem('autoDetected', 'true');
  }, [isReady, locale, locales, defaultLocale]);

  return (
    <select
      value={locale}
      onChange={(e) => handleLocaleChange(e.target.value)}
      className="px-3 py-1 rounded-md bg-gray-800 text-gray-400 focus:outline-none"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {loc.toUpperCase()}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
