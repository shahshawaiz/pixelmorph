import { useState, useRef } from 'react';
import axios from 'axios';
import Layout from './Layout';
import { Upload, ArrowRight, RefreshCcw } from 'lucide-react';

const MultiFaceSwap = () => {
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
        setAnnotatedImageUrl(`/api/assets?filename=${response.data.annotated_image}`);
        setStep(2);
        setMessage('Select the face number you want to replace');
      }
    } catch (err) {
      setError('Could not detect faces. Please try another image.');
    } finally {
      setLoading(false);
    }
  };

  const handleReplacementUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReplacementFile(file);
      setStep(3);
    }
  };

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
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[
                'Upload Group Photo',
                'Select Face',
                'Upload New Face',
                'Complete'
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
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-4">
                {error}
              </div>
            )}


            <div className="space-y-8">
              {/* Step 1: Upload Group Photo */}
              <div className={step === 1 ? 'block' : 'hidden'}>
                <DropZone
                  title="Upload Group Photo"
                  subtitle="Drop your group photo here or click to browse"
                  file={groupFile}
                  onUpload={handleGroupUpload}
                  inputRef={groupInputRef}
                />
              </div>

              {/* Step 2: Select Face Number */}
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
                      className="w-32 px-3 py-2 border rounded-md"
                      min="1"
                    />
                    <button
                      onClick={() => faceNumber && setStep(3)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Upload Replacement Face */}
              {step === 3 && (
                <DropZone
                  title="Upload Replacement Face"
                  subtitle="Drop the new face photo here or click to browse"
                  file={replacementFile}
                  onUpload={handleReplacementUpload}
                  inputRef={replacementInputRef}
                />
              )}

              {/* Step 4: Show Result */}
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
                      className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      <RefreshCcw className="mr-2" size={16} />
                      Start New Face Swap
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {step === 3 && replacementFile && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleSwap}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
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
          accept="image/*"
          className="hidden"
          onChange={onUpload}
        />
      </div>
    </div>
  );
};

export default MultiFaceSwap;