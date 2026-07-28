/**
 * Gemini API 프록시 (Vercel Serverless)
 * 키는 서버 환경변수 GEMINI_API_KEY 만 사용
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
      error: 'GEMINI_API_KEY가 설정되지 않았습니다.',
    })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const { prompt, system, history = [], model, temperature = 0.7 } = body

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

    const preferred = model || 'gemini-2.5-flash'
    const modelsToTry = [preferred, 'gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash']
      .filter((m, i, arr) => arr.indexOf(m) === i)

    let data = null
    let usedModel = preferred
    let lastStatus = 500
    let lastMsg = ''

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
      lastMsg = data?.error?.message || ''

      if (upstream.ok) break
      // 모델 없음·할당량·과부하 → 다음 모델
      if ([404, 429, 503].includes(upstream.status)) continue
      return res.status(upstream.status).json({ error: lastMsg || 'Gemini API 오류' })
    }

    if (!data || lastStatus >= 400) {
      return res.status(lastStatus || 502).json({
        error: lastMsg || 'Gemini 응답에 실패했습니다. 잠시 후 다시 시도하세요.',
      })
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
