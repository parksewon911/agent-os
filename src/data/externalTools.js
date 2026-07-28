/** 참고·연동 외부 도구 (프로 보장분석 / 금융계산기 / Gemini Gem) */
export const analysisTool = {
  name: 'PRO AI 보장분석표',
  url: 'https://pro-insuranceanalysis.com/',
  desc: 'PDF 업로드 → 자동 보장분석 → Before/After 리포트',
}

export const calculatorTool = {
  name: 'PRO Calculator',
  url: 'https://pro-financecalculator.vercel.app/',
  desc: '예적금·대출·부동산·은퇴·실손·상속증여 등 실시간 시뮬레이션',
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

/** Gemini Gem — 로그인 후 사용 (공유 링크) */
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
    desc: '카톡/문자 후속 메시지 · 리크루팅 멘트를 빠르게',
    url: 'https://gemini.google.com/gem/577a8cec82dc?usp=sharing',
  },
]
