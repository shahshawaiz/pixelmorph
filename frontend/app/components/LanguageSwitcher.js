import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale, locales, asPath, defaultLocale } = router;
  const [autoDetected, setAutoDetected] = useState(false);

  const handleLocaleChange = (newLocale) => {
    router.push(asPath, asPath, { locale: newLocale });
  };

  useEffect(() => {
    if (!router.isReady || autoDetected) return;

    // If the locale has already been set (i.e. it is not the default), do not auto-detect.
    if (locale !== defaultLocale) {
      setAutoDetected(true);
      return;
    }

    const deviceLang = navigator.language.split('-')[0];
    if (locales.includes(deviceLang) && deviceLang !== locale) {
      handleLocaleChange(deviceLang);
    }
    setAutoDetected(true);
  }, [router.isReady, autoDetected, locales, locale, defaultLocale]);

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
