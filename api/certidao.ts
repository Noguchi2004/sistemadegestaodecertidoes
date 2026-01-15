import type { VercelRequest, VercelResponse } from '@vercel/node';

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzp4fHTLrsyM1G-b7VBEr539l73QFfa_Y5vgCky-kAd6_M53StOrzbK9E6D8gw--38fxg/exec'; // a mesma URL que você usava antes

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      // Lista todas as certidões (proxy do doGet)
      const gsResponse = await fetch(APPS_SCRIPT_URL);
      const text = await gsResponse.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { ok: false, raw: text };
      }

      return res.status(gsResponse.status).json(data);
    }

    if (req.method === 'POST') {
      const body: any = req.body || {};
      const { action, data, id } = body;

      if (!action) {
        return res
          .status(400)
          .json({ ok: false, error: 'Campo "action" é obrigatório' });
      }

      // Repasse direto para o Apps Script no formato que o front espera
      const gsResponse = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data, id }),
      });

      const text = await gsResponse.text();
      let responseData;
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = { ok: false, raw: text };
      }

      return res.status(gsResponse.status).json(responseData);
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Erro na Vercel:', error);
    return res.status(500).json({ ok: false, error: String(error) });
  }
}
