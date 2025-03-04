import { useState, useEffect } from 'react';
import Layout from './Layout';

const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPostUrl, setSelectedPostUrl] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Fetch posts from WordPress REST API on component mount
  useEffect(() => {
    fetch('https://swapinfo.xyz/wp-json/wp/v2/posts')
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  // When a tile is clicked, set the selected post URL and reset iframe loading state
  const handleTileClick = (post) => {
    setSelectedPostUrl(post.link);
    setIframeLoaded(false);
  };

  return (
    <Layout>
      <div className="bg-black pt-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-white">Blog</h1>
          
          {/* Tiles listing all posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 p-4 rounded cursor-pointer hover:bg-gray-700"
                onClick={() => handleTileClick(post)}
              >
                <h2
                  className="text-xl font-bold text-white"
                  // Use dangerouslySetInnerHTML to render the title HTML
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <div
                  className="text-gray-400 mt-2"
                  // Render the excerpt HTML
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                />
              </div>
            ))}
          </div>

          {/* Render the selected post in an iframe */}
          {selectedPostUrl && (
            <div className="relative" style={{ paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              {!iframeLoaded && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70">
                  <p className="text-xl text-white">Loading post...</p>
                </div>
              )}
              <iframe
                src={selectedPostUrl}
                title="Selected Post"
                frameBorder="0"
                className="absolute top-0 left-0 w-full h-full"
                onLoad={() => setIframeLoaded(true)}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Blogs;
