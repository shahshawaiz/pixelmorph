import { useState } from 'react';
import Link from 'next/link';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed z-20 inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 bg-white w-60 shadow-md lg:translate-x-0`}
      >
        <div className="flex flex-col h-full justify-between">
          {/* Logo and Navigation */}
          <div>
            <div className="p-6">
              <div className="flex items-center mb-6">
                <img
                  src="/logo.png"
                  alt="PixelMorph"
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: '80px' }}
                />
              </div>
              <nav className="space-y-4">
                <Link href="/" legacyBehavior>
                  <a
                    className="block px-4 py-2 rounded hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-100 focus:text-blue-800 focus:outline-none transition-all duration-300"
                    aria-label="Go to Home Page"
                  >
                    Home
                  </a>
                </Link>
                <Link href="/background-remover" legacyBehavior>
                  <a
                    className="block px-4 py-2 rounded hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-100 focus:text-blue-800 focus:outline-none transition-all duration-300"
                    aria-label="Go to Background Remover"
                  >
                    Background Remover
                  </a>
                </Link>
                <Link href="/faceswap" legacyBehavior>
                  <a
                    className="block px-4 py-2 rounded hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-100 focus:text-blue-800 focus:outline-none transition-all duration-300"
                    aria-label="Go to Face Swapper"
                  >
                    Faceswap
                  </a>
                </Link>  
                <Link href="/multifaceswap" legacyBehavior>
                  <a
                    className="block px-4 py-2 rounded hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-100 focus:text-blue-800 focus:outline-none transition-all duration-300"
                    aria-label="Go to Face Swapper"
                  >
                    Multi-Faceswap
                  </a>
                </Link>  
                <Link href="/faceshape-detector" legacyBehavior>
                  <a
                    className="block px-4 py-2 rounded hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-100 focus:text-blue-800 focus:outline-none transition-all duration-300"
                    aria-label="Go to Face Swapper"
                  >
                    Face Shape Detector
                  </a>
                </Link>                                                
                <Link href="/the-wall" legacyBehavior>
                  <a
                    className="block px-4 py-2 rounded hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-100 focus:text-blue-800 focus:outline-none transition-all duration-300"
                    aria-label="Go to Watermark Remover"
                  >
                    The Wall
                  </a>
                </Link>                                
                <Link href="/about" legacyBehavior>
                  <a
                    className="block px-4 py-2 rounded hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-100 focus:text-blue-800 focus:outline-none transition-all duration-300"
                    aria-label="Learn About Us"
                  >
                    About
                  </a>
                </Link>
              </nav>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 text-sm text-center text-gray-500">
            &copy; {new Date().getFullYear()} PixelMorph
          </div>
        </div>
      </aside>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 lg:ml-60">
        {/* Header */}
        <header className="bg-white shadow p-4 flex items-center justify-between lg:hidden">
          <button
            className="text-gray-700 focus:outline-none"
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
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
          <div className="text-lg font-semibold">PixelMorph</div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-white shadow-lg m-6 rounded-lg overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
