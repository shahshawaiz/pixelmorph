import { useRouter } from 'next/router';
import useSWR from 'swr';
import Head from 'next/head';
import Layout from '../components/Layout';

const fetcher = (url) => fetch(url).then((res) => res.json());

const TermsOfService = () => {
  const { locale } = useRouter();
  const { data, error } = useSWR(`/api/loadSwrFaceswap?locale=${locale}`, fetcher);

  const fallbackContent = {
    termsTitle: 'Terms of Service',
    termsBody: `
      <p>Welcome to PixelMorph. By accessing our services, you agree to these Terms of Service.</p>
      <h2>User Responsibilities</h2>
      <ul>
        <li>Use the service in compliance with applicable laws.</li>
        <li>You are solely responsible for any content you upload.</li>
      </ul>
      <h2>Service Limitations</h2>
      <p>
        While we strive for accuracy, the service is provided "as is" without any warranties, and we assume no
        liability for errors or omissions.
      </p>
      <h2>Modifications</h2>
      <p>
        We reserve the right to modify these terms at any time. Continued use of the service signifies your acceptance
        of any changes.
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
  const bodyHtml = formatContent(content.termsBody);

  return (
    <Layout>
      <Head>
        <title>{content.termsTitle} - PixelMorph</title>
        <meta name="description" content={content.termsBody.replace(/(<([^>]+)>)/gi, "").slice(0, 150)} />
      </Head>
      <div className="bg-black pt-6">
        <div className="max-w-4xl mx-auto px-4 bg-black" >
          <h1 className="text-3xl font-bold mb-6 text-white">{content.termsTitle}</h1>
          <div className="prose prose-invert">
            <div className="pb-8" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
