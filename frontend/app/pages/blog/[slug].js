// pages/blog/[slug].js
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export async function getStaticPaths({ locales }) {
  // Fetch all posts to build the list of possible paths (using the slug)
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
  // Attempt to fetch the localized post only
  const res = await fetch(
    `https://swapinfo.xyz/wp-json/wp/v2/posts?slug=${params.slug}&lang=${locale}`
  );
  const posts = await res.json();

  // If no post is found, return a 404 page
  if (!posts || posts.length === 0) {
    // redirect to blogs page with locale
    return {
      redirect: {
        destination: `/${locale}/blog`,
        permanent: false,
      },
    };
  }

  return {
    props: { post: posts[0] },
    revalidate: 10, // Enable Incremental Static Regeneration
  };
}

/**
 * A minimal formatter that performs only basic removals so as not to
 * disturb the original WordPress markup too much.
 */
const formatContent = (content) => {
  if (!content) return '';
  // These replacements are just examples—adjust as needed.
  content = content.replace(/<p>/g, '');
  content = content.replace(/<\/p>/g, '');
  content = content.replace(/<ol>/g, '');
  content = content.replace(/<\/ol>/g, '');
  content = content.replace(/<ul>/g, '');
  content = content.replace(/<\/ul>/g, '');
  content = content.replace(/<li>/g, '');
  content = content.replace(/<\/li>/g, '<br/>');
  return content;
};

const BlogsPostPage = ({ post }) => {
  const { locale } = useRouter();

  return (
    <Layout>
      <div className="pt-6 pb-4">
        <div className="max-w-4xl mx-auto px-4 bg-white">
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
              className="text-gray-600 mb-4 text-black"
              dangerouslySetInnerHTML={{
                __html: formatContent(post.content.rendered),
              }}
            />
          </article>
        </div>
      </div>
    </Layout>
  );
};

export default BlogsPostPage;
