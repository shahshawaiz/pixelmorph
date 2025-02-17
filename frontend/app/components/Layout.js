import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { locale, locales, asPath } = router;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 bg-black shadow-xl overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full justify-between">
          {/* Logo and Navigation */}
          <div>
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center mb-4">
                <img
                  src="/logo.png"
                  alt="PixelMorph"
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: '80px' }}
                />
              </div>
              <nav className="space-y-2">
                <Link
                  href="/"
                  className="block px-4 py-2 rounded hover:bg-cyan-600 transition"
                >
                  Home
                </Link>
                <Link
                  href="/faceswap"
                  className="block px-4 py-2 rounded hover:bg-cyan-600 transition"
                >
                  Faceswap
                </Link>
                <Link
                  href="/background-remover"
                  className="block px-4 py-2 rounded hover:bg-cyan-600 transition"
                >
                  Background Remover
                </Link>
                <Link
                  href="/multifaceswap"
                  className="block px-4 py-2 rounded hover:bg-cyan-600 transition"
                >
                  Multi-Faceswap
                </Link>
                <Link
                  href="/faceshape-detector"
                  className="block px-4 py-2 rounded hover:bg-cyan-600 transition"
                >
                  Face Shape Detector
                </Link>
                <Link
                  href="/the-wall"
                  className="block px-4 py-2 rounded hover:bg-cyan-600 transition"
                >
                  The Wall
                </Link>
                <Link
                  href="/about"
                  className="block px-4 py-2 rounded hover:bg-cyan-600 transition"
                >
                  About
                </Link>
              </nav>
            </div>
            {/* Language Switcher */}
            <div className="p-6 border-t border-gray-800">
              <div className="text-gray-500 text-sm mb-2 text-center">Language</div>
              <div className="flex justify-center space-x-2">
                {locales.map((loc) => (
                  <Link
                    key={loc}
                    href={asPath}
                    locale={loc}
                    className={`px-3 py-1 rounded-full border border-gray-700 transition-colors ${
                      locale === loc
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-cyan-700 hover:text-white'
                    }`}
                  >
                    {loc.toUpperCase()}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="p-6 text-xs text-center text-gray-500 border-t border-gray-800">
            &copy; {new Date().getFullYear()} PixelMorph
          </div>
        </div>
      </aside>

      {/* Overlay for Sidebar on Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* Header */}
        <header className="bg-black shadow p-4 flex items-center justify-between">
          <button
            className="text-white focus:outline-none"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <div className="text-lg font-semibold">PixelMorph</div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-black overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
