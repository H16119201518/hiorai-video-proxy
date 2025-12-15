import ytdl from 'ytdl-core';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Invalid or unsupported URL' });
  }

  try {
    const info = await ytdl.getInfo(url);
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
    const bestFormat = formats[0]; // Mejor calidad disponible

    if (!bestFormat) {
      return res.status(404).json({ error: 'No suitable video format found' });
    }

    // Devolvemos la URL directa del vídeo (Vercel la sirve con CORS habilitado)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ videoUrl: bestFormat.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch video – try uploading directly' });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
