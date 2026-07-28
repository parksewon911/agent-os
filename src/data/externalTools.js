/**
 * 외부 참고 도구 — 구조·데이터 출처 요약
 *
 * [보장분석 https://pro-insuranceanalysis.com ]
 *  - PDF.js 텍스트 추출
 *  - parserEngineV2: 보험사별 담보 파싱
 *  - coverageMaster: 카테고리·권장금액·레이더
 *  - Gemini/Vertex 프록시(/api/gemini-proxy, /api/vertex-proxy)로 제안서 AI 분석
 *  - Supabase: analysis_customers, analysis_snapshots / Firebase Auth
 *  - 리포트에 '소속: 인카금융서비스' 하드코딩됨 → 설계사 AI에는 이식하지 않음
 *
 * [금융계산기 https://pro-financecalculator.vercel.app ]
 *  - 계산은 전부 브라우저 공식
 *  - /api/rate → 네이버 환율
 *  - Supabase는 익명 사용량 로그만
 *
 * [Gemini Gem 공유 링크]
 *  - Google 계정 로그인 후 Gem 프롬프트·지식으로 응답 (서버는 Google)
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

export const geminiGems = [
  {
    id: 'a21651eef85c',
    title: '상담 스크립트 Gem',
    desc: '고객 상황 입력 → 실시간 상담 멘트·질문 제안',
    url: 'https://gemini.google.com/gem/a21651eef85c?usp=sharing',
  },
  {
    id: 'bad09ace91c8',
    title: '보장분석 Gem',
    desc: '증권·보장 공백 해석과 리모델링 포인트 정리',
    url: 'https://gemini.google.com/gem/bad09ace91c8?usp=sharing',
  },
  {
    id: 'd3f5d0e6c6e4',
    title: '상품·제안서 Gem',
    desc: '상품 비교·제안서 설명 문구 생성',
    url: 'https://gemini.google.com/gem/d3f5d0e6c6e4?usp=sharing',
  },
  {
    id: '577a8cec82dc',
    title: '후속·리크루팅 Gem',
    desc: '카톡/문자 후속 메시지 · 리크루팅 멘트',
    url: 'https://gemini.google.com/gem/577a8cec82dc?usp=sharing',
  },
]
