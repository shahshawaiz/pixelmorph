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
      maxFileSize: 50 * 1024 * 1024, // 50MB limit
      allowEmptyFiles: false,
      multiples: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing the files:', err);
        res.status(500).json({ error: 'Error processing file upload' });
        return resolve();
      }

      const sourceFile = files.source?.[0] || files.source;
      const targetFile = files.target?.[0] || files.target;

      if (!sourceFile?.filepath || !targetFile?.filepath) {
        res.status(400).json({ error: 'Both source and target files are required' });
        return resolve();
      }

      const videoExtensions = ['.mp4', '.mov', '.avi'];
      const isVideo = videoExtensions.some((ext) => targetFile.originalFilename?.toLowerCase().endsWith(ext));

      try {
        const formData = new FormData();

        // Read and append files to FormData
        formData.append('source', fs.createReadStream(sourceFile.filepath), {
          filename: sourceFile.originalFilename || 'source.jpg',
          contentType: sourceFile.mimetype,
        });
        formData.append('target', fs.createReadStream(targetFile.filepath), {
          filename: targetFile.originalFilename || 'target.jpg',
          contentType: targetFile.mimetype,
        });
        formData.append('video', isVideo ? 'true' : 'false');

        // Send request to the backend processing server
        const apiResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/faceswap`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
          }
        );

        // Cleanup uploaded files
        await Promise.all([
          fs.promises.unlink(sourceFile.filepath).catch((err) =>
            console.error('Error deleting source file:', err)
          ),
          fs.promises.unlink(targetFile.filepath).catch((err) =>
            console.error('Error deleting target file:', err)
          ),
        ]);

        // Send response back to the client
        res.status(200).json(apiResponse.data);
      } catch (error) {
        console.error('Error during face swap:', error);

        // Cleanup files on error
        try {
          await Promise.all([
            fs.promises.unlink(sourceFile.filepath).catch(() => {}),
            fs.promises.unlink(targetFile.filepath).catch(() => {}),
          ]);
        } catch (cleanupError) {
          console.error('Error cleaning up files:', cleanupError);
        }

        const errorMessage = error.response?.data?.detail || error.message || 'An unknown error occurred';
        res.status(error.response?.status || 500).json({
          error: errorMessage,
          details: error.response?.data || error.message,
        });
      }

      resolve();
    });
  });
}
