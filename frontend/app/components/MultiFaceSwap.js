import { useState, useRef } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import Head from 'next/head';
import { Upload, ArrowRight, RefreshCcw } from 'lucide-react';
import Layout from './Layout';

// Reusable DropZone component for file uploads.
const DropZone = ({ title, subtitle, file, onUpload, inputRef }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files?.[0]) {
      const event = { target: { files } };
      onUpload(event);
    }
  };

  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-8
        ${isDragging ? 'border-blue-500 bg-blue-900' : 'border-gray-800 bg-black'}
        transition-colors duration-200
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center">
        {file ? (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="max-h-64 rounded-lg shadow-md"
            onLoad={(e) => URL.revokeObjectURL(e.target.src)}
          />
        ) : (
          <>
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2 text-white">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
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
    </div>
  );
};

const MultiFaceSwap = () => {
  // Load localized content using SWR.
  const { data: apiData } = useSWR(`/api/loadSwrMultiFaceswap?locale=en`, fetcher);
  // Fallback content in case API data isn't available.
  const fallbackContent = {
    seoTitle: "Multi Face Swap – Advanced Multi Faceswap",
    metaDescription: "Swap multiple faces in your group photo easily with our AI-powered tool.",
    header: "Advanced Multi Face Swap",
    // Add additional fallback content if desired.
  };
  const content = apiData?.data || fallbackContent;

  // Local component state.
  const [groupFile, setGroupFile] = useState(null);
  const [annotatedImageUrl, setAnnotatedImageUrl] = useState(null);
  const [faceNumber, setFaceNumber] = useState('');
  const [replacementFile, setReplacementFile] = useState(null);
  const [outputFile, setOutputFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');

  const groupInputRef = useRef(null);
  const replacementInputRef = useRef(null);

  // SWR fetcher.
  function fetcher(url) {
    return fetch(url).then((res) => res.json());
  }

  // STEP 1: Upload group photo and detect faces.
  const handleGroupUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setGroupFile(file);
    setMessage('Detecting faces...');
    const formData = new FormData();
    formData.append('file', file);
    try {
      setLoading(true);
      const response = await axios.post('/api/facedetect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.annotated_image) {
        setAnnotatedImageUrl(
          `/api/assets?filename=${response.data.annotated_image}`
        );
        setStep(2);
        setMessage('Select the face number you want to replace');
      }
    } catch (err) {
      setError('Could not detect faces. Please try another image.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Upload replacement face.
  const handleReplacementUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReplacementFile(file);
      setStep(3);
    }
  };

  // STEP 4: Perform face swap.
  const handleSwap = async () => {
    if (!groupFile || !replacementFile || !faceNumber) return;
    setLoading(true);
    setMessage('Performing face swap...');
    const formData = new FormData();
    formData.append('source', groupFile);
    formData.append('target', replacementFile);
    formData.append('face_index', parseInt(faceNumber, 10) - 1);
    try {
      const response = await axios.post('/api/multifaceswap', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.output_file) {
        setOutputFile(`/api/assets?filename=${response.data.output_file}`);
        setStep(4);
        setMessage('Face swap completed successfully!');
      }
    } catch (err) {
      setError('Face swap failed. Please try again.');
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
    setStep(1);
    setError('');
    setMessage('');
  };

  return (
    <Layout>
      <Head>
        <title>{content.seoTitle}</title>
        <meta name="description" content={content.metaDescription} />
      </Head>
      <div className="min-h-screen bg-black py-8 px-4 text-white">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <h1 className="text-4xl font-bold text-center mb-8">{content.header}</h1>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[
                'Upload Group Photo',
                'Select Face',
                'Upload New Face',
                'Complete',
              ].map((text, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${step > index + 1 ? 'bg-cyan-600' : step === index + 1 ? 'bg-cyan-600' : 'bg-gray-800'}
                      text-white font-medium
                    `}
                  >
                    {index + 1}
                  </div>
                  <span className="ml-2 text-sm hidden sm:block">{text}</span>
                  {index < 3 && (
                    <ArrowRight className="mx-4 text-gray-500 hidden sm:block" size={16} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-black rounded-xl shadow-lg p-6 border border-gray-800">
            {error && (
              <div className="bg-red-900 border border-red-800 text-red-200 px-4 py-2 rounded-md mb-4">
                {error}
              </div>
            )}
            <div className="space-y-8">
              {/* STEP 1: Upload Group Photo */}
              {step === 1 && (
                <div>
                  <DropZone
                    title="Upload Group Photo"
                    subtitle="Drop your group photo here or click to browse"
                    file={groupFile}
                    onUpload={handleGroupUpload}
                    inputRef={groupInputRef}
                  />
                </div>
              )}
              {/* STEP 2: Select Face Number */}
              {step === 2 && annotatedImageUrl && (
                <div className="space-y-4">
                  <img
                    src={annotatedImageUrl}
                    alt="Annotated Group"
                    className="max-w-full rounded-lg shadow-md"
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
                      onClick={() => faceNumber && setStep(3)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}
              {/* STEP 3: Upload Replacement Face */}
              {step === 3 && (
                <div>
                  <DropZone
                    title="Upload Replacement Face"
                    subtitle="Drop the new face photo here or click to browse"
                    file={replacementFile}
                    onUpload={handleReplacementUpload}
                    inputRef={replacementInputRef}
                  />
                </div>
              )}
              {/* STEP 4: Show Result */}
              {step === 4 && outputFile && (
                <div className="space-y-4">
                  <img
                    src={outputFile}
                    alt="Face Swap Result"
                    className="max-w-full rounded-lg shadow-md"
                  />
                  <div className="flex justify-center">
                    <button
                      onClick={resetAll}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      <RefreshCcw className="mr-2" size={16} />
                      Start New Face Swap
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button for Step 3 */}
            {step === 3 && replacementFile && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleSwap}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-600"
                >
                  {loading ? 'Processing...' : 'Swap Face'}
                </button>
              </div>
            )}
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

export default MultiFaceSwap;
