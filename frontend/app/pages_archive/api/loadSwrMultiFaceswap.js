// pages/api/faceswap.js
export default async function handler(req, res) {
    const { locale } = req.query;
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const token = process.env.STRAPI_API_TOKEN;
    console.log(locale);
    
    try {
      const response = await fetch(
        `${apiUrl}/api/multiple-face-swap?locale=${locale}`
      );
      
      if (!response.ok) {
        console.error('Error response from Strapi:', response.status);
        return res.status(response.status).json({ error: 'Failed to fetch content' });
      }
  
      const data = await response.json();
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.error('Error in API route:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  