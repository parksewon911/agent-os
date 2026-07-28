/**
 * 환율 — 참고: PRO Calculator /api/rate → { rate, source: 'naver' }
 * 설계사 AI: 공개 API 폴백 (클라이언트)
 */
export async function fetchUsdKrw() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD')
    if (!res.ok) throw new Error('rate http')
    const data = await res.json()
    const rate = data?.rates?.KRW
    if (!rate) throw new Error('no krw')
    return { rate: Math.round(rate * 10) / 10, source: 'open.er-api', timestamp: new Date().toISOString() }
  } catch {
    return { rate: 1380, source: 'fallback', timestamp: new Date().toISOString() }
  }
}
