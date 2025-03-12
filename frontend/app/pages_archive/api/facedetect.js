import formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  return new Promise((resolve) => {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024,
      allowEmptyFiles: false,
    });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing file upload:", err);
        res.status(500).json({ error: 'Error processing file upload' });
        return resolve();
      }
      const file = files.file?.[0] || files.file;
      if (!file || !file.filepath) {
        res.status(400).json({ error: 'File is required' });
        return resolve();
      }
      try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(file.filepath), {
          filename: file.originalFilename || 'upload.png',
          contentType: file.mimetype,
        });
        const apiResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/facedetect`,
          formData,
          {
            headers: formData.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          }
        );
        fs.promises.unlink(file.filepath).catch((err) => {
          console.error('Error deleting temporary file:', err);
        });
        res.status(200).json(apiResponse.data);
      } catch (error) {
        console.error("Error forwarding face detection request:", error);
        fs.promises.unlink(file.filepath).catch((err) => {
          console.error('Error deleting temporary file:', err);
        });
        const errorMessage =
          error.response?.data?.detail ||
          error.message ||
          'An unknown error occurred during face detection.';
        res.status(error.response?.status || 500).json({ error: errorMessage });
      }
      resolve();
    });
  });
}
