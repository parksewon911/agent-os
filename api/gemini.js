/**
 * Gemini API 프록시 (Vercel Serverless)
 * 키는 서버 환경변수 GEMINI_API_KEY 만 사용 — 클라이언트에 노출하지 않음
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY가 설정되지 않았습니다. Vercel 환경변수를 확인하세요.',
    })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const {
      prompt,
      system,
      history = [],
      model = 'gemini-2.0-flash',
      temperature = 0.7,
    } = body

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'prompt가 필요합니다.' })
    }

    const contents = []
    for (const h of history) {
      if (!h?.text) continue
      contents.push({
        role: h.role === 'ai' || h.role === 'model' ? 'model' : 'user',
        parts: [{ text: String(h.text) }],
      })
    }
    contents.push({ role: 'user', parts: [{ text: prompt }] })

    const preferred = model || 'gemini-2.0-flash'
    const modelsToTry = [preferred, 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-latest']
      .filter((m, i, arr) => arr.indexOf(m) === i)

    let data = null
    let usedModel = preferred
    let lastStatus = 500

    for (const m of modelsToTry) {
      usedModel = m
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent?key=${apiKey}`
      const payload = {
        contents,
        generationConfig: {
          temperature,
          maxOutputTokens: 2048,
        },
      }
      if (system) {
        payload.systemInstruction = { parts: [{ text: system }] }
      }

      const upstream = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      data = await upstream.json()
      lastStatus = upstream.status

      if (upstream.ok) break
      // 할당량/과부하면 다음 모델 시도
      if (upstream.status === 429 || upstream.status === 503) continue
      const msg = data?.error?.message || 'Gemini API 오류'
      return res.status(upstream.status).json({ error: msg })
    }

    if (!data || lastStatus >= 400) {
      const msg = data?.error?.message || 'Gemini 할당량이 초과되었습니다. 잠시 후 다시 시도하세요.'
      return res.status(lastStatus || 429).json({ error: msg })
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || ''

    if (!text) {
      return res.status(502).json({ error: 'Gemini 응답이 비어 있습니다.' })
    }

    return res.status(200).json({ text, model: usedModel })
  } catch (err) {
    return res.status(500).json({ error: err?.message || '서버 오류' })
  }
}
