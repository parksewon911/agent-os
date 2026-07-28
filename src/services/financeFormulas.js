/**
 * 금융 계산 공식
 * 참고: pro-financecalculator — 클라이언트 단리/원리금·세율 상수, 환율은 /api/rate
 */

export const TAX = {
  normal: 0.154, // 이자소득 15.4%
  reduced: 0.095, // 세금우대 9.5%
  free: 0,
}

export function calcDeposit({ principal, rate, years, taxKey = 'normal' }) {
  const preTax = Math.round(principal * (rate / 100) * years)
  const taxRate = TAX[taxKey] ?? TAX.normal
  const afterTax = Math.round(preTax * (1 - taxRate))
  return { preTax, afterTax, maturity: principal + afterTax, taxRate }
}

export function calcInstallment({ monthly, rate, years, taxKey = 'normal' }) {
  const months = years * 12
  const r = rate / 100 / 12
  let balance = 0
  let preTaxInterest = 0
  for (let i = 0; i < months; i++) {
    balance += monthly
    const interest = balance * r
    preTaxInterest += interest
    balance += interest
  }
  const totalPaid = monthly * months
  const preTax = Math.round(preTaxInterest)
  const taxRate = TAX[taxKey] ?? TAX.normal
  const afterTax = Math.round(preTax * (1 - taxRate))
  return {
    totalPaid,
    preTax,
    afterTax,
    maturity: totalPaid + afterTax,
    taxRate,
  }
}

export function calcLoan({ principal, annualRate, years }) {
  const n = years * 12
  const r = annualRate / 100 / 12
  const equalPayment =
    r === 0 ? principal / n : (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1)
  const firstEqualPrincipal = principal / n + principal * r
  const interestOnly = principal * r
  return {
    equalPayment: Math.round(equalPayment),
    firstEqualPrincipal: Math.round(firstEqualPrincipal),
    interestOnly: Math.round(interestOnly),
  }
}

/** 갱신형 총납 vs 비갱신형 총납 */
export function calcRenewalCompare({ renewMonthly, renewRate, years, fixedMonthly, fixedPayYears }) {
  let m = renewMonthly
  let renewTotal = 0
  for (let y = 0; y < years; y++) {
    renewTotal += m * 12
    m *= 1 + renewRate / 100
  }
  const payY = Math.min(years, fixedPayYears)
  const fixedTotal = fixedMonthly * 12 * payY
  return {
    renewTotal: Math.round(renewTotal),
    fixedTotal: Math.round(fixedTotal),
    diff: Math.round(renewTotal - fixedTotal),
  }
}

/** 실손 갱신 시뮬레이션 (연 인상률 복리) */
export function calcSilsonProjection({ monthly, age, endAge, annualIncrease }) {
  const years = Math.max(0, endAge - age)
  const rows = []
  let m = monthly
  let total = 0
  for (let y = 0; y <= years; y++) {
    const yearPay = m * 12
    total += yearPay
    rows.push({ age: age + y, monthly: Math.round(m), yearPay: Math.round(yearPay), total: Math.round(total) })
    m *= 1 + annualIncrease / 100
  }
  return rows
}

export function calcDollarPremium({ usdMonthly, fxRate, extraUsd = 0 }) {
  const krw = Math.round((usdMonthly + extraUsd) * fxRate)
  return { usd: usdMonthly + extraUsd, krw, fxRate }
}
