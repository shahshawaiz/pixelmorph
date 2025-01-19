import axios from 'axios';

export default async function handler(req, res) {
  const { filename } = req.query;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Replace with the URL of your FastAPI server
    const fastApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/assets/${filename}`;

    // Fetch the file from FastAPI
    const response = await axios.get(fastApiUrl, {
      responseType: 'stream', // Stream the response for efficient transfer
    });

    // Set the appropriate content headers
    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Content-Length', response.headers['content-length'] || '0');

    // Pipe the data to the client
    response.data.pipe(res);
  } catch (err) {
    console.error('Error fetching asset:', err.message);
    const status = err.response?.status || 500;
    res.status(status).json({
      error: 'Failed to fetch the requested asset',
      details: err.response?.data || err.message,
    });
  }
}
