import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale, locales, asPath, defaultLocale, isReady } = router;
  const autoDetectedRef = useRef(false);

  const handleLocaleChange = (newLocale) => {
    // Prevent redirecting if already in desired locale
    if (router.locale === newLocale) return;
    router.replace(asPath, asPath, { locale: newLocale });
  };

  useEffect(() => {
    if (!isReady) return;
    if (autoDetectedRef.current) return;

    // Use sessionStorage (more reliable in a single session on mobile) to mark detection as done.
    if (sessionStorage.getItem('autoDetected')) {
      autoDetectedRef.current = true;
      return;
    }

    // If the current locale isn’t the default, assume a locale was already set and do nothing.
    if (locale !== defaultLocale) {
      sessionStorage.setItem('autoDetected', 'true');
      autoDetectedRef.current = true;
      return;
    }

    const deviceLang = navigator.language.split('-')[0];
    // Only change if the device language is supported and is different from current.
    if (locales.includes(deviceLang) && deviceLang !== locale) {
      handleLocaleChange(deviceLang);
    }

    sessionStorage.setItem('autoDetected', 'true');
    autoDetectedRef.current = true;
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
