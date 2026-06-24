export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const RELAY_URL = process.env.RELAY_URL;
  if (!RELAY_URL) return res.status(500).json({ error: 'RELAY_URL not configured' });

  const path = req.url.replace(/^\/api\/relay/, '');
  const targetUrl = RELAY_URL + path;

  try {
    const fetchOptions = { method: req.method, headers: { 'Content-Type': req.headers['content-type'] || 'application/json' } };
    if (req.body && Object.keys(req.body).length > 0) fetchOptions.body = JSON.stringify(req.body);
    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();
    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'application/json');
    res.send(data);
  } catch (error) {
    res.status(502).json({ error: 'Proxy error', details: error.message });
  }
}
