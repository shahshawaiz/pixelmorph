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

// FAQ item as an accordion component.
const FaqItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-black border border-gray-800 rounded-lg p-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left focus:outline-none"
      >
        <h3 className="text-xl font-semibold text-white">{question}</h3>
      </button>
      {open && <p className="mt-2 text-gray-400">{answer}</p>}
    </div>
  );
};

const FaceSwap = () => {
  const router = useRouter();
  const { locale } = router;
  // Ref for scrolling to the upload section.
  const uploadSectionRef = useRef(null);

  // Fetch localized content via SWR.
  const { data: apiData } = useSWR(`/api/loadSwrFaceswap?locale=${locale}`, fetcher);
  console.log('SWR Data:', apiData);

  // Fallback content if API data is not available.
  const fallbackContent = {
    seoTitle: "Free AI Face Swap – Best Face Swapper Online",
    metaDescription: "Create fun and unique photos with AI Face Swap. Swap faces seamlessly in seconds.",
    keywords: "Face Swap, AI, Photo Editing, Online Tool",
    structureBreadcrumblistName: "Face Swap Home",
    structureBreadcrumblistItem: "/faceswap",
    structureWebsiteName: "Face Swap AI",
    structureWebsiteUrl: "https://mydomain.com",
    structureWebsiteHeadline: "AI Face Swap Online",
    structureWebsiteDescription: "Swap faces instantly using advanced AI algorithms.",
    structureWebsiteImage: "/images/faceswap/IMAGE 1.webp",
    ogTitle: "AI Face Swap - Instantly Swap Faces",
    ogDescription: "Use our free online tool to swap faces in your photos.",
    ogUrl: "https://mydomain.com/faceswap",
    ogImgAlt: "Face Swap Preview",
    previewImageUrl: "/images/faceswap/IMAGE 1.webp",
    twitterTitle: "AI Face Swap",
    twitterDescription: "Easily swap faces online with AI.",
    imageAlt: "Before and after face swap preview",

    header: "Free AI Face Swapper",
    introH1: "AI Face Swap",
    introContent: "Seamlessly swap faces with our powerful AI-based technology.",
    processingMessage: "Swapping faces with AI... please wait!",

    whatH2: "What AI Face Swapper Can Do?",
    whatH3_1: "1. Instant Face Swap",
    whatContent1: "Swap faces instantly with advanced AI technology in just seconds.",
    whatH3_2: "2. Realistic and Seamless Face Swaps Made Easy",
    whatContent2: "Experience effortless face swaps that produce natural-looking results.",
    whatH3_3: "3. Make Photos Fun with AI FaceSwap",
    whatContent3: "Have fun mixing faces for creative projects or comedic images.",
    whatH3_4: "4. Transform Yourself into Famous Art",
    whatContent4: "Try out templates to become famous artworks or unique characters.",

    whyH2: "The Perfect Face Swapper For Everyone",
    whyContent1: "Effortlessly swap faces in any photo. Ideal for refreshing old pictures, trying a fun swap, or editing portraits.",
    whyH3_1: "Easy to Use",
    whyContent2: "A simple upload process ensures anyone can do it in seconds.",
    whyH3_2: "Fast & Accurate",
    whyContent3: "AI detection gives quick, realistic results for each face swap.",
    whyH3_3: "Safe & Private",
    whyContent4: "Your photos are never stored. We respect your privacy.",
    whyH3_4: "Free to Use",
    whyContent5: "No hidden costs. Enjoy unlimited face swaps at zero cost.",

    howH2: "How to Use Face Swap?",
    howTitle1: "Upload Source Photo",
    howContent1: "Select an image with a single face to use as the source.",
    howTitle2: "Choose Target Photo",
    howContent2: "Pick the face you want to swap into the source photo.",
    howTitle3: "Face Swap Now",
    howContent3: "Click 'Swap Faces' and download your newly swapped image.",

    toolsH2: "All Online Photo & Video Editing Tools",
    toolsH3_1: "Face Swap AI",
    toolsContent1: "Easily swap any face in seconds with our advanced AI technology.",

    userReviewH2: "User Reviews",
    userReviewName1: "Sophia L",
    userReview1: "This is my favorite online editor! AI Face Swap makes transforming photos so effortless.",
    userReviewName2: "Carlos M",
    userReview2: "Face swapper delivers flawless results in seconds. Highly addictive and enjoyable.",
    userReviewName3: "Priya K",
    userReview3: "It's fast, accurate, and makes photo editing super fun. The results look very natural!",
    userReviewName4: "John S",
    userReview4: "I use it for social media content. My friends are always impressed with the realistic swaps!",

    faqHeader: "Frequently Asked Questions",
    faqQuestion1: "What is AI Face Swap?",
    faqAnswer1: "Face Swapper is an online tool that allows you to seamlessly replace one face with another in photos using AI.",
    faqQuestion2: "How does Face Swapper work?",
    faqAnswer2: "It analyzes the photo, identifies the faces, and blends them seamlessly with just a few clicks.",
    faqQuestion3: "Is Face Swap free?",
    faqAnswer3: "Yes, you can use Face Swap for free to create fun, realistic swaps in seconds.",
    faqQuestion4: "Does it work on all photos?",
    faqAnswer4: "As long as the faces are clearly visible, the tool can swap them. Well-lit, front-facing images work best.",
    faqQuestion5: "Is face swapper online safe?",
    faqAnswer5: "We prioritize security and do not store your images on our servers.",
    faqQuestion6: "Can I swap faces between animals and humans?",
    faqAnswer6: "Yes, but results may vary depending on image clarity and face angles.",
    faqQuestion7: "Does AI FaceSwap Support Gender Swap?",
    faqAnswer7: "Yes, you can swap faces regardless of gender. The AI handles all facial mappings.",
    faqQuestion8: "How to achieve the best results?",
    faqAnswer8: "Use clear, high-resolution images with front-facing faces.",
    faqQuestion9: "How does AI face swapper handle multiple faces?",
    faqAnswer9: "Currently, the tool focuses on one face at a time for best results.",
    faqQuestion10: "What file formats are supported?",
    faqAnswer10: "We support PNG, JPG, and WEBP up to 50MB.",
  };

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
      setOutputFile(`/api/assets?filename=${response.data.output_file}`);
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
        {/* Open Graph, Twitter, and Structured Data meta tags here */}
      </Head>
      <div className="min-h-screen bg-black text-white pb-12">
        {/* Language Switcher */}
        <div className="max-w-5xl mx-auto px-4 mt-4">
          <LanguageSwitcher />
        </div>

        {/* HERO SECTION */}
        <div className="bg-black py-12 px-4">
          <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8">
            {/* Left side: Headings and subtext */}
            <div className="md:w-1/2">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {content.seoTitle}
              </h1>
              <p className="text-gray-300 text-lg sm:text-xl mb-4">
                {content.metaDescription}
              </p>
              {content.introContent && (
                <p className="text-gray-400 mb-6">{content.introContent}</p>
              )}
              {/* Hero buttons trigger scroll to upload section */}
              <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
                <button
                  onClick={() =>
                    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                  Upload Face
                </button>
                <button
                  onClick={() =>
                    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                  Base Image
                </button>
                <button
                  onClick={() =>
                    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md"
                >
                  Swap Face
                </button>
              </div>
            </div>
            {/* Right side: Preview Image */}
            <div className="md:w-1/2 flex justify-center relative">
              <img
                src="/images/faceswap/IMAGE 1.webp"
                alt={content.imageAlt || 'Face Swap Preview'}
                className="rounded-lg shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Optional Breadcrumb */}
        {content.structureBreadcrumblistName && content.structureBreadcrumblistItem && (
          <div className="max-w-5xl mx-auto px-4 mt-4 text-sm text-gray-500">
            <a href={content.structureBreadcrumblistItem}>
              {content.structureBreadcrumblistName}
            </a>
          </div>
        )}

        {/* UPLOAD SECTION */}
        <div ref={uploadSectionRef} className="max-w-4xl mx-auto mt-8 px-4">
          {error && (
            <div className="bg-red-600 border border-red-700 text-red-200 p-4 rounded-md mb-4">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DropZone
              title="Upload Base Image"
              subtitle="Main image where faces will be replaced."
              file={baseFile}
              onUpload={(e) => handleFileUpload(e, 'base')}
              inputRef={baseInputRef}
            />
            <DropZone
              title="Upload Target Face"
              subtitle="This face will replace the one in your base image."
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
              {loading ? 'Processing...' : 'Swap Faces'}
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
                  Start New Face Swap
                </button>
                <a
                  href={outputFile}
                  download
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  <Download className="mr-2" size={16} />
                  Download Result
                </a>
              </div>
            </div>
          )}
        </div>

        {/* GALLERY SECTION */}
        <div className="max-w-5xl mx-auto mt-12 px-4">
          <h2 className="text-3xl font-bold mb-4 text-white">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              'IMAGE 2.webp',
              'IMAGE 3.webp',
              'IMAGE 4.webp',
              'IMAGE 5.webp',
              'IMAGE 6.webp',
              'IMAGE 7.webp',
            ].map((imgName) => (
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

        {/* WHAT Section (4 columns) */}
        {content.whatH2 && (
          <div className="max-w-5xl mx-auto mt-12 px-4">
            <h2 className="text-3xl font-bold text-white mb-6">{content.whatH2}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.whatH3_1 && (
                <div className="bg-black border border-gray-800 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-white">{content.whatH3_1}</h3>
                  <p className="text-gray-400 mt-2">{content.whatContent1}</p>
                </div>
              )}
              {content.whatH3_2 && (
                <div className="bg-black border border-gray-800 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-white">{content.whatH3_2}</h3>
                  <p className="text-gray-400 mt-2">{content.whatContent2}</p>
                </div>
              )}
              {content.whatH3_3 && (
                <div className="bg-black border border-gray-800 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-white">{content.whatH3_3}</h3>
                  <p className="text-gray-400 mt-2">{content.whatContent3}</p>
                </div>
              )}
              {content.whatH3_4 && (
                <div className="bg-black border border-gray-800 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-white">{content.whatH3_4}</h3>
                  <p className="text-gray-400 mt-2">{content.whatContent4}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* WHY Section (Image centered with text on right) */}
        {content.whyH2 && (
          <div className="max-w-6xl mx-auto mt-12 px-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex-1">
                <img
                  src="/images/faceswap/IMAGE 2.webp"
                  alt="Why Face Swapper"
                  className="mx-auto rounded-lg shadow-2xl w-full h-auto object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-4">{content.whyH2}</h2>
                <p className="text-gray-400 mb-6">{content.whyContent1}</p>
                <div className="grid grid-cols-1 gap-4">
                  {content.whyH3_1 && (
                    <div className="p-4 bg-black rounded-lg border border-gray-800">
                      <h3 className="text-xl font-semibold text-white">{content.whyH3_1}</h3>
                      <p className="mt-2 text-gray-400">{content.whyContent2}</p>
                    </div>
                  )}
                  {content.whyH3_2 && (
                    <div className="p-4 bg-black rounded-lg border border-gray-800">
                      <h3 className="text-xl font-semibold text-white">{content.whyH3_2}</h3>
                      <p className="mt-2 text-gray-400">{content.whyContent3}</p>
                    </div>
                  )}
                  {content.whyH3_3 && (
                    <div className="p-4 bg-black rounded-lg border border-gray-800">
                      <h3 className="text-xl font-semibold text-white">{content.whyH3_3}</h3>
                      <p className="mt-2 text-gray-400">{content.whyContent4}</p>
                    </div>
                  )}
                  {content.whyH3_4 && (
                    <div className="p-4 bg-black rounded-lg border border-gray-800">
                      <h3 className="text-xl font-semibold text-white">{content.whyH3_4}</h3>
                      <p className="mt-2 text-gray-400">{content.whyContent5}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HOW-TO Section (3 columns) */}
        {content.howH2 && (
          <div className="max-w-5xl mx-auto mt-12 px-4">
            <h2 className="text-3xl font-bold text-white mb-6">{content.howH2}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.howTitle1 && (
                <div className="bg-black border border-gray-800 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-white">{content.howTitle1}</h3>
                  <p className="text-gray-400 mt-2">{content.howContent1}</p>
                </div>
              )}
              {content.howTitle2 && (
                <div className="bg-black border border-gray-800 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-white">{content.howTitle2}</h3>
                  <p className="text-gray-400 mt-2">{content.howContent2}</p>
                </div>
              )}
              {content.howTitle3 && (
                <div className="bg-black border border-gray-800 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-white">{content.howTitle3}</h3>
                  <p className="text-gray-400 mt-2">{content.howContent3}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TOOLS Section */}
        {content.toolsH2 && (
          <div className="max-w-5xl mx-auto mt-12 px-4">
            <h2 className="text-3xl font-bold text-white mb-6">{content.toolsH2}</h2>
            <div className="bg-black p-6 rounded-lg shadow-2xl border border-gray-800">
              {content.toolsH3_1 && (
                <h3 className="text-2xl font-semibold text-white">{content.toolsH3_1}</h3>
              )}
              {content.toolsContent1 && (
                <p className="mt-2 text-gray-400">{content.toolsContent1}</p>
              )}
            </div>
          </div>
        )}

        {/* FAQ Section as Accordion */}
        <div className="bg-black py-12">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            {content.faqHeader ? content.faqHeader : 'FAQ'}
          </h2>
 
          <div className="max-w-5xl mx-auto mt-12 px-4">
            <h2 className="text-3xl font-bold text-white mb-6">{content.faqHeader}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10
              ].map((i) => {
                const question = content[`faqQuestion${i}`];
                const answer = content[`faqAnswer${i}`];
                return question || answer ? (
                  <FaqItem key={i} question={question} answer={answer} />
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
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
