import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        {/* Full-Width Hero Section */}
        <section className="relative w-full rounded-lg shadow-2xl border border-gray-800 overflow-hidden">
          {/* Hero Banner Image */}
          <img
            src="/images/home/hero-banner.jpg" // Update with your banner image path
            alt="Hero Banner"
            className="absolute inset-0 z-0 w-full h-full object-cover"
          />
          {/* Animated Clouds Overlay */}
          <div className="moving-clouds absolute inset-0 z-10"></div>
          {/* Overlay */}
          <div className="absolute inset-0 z-20 bg-gradient-to-br from-black via-gray-900 to-black opacity-80"></div>
          {/* Hero Content */}
          <div className="relative z-30 py-16">
            <h1 className="text-center text-7xl font-extrabold mb-6 drop-shadow-2xl text-white bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              PixelMorph
            </h1>
            <p className="text-center text-2xl mb-10 max-w-3xl mx-auto text-gray-400">
              Fast, simple, and free tools to process your images. Enhance effortlessly.
            </p>
            <div className="flex justify-center">
              <Link
                href="/about"
                className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-md transition-all duration-300 shadow-lg hover:shadow-cyan-600"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <section className="py-16">
            <h2 className="text-4xl font-bold mb-12 text-center text-white">
              Our Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1 */}
              <div className="p-8 bg-gray-900 rounded-lg shadow-lg border border-gray-800 transition transform hover:-translate-y-1 hover:border-cyan-500">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-400">
                  Background Remover
                </h3>
                <p className="text-gray-400 mb-6">
                  Instantly remove image backgrounds with AI precision.
                </p>
                <Link
                  href="/background-remover"
                  className="text-cyan-500 font-medium hover:underline"
                >
                  Try Now →
                </Link>
              </div>
              {/* Card 2 */}
              <div className="p-8 bg-gray-900 rounded-lg shadow-lg border border-gray-800 transition transform hover:-translate-y-1 hover:border-cyan-500">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-400">
                  Faceswap
                </h3>
                <p className="text-gray-400 mb-6">
                  Effortlessly faceswap images or videos.
                </p>
                <Link
                  href="/faceswap"
                  className="text-cyan-500 font-medium hover:underline"
                >
                  Try Now →
                </Link>
              </div>
              {/* Card 3 */}
              <div className="p-8 bg-gray-900 rounded-lg shadow-lg border border-gray-800 transition transform hover:-translate-y-1 hover:border-cyan-500">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-400">
                  Multi-Faceswap
                </h3>
                <p className="text-gray-400 mb-6">
                  Faceswap multiple faces in images or videos.
                </p>
                <Link
                  href="/multifaceswap"
                  className="text-cyan-500 font-medium hover:underline"
                >
                  Try Now →
                </Link>
              </div>
              {/* Card 4 */}
              <div className="p-8 bg-gray-900 rounded-lg shadow-lg border border-gray-800 transition transform hover:-translate-y-1 hover:border-cyan-500">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-400">
                  Faceshape Detector
                </h3>
                <p className="text-gray-400 mb-6">
                  Detect face shapes effortlessly.
                </p>
                <Link
                  href="/faceshape-detector"
                  className="text-cyan-500 font-medium hover:underline"
                >
                  Try Now →
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Call-To-Action Section */}
        <section className="relative w-full py-20 mt-16">
          <div className="absolute inset-0">
            {/* Background image overlay for bottom section */}
            <img
              src="/images/home/bottom-bg.jpg" // Update with your bottom section image path
              alt="Bottom Background"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="w-full h-full bg-gradient-to-br from-blue-800 to-purple-800 opacity-70"></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold text-white mb-6">
              Take Your Images to the Next Level
            </h2>
            <p className="text-lg text-gray-200 mb-8">
              Explore our suite of powerful image enhancement tools designed to boost your creativity and streamline your workflow.
            </p>
            <div className="flex justify-center">
              <Link
                href="/get-started"
                className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-md transition-all duration-300 shadow-lg hover:shadow-cyan-600"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>
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
