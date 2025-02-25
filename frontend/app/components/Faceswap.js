import { useState, useRef, useEffect } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import {
  Home,
  Upload,
  Info,
  Lightbulb,
  Wrench,
  HelpCircle,
  RefreshCcw,
  Download,
  Twitter,
  Instagram,
  Facebook,
  Plus,
  Menu,
  X
} from 'lucide-react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Language Switcher: auto-detect device language; placed in the nav bar.
const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale, locales, asPath } = router;
  const [autoDetected, setAutoDetected] = useState(false);

  const handleLocaleChange = (newLocale) => {
    router.push(asPath, asPath, { locale: newLocale });
  };

  useEffect(() => {
    if (!router.isReady || autoDetected) return;
    const deviceLang = navigator.language.split('-')[0];
    if (locales.includes(deviceLang) && deviceLang !== locale) {
      handleLocaleChange(deviceLang);
    }
    setAutoDetected(true);
  }, [router.isReady, autoDetected, locales, locale]);

  return (
    <select
      value={locale}
      onChange={(e) => handleLocaleChange(e.target.value)}
      className="px-3 py-1 rounded-md bg-gray-800 text-gray-400 focus:outline-none"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {loc.toUpperCase()}
        </option>
      ))}
    </select>
  );
};

const fetcher = (url) => fetch(url).then((res) => res.json());

// DropZone component for image uploads
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
        isDragging ? 'border-gray-500 bg-gray-700' : 'border-gray-800 bg-black'
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
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
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

// FAQ accordion item
const FaqItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-black border border-gray-800 rounded-lg p-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left focus:outline-none flex items-center justify-between"
      >
        <h3 className="text-xl font-semibold text-white">{question}</h3>
        <Plus className={`w-6 h-6 text-white transition-transform ${open ? 'rotate-45' : ''}`} />
      </button>
      {open && <p className="mt-2 text-gray-400">{answer}</p>}
    </div>
  );
};

const FaceSwap = () => {
  const router = useRouter();
  const { locale } = router;
  const uploadSectionRef = useRef(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load localized content via SWR
  const { data: apiData } = useSWR(`/api/loadSwrFaceswap?locale=${locale}`, fetcher);
  console.log('SWR Data:', apiData);

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
    successMessage: "Face swap completed successfully!",
    errorMessage: "Face swap failed. Please try again.",

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
    whyH3_1: "Easy to Use",
    whyH3_2: "Fast & Accurate",
    whyH3_3: "Safe & Private",
    whyH3_4: "Free to Use",
    whyContent1: "Effortlessly swap faces in any photo. Ideal for refreshing old pictures, trying a fun swap, or editing portraits.",
    whyContent2: "A simple upload process ensures anyone can do it in seconds.",
    whyContent3: "AI detection gives quick, realistic results for each face swap.",
    whyContent4: "Your photos are never stored. We respect your privacy.",
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
    <div>
      <Head>
        <title>{content.seoTitle}</title>
        <meta name="description" content={content.metaDescription} />
        <meta name="keywords" content={content.keywords} />

        {/* Open Graph meta tags */}
        <meta property="og:title" content={content.ogTitle || content.seoTitle} />
        <meta property="og:description" content={content.ogDescription || content.metaDescription} />
        <meta property="og:url" content={content.ogUrl || content.structureWebsiteUrl} />
        <meta property="og:image" content={content.structureWebsiteImage || content.previewImageUrl} />
        <meta property="og:image:alt" content={content.ogImgAlt || content.imageAlt} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={content.structureWebsiteName} />

        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.twitterTitle || content.seoTitle} />
        <meta name="twitter:description" content={content.twitterDescription || content.metaDescription} />
        <meta name="twitter:image" content={content.structureWebsiteImage || content.previewImageUrl} />

        {/* Structured Data JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": content.structureWebsiteName,
              "url": content.structureWebsiteUrl,
              "headline": content.structureWebsiteHeadline,
              "description": content.structureWebsiteDescription,
              "image": content.structureWebsiteImage || content.previewImageUrl
            }),
          }}
        />
      </Head>

      {/* Sticky Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-black bg-opacity-90 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-white">
            <Link href="/">
              <img src="/logo.png" alt="Pixelmorph Logo" className="h-10 w-auto" />
            </Link>
          </div>
          {/* Desktop Links */}
          <div className="hidden md:flex space-x-4">
            <a href="#hero" className="text-gray-400 hover:text-white" title="Home">
              <Home size={20} />
            </a>
            <a href="#upload" className="text-gray-400 hover:text-white" title="Upload">
              <Upload size={20} />
            </a>
            <a href="#what" className="text-gray-400 hover:text-white" title="What">
              <Info size={20} />
            </a>
            <a href="#why" className="text-gray-400 hover:text-white" title="Why">
              <Lightbulb size={20} />
            </a>
            <a href="#how" className="text-gray-400 hover:text-white" title="How">
              <Wrench size={20} />
            </a>
            <a href="#faq" className="text-gray-400 hover:text-white" title="FAQ">
              <HelpCircle size={20} />
            </a>
          </div>
          {/* Language Switcher & Mobile Menu Toggle */}
          <div className="flex items-center">
            <LanguageSwitcher />
            <div className="md:hidden ml-4">
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gradient-to-r from-gray-900 to-black">
            <div className="px-4 py-2 space-y-2">
              <a href="#hero" className="block text-gray-400 hover:text-white">Home</a>
              <a href="#upload" className="block text-gray-400 hover:text-white">Upload</a>
              <a href="#what" className="block text-gray-400 hover:text-white">What</a>
              <a href="#why" className="block text-gray-400 hover:text-white">Why</a>
              <a href="#how" className="block text-gray-400 hover:text-white">How</a>
              <a href="#faq" className="block text-gray-400 hover:text-white">FAQ</a>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Container */}
      <div className="pt-20">
        {/* HERO SECTION */}
        <section id="hero" className="bg-gradient-to-br from-gray-900 via-black to-gray-800 py-16 px-8 border-b border-gray-700">
          <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8">
            {/* Left: Text */}
            <div className="md:w-1/2">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                {content.seoTitle}
              </h1>
              <p className="text-gray-300 text-xl sm:text-2xl mb-6">
                {content.metaDescription}
              </p>
              {content.introContent && (
                <p className="text-gray-400 mb-6">{content.introContent}</p>
              )}
            </div>
            {/* Right: Image */}
            <div className="md:w-1/2 flex justify-center">
              <img
                src="/images/faceswap/IMAGE 1.webp"
                alt={content.imageAlt || 'Face Swap Preview'}
                className="rounded-lg shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Optional Breadcrumb */}
        {content.structureBreadcrumblistName && content.structureBreadcrumblistItem && (
          <div className="max-w-5xl mx-auto px-8 mt-4 text-sm text-gray-500">
            <a href={content.structureBreadcrumblistItem}>
              {content.structureBreadcrumblistName}
            </a>
          </div>
        )}

        {/* UPLOAD SECTION */}
        <section id="upload" ref={uploadSectionRef} className="bg-gradient-to-r from-gray-800 via-gray-900 to-black py-16 px-8">
          {error && (
            <div className="bg-red-600 border border-red-700 text-red-200 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
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
          <div className="flex justify-center mt-8">
            <button
              onClick={runFaceSwap}
              disabled={!baseFile || !targetFile || loading}
              className="px-8 py-4 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition disabled:bg-gray-600"
            >
              {loading ? 'Processing...' : 'Swap Faces'}
            </button>
          </div>
          {outputFile && (
            <div className="mt-8 space-y-6">
              <img
                src={outputFile}
                alt="Face Swap Result"
                className="h-80 w-auto rounded-lg shadow-lg object-contain mx-auto"
              />
              <div className="flex justify-center space-x-6">
                <button
                  onClick={resetAll}
                  className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
                >
                  <RefreshCcw className="mr-2" size={18} />
                  Start New Face Swap
                </button>
                <a
                  href={outputFile}
                  download
                  className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
                >
                  <Download className="mr-2" size={18} />
                  Download Result
                </a>
              </div>
            </div>
          )}
        </section>

        {/* WHAT Section */}
        {content.whatH2 && (
          <section id="what" className="bg-gradient-to-l from-gray-900 via-black to-gray-800 py-16 px-8 border-t border-b border-gray-700">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8">{content.whatH2}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {content.whatH3_1 && (
                  <div className="bg-black border border-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white">{content.whatH3_1}</h3>
                    <p className="text-gray-400 mt-4">{content.whatContent1}</p>
                  </div>
                )}
                {content.whatH3_2 && (
                  <div className="bg-black border border-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white">{content.whatH3_2}</h3>
                    <p className="text-gray-400 mt-4">{content.whatContent2}</p>
                  </div>
                )}
                {content.whatH3_3 && (
                  <div className="bg-black border border-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white">{content.whatH3_3}</h3>
                    <p className="text-gray-400 mt-4">{content.whatContent3}</p>
                  </div>
                )}
                {content.whatH3_4 && (
                  <div className="bg-black border border-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white">{content.whatH3_4}</h3>
                    <p className="text-gray-400 mt-4">{content.whatContent4}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* WHY Section (Horizontal Scroll) */}
        {content.whyH2 && (
          <section id="why" className="bg-gradient-to-r from-gray-800 to-gray-700 py-16 px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                {content.whyH2}
              </h2>
              <div className="overflow-x-auto snap-x snap-mandatory flex w-full space-x-8">
                {[
                  {
                    heading: content.whyH3_1,
                    text: content.whyContent1,
                    image: '/images/faceswap/IMAGE 2.webp',
                  },
                  {
                    heading: content.whyH3_2,
                    text: content.whyContent2,
                    image: '/images/faceswap/IMAGE 3.webp',
                  },
                  {
                    heading: content.whyH3_3,
                    text: content.whyContent3,
                    image: '/images/faceswap/IMAGE 4.webp',
                  },
                  {
                    heading: content.whyH3_4,
                    text: content.whyContent4,
                    image: '/images/faceswap/IMAGE 5.webp',
                  },
                  {
                    heading: '',
                    text: content.whyContent5,
                    image: '/images/faceswap/IMAGE 6.webp',
                  },
                ].map((slide, index) => (
                  <div
                    key={index}
                    className="snap-center min-w-[90%] md:min-w-[60%] bg-black border border-gray-800 rounded-lg p-6 shadow-xl flex flex-col md:flex-row items-center gap-6"
                  >
                    <div className="md:w-1/2">
                      <img
                        src={slide.image}
                        alt={`Why Slide ${index + 1}`}
                        className="rounded-lg shadow-2xl object-cover w-full"
                      />
                    </div>
                    <div className="md:w-1/2">
                      {slide.heading && (
                        <h3 className="text-xl font-semibold text-white mb-4">
                          {slide.heading}
                        </h3>
                      )}
                      <p className="text-gray-400">{slide.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* HOW-TO Section */}
        {content.howH2 && (
          <section id="how" className="bg-gradient-to-br from-black to-gray-800 py-16 px-8 border-t border-gray-700">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8">{content.howH2}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {content.howTitle1 && (
                  <div className="bg-black border border-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white">{content.howTitle1}</h3>
                    <p className="text-gray-400 mt-4">{content.howContent1}</p>
                  </div>
                )}
                {content.howTitle2 && (
                  <div className="bg-black border border-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white">{content.howTitle2}</h3>
                    <p className="text-gray-400 mt-4">{content.howContent2}</p>
                  </div>
                )}
                {content.howTitle3 && (
                  <div className="bg-black border border-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white">{content.howTitle3}</h3>
                    <p className="text-gray-400 mt-4">{content.howContent3}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section id="faq" className="bg-gradient-to-l from-gray-900 to-black py-16 px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              {content.faqHeader ? content.faqHeader : 'FAQ'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                const question = content[`faqQuestion${i}`];
                const answer = content[`faqAnswer${i}`];
                return question || answer ? (
                  <FaqItem key={i} question={question} answer={answer} />
                ) : null;
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black rounded-lg p-6 flex flex-col items-center border border-gray-800">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">{message}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Logo & Tagline */}
          <div>
            <img src="/logo.png" alt="Pixelmorph Logo" className="h-10 w-auto mb-2" />
            <p className="text-sm text-gray-300">Pixelmorph - {content.seoTitle}</p>
            <p className="text-sm text-gray-500 mt-2">© {new Date().getFullYear()} Pixelmorph. All rights reserved.</p>
          </div>
          {/* Column 2: More Links */}
          <div>
            <h3 className="font-semibold mb-2 text-white">More</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="/blogs" className="hover:text-white">Blog</a>
              </li>
              <li>
                <a href="/about" className="hover:text-white">About Us</a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white">Terms of Service</a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-white">Privacy Policy</a>
              </li>
            </ul>
          </div>
          {/* Column 3: Social Links & Language */}
          <div>
            <h3 className="font-semibold mb-2 text-white">Follow Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <Facebook size={20} />
              </a>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-white mb-1">Change Language</h4>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FaceSwap;
