export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const data = Buffer.concat(chunks).toString();
    
    const match = data.match(/<key>UDID<\/key>\s*<string>([^<]+)<\/string>/i);
    const udid = match ? match[1] : null;
    
    if (!udid) {
      return res.status(400).json({ error: 'UDID not found' });
    }

    const host = req.headers.host;
    const proto = req.headers['x-forwarded-proto'] || 'https';
    
    res.writeHead(302, {
      'Location': `${proto}://${host}/?udid=${encodeURIComponent(udid)}`
    });
    res.end();
    
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};