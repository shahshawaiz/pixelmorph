import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, ArrowRight, RefreshCcw } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import Layout from './Layout';

const FaceShapeDetector = () => {
  // Step management:
  // Step 1: Upload Image, Step 2: Processing, Step 3: Result
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [detectedShape, setDetectedShape] = useState(null);
  const [outputFile, setOutputFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('Upload an image to detect face shape');

  // Refs
  const fileInputRef = useRef(null);

  // File validation
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

  // Handle file selection (via click or drag‑and‑drop)
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;
    try {
      validateFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setImage(file);
      setError('');
      setMessage('Click "Detect Face Shape" to process');
      setDetectedShape(null);
      setOutputFile(null);
      setStep(1);
    } catch (err) {
      setError(err.message);
      setImage(null);
      setPreview(null);
    }
  }, []);

  // Drag & Drop support
  const [dragActive, setDragActive] = useState(false);
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleImageUpload(e);
  }, [handleImageUpload]);

  // Process image and detect face shape using the correct route (/api/faceshape-detector)
  const detectFaceShape = async () => {
    if (!image) return;
    setLoading(true);
    setError('');
    setMessage('Analyzing the image...');
    setStep(2);
    try {
      const formData = new FormData();
      // Ensure the key matches what your backend expects.
      formData.append('file', image);

      const response = await fetch('/api/faceshape-detector', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Detection failed: ${errorBody}`);
      }
      const data = await response.json();
      // Expected backend response format:
      // { "message": "<some message>", "shape": "<detected shape>", "output_file": "<filename>" }
      setDetectedShape(data.shape);
      setMessage(data.message || `Detected face shape: ${data.shape}`);
      if (data.output_file) {
        // Assuming your assets are served via /api/assets?filename=<filename>
        setOutputFile(`/api/assets?filename=${data.output_file}`);
      }
      setStep(3);
    } catch (err) {
      setError('Face shape detection failed. Please try again.');
      console.error('Detection error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset everything to start over
  const resetAll = () => {
    setImage(null);
    setPreview(null);
    setDetectedShape(null);
    setOutputFile(null);
    setError('');
    setMessage('Upload an image to detect face shape');
    setStep(1);
  };

  // Cleanup any created object URLs when unmounting or when preview changes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <Layout>
      <div className="min-h-screen bg-black py-8 px-4 text-white">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {['Upload Image', 'Process', 'Result'].map((text, index) => (
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
                  {index < 2 && (
                    <ArrowRight className="mx-4 text-gray-500 hidden sm:block" size={16} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          {step === 1 && (
            <DropZone
              title="Upload Image"
              subtitle="Drag and drop an image here, or click to select. Supports JPG, JPEG, PNG (max 10MB)."
              file={image}
              onUpload={handleImageUpload}
              inputRef={fileInputRef}
              dragActive={dragActive}
              handleDrag={handleDrag}
              handleDrop={handleDrop}
            />
          )}

          {step === 1 && image && (
            <div className="flex justify-center mt-4">
              <Button onClick={detectFaceShape} disabled={loading} className="flex-1">
                {loading ? 'Detecting...' : 'Detect Face Shape'}
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex justify-center">
                {outputFile ? (
                  <img
                    src={outputFile}
                    alt="Processed Output"
                    className="rounded-lg shadow-md max-h-64"
                  />
                ) : (
                  <img
                    src={preview}
                    alt="Uploaded"
                    className="rounded-lg shadow-md max-h-64"
                  />
                )}
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold">Detected Face Shape:</h3>
                <p className="text-2xl font-bold text-cyan-600">{detectedShape}</p>
              </div>
              <div className="flex justify-center">
                <Button onClick={resetAll} className="flex-1">
                  <RefreshCcw className="mr-2" size={16} />
                  Reset
                </Button>
              </div>
            </div>
          )}

          {/* Display messages and errors */}
          {error && (
            <div className="p-4 bg-red-900 border border-red-800 text-red-200 rounded-md">
              {error}
            </div>
          )}
          {message && !error && (
            <div className="p-4 bg-gray-800 rounded-md text-gray-400">
              {message}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const DropZone = ({ title, subtitle, file, onUpload, inputRef, dragActive, handleDrag, handleDrop }) => {
  return (
    <div
      className={`
        relative border-2 rounded-lg p-8
        ${dragActive ? 'border-blue-500 bg-blue-900' : 'border-gray-800 bg-black'}
        transition-colors duration-200
      `}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
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
            <Button onClick={() => inputRef.current?.click()}>
              Choose File
            </Button>
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

export default FaceShapeDetector;
