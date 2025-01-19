import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto text-center py-8">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-blue-500 to-indigo-700 text-white rounded-xl shadow-lg">
          <h1 className="text-5xl font-extrabold mb-6">PixelMorph</h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Fast, simple, and free tools to process your images. Enhance effortlessly.
          </p>
          <Link href="/about" legacyBehavior>
            <a className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-md hover:bg-blue-100 transition">
              Learn More
            </a>
          </Link>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Our Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition-transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-3 text-blue-700">Background Remover</h3>
              <p className="text-gray-700 mb-4">
                Instantly remove image backgrounds with AI precision.
              </p>
              <Link href="/background-remover" legacyBehavior>
                <a className="text-blue-600 font-medium hover:underline">Try Now →</a>
              </Link>
            </div>

            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition-transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-3 text-blue-700">Faceswap</h3>
              <p className="text-gray-700 mb-4">
                Effortlessly faceswap images or videos
              </p>
              <Link href="/faceswap" legacyBehavior>
                <a className="text-blue-600 font-medium hover:underline">Try Now →</a>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
