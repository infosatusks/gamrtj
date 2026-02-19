// Vercel Serverless Function: /api/gass/worksheet
module.exports = async (req, res) => {
  // CORS (agar frontend gamrtj.vercel.app boleh akses)
  res.setHeader("Access-Control-Allow-Origin", "https://gamrtj.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, message: "Method not allowed" });

  const APPS_SCRIPT_URL = process.env.GASS_APPS_SCRIPT_URL; // URL Apps Script /exec
  const API_KEY = process.env.GASS_API_KEY;                // secret

  try {
    // Body bisa sudah object (JSON) atau string (fallback)
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const payload = { ...body, apiKey: API_KEY, source: "worksheet" };

    const upstream = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { ok: false, raw: text }; }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ ok: false, message: err?.message || String(err) });
  }
};
