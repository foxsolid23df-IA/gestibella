import type { VercelRequest, VercelResponse } from '@vercel/node';

// Proxy Gemini para no exponer GEMINI_API_KEY al cliente
// Vercel Hobby: maxDuration 10s (vercel.json)
// Env: GEMINI_API_KEY (sin prefijo VITE, solo server)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY no configurada en Vercel env' });
  }

  const { prompt, model = 'gemini-2.0-flash' } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Falta campo prompt (string)' });
  }

  try {
    // Usamos fetch directo para evitar cold-start de SDK en Hobby
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    if (!resp.ok) {
      const text = await resp.text();
      return res.status(resp.status).json({ error: 'Gemini upstream error', detail: text });
    }
    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ text, raw: data });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Gemini proxy failed' });
  }
}
