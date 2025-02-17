import React, { useState, useCallback, useRef } from 'react';
import { Upload, RefreshCcw } from 'lucide-react';
import { Button } from "../components/ui/button";
import axios from 'axios';
import Layout from './Layout';

// Reusable Stepper Component
const Stepper = ({ steps, currentStep }) => (
  <div className="flex items-center justify-center mb-8">
    {steps.map((stepLabel, index) => {
      const stepNumber = index + 1;
      const isActive = stepNumber === currentStep;
      const isCompleted = stepNumber < currentStep;
      return (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center
                ${isCompleted || isActive ? 'bg-cyan-600' : 'bg-gray-800'} 
                text-white font-bold`}
            >
              {stepNumber}
            </div>
            <span className="mt-2 text-sm">{stepLabel}</span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 ${stepNumber < currentStep ? 'bg-cyan-600' : 'bg-gray-800'}`}
            ></div>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

const BgRemover = () => {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('Upload an image to remove its background');

  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (!validTypes.includes(file.type)) {
      throw new Error('Please upload a valid JPG or PNG image.');
    }
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB.');
    }
  };

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;
    try {
      validateFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setImage(file);
      setError('');
      setMessage('Click "Remove Background" to process');
      setOutputImage(null);
      setStep(1);
    } catch (err) {
      setError(err.message);
      setImage(null);
      setPreview(null);
    }
  }, []);

  const removeBackground = async () => {
    if (!image) return;
    setLoading(true);
    setError('');
    setMessage('Processing your image...');
    setStep(2);

    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await axios.post('/api/background-remover', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });
      setOutputImage(`/api/assets?filename=${response.data.output_file}`);
      setMessage('Background removed! You can download the result.');
      setStep(3);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Error during processing:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setImage(null);
    setPreview(null);
    setOutputImage(null);
    setError('');
    setMessage('Upload an image to remove its background');
    setStep(1);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black py-8 px-4 text-white">
        <div className="max-w-4xl mx-auto">
          {/* Updated Stepper */}
          <Stepper steps={['Upload Image', 'Processing', 'Result']} currentStep={step} />

          {/* Upload/Preview UI */}
          {step === 1 && (
            <DropZone
              title="Upload Image"
              file={image}
              onUpload={handleImageUpload}
              inputRef={fileInputRef}
            />
          )}

          {step === 1 && image && (
            <div className="flex justify-center mt-4">
              <Button onClick={removeBackground} disabled={loading} className="flex-1">
                {loading ? 'Processing...' : 'Remove Background'}
              </Button>
            </div>
          )}

          {/* Processed Result */}
          {step === 3 && (
            <div className="space-y-4 mt-4">
              <div className="flex justify-center">
                {outputImage && (
                  <img
                    src={outputImage}
                    alt="Processed Output"
                    className="rounded-lg shadow-md max-h-64"
                  />
                )}
              </div>
              <div className="flex justify-center">
                <Button onClick={resetAll} className="flex-1">
                  <RefreshCcw className="mr-2" size={16} /> Reset
                </Button>
              </div>
            </div>
          )}

          {/* Error and Message Alerts */}
          {error && (
            <div className="p-4 bg-red-900 border border-red-800 text-red-200 rounded-md mt-4">
              {error}
            </div>
          )}
          {message && !error && (
            <div className="p-4 bg-gray-800 rounded-md mt-4">
              {message}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const DropZone = ({ title, file, onUpload, inputRef }) => (
  <div className="relative border-2 rounded-lg p-8 border-gray-800 transition-colors duration-200 hover:border-cyan-600">
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
          <Upload className="w-12 h-12 text-gray-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <Button onClick={() => inputRef.current?.click()}>Choose File</Button>
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

export default BgRemover;
