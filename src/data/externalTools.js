/**
 * 외부 참고 도구 — 구조·데이터 출처 요약
 *
 * [보장분석] PDF.js → 보험사별 파서 → 권장담보 → Before/After → 스냅샷 저장
 * [금융계산기] 브라우저 공식 + 환율 API
 */

export const analysisTool = {
  name: '외부 보장분석 참고',
  url: 'https://pro-insuranceanalysis.com/',
  desc: 'PDF→파서→권장담보→Before/After 파이프라인 참고용',
}

export const calculatorTool = {
  name: '외부 금융계산 참고',
  url: 'https://pro-financecalculator.vercel.app/',
  desc: '카테고리·공식·환율 API 구조 참고용',
  categories: [
    '부동산 통합',
    '상속 및 증여세',
    '예적금 계산기',
    '은퇴자금 설계',
    '목적자금 설계',
    '달러 설계',
    '갱신형/비갱신형 비교',
    '실손보험 갱신',
    '전월세 전환 설계',
    '대출 상환 설계',
    '종합소득세 계산',
  ],
}
