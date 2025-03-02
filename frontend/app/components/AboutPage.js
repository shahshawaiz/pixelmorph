import { useRouter } from 'next/router';
import useSWR from 'swr';
import Head from 'next/head';
import Layout from '../components/Layout';

const fetcher = (url) => fetch(url).then((res) => res.json());

const About = () => {
  const { locale } = useRouter();
  const { data, error } = useSWR(`/api/loadSwrFaceswap?locale=${locale}`, fetcher);

  // Fallback content if API data isn’t available
  const fallbackContent = {
    aboutTitle: 'About PixelMorph',
    aboutBody: `
      PixelMorph is a simple and user-friendly platform that provides fast and free image processing services.
      Our goal is to make image editing accessible to everyone by offering tools like background removal and
      watermark removal, all in just a few clicks.
      
      <h2>Key Features</h2>
      <ul>
        <li>Effortless background removal using AI.</li>
        <li>Quick and efficient watermark removal.</li>
        <li>Simple, user-friendly interface.</li>
        <li>High-quality results in seconds.</li>
      </ul>
      
      <h2>Our Mission</h2>
      <p>
        We aim to deliver free, easy-to-use image editing tools for everyone. PixelMorph empowers you to achieve
        professional results without expensive software or technical expertise.
      </p>
      
      <h2>Why Choose Us?</h2>
      <p>
        With its blend of simplicity and efficiency, PixelMorph is perfect whether you’re refreshing old photos or
        creating fun new images. Our tools are designed to be as seamless as possible.
      </p>
    `,
  };

  const formatContent = (content) => {
    content = content || '';
  
    // Add default styling classes to common HTML tags if they don't already have a class attribute.
    content = content.replace(/<(p)(?![^>]*\bclass\s*=)/gi, '<$1 class="text-white"');
    content = content.replace(/<(h[1-6])(?![^>]*\bclass\s*=)/gi, '<$1 class="text-white"');
    content = content.replace(/<(strong|b)(?![^>]*\bclass\s*=)/gi, '<$1 class="font-bold text-white"');
    content = content.replace(/<(em|i)(?![^>]*\bclass\s*=)/gi, '<$1 class="italic text-white"');
  
    // Now convert all newline characters to <br/> tags.
    // This splits the entire content (including text inside tags) on newline characters and rejoins them.
    content = content.split(/\r?\n/).join('<br/>');
  
    return content;
  };

  // The API response is expected to be structured as { data: { attributes: { ... } } }
  const content = data?.data || fallbackContent;
  const bodyHtml = formatContent(content.aboutBody);

  return (
    <Layout>
      <Head>
        <title>{content.aboutTitle}</title>
        <meta name="description" content={content.aboutBody.replace(/(<([^>]+)>)/gi, "").slice(0, 150)} />
      </Head>
      <div className="bg-black pt-6">
        <div className="max-w-4xl mx-auto px-4 bg-black" >
          <h1 className="text-3xl font-bold mb-6 text-white">{content.aboutTitle}</h1>
          <div className="prose prose-invert whitespace-pre-line">
            <div className="pb-8" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
