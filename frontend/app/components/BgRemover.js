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
import axios from 'axios';
import Layout from './Layout';

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
    const maxSize = 10 * 1024 * 1024;
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
      <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          {['Upload Image', 'Processing', 'Result'].map((text, index) => (
            <div key={index} className="flex items-center">
              <div className={
                `w-8 h-8 rounded-full flex items-center justify-center ${step > index + 1 ? 'bg-green-500' : step === index + 1 ? 'bg-blue-500' : 'bg-gray-300'} text-white font-medium`
              }>
                {index + 1}
              </div>
              <span className="ml-2 text-sm hidden sm:block">{text}</span>
              {index < 2 && <ArrowRight className="mx-4 text-gray-400 hidden sm:block" size={16} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <DropZone title="Upload Image" file={image} onUpload={handleImageUpload} inputRef={fileInputRef} />
        )}

        {step === 1 && image && (
          <div className="flex justify-center">
            <Button onClick={removeBackground} disabled={loading} className="flex-1">
              {loading ? 'Processing...' : 'Remove Background'}
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex justify-center">
              {outputImage && <img src={outputImage} alt="Processed Output" className="rounded-lg shadow-md max-h-64" />}
            </div>
            <div className="flex justify-center">
              <Button onClick={resetAll} className="flex-1">
                <RefreshCcw className="mr-2" size={16} /> Reset
              </Button>
            </div>
          </div>
        )}

        {error && <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-md">{error}</div>}
        {message && !error && <div className="p-4 bg-gray-100 rounded-md">{message}</div>}
      </div>
    </div>
    </Layout>
  );
};

const DropZone = ({ title, file, onUpload, inputRef }) => (
  <div className="relative border-2 rounded-lg p-8 border-gray-300 transition-colors duration-200">
    <div className="flex flex-col items-center">
      {file ? (
        <img src={URL.createObjectURL(file)} alt="Preview" className="max-h-64 rounded-lg shadow-md" onLoad={(e) => URL.revokeObjectURL(e.target.src)} />
      ) : (
        <>
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <Button onClick={() => inputRef.current?.click()}>Choose File</Button>
        </>
      )}
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={onUpload} />
    </div>
  </div>
);

export default BgRemover;
