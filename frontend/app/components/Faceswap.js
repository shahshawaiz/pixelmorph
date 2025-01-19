import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import Layout from './Layout';

const FaceSwap = () => {
  const [baseFile, setBaseFile] = useState(null);
  const [targetFile, setTargetFile] = useState(null);
  const [outputFile, setOutputFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState('Upload base and target files to begin');

  const baseInputRef = useRef(null);
  const targetInputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleFileUpload = useCallback((e, setFile, type) => {
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
    if (file) {
      const validExtensions = ['.jpg', '.jpeg', '.png', '.mp4', '.mov', '.avi'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

      if (
        !(
          file.type.startsWith('image/') ||
          file.type.startsWith('video/')
        ) ||
        !validExtensions.includes(fileExtension)
      ) {
        setError('Please upload a valid JPG, PNG, or video file (MP4, MOV, AVI).');
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB.');
        return;
      }

      setFile(file);
      setOutputFile(null);
      setError('');
      updateMessage(type, true);
    }
  }, []);

  const updateMessage = (type, isUploaded) => {
    if (type === 'base' && isUploaded && !targetFile) {
      setMessage('Now upload a target file');
    } else if (type === 'target' && isUploaded && !baseFile) {
      setMessage('Now upload a base file');
    } else if (baseFile && targetFile) {
      setMessage('Click "Swap Faces" to process');
    }
  };

  const runFaceSwap = useCallback(async () => {
    if (!baseFile || !targetFile) return;

    setLoading(true);
    setError('');
    setMessage('Processing your files...');

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
      setMessage('Processing completed! You can download the result.');
    } catch (err) {
      setError('Failed to process the request. Please try again.');
      setMessage('An error occurred. Please try again.');
      console.error('Error during processing:', err);
    } finally {
      setLoading(false);
    }
  }, [baseFile, targetFile]);

  return (
    <Layout>
      {loading && <Loader />}
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10 px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Face Swap</h1>

          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FileUploadComponent
              title="Base File"
              file={baseFile}
              onUpload={(e) => handleFileUpload(e, setBaseFile, 'base')}
              inputRef={baseInputRef}
              dragActive={dragActive}
              handleDrag={handleDrag}
            />

            <FileUploadComponent
              title="Target File"
              file={targetFile}
              onUpload={(e) => handleFileUpload(e, setTargetFile, 'target')}
              inputRef={targetInputRef}
              dragActive={dragActive}
              handleDrag={handleDrag}
            />

            <div className="flex flex-col">
              <h3 className="text-sm font-semibold mb-2 text-center">Result</h3>
              <div className="border-2 border-gray-300 border-dashed rounded-lg p-4 aspect-square flex items-center justify-center mb-2">
                {outputFile ? (
                  outputFile.endsWith('.mp4') ? (
                    <video controls className="w-full h-full object-contain rounded-md">
                      <source src={outputFile} type="video/mp4" />
                      Your browser does not support video playback.
                    </video>
                  ) : (
                    <img
                      src={outputFile}
                      alt="Result"
                      className="w-full h-full object-contain rounded-md"
                    />
                  )
                ) : (
                  <span className="text-gray-400 text-sm text-center">
                    Result will appear here
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4 text-center">
            {error ? <p className="text-red-600 text-sm">{error}</p> : <p className="text-gray-600 text-sm">{message}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={runFaceSwap}
              disabled={loading || !baseFile || !targetFile}
              className={`flex-1 py-2 sm:py-3 text-white font-semibold rounded-lg transition ${
                loading || !baseFile || !targetFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Processing...' : 'Swap Faces'}
            </button>

            {outputFile && (
              <a
                href={outputFile}
                download
                className="flex-1 py-2 sm:py-3 text-white font-semibold rounded-lg bg-green-600 hover:bg-green-700 transition text-center"
              >
                Download Result
              </a>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

const Loader = () => (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="text-center">
      <div className="loader spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-white"></div>
      <p className="text-white text-lg mt-4">Please do not refresh the screen...</p>
    </div>
  </div>
);

const FileUploadComponent = ({ title, file, onUpload, inputRef, dragActive, handleDrag }) => (
  <div className="flex flex-col">
    <h3 className="text-sm font-semibold mb-2 text-center">{title}</h3>
    <div
      className={`border-2 ${
        dragActive ? 'border-blue-500' : 'border-gray-300'
      } border-dashed rounded-lg p-4 aspect-square flex items-center justify-center mb-2`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={(e) => {
        handleDrag(e);
        onUpload(e);
      }}
    >
      {file ? (
        file.type.startsWith('video/') ? (
          <video
            src={URL.createObjectURL(file)}
            controls
            className="w-full h-full object-contain rounded-md"
            onLoad={(e) => URL.revokeObjectURL(e.target.src)}
          />
        ) : (
          <img
            src={URL.createObjectURL(file)}
            alt="File"
            className="w-full h-full object-contain rounded-md"
            onLoad={(e) => URL.revokeObjectURL(e.target.src)}
          />
        )
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          className="text-blue-600 text-sm hover:text-blue-800"
        >
          Upload File
        </button>
      )}
    </div>
    <input
      ref={inputRef}
      type="file"
      accept=".jpg,.jpeg,.png,.mp4,.mov,.avi"
      className="hidden"
      onChange={onUpload}
    />
  </div>
);

export default FaceSwap;
