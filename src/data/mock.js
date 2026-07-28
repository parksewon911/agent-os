export const customers = [
  {
    id: 'c1',
    name: '김민수',
    age: 42,
    phone: '010-2345-6789',
    stage: '상담중',
    score: 78,
    lastContact: '2026-07-26',
    gaps: ['실손 갱신형 리스크', '암 진단비 부족'],
    policies: 3,
  },
  {
    id: 'c2',
    name: '이서연',
    age: 35,
    phone: '010-8765-4321',
    stage: '제안완료',
    score: 91,
    lastContact: '2026-07-27',
    gaps: ['운전자 특약 미가입'],
    policies: 2,
  },
  {
    id: 'c3',
    name: '박준호',
    age: 51,
    phone: '010-5555-1212',
    stage: '소개대기',
    score: 64,
    lastContact: '2026-07-20',
    gaps: ['간병비', '사망보장 공백'],
    policies: 4,
  },
  {
    id: 'c4',
    name: '최유진',
    age: 29,
    phone: '010-3333-9999',
    stage: '초회상담',
    score: 55,
    lastContact: '2026-07-28',
    gaps: ['보장 전무 · 신규 설계'],
    policies: 0,
  },
]

export const teamStats = [
  { name: '박세원', consults: 28, closes: 6, score: 92 },
  { name: '정하늘', consults: 21, closes: 4, score: 81 },
  { name: '오미래', consults: 19, closes: 5, score: 88 },
  { name: '강태우', consults: 14, closes: 2, score: 70 },
]

export const applicants = [
  { id: 'a1', name: '윤서진', channel: '소개', status: '1차면접', experience: '신입', score: 72 },
  { id: 'a2', name: '한도윤', channel: '채용공고', status: '서류통과', experience: '3년', score: 85 },
  { id: 'a3', name: '배수아', channel: 'SNS', status: '관심', experience: '경력전환', score: 61 },
]

export const products = [
  { company: 'KB손해보험', name: '간편실손', type: '실손', premium: 28000, score: 86 },
  { company: '삼성화재', name: '통합건강', type: '종합', premium: 52000, score: 91 },
  { company: '현대해상', name: '암케어플러스', type: '암', premium: 35000, score: 84 },
  { company: 'DB손해보험', name: '운전자안심', type: '운전자', premium: 18000, score: 79 },
]

export const consultTranscript = `
고객: 요즘 실손 보험료가 너무 올라서 걱정이에요. 기존에 든 게 있는데 바꿀 수 있나요?
설계사: 증권 보여주시면 갱신형·비갱신 구조랑 보장 공백을 같이 볼게요.
고객: 아이도 둘이라 병원비 나가는 게 부담이고, 암 쪽도 좀 걱정돼요.
설계사: 암 진단비랑 수술비, 간병까지 묶어서 리모델링 안을 드릴게요.
`

export const ocrResult = {
  insurer: '삼성화재',
  product: '통합건강보험',
  contractor: '김민수',
  insured: '김민수',
  monthly: 68400,
  startDate: '2019-03-12',
  covers: [
    { name: '질병사망', amount: '5,000만' },
    { name: '암진단비', amount: '2,000만' },
    { name: '실손의료비', amount: '급여 80%' },
    { name: '운전자', amount: '미가입' },
  ],
}
