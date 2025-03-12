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

  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      allowEmptyFiles: false,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing the file:', err);
        res.status(500).json({ error: 'Error processing file upload' });
        return resolve();
      }

      const file = files.file?.[0] || files.file; // Handle both formidable v3 and v4

      if (!file || !file.filepath) {
        res.status(400).json({ error: 'File is required and must be valid' });
        return resolve();
      }

      try {
        // Create a new FormData instance for the API request
        const apiFormData = new FormData();

        // Read the file and append it to the FormData with the correct field name
        const fileStream = fs.createReadStream(file.filepath);
        apiFormData.append('file', fileStream, {
          filename: file.originalFilename || 'upload.jpg',
          contentType: file.mimetype,
        });

        // Make the request to the face shape detection service
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/faceshape-detector`,
          apiFormData,
          {
            headers: {
              ...apiFormData.getHeaders(), // Headers required for FormData
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
          }
        );

        // Clean up the temporary file
        fs.unlink(file.filepath, (err) => {
          if (err) console.error('Error deleting temporary file:', err);
        });

        res.status(200).json(response.data);
      } catch (error) {
        console.error('Error during face shape detection:', error);

        let errorMessage = 'An unknown error occurred';
        if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.message) {
          errorMessage = error.message;
        }

        res.status(error.response?.status || 500).json({ 
          error: errorMessage,
          details: error.response?.data || error.message
        });
      }
      resolve();
    });
  });
}
