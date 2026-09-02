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

  const { prompt, model = 'gemini-2.5-flash' } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Falta campo prompt (string)' });
  }

  try {
    // Usa SDK oficial @google/genai (maneja automáticamente endpoint y modelo correcto para keys nuevas AQ.*)
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({ model, contents: prompt });
    const text = (result as any).text || (result as any).candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ text, raw: result });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Gemini proxy failed', detail: String(e) });
  }
}
