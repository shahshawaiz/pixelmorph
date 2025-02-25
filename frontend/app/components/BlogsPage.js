import { useState } from 'react';
import Layout from './Layout';

const Blogs = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6 text-white">Blog</h1>
        <div
          className="relative"
          style={{ paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}
        >
          {!iframeLoaded && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70">
              <p className="text-xl text-white">Loading blog...</p>
            </div>
          )}
          <iframe
            src="https://yourwordpresssite.com" // Replace with your actual WordPress blog URL
            title="Blog"
            frameBorder="0"
            className="absolute top-0 left-0 w-full h-full"
            onLoad={() => setIframeLoaded(true)}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Blogs;
