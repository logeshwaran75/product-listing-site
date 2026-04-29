export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productName, description, seoKeywords, status } = req.body;
    if (!productName || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { productName, description, seoKeywords, status }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}