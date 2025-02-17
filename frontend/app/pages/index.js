import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-black via-gray-900 to-black rounded-lg shadow-2xl border border-gray-800">
            <h1 className="text-center text-7xl font-extrabold mb-6 drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
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
          </section>

          {/* Features Section */}
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
      </div>
    </Layout>
  );
}
