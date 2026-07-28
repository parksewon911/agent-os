import { brand } from '../config/brand.js'

export const SYSTEM_DEFAULT = `당신은 "${brand.name}" 보험설계사 업무 AI 비서입니다.
한국어로 짧고 실무적으로 답하세요.
상담 스크립트, 보장 설명, 후속 메시지, 리모델링 포인트를 돕습니다.
소속·직함·조직명은 사용자가 말한 경우에만 언급하고, 특정 금융사·총괄 조직명을 임의로 넣지 마세요.
단정적인 보장·세무 확정 조언은 피하고, 참고용임을 필요 시 짧게 밝히세요.`

/**
 * @param {{ prompt: string, system?: string, history?: {role:string,text:string}[], model?: string }} opts
 */
export async function askGemini(opts) {
  const { prompt, system = SYSTEM_DEFAULT, history = [], model } = opts
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, system, history, model }),
  })

  let data = {}
  try {
    data = await res.json()
  } catch {
    data = {}
  }

  if (!res.ok) {
    throw new Error(data.error || `Gemini 요청 실패 (${res.status})`)
  }
  return data.text
}

export async function askGeminiSafe(opts, fallback) {
  try {
    return await askGemini(opts)
  } catch (e) {
    if (typeof fallback === 'function') return fallback(e)
    if (fallback != null) return fallback
    throw e
  }
}
