import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Image from 'next/image';
import Head from 'next/head';

export async function getStaticProps({ locale }) {
  const res = await fetch(
    `https://swapinfo.xyz/wp-json/wp/v2/posts?lang=${locale}&_embed`
  );
  const posts = await res.json();

  // Optionally, you can handle an empty posts list:
  // if (!posts || posts.length === 0) {
  //   return {
  //     notFound: true,
  //   };
  // }

  return {
    props: { posts },
    revalidate: 10,
  };
}

export default function Blogs({ posts }) {
  const { locale } = useRouter();

  return (
    <Layout>
      <Head>
        <title>Blogs - PixelMorph</title>
      </Head>
      {/* Dark background for the entire section */}
      <div className="bg-gray-900 min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8">Blog</h1>

          {/* Grid layout for blog cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {posts.map((post) => {
              // Use a larger size if available, else fall back to thumbnail
              const thumbnail =
                post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes
                  ?.medium?.source_url ||
                post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes
                  ?.thumbnail?.source_url;

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  locale={locale}
                >
                  <a className="bg-gray-800 rounded overflow-hidden shadow hover:shadow-lg transition-shadow">
                    {/* Image at the top of the card */}
                    {thumbnail && (
                      <div className="relative w-full h-48">
                        <Image
                          src={thumbnail}
                          alt={post.title.rendered}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Card content */}
                    <div className="p-4">
                      <h2
                        className="text-xl font-bold text-white mb-2"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                      <div
                        className="text-gray-400 text-sm"
                        dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                      />
                      <div className="text-gray-500 text-xs mt-2">
                        {new Date(post.date).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
