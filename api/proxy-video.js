import ytdl from 'ytdl-core';

export default async function handler(req, res) {
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

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Invalid or unsupported URL' });
  }

  try {
    const info = await ytdl.getInfo(url);
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
    const format = ytdl.chooseFormat(formats, { quality: 'highest' });

    if (!format || !format.url) {
      return res.status(404).json({ error: 'No video format found' });
    }

    res.status(200).json({ videoUrl: format.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch video – YouTube blocked or format changed' });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
