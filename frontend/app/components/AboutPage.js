import Layout from './Layout';

const About = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6 text-white">About PixelMorph</h1>
        <p className="text-gray-300 leading-relaxed mb-6">
          PixelMorph is a simple and user-friendly platform that provides fast and free
          image processing services. Our goal is to make image editing accessible to everyone by
          offering tools like background removal and watermark removal, all in just a few clicks.
        </p>
        <h2 className="text-2xl font-semibold mb-4 text-white">Key Features</h2>
        <ul className="list-disc pl-5 text-gray-300 space-y-2 mb-6">
          <li>Remove image backgrounds effortlessly with AI.</li>
          <li>Erase watermarks from images quickly and efficiently.</li>
          <li>No need for complex software – everything is online and free.</li>
          <li>User-friendly interface designed for simplicity.</li>
          <li>Fast processing times with high-quality results.</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-4 text-white">Our Mission</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          Our mission is to provide free and easy-to-use image editing tools for everyone. We believe
          that high-quality image processing should be accessible without expensive software or
          technical expertise. With PixelMorph, anyone can achieve professional results.
        </p>
        <h2 className="text-2xl font-semibold mb-4 text-white">Why Choose Us?</h2>
        <p className="text-gray-300 leading-relaxed">
          PixelMorph stands out for its simplicity and efficiency. Whether you need to remove
          a background for product photos or get rid of watermarks from personal images, our tools
          are designed to make the process as easy and seamless as possible.
        </p>
      </div>
    </Layout>
  );
};

export default About;
