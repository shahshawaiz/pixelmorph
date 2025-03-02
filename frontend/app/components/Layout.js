import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LanguageSwitcher from './LanguageSwitcher';
import { Twitter, Instagram, Facebook } from 'lucide-react';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { locale, locales, asPath } = router;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
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
                <Link href="/" className="block px-4 py-2 rounded hover:bg-cyan-600 transition">Faceswap</Link>
                {/* <Link href="/multifaceswap" className="block px-4 py-2 rounded hover:bg-cyan-600 transition">Multi-Faceswap</Link>
                <Link href="/blogs" className="block px-4 py-2 rounded hover:bg-cyan-600 transition">Blogs</Link> */}
                <Link href="/about" className="block px-4 py-2 rounded hover:bg-cyan-600 transition">About</Link>
                <Link href="/privacy" className="block px-4 py-2 rounded hover:bg-cyan-600 transition">Privacy Policy</Link>
                <Link href="/terms" className="block px-4 py-2 rounded hover:bg-cyan-600 transition">Terms of Service</Link>
              </nav>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for Sidebar on Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={toggleSidebar} />
      )}

      {/* Main Content */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-black shadow p-4 flex items-center justify-between">
          <button className="text-white focus:outline-none" onClick={toggleSidebar} aria-label="Toggle Sidebar">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <LanguageSwitcher />
        </header>

        {/* Page Content */}
        <main className="py-2 bg-white overflow-auto flex-1">
          <div className="mx-auto">{children}</div>
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-gray-900 to-black text-gray-400 py-8">
          <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Logo & Tagline */}
            <div>
              <img src="/logo.png" alt="Pixelmorph Logo" className="h-10 w-auto mb-2" />
              <p className="text-sm text-gray-300">Pixelmorph</p>
              <p className="text-sm text-gray-500 mt-2">© {new Date().getFullYear()} Pixelmorph. All rights reserved.</p>
            </div>
            {/* Column 2: More Links */}
            <div>
              <ul className="space-y-1 text-sm">
                <li><Link href="/blogs" className="hover:text-white">Blog</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            {/* Column 3: Social Links & Language */}
            <div>
              <p className="font-semibold mb-2 text-white">Follow Us</p>
              <div className="flex space-x-4 mb-4">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  <Twitter size={20} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  <Instagram size={20} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  <Facebook size={20} />
                </a>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-white mb-1">Change Language</p>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;