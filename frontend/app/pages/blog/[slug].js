import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Image from 'next/image';
import Head from 'next/head';

export async function getStaticPaths({ locales }) {
  // Fetch all posts to build the list of possible paths
  const res = await fetch('https://swapinfo.xyz/wp-json/wp/v2/posts');
  const posts = await res.json();

  // Generate paths for each locale
  const paths = posts.flatMap((post) =>
    locales.map((locale) => ({
      params: { slug: post.slug },
      locale,
    }))
  );

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params, locale }) {
  // Fetch localized post with embedded media
  const res = await fetch(
    `https://swapinfo.xyz/wp-json/wp/v2/posts?slug=${params.slug}&lang=${locale}&_embed`
  );
  const posts = await res.json();

  // If no post is found, return notFound to render the 404 page
  if (!posts || posts.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: { post: posts[0] },
    revalidate: 10,
  };
}

// Basic content formatting (optional)
const formatContent = (content) => {
  if (!content) return '';
  return content;
};

export default function BlogsPostPage({ post }) {
  const { locale } = useRouter();

  // Pull the highest-resolution image available (full) or fallback
  const featuredImageUrl =
    post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.full
      ?.source_url ||
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <Layout>
      <Head>
        <title>{post.title.rendered} - PixelMorph</title>
      </Head>
      {/* Full image at the top */}
      {featuredImageUrl && (
        <div className="max-w-5xl mx-auto my-6">
          <Image
            src={featuredImageUrl}
            alt={post.title.rendered}
            width={1920}
            height={1080}
            className="w-full h-auto rounded"
            priority
          />
        </div>
      )}

      {/* Main content */}
      <div className="pt-6 pb-4 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <article>
            <h1
              className="text-4xl font-bold mb-4 text-black"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            <div className="text-gray-600 mb-4 text-black">
              {new Date(post.date).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div
              className="text-gray-600 mb-4 text-black leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: formatContent(post.content.rendered),
              }}
            />
          </article>
        </div>
      </div>
    </Layout>
  );
}
