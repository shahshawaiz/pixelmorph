import { useState, useRef } from 'react';
import axios from 'axios';
import Layout from './Layout';
import { Upload, ArrowRight, RefreshCcw, Download } from 'lucide-react';

const FaceSwap = () => {
  const [baseFile, setBaseFile] = useState(null);
  const [targetFile, setTargetFile] = useState(null);
  const [outputFile, setOutputFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');

  const baseInputRef = useRef(null);
  const targetInputRef = useRef(null);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }

    if (type === 'base') {
      setBaseFile(file);
      setStep(2);
      setMessage('Now upload the target face');
    } else {
      setTargetFile(file);
      setStep(3);
      setMessage('Ready to swap faces');
    }
    setError('');
  };

  const runFaceSwap = async () => {
    if (!baseFile || !targetFile) return;
    
    setLoading(true);
    setMessage('Processing your face swap...');
    const formData = new FormData();
    formData.append('source', baseFile);
    formData.append('target', targetFile);
    
    try {
      const response = await axios.post('/api/faceswap', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });
      const output = response.data.output_file;
      setOutputFile(`/api/assets?filename=${output}`);
      setStep(4);
      setMessage('Face swap completed successfully!');
    } catch (err) {
      setError('Face swap failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setBaseFile(null);
    setTargetFile(null);
    setOutputFile(null);
    setStep(1);
    setError('');
    setMessage('');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[
                'Upload Base Image',
                'Upload Target Face',
                'Process',
                'Result'
              ].map((text, index) => (
                <div key={index} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${step > index + 1 ? 'bg-green-500' : step === index + 1 ? 'bg-blue-500' : 'bg-gray-300'}
                    text-white font-medium
                  `}>
                    {index + 1}
                  </div>
                  <span className="ml-2 text-sm hidden sm:block">{text}</span>
                  {index < 3 && (
                    <ArrowRight className="mx-4 text-gray-400 hidden sm:block" size={16} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {error && (
              <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-4">
                {error}
              </div>
            )}

            <div className="space-y-8">
              {/* Step 1: Upload Base Image */}
              {step === 1 && (
                <DropZone
                  title="Upload Base Image"
                  subtitle="This is the main image where faces will be replaced"
                  file={baseFile}
                  onUpload={(e) => handleFileUpload(e, 'base')}
                  inputRef={baseInputRef}
                />
              )}

              {/* Step 2: Upload Target Face */}
              {step === 2 && (
                <DropZone
                  title="Upload Target Face"
                  subtitle="This face will replace the face in your base image"
                  file={targetFile}
                  onUpload={(e) => handleFileUpload(e, 'target')}
                  inputRef={targetInputRef}
                />
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-center font-medium">Base Image</h3>
                      <img
                        src={URL.createObjectURL(baseFile)}
                        alt="Base"
                        className="rounded-lg shadow-md max-h-64 mx-auto"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-center font-medium">Target Face</h3>
                      <img
                        src={URL.createObjectURL(targetFile)}
                        alt="Target"
                        className="rounded-lg shadow-md max-h-64 mx-auto"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={runFaceSwap}
                      disabled={loading}
                      className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
                    >
                      {loading ? 'Processing...' : 'Swap Faces'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Result */}
              {step === 4 && outputFile && (
                <div className="space-y-4">
                  <img
                    src={outputFile}
                    alt="Face Swap Result"
                    className="max-w-full rounded-lg shadow-md"
                  />
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetAll}
                      className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      <RefreshCcw className="mr-2" size={16} />
                      Start New Face Swap
                    </button>
                    <a
                      href={outputFile}
                      download
                      className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                      <Download className="mr-2" size={16} />
                      Download Result
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-700">{message}</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

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
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
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
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
            <button
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Choose File
            </button>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          className="hidden"
          onChange={onUpload}
        />
      </div>
    </div>
  );
};

export default FaceSwap;