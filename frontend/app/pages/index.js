import Link from 'next/link';
import Layout from '../components/Layout';
import { User, Users } from 'lucide-react';

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        {/* HERO SECTION */}
        <section className="relative w-full h-screen rounded-lg shadow-2xl border border-gray-800 overflow-hidden">
          {/* Background Image */}
          <img
            src="/images/home/hero-banner.jpg" // Update with your banner image path
            alt="Hero Banner"
            className="absolute inset-0 z-0 w-full h-full object-cover"
          />
          {/* Animated Clouds Overlay */}
          <div className="moving-clouds absolute inset-0 z-10" />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 z-20 bg-gradient-to-br from-black via-gray-900 to-black opacity-80" />
          {/* Hero Content */}
          <div className="relative z-30 flex flex-col justify-center items-center h-full px-4">
            <h1 className="text-center text-7xl font-extrabold mb-6 drop-shadow-2xl text-white">
              PixelMorph
            </h1>
            <p className="text-center text-2xl mb-10 max-w-3xl mx-auto text-gray-400">
              Fast, simple, and free tools to process your images. Enhance effortlessly.
            </p>
            <Link
              href="/about"
              className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md transition-all duration-300 shadow-lg"
            >
              Learn More
            </Link>
          </div>
        </section>

        {/* FOOTER SECTION WITH TOOLS */}
        <footer className="bg-black border-t border-gray-800 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8 text-center">Our Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* FaceSwap Tool Card */}
              <Link
                href="/faceswap"
                className="block bg-gray-900 border border-gray-800 rounded-lg p-8 hover:bg-gray-800 transition transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  <User size={48} className="text-gray-500 mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-300 mb-2">FaceSwap</h3>
                  <p className="text-gray-500 text-center">Effortlessly swap faces in your photos.</p>
                </div>
              </Link>
              {/* Multi-FaceSwap Tool Card */}
              <Link
                href="/multifaceswap"
                className="block bg-gray-900 border border-gray-800 rounded-lg p-8 hover:bg-gray-800 transition transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  <Users size={48} className="text-gray-500 mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-300 mb-2">Multi-FaceSwap</h3>
                  <p className="text-gray-500 text-center">Swap multiple faces at once.</p>
                </div>
              </Link>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .moving-clouds {
          background: url('/images/home/clouds.png') repeat-x;
          background-size: cover;
          opacity: 0.5;
          animation: moveClouds 60s linear infinite;
        }
        @keyframes moveClouds {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </Layout>
  );
}
