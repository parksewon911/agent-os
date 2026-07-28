import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

/** 로컬 개발용 /api/gemini 미들웨어 (프로덕션은 Vercel api/gemini.js) */
function geminiDevApi() {
  return {
    name: 'gemini-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/gemini') || req.method === 'GET') {
          return next()
        }
        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        const env = loadEnv(server.config.mode, server.config.root, '')
        const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY
        if (!apiKey) {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error: '로컬 .env.local에 GEMINI_API_KEY를 넣어주세요.',
            }),
          )
          return
        }

        try {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
          const {
            prompt,
            system,
            history = [],
            model = 'gemini-2.5-flash',
            temperature = 0.7,
          } = body

          if (!prompt) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'prompt가 필요합니다.' }))
            return
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

          const modelsToTry = [model, 'gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash']
            .filter((m, i, arr) => arr.indexOf(m) === i)

          let data = null
          let usedModel = model
          let lastStatus = 500
          let lastMsg = ''

          for (const m of modelsToTry) {
            usedModel = m
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent?key=${apiKey}`
            const payload = {
              contents,
              generationConfig: { temperature, maxOutputTokens: 2048 },
            }
            if (system) payload.systemInstruction = { parts: [{ text: system }] }

            const upstream = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
            data = await upstream.json()
            lastStatus = upstream.status
            lastMsg = data?.error?.message || ''
            if (upstream.ok) break
            if ([404, 429, 503].includes(upstream.status)) continue
            res.statusCode = upstream.status
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: lastMsg || 'Gemini API 오류' }))
            return
          }

          res.setHeader('Content-Type', 'application/json')
          if (!data || lastStatus >= 400) {
            res.statusCode = lastStatus || 502
            res.end(JSON.stringify({ error: lastMsg || 'Gemini 응답 실패' }))
            return
          }
          const text =
            data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || ''
          res.statusCode = 200
          res.end(JSON.stringify({ text, model: usedModel }))
          return
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err?.message || '서버 오류' }))
          return
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), geminiDevApi()],
})
