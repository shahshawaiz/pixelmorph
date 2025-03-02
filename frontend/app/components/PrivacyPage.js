import { useRouter } from 'next/router';
import useSWR from 'swr';
import Head from 'next/head';
import Layout from '../components/Layout';

const fetcher = (url) => fetch(url).then((res) => res.json());

const PrivacyPolicy = () => {
  const { locale } = useRouter();
  const { data, error } = useSWR(`/api/loadSwrFaceswap?locale=${locale}`, fetcher);

  const fallbackContent = {
    privacyTitle: 'Privacy Policy',
    privacyBody: `
      <p>At PixelMorph, we respect your privacy and are committed to protecting your personal information.</p>
      <h2>Information Collection</h2>
      <p>
        We may collect information such as your IP address, browser type, and other technical details to enhance
        our services.
      </p>
      <h2>Use of Information</h2>
      <p>
        Collected information is used solely for improving user experience and enhancing our platform’s performance.
      </p>
      <h2>Data Security</h2>
      <p>
        We implement robust security measures to safeguard your personal data and do not share your information with third parties.
      </p>
      <h2>Policy Changes</h2>
      <p>
        We reserve the right to update our privacy policy at any time. Continued use of our service indicates acceptance of any changes.
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

  const content = data?.data || fallbackContent;
  const bodyHtml = formatContent(content.privacyBody);

  return (
    <Layout>
      <Head>
        <title>{content.privacyTitle}</title>
        <meta name="description" content={content.privacyBody.replace(/(<([^>]+)>)/gi, "").slice(0, 150)} />
      </Head>
      <div className="bg-black pt-6">
        <div className="max-w-4xl mx-auto px-4 bg-black" >
          <h1 className="text-3xl font-bold mb-6 text-white">{content.privacyTitle}</h1>
          <div className="prose prose-invert">
            <div className="pb-8" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;