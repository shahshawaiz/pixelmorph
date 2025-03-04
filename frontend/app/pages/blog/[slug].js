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
  // Fetch the specific post using its slug
  const res = await fetch(`https://swapinfo.xyz/wp-json/wp/v2/posts?slug=${params.slug}`);
  const posts = await res.json();

  if (!posts.length) {
    return { notFound: true };
  }

  return {
    props: { post: posts[0] },
    revalidate: 10, // Enable Incremental Static Regeneration
  };
}

/**
 * Only inject default classes if they’re not already set.
 * We avoid converting newlines to <br/> so that the original WordPress formatting is preserved.
 */
const formatContent = (content) => {
  if (!content) return '';

  // Add default styling classes to common HTML tags if they don't already have a class attribute.
  // content = content.replace(/<(p)(?![^>]*\bclass\s*=)/gi, '<$1 class="text-white"');
  // content = content.replace(/<(h[1-6])(?![^>]*\bclass\s*=)/gi, '<$1 class="text-white"');
  // content = content.replace(/<(strong|b)(?![^>]*\bclass\s*=)/gi, '<$1 class="font-bold text-white"');
  // content = content.replace(/<(em|i)(?![^>]*\bclass\s*=)/gi, '<$1 class="italic text-white"');

  // replace carriage returns with <br> tags
  // content = content.replace(/\r/g, '<br/>');

  // remove <p> tags
  content = content.replace(/<p>/g, '');

  // remove ol tags
  content = content.replace(/<ol>/g, '');

  // remove <ul> tags
  content = content.replace(/<ul>/g, '<br>');

  // remove li tags
  content = content.replace(/<li>/g, '');

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
