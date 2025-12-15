import play from 'play-dl';

export default async function handler(req, res) {
  // CORS headers para que funcione desde Lovable
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL' });
  }

  try {
    // Auto-refresh token si expira
    if (play.is_expired()) {
      await play.refreshToken();
    }

    // Extrae el stream directo
    const streamData = await play.stream(url);

    // Devuelve la URL del vídeo/stream
    res.status(200).json({ videoUrl: streamData.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch video – platform blocked or unsupported' });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
