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
      maxFileSize: 50 * 1024 * 1024,
      allowEmptyFiles: false,
      multiples: true,
    });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing the files:', err);
        res.status(500).json({ error: 'Error processing file upload' });
        return resolve();
      }
      // "source" is the group image and "target" is the replacement face image.
      const groupFile = files.source?.[0] || files.source;
      const replacementFile = files.target?.[0] || files.target;
      const faceIndex = fields.face_index;
      const faceIndexInt = parseInt(faceIndex, 10);
      if (!groupFile?.filepath || !replacementFile?.filepath) {
        res.status(400).json({ error: 'Both group and replacement files are required' });
        return resolve();
      }
      try {
        const formData = new FormData();
        // Append group image as "source"
        formData.append('source', fs.createReadStream(groupFile.filepath), {
          filename: groupFile.originalFilename || 'group.jpg',
          contentType: groupFile.mimetype,
        });
        // Append replacement image as "target"
        formData.append('target', fs.createReadStream(replacementFile.filepath), {
          filename: replacementFile.originalFilename || 'replacement.jpg',
          contentType: replacementFile.mimetype,
        });
        formData.append('face_index', faceIndexInt);
        formData.append('video', 'false');

        const apiResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/multifaceswap`,
          formData,
          {
            headers: { ...formData.getHeaders() },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
          }
        );

        await Promise.all([
          fs.promises.unlink(groupFile.filepath).catch((err) =>
            console.error('Error deleting group file:', err)
          ),
          fs.promises.unlink(replacementFile.filepath).catch((err) =>
            console.error('Error deleting replacement file:', err)
          ),
        ]);

        res.status(200).json(apiResponse.data);
      } catch (error) {
        console.error('Error during face swap:', error);
        try {
          await Promise.all([
            fs.promises.unlink(groupFile.filepath).catch(() => {}),
            fs.promises.unlink(replacementFile.filepath).catch(() => {}),
          ]);
        } catch (cleanupError) {
          console.error('Error cleaning up files:', cleanupError);
        }
        const errorMessage =
          error.response?.data?.detail || error.message || 'An unknown error occurred';
        res.status(error.response?.status || 500).json({
          error: errorMessage,
          details: error.response?.data || error.message,
        });
      }
      resolve();
    });
  });
}
