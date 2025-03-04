import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export async function getStaticProps({ locale }) {
  // Fetch posts from the WordPress REST API
  const res = await fetch('https://swapinfo.xyz/wp-json/wp/v2/posts?lang=' + locale);
  const posts = await res.json();

  return {
    props: { posts },
    revalidate: 10, // Enable Incremental Static Regeneration
  };
}

const Blogs = ({ posts }) => {
  const { locale } = useRouter();

  return (
    <Layout>
      <div className="pt-6">
        <div className="max-w-4xl mx-auto px-4" >
            <h1 className="text-3xl font-bold mb-6 text-black">Blog</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  locale={locale}
                  className="bg-gray-800 p-4 rounded hover:bg-gray-700"
                >
                  <h2
                    className="text-xl font-bold"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <div
                    className="text-gray-400 mt-2"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                  <div className="text-gray-500 mt-2">
                    {new Date(post.date).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </Link>
              ))}
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blogs;
