import { useState, useRef } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import { Upload, RefreshCcw, Download } from 'lucide-react';
import Layout from '../components/Layout';

// LanguageSwitcher component using Next.js i18n routing.
const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale, locales, asPath } = router;

  const handleLocaleChange = (newLocale) => {
    router.push(asPath, asPath, { locale: newLocale });
  };

  return (
    <div className="flex space-x-2 mb-4 justify-center">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          className={`px-3 py-1 rounded-md transition-colors ${
            loc === locale ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

// SWR fetcher
const fetcher = (url) => fetch(url).then((res) => res.json());

// Reusable DropZone component for file uploads.
const DropZone = ({ title, subtitle, file, onUpload, inputRef }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const event = { target: { files } };
      onUpload(event);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors duration-200 w-full ${
        isDragging ? 'border-blue-500 bg-blue-900' : 'border-gray-800 bg-black'
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      {file ? (
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          className="h-64 w-auto rounded-lg shadow-md"
          onLoad={(e) => URL.revokeObjectURL(e.target.src)}
        />
      ) : (
        <>
          <Upload className="w-12 h-12 text-gray-500 mb-3" />
          {title && <h3 className="text-lg font-medium mb-1 text-white">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mb-3">{subtitle}</p>}
          <button
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Choose File
          </button>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onUpload}
      />
    </div>
  );
};

const FaceSwap = () => {
  const router = useRouter();
  const { locale } = router;

  // Fetch localized content via SWR.
  const { data: apiData } = useSWR(`/api/loadSwr?locale=${locale}`, fetcher);
  console.log('SWR Data:', apiData);

  // Fallback content if API data is not available.
  const fallbackContent = {
    seoTitle: "AI Face Swap Online for Photos | Free Face Swapper",
    metaDescription: "Easily swap faces in any photo using our AI-powered tool.",
    keywords: "Face Swap, AI, Photo Editing, Gender Swap, Online Tool",
    header: "Free AI Face Swapper",
    structureBreadcrumblistName: "Face Swap Home",
    structureBreadcrumblistItem: "https://example.com/faceswap",
    structureWebsiteName: "Face Swap AI",
    structureWebsiteUrl: "https://example.com",
    structureWebsiteHeadline: "AI Face Swap Online",
    structureWebsiteDescription: "Swap faces instantly using advanced AI algorithms.",
    structureWebsiteImage: "https://example.com/images/hero.png",
    ogTitle: "AI Face Swap - Instantly Swap Faces",
    ogDescription: "Use our free online tool to swap faces in your photos.",
    ogUrl: "https://example.com/faceswap",
    ogImgAlt: "Face Swap Preview",
    previewImageUrl: "https://example.com/images/preview.png",
    twitterTitle: "AI Face Swap",
    twitterDescription: "Easily swap faces online with AI.",
    imageAlt: "A sample image showing before and after face swap.",
    introH1: "AI Face Swap",
    introContent: "Seamlessly swap faces with our powerful AI-based technology.",
    whatH2: "What Is Face Swap?",
    whatH3_1: "Introduction",
    whatContent1: "Face Swap is an AI tool that allows you to exchange faces in photos.",
    whatH3_2: "How It Works",
    whatContent2: "We use neural networks to detect and map facial features.",
    whatH3_3: "Supported Formats",
    whatContent3: "JPG, PNG, and WEBP are supported.",
    whatH3_4: "Instant Results",
    whatContent4: "See your swapped image in seconds.",
    whyH2: "Why Use Our Face Swap?",
    whyContent1: "Our tool offers unmatched accuracy and speed.",
    whyH3_1: "Accurate Detection",
    whyContent2: "We pinpoint facial landmarks for realistic swaps.",
    whyH3_2: "Fast Processing",
    whyContent3: "Get your results in just a few seconds.",
    whyH3_3: "Safe & Private",
    whyContent4: "We respect your privacy and never store your images.",
    whyH3_4: "Free to Use",
    whyContent5: "No hidden costs or premium features — everything is free!",
    howH2: "How to Use Face Swap",
    howTitle1: "Step 1: Upload Base Image",
    howContent1: "Select the main image where the face will be replaced.",
    howTitle2: "Step 2: Upload Target Face",
    howContent2: "Choose the face you want to swap into the base image.",
    howTitle3: "Step 3: Swap & Download",
    howContent3: "Click 'Swap Faces' and download the final result.",
    toolsH2: "All Tools",
    toolsH3_1: "Face Swap AI",
    toolsContent1: "Easily swap any face in seconds with our advanced AI technology.",
    userReviewH2: "User Reviews",
    userReviewName1: "Jane Doe - 'Fantastic!'",
    userReview1: "I love this tool! Swapping faces is so easy and fun.",
    userReviewName2: "John Smith - 'Unbelievable Results'",
    userReview2: "The accuracy is amazing. My friends thought it was real!",
    userReviewName3: "Alex Lee - 'Quick & Simple'",
    userReview3: "No complicated steps. Just upload and swap. Perfect for me.",
    userReviewName4: "Sam Patel - 'Highly Recommended'",
    userReview4: "The best face swapping tool out there. Highly recommend!",
    faqHeader: "Frequently Asked Questions",
    faqQuestion1: "What is a Face Swap?",
    faqAnswer1: "Face swap is the process of exchanging one face with another in a photo.",
    faqQuestion2: "How to swap a face in a picture?",
    faqAnswer2: "Just upload the base image and the target face, then click 'Swap Faces'.",
    faqQuestion3: "Can I swap faces for any photo?",
    faqAnswer3: "Yes, as long as the face is clearly visible.",
    faqQuestion4: "Is face swap legal?",
    faqAnswer4: "It's generally allowed for personal use, but avoid misusing it for deception.",
    faqQuestion5: "Is face swapper online safe?",
    faqAnswer5: "We prioritize security and do not store your images on our servers.",
    faqQuestion6: "Can I swap faces between animals and humans?",
    faqAnswer6: "Yes, but results may vary depending on the image clarity.",
    faqQuestion7: "Does AI FaceSwap Support Gender Swap?",
    faqAnswer7: "Yes, you can swap faces regardless of gender.",
    faqQuestion8: "How to achieve the best results?",
    faqAnswer8: "Use clear, well-lit images with front-facing faces.",
    faqQuestion9: "How does AI face swapper work?",
    faqAnswer9: "It uses deep learning to detect and map facial features, then merges them.",
    faqQuestion10: "What type of file format does this tool support?",
    faqAnswer10: "We support PNG, JPG, and WEBP up to 50MB.",
  };

  // Use API data if available; otherwise fallback.
  const content = apiData?.data || fallbackContent;

  // Face swap states
  const [baseFile, setBaseFile] = useState(null);
  const [targetFile, setTargetFile] = useState(null);
  const [outputFile, setOutputFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const baseInputRef = useRef(null);
  const targetInputRef = useRef(null);

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }
    if (type === 'base') {
      setBaseFile(file);
    } else {
      setTargetFile(file);
    }
    setError('');
  };

  const runFaceSwap = async () => {
    if (!baseFile || !targetFile) return;
    setLoading(true);
    setMessage(content.processingMessage || 'Processing your face swap...');
    const formData = new FormData();
    formData.append('source', baseFile);
    formData.append('target', targetFile);
    try {
      const response = await axios.post('/api/faceswap', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });
      if (!response.data?.output_file) {
        throw new Error('No output file received');
      }
      const output = response.data.output_file;
      setOutputFile(`/api/assets?filename=${output}`);
      setMessage(content.successMessage || 'Face swap completed successfully!');
    } catch (err) {
      setError(content.errorMessage || 'Face swap failed. Please try again.');
      console.error('Face swap error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setBaseFile(null);
    setTargetFile(null);
    setOutputFile(null);
    setError('');
    setMessage('');
  };

  return (
    <Layout>
      <Head>
        <title>{content.seoTitle}</title>
        <meta name="description" content={content.metaDescription} />
        <meta name="keywords" content={content.keywords} />
        <meta property="og:title" content={content.ogTitle || content.seoTitle} />
        <meta property="og:description" content={content.ogDescription || content.metaDescription} />
        <meta property="og:url" content={content.ogUrl || ''} />
        <meta property="og:image" content={content.previewImageUrl} />
        <meta property="og:image:alt" content={content.ogImgAlt || ''} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.twitterTitle || content.seoTitle} />
        <meta name="twitter:description" content={content.twitterDescription || content.metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: content.structureBreadcrumblistName,
                  item: content.structureBreadcrumblistItem,
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: content.structureWebsiteName,
              url: content.structureWebsiteUrl,
              headline: content.structureWebsiteHeadline,
              description: content.structureWebsiteDescription,
              image: content.structureWebsiteImage,
            }),
          }}
        />
      </Head>

      <div className="min-h-screen bg-black text-white pb-12">
        {/* Language Switcher */}
        <div className="max-w-5xl mx-auto px-4 mt-4">
          <LanguageSwitcher />
        </div>

        {/* Hero / Banner */}
        <div className="relative w-full max-w-5xl mx-auto h-80 sm:h-96 overflow-hidden rounded-xl mt-8 shadow-2xl">
          <img
            src="/images/faceswap/IMAGE 1.webp"
            alt={content.imageAlt || 'Hero Banner'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black flex flex-col items-center justify-center text-center p-4">
            {content.header && (
              <h2 className="text-2xl font-semibold mb-2 text-white">{content.header}</h2>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">{content.introH1}</h1>
            <p className="text-lg sm:text-xl text-gray-400">{content.introContent}</p>
          </div>
        </div>

        {/* Breadcrumb (optional) */}
        {content.structureBreadcrumblistName && content.structureBreadcrumblistItem && (
          <div className="max-w-5xl mx-auto px-4 mt-4 text-sm text-gray-500">
            <a href={content.structureBreadcrumblistItem}>
              {content.structureBreadcrumblistName}
            </a>
          </div>
        )}

        {/* Side-by-Side Upload UI */}
        <div className="max-w-4xl mx-auto mt-8 px-4">
          {error && (
            <div className="bg-red-600 border border-red-700 text-red-200 p-4 rounded-md mb-4">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DropZone
              title={content.baseImageTitle || 'Upload Base Image'}
              subtitle={content.baseImageSubtitle || 'Main image where faces will be replaced.'}
              file={baseFile}
              onUpload={(e) => handleFileUpload(e, 'base')}
              inputRef={baseInputRef}
            />
            <DropZone
              title={content.targetImageTitle || 'Upload Target Face'}
              subtitle={content.targetImageSubtitle || 'This face will replace the one in your base image.'}
              file={targetFile}
              onUpload={(e) => handleFileUpload(e, 'target')}
              inputRef={targetInputRef}
            />
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={runFaceSwap}
              disabled={!baseFile || !targetFile || loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-600"
            >
              {loading
                ? (content.processingButtonText || 'Processing...')
                : (content.swapButtonText || 'Swap Faces')}
            </button>
          </div>
          {outputFile && (
            <div className="mt-8 space-y-4">
              <img
                src={outputFile}
                alt="Face Swap Result"
                className="h-64 w-auto rounded-lg shadow-lg object-contain mx-auto"
              />
              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetAll}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  <RefreshCcw className="mr-2" size={16} />
                  {content.newSwapButtonText || 'Start New Face Swap'}
                </button>
                <a
                  href={outputFile}
                  download
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  <Download className="mr-2" size={16} />
                  {content.downloadButtonText || 'Download Result'}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Gallery Section */}
        <div className="max-w-5xl mx-auto mt-12 px-4">
          <h2 className="text-3xl font-bold mb-4 text-white">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {['IMAGE 2.webp', 'IMAGE 3.webp', 'IMAGE 4.webp', 'IMAGE 5.webp', 'IMAGE 6.webp', 'IMAGE 7.webp'].map((imgName) => (
              <div
                key={imgName}
                className="overflow-hidden rounded-lg shadow-2xl transform transition duration-300 hover:scale-105"
              >
                <img
                  src={`/images/faceswap/${imgName}`}
                  alt={`Gallery ${imgName}`}
                  className="object-cover w-full h-48"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content Sections in Cards */}
        <div className="max-w-5xl mx-auto mt-12 px-4 space-y-8">
          {/* WHAT Section */}
          {content.whatH2 && (
            <div className="bg-black p-6 rounded-lg shadow-2xl border border-gray-800">
              <h2 className="text-3xl font-bold border-b border-gray-800 pb-2 text-white">{content.whatH2}</h2>
              <div className="mt-4 grid grid-cols-1 gap-4">
                {content.whatH3_1 && (
                  <div className="p-4 bg-black rounded-lg border border-gray-800">
                    <h3 className="text-2xl font-semibold text-white">{content.whatH3_1}</h3>
                    {content.whatContent1 && <p className="mt-2 text-gray-400">{content.whatContent1}</p>}
                  </div>
                )}
                {content.whatH3_2 && (
                  <div className="p-4 bg-black rounded-lg border border-gray-800">
                    <h3 className="text-2xl font-semibold text-white">{content.whatH3_2}</h3>
                    {content.whatContent2 && <p className="mt-2 text-gray-400">{content.whatContent2}</p>}
                  </div>
                )}
                {content.whatH3_3 && (
                  <div className="p-4 bg-black rounded-lg border border-gray-800">
                    <h3 className="text-2xl font-semibold text-white">{content.whatH3_3}</h3>
                    {content.whatContent3 && <p className="mt-2 text-gray-400">{content.whatContent3}</p>}
                  </div>
                )}
                {content.whatH3_4 && (
                  <div className="p-4 bg-black rounded-lg border border-gray-800">
                    <h3 className="text-2xl font-semibold text-white">{content.whatH3_4}</h3>
                    {content.whatContent4 && <p className="mt-2 text-gray-400">{content.whatContent4}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* WHY Section */}
          {content.whyH2 && (
            <div className="bg-black p-6 rounded-lg shadow-2xl border border-gray-800">
              <h2 className="text-3xl font-bold border-b border-gray-800 pb-2 text-white">{content.whyH2}</h2>
              {content.whyContent1 && <p className="mt-4 text-gray-400">{content.whyContent1}</p>}
              <div className="mt-4 grid grid-cols-1 gap-4">
                {content.whyH3_1 && (
                  <div className="p-4 bg-black rounded-lg border border-gray-800">
                    <h3 className="text-2xl font-semibold text-white">{content.whyH3_1}</h3>
                    {content.whyContent2 && <p className="mt-2 text-gray-400">{content.whyContent2}</p>}
                  </div>
                )}
                {content.whyH3_2 && (
                  <div className="p-4 bg-black rounded-lg border border-gray-800">
                    <h3 className="text-2xl font-semibold text-white">{content.whyH3_2}</h3>
                    {content.whyContent3 && <p className="mt-2 text-gray-400">{content.whyContent3}</p>}
                  </div>
                )}
                {content.whyH3_3 && (
                  <div className="p-4 bg-black rounded-lg border border-gray-800">
                    <h3 className="text-2xl font-semibold text-white">{content.whyH3_3}</h3>
                    {content.whyContent4 && <p className="mt-2 text-gray-400">{content.whyContent4}</p>}
                  </div>
                )}
                {content.whyH3_4 && (
                  <div className="p-4 bg-black rounded-lg border border-gray-800">
                    <h3 className="text-2xl font-semibold text-white">{content.whyH3_4}</h3>
                    {content.whyContent5 && <p className="mt-2 text-gray-400">{content.whyContent5}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* HOW-TO Section */}
          {content.howH2 && (
            <div className="bg-black p-6 rounded-lg shadow-2xl border border-gray-800">
              <h2 className="text-3xl font-bold border-b border-gray-800 pb-2 text-white">{content.howH2}</h2>
              <div className="mt-4 grid grid-cols-1 gap-4">
                {content.howTitle1 && (
                  <div className="p-4 bg-black rounded-lg border border-gray-800">
                    <h3 className="text-2xl font-semibold text-white">{content.howTitle1}</h3>
                    {content.howContent1 && <p className="mt-2 text-gray-400">{content.howContent1}</p>}
                  </div>
                )}
                {content.howTitle2 && (
                  <div className="p-4 bg-black rounded-lg border border-gray-800">
                    <h3 className="text-2xl font-semibold text-white">{content.howTitle2}</h3>
                    {content.howContent2 && <p className="mt-2 text-gray-400">{content.howContent2}</p>}
                  </div>
                )}
                {content.howTitle3 && (
                  <div className="p-4 bg-black rounded-lg border border-gray-800">
                    <h3 className="text-2xl font-semibold text-white">{content.howTitle3}</h3>
                    {content.howContent3 && <p className="mt-2 text-gray-400">{content.howContent3}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TOOLS Section */}
          {content.toolsH2 && (
            <div className="bg-black p-6 rounded-lg shadow-2xl border border-gray-800">
              <h2 className="text-3xl font-bold border-b border-gray-800 pb-2 text-white">{content.toolsH2}</h2>
              <div className="mt-4 p-4 bg-black rounded-lg border border-gray-800">
                {content.toolsH3_1 && <h3 className="text-2xl font-semibold text-white">{content.toolsH3_1}</h3>}
                {content.toolsContent1 && <p className="mt-2 text-gray-400">{content.toolsContent1}</p>}
              </div>
            </div>
          )}

          {/* User Reviews Section */}
          {content.userReviewH2 && (
            <div className="bg-black p-6 rounded-lg shadow-2xl border border-gray-800">
              <h2 className="text-3xl font-bold border-b border-gray-800 pb-2 text-white">{content.userReviewH2}</h2>
              <div className="mt-4 grid grid-cols-1 gap-4">
                {[1, 2, 3, 4].map((i) =>
                  content[`userReviewName${i}`] || content[`userReview${i}`] ? (
                    <div key={i} className="p-4 bg-black rounded-lg border border-gray-800">
                      {content[`userReviewName${i}`] && (
                        <h3 className="text-2xl font-semibold text-white">{content[`userReviewName${i}`]}</h3>
                      )}
                      {content[`userReview${i}`] && (
                        <p className="mt-2 text-gray-400">{content[`userReview${i}`]}</p>
                      )}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {content.faqHeader && (
            <div className="bg-black p-6 rounded-lg shadow-2xl border border-gray-800">
              <h2 className="text-3xl font-bold border-b border-gray-800 pb-2 text-white">{content.faqHeader}</h2>
              <div className="mt-4 grid grid-cols-1 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) =>
                  (content[`faqQuestion${i}`] || content[`faqAnswer${i}`]) ? (
                    <div key={i} className="p-4 bg-black rounded-lg border border-gray-800">
                      {content[`faqQuestion${i}`] && (
                        <h3 className="text-xl font-semibold text-white">{content[`faqQuestion${i}`]}</h3>
                      )}
                      {content[`faqAnswer${i}`] && (
                        <p className="mt-1 text-gray-400">{content[`faqAnswer${i}`]}</p>
                      )}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black rounded-lg p-6 flex flex-col items-center border border-gray-800">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">{message}</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default FaceSwap;
