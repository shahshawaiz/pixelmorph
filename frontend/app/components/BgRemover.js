import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import Layout from './Layout';

const BgRemover = () => {
  const [image, setImage] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState('Upload an image to remove its background');

  const fileInputRef = useRef(null);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
    if (file) {
      const validExtensions = ['.jpg', '.jpeg', '.png'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

      if (!file.type.startsWith('image/') || !validExtensions.includes(fileExtension)) {
        setError('Please upload a valid JPG or PNG image.');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB.');
        return;
      }

      setImage(file);
      setOutputImage(null);
      setError('');
      setMessage('Click "Remove Background" to process');
    }
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const runInference = useCallback(async () => {
    if (!image) return;

    setLoading(true);
    setError('');
    setMessage('Processing your image...');

    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await axios.post('/api/background-remover', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });
      const outputFile = response.data.output_file;
      setOutputImage(`/api/assets?filename=${outputFile}`);
      setMessage('Background removed! You can download the result.');
    } catch (err) {
      setError('Failed to process image. Please try again.');
      setMessage('An error occurred. Please try again.');
      console.error('Error during inference:', err);
    } finally {
      setLoading(false);
    }
  }, [image]);

  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 ">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Background Remover</h1>

          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Original Image Upload */}
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold mb-2 text-center">Original Image</h3>
              <div
                className={`border-2 ${
                  dragActive ? 'border-blue-500' : 'border-gray-300'
                } border-dashed rounded-lg p-4 aspect-square flex items-center justify-center mb-2`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={(e) => {
                  handleDrag(e);
                  handleImageUpload(e);
                }}
              >
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Original"
                    className="w-full h-full object-contain rounded-md"
                    onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={handleButtonClick}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    Upload Image
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {/* Result */}
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold mb-2 text-center">Result</h3>
              <div className="border-2 border-gray-300 border-dashed rounded-lg p-4 aspect-square flex items-center justify-center mb-2">
                {outputImage ? (
                  <img
                    src={outputImage}
                    alt="Result"
                    className="w-full h-full object-contain rounded-md"
                  />
                ) : (
                  <span className="text-gray-400 text-sm text-center">
                    Result will appear here
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Message and Error Display */}
          <div className="mb-4 text-center">
            {error ? (
              <p className="text-red-600 text-sm">{error}</p>
            ) : (
              <p className="text-gray-600 text-sm">{message}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={runInference}
              disabled={loading || !image}
              className={`flex-1 py-2 sm:py-3 text-white font-semibold rounded-lg transition ${
                loading || !image
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Processing...' : 'Remove Background'}
            </button>

            {outputImage && (
              <a
                href={outputImage}
                download
                className="flex-1 py-2 sm:py-3 text-white font-semibold rounded-lg bg-green-600 hover:bg-green-700 transition text-center"
              >
                Download Result
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BgRemover;