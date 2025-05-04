import { useState, useRef, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import { Upload, RefreshCcw, Download, Plus } from 'lucide-react';
import Layout from '../components/Layout';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then((res) => res.json());

// DropZone component for image uploads (same as FaceSwap)
const DropZone = ({ title, subtitle, file, onUpload, inputRef, buttonText }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files && files[0]) {
        const event = { target: { files } };
        onUpload(event);
      }
    },
    [onUpload]
  );

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
          loading="lazy"
        />
      ) : (
        <>
          <Upload className="w-12 h-12 text-gray-500 mb-3" />
          {title && <p className="text-lg font-medium mb-1 text-white">{title}</p>}
          {subtitle && (
            <p className="text-sm text-gray-500 mb-3 text-center">{subtitle}</p>
          )}
          <button
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
          >
            {buttonText || 'Upload Image'}
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

// FAQ accordion item (unchanged)
const FaqItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-black border border-gray-800 rounded-lg p-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left focus:outline-none flex items-center justify-between"
        aria-expanded={open}
      >
        <p className="text-xl font-semibold text-white">{question}</p>
        <Plus className={`w-6 h-6 text-white transition-transform ${open ? 'rotate-45' : ''}`} />
      </button>
      {open && <p className="mt-2 text-gray-400">{answer}</p>}
    </div>
  );
};

// AutoSlider component (unchanged)
const AutoSlider = ({ slides = [] }) => {
  const visibleCount = 3;
  const extendedSlides = [...slides, ...slides.slice(0, visibleCount)];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const slideWidth = 100 / visibleCount;

  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovering]);

  const handleTransitionEnd = () => {
    if (currentIndex >= slides.length) {
      setTransitionEnabled(false);
      setCurrentIndex(0);
      setTimeout(() => setTransitionEnabled(true), 50);
    }
  };

  const goToNextSlide = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const goToPrevSlide = useCallback(() => {
    if (currentIndex === 0) {
      setTransitionEnabled(false);
      setCurrentIndex(slides.length - 1);
      setTimeout(() => setTransitionEnabled(true), 50);
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex, slides.length]);

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="flex"
        style={{
          transform: `translateX(-${currentIndex * slideWidth}%)`,
          transition: transitionEnabled ? 'transform 700ms ease-in-out' : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedSlides.map((slide, index) => (
          <div key={index} className="w-full md:w-1/3 flex-none p-4">
            <div className="bg-black border border-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col h-full">
              <div className="relative w-full h-96">
                <Image
                  src={slide.image}
                  alt={slide.heading || `Slide ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <div className="p-4">
                {slide.heading && (
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {slide.heading}
                  </h3>
                )}
                <p className="text-gray-400">{slide.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600"
        aria-label="Previous slide"
      >
        &larr;
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600"
        aria-label="Next slide"
      >
        &rarr;
      </button>
    </div>
  );
};

const MultiFaceSwap = () => {
  const router = useRouter();
  const { locale } = router;
  const uploadSectionRef = useRef(null);
  
  // Multi-face swap state variables
  const [groupFile, setGroupFile] = useState(null);
  const [annotatedImageUrl, setAnnotatedImageUrl] = useState(null);
  const [faceNumber, setFaceNumber] = useState('');
  const [replacementFile, setReplacementFile] = useState(null);
  const [outputFile, setOutputFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const groupInputRef = useRef(null);
  const replacementInputRef = useRef(null);

  // Load localized content via SWR
  const { data: apiData } = useSWR(
    `/api/loadSwrMultiFaceswap?locale=${locale}`,
    fetcher
  );
  
  const fallbackContent = {
    seoTitle: 'Multi Face Swap – Advanced Multi Faceswap',
    metaDescription: 'Swap multiple faces in your group photo easily with our AI-powered tool.',
    keywords: 'Multi Face Swap, AI, Photo Editing, Online Tool',
    structureBreadcrumblistName: 'Home',
    structureBreadcrumblistItem: '/',
    structureWebsiteName: 'Multi Face Swap AI',
    structureWebsiteUrl: 'https://mydomain.com',
    ogTitle: 'Multi Face Swap - AI Powered',
    ogDescription: 'Replace multiple faces in a group photo using advanced AI.',
    ogUrl: 'https://mydomain.com/multifaceswap',
    previewImageUrl: '/images/multifaceswap/IMAGE1.webp',
    imageAlt: 'Multi Face Swap Preview',
    twitterTitle: 'Multi Face Swap',
    twitterDescription: 'Swap multiple faces seamlessly with our AI tool.',

    introH1: 'Multi Face Swap',
    introContent: 'Easily swap one or more faces in your group photos with our advanced AI technology.',
    processingMessage: 'Swapping faces... please wait!',
    successMessage: 'Face swap completed successfully!',
    errorMessage: 'Face swap failed. Please try again.',

    engineDiv1Instruction: 'Upload your group photo (max 50MB)',
    engineDiv1Button: 'Upload Group Photo',
    engineDiv2Instruction: 'Upload the replacement face (max 50MB)',
    engineDiv2Button: 'Upload Replacement Face',
    engineRunButton: 'Swap Faces',
  };

  const content = apiData?.data || fallbackContent;

  // STEP 1: Upload group photo and detect faces.
  const handleGroupUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }
    setGroupFile(file);
    setError('');
    setMessage('Detecting faces...');
    const formData = new FormData();
    formData.append('file', file);
    try {
      setLoading(true);
      const response = await axios.post('/api/facedetect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.annotated_image) {
        setAnnotatedImageUrl(`/api/assets?filename=${response.data.annotated_image}`);
        setMessage('Select the face number you want to replace');
      } else {
        setError('Could not detect faces in the image.');
      }
    } catch (err) {
      setError('Face detection failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Upload replacement face.
  const handleReplacementUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReplacementFile(file);
      setError('');
    }
  };

  // STEP 4: Perform multi-face swap.
  const handleSwap = async () => {
    if (!groupFile || !replacementFile || !faceNumber) return;
    setLoading(true);
    setMessage(content.processingMessage);
    const formData = new FormData();
    formData.append('source', groupFile);
    formData.append('target', replacementFile);
    // Convert the face number to a zero-based index
    formData.append('face_index', parseInt(faceNumber, 10) - 1);
    try {
      const response = await axios.post('/api/multifaceswap', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.output_file) {
        setOutputFile(`/api/assets?filename=${response.data.output_file}`);
        setMessage(content.successMessage);
      }
    } catch (err) {
      setError('Face swap failed. Please try again.');
      console.error('Multi face swap error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setGroupFile(null);
    setAnnotatedImageUrl(null);
    setFaceNumber('');
    setReplacementFile(null);
    setOutputFile(null);
    setError('');
    setMessage('');
  };

  return (
    <Layout>
      <Head>
        <title>{content.seoTitle} - PixelMorph</title>
        <meta name="title" content={content.seoTitle} />
        <meta name="description" content={content.metaDescription} />
        <meta name="keywords" content={content.keywords} />
        <meta property="og:title" content={content.ogTitle || content.seoTitle} />
        <meta property="og:description" content={content.ogDescription || content.metaDescription} />
        <meta property="og:url" content={content.ogUrl || content.structureWebsiteUrl} />
        <meta property="og:image" content={content.structureWebsiteImage || content.previewImageUrl} />
        <meta property="og:image:alt" content={content.ogImgAlt || content.imageAlt} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={content.structureWebsiteName} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.twitterTitle || content.seoTitle} />
        <meta name="twitter:description" content={content.twitterDescription || content.metaDescription} />
        <meta name="twitter:image" content={content.structureWebsiteImage || content.previewImageUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: content.structureWebsiteName,
              url: content.structureWebsiteUrl,
              headline: content.structureWebsiteHeadline,
              description: content.structureWebsiteDescription,
              image: content.structureWebsiteImage || content.previewImageUrl,
            }),
          }}
        />
      </Head>
      <main>
        {/* HERO SECTION */}
        <section id="hero" className="bg-gradient-to-br from-gray-900 via-black to-gray-800 py-16 px-8 border-b border-gray-700">
          <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                {content.introH1}
              </h1>
              <p className="text-gray-300 text-xl sm:text-2xl mb-6">
                {content.introContent}
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <Image
                src="/images/multifaceswap/IMAGE 1.jpg"
                alt={content.imageAlt || 'Multi Face Swap Preview'}
                width={600}
                height={400}
                className="rounded-lg shadow-2xl object-cover"
                priority
                sizes="(max-width: 600px) 100vw, 600px"
                placeholder="blur" // Optional: shows a blur-up placeholder
                blurDataURL="/images/placeholder.webp" // Optional: a very low-res version of your image
              />
                            
            </div>
          </div>
        </section>

        {/* Breadcrumb */}
        {content.structureBreadcrumblistName && content.structureBreadcrumblistItem && (
          <div className="max-w-5xl mx-auto px-8 mt-4 text-sm text-gray-500">
            <Link href={content.structureBreadcrumblistItem}>
              {content.structureBreadcrumblistName}
            </Link>
          </div>
        )}

        {/* UPLOAD SECTION */}
        <section id="upload" ref={uploadSectionRef} className="bg-gradient-to-r from-gray-800 via-gray-900 to-black py-16 px-8">
          {error && (
            <div className="bg-red-600 border border-red-700 text-red-200 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Group Photo Upload and Face Detection */}
            <div>
              {groupFile ? (
                annotatedImageUrl ? (
                  <>
                    <img
                      src={annotatedImageUrl}
                      alt="Annotated Group Photo"
                      className="h-64 w-auto rounded-lg shadow-md mb-4"
                      loading="lazy"
                    />
                    <div className="flex items-center justify-center space-x-4">
                      <input
                        type="number"
                        value={faceNumber}
                        onChange={(e) => setFaceNumber(e.target.value)}
                        placeholder="Enter face number"
                        className="w-32 px-3 py-2 border border-gray-800 rounded-md bg-black text-white"
                        min="1"
                      />
                      <button
                        onClick={() => faceNumber && setMessage('Ready to swap faces')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      >
                        Continue
                      </button>
                    </div>
                  </>
                ) : (
                  <DropZone
                    title="Upload Group Photo"
                    subtitle={content.engineDiv1Instruction}
                    file={groupFile}
                    onUpload={handleGroupUpload}
                    inputRef={groupInputRef}
                    buttonText={content.engineDiv1Button}
                  />
                )
              ) : (
                <DropZone
                  title="Upload Group Photo"
                  subtitle={content.engineDiv1Instruction}
                  file={groupFile}
                  onUpload={handleGroupUpload}
                  inputRef={groupInputRef}
                  buttonText={content.engineDiv1Button}
                />
              )}
            </div>
            {/* Right Column: Replacement Face Upload */}
            <div>
              <DropZone
                title="Upload Replacement Face"
                subtitle={content.engineDiv2Instruction}
                file={replacementFile}
                onUpload={handleReplacementUpload}
                inputRef={replacementInputRef}
                buttonText={content.engineDiv2Button}
              />
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={handleSwap}
              disabled={!groupFile || !replacementFile || !faceNumber || loading}
              className="px-8 py-4 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition disabled:bg-gray-600"
            >
              {loading ? 'Processing...' : content.engineRunButton}
            </button>
          </div>
          {outputFile && (
            <div className="mt-8 space-y-6">
              <img
                src={outputFile}
                alt="Multi Face Swap Result"
                className="h-80 w-auto rounded-lg shadow-lg object-contain mx-auto"
                loading="lazy"
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
            <div className="max-w-7xl mx-auto">
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

        {/* WHY Section with Slider */}
        {content.whyH2 && (
          <section id="why" className="bg-gradient-to-r from-gray-800 to-gray-700 py-16 px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                {content.whyH2}
              </h2>
              <AutoSlider
                slides={[
                  {
                    heading: content.whyH3_1,
                    text: content.whyContent1,
                    image: '/images/multifaceswap/2. Fun family memes.png',
                  },
                  {
                    heading: content.whyH3_2,
                    text: content.whyContent2,
                    image: '/images/multifaceswap/1. Group Celebrities Faceswap.png',
                  },
                  {
                    heading: content.whyH3_3,
                    text: content.whyContent3,
                    image: '/images/multifaceswap/3. Social media A.png',
                  },
                  {
                    heading: content.whyH3_4,
                    text: content.whyContent4,
                    image: '/images/multifaceswap/4. Discover new looks.png',
                  },                  
                ]}
              />
            </div>
          </section>
        )}

        {/* HOW Section */}
        {content.howH2 && (
          <section id="how" className="bg-gradient-to-br from-black to-gray-800 py-16 px-8 border-t border-gray-700">
            <div className="max-w-7xl mx-auto">
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
      
        {/* TOOLS Section */}
        {(content.toolsH2 || content.faceswapToolsH2 || content.multiFaceswapToolsH2) && (
          <section id="tools" className="bg-gradient-to-br from-black to-gray-800 py-16 px-8 border-t border-gray-700">
            <div className="max-w-7xl mx-auto">
              {content.faceswapToolsH2 && (
                <h2 className="text-3xl font-bold text-white mb-8">{content.faceswapToolsH2}</h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {content.faceswapToolsH2 && (
                  <Link href="/" passHref>
                    <div className="cursor-pointer">
                      <p className="text-xl font-semibold text-white mb-2">{content.faceswapToolsH3_1}</p>
                      <p className="text-gray-400">{content.faceswapToolsContent1}</p>
                    </div>
                  </Link>
                )}
                {content.multiFaceswapToolsH2 && (
                  <Link href="/multifaceswap" passHref>
                    <div className="cursor-pointer">
                      <p className="text-xl font-semibold text-white mb-2">{content.multiFaceswapToolsH3_1}</p>
                      <p className="text-gray-400">{content.multiFaceswapToolsContent1}</p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        {/* REVIEWS Section */}
        {content.userReviewH2 && (
          <section id="reviews" className="py-20 px-4 bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-extrabold text-center mb-12">
                {content.userReviewH2}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="relative flex flex-col p-8 bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 border-l-4 border-indigo-500"
                  >
                    <div className="mb-2 text-xl font-semibold text-indigo-400">
                      {content[`userReviewName${i}`]}
                    </div>
                    <p className="text-gray-300 italic">
                      “{content[`userReview${i}`]}”
                    </p>
                    <svg
                      className="absolute top-4 right-4 w-8 h-8 text-gray-600 opacity-40"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5.64 9.36C4.48 10.52 3.76 12.05 3.76 13.64H2c0-1.78.72-3.49 2.02-4.74l1.62 1.46zm7.36 0c-1.16 1.16-1.88 2.69-1.88 4.28H8c0-1.78.72-3.49 2.02-4.74l1.62 1.46z" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section id="faq" className="bg-gradient-to-l from-gray-900 to-black py-16 px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              {content.faqHeader || 'FAQ'}
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
      </main>

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

export default MultiFaceSwap;
