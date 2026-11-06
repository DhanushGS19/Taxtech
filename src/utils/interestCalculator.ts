/**
 * Indian P2P Lending & Commercial Interest Calculator Engine
 * Supports:
 * - Simple Interest (SI = P * R * T / 100)
 * - Compound Interest (CI = P * (1 + r/n)^(nt) - P)
 * - Annual Rate (% p.a.) & Monthly Informal Indian Rate (% p.m. / ₹ per ₹100 per month)
 * - Exact Day Counts & Tenure in Months/Days
 */

export interface InterestCalculationParams {
  principal: number;
  rate: number; // e.g. 12 (for 12% p.a.) or 2 (for 2% p.m.)
  period: 'ANNUAL' | 'MONTHLY';
  type: 'SIMPLE' | 'COMPOUND';
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  durationDays?: number;
  durationMonths?: number;
}

export interface InterestCalculationResult {
  principal: number;
  rate: number;
  period: 'ANNUAL' | 'MONTHLY';
  type: 'SIMPLE' | 'COMPOUND';
  effectiveDays: number;
  effectiveMonths: number;
  effectiveYears: number;
  accruedInterest: number;
  totalMaturityAmount: number;
  monthlyInterest: number;
  dailyInterest: number;
  annualEquivalentRate: number;
}

export function calculateLoanInterest(params: InterestCalculationParams): InterestCalculationResult {
  const { principal, rate, period, type, startDate, endDate, durationDays, durationMonths } = params;

  if (principal <= 0 || rate < 0) {
    return {
      principal: Math.max(0, principal),
      rate,
      period,
      type,
      effectiveDays: 0,
      effectiveMonths: 0,
      effectiveYears: 0,
      accruedInterest: 0,
      totalMaturityAmount: Math.max(0, principal),
      monthlyInterest: 0,
      dailyInterest: 0,
      annualEquivalentRate: period === 'MONTHLY' ? rate * 12 : rate
    };
  }

  // Determine elapsed days
  let days = 0;
  if (startDate && endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffTime = Math.max(0, end - start);
    days = Math.round(diffTime / (1000 * 60 * 60 * 24));
  } else if (durationDays !== undefined && durationDays > 0) {
    days = durationDays;
  } else if (durationMonths !== undefined && durationMonths > 0) {
    days = Math.round(durationMonths * 30.4375);
  }

  const effectiveMonths = Number((days / 30.4375).toFixed(2));
  const effectiveYears = Number((days / 365.25).toFixed(2));

  // Annual equivalent %
  const annualEquivalentRate = period === 'MONTHLY' ? rate * 12 : rate;

  let accruedInterest = 0;

  if (rate === 0) {
    accruedInterest = 0;
  } else if (type === 'SIMPLE') {
    if (period === 'MONTHLY') {
      // Monthly simple interest: Principal * (Rate/100) * (Days / 30.4375)
      accruedInterest = principal * (rate / 100) * (days / 30.4375);
    } else {
      // Annual simple interest: Principal * (Rate/100) * (Days / 365)
      accruedInterest = principal * (rate / 100) * (days / 365);
    }
  } else {
    // COMPOUND INTEREST
    if (period === 'MONTHLY') {
      // Compounded monthly
      const months = days / 30.4375;
      const totalAmount = principal * Math.pow(1 + rate / 100, months);
      accruedInterest = totalAmount - principal;
    } else {
      // Compounded annually
      const years = days / 365.25;
      const totalAmount = principal * Math.pow(1 + rate / 100, years);
      accruedInterest = totalAmount - principal;
    }
  }

  accruedInterest = Math.max(0, Math.round(accruedInterest));
  const totalMaturityAmount = Math.round(principal + accruedInterest);

  const monthlyInterest = days > 0 ? Math.round((accruedInterest / days) * 30.4375) : Math.round((principal * (annualEquivalentRate / 100)) / 12);
  const dailyInterest = days > 0 ? Math.round(accruedInterest / days) : Math.round(monthlyInterest / 30);

  return {
    principal,
    rate,
    period,
    type,
    effectiveDays: days,
    effectiveMonths,
    effectiveYears,
    accruedInterest,
    totalMaturityAmount,
    monthlyInterest,
    dailyInterest,
    annualEquivalentRate
  };
}

/**
 * Generate a professional WhatsApp reminder message for money lent / given
 */
export function generateWhatsAppReminder(record: {
  personName: string;
  principalAmount: number;
  accruedInterest: number;
  totalMaturityAmount: number;
  rate: number;
  period: 'ANNUAL' | 'MONTHLY';
  startDate: string;
  dueDate?: string;
  upiId?: string;
}): string {
  const isInterestBearing = record.rate > 0;
  const rateText = isInterestBearing
    ? `${record.rate}% ${record.period === 'MONTHLY' ? 'p.m.' : 'p.a.'}`
    : 'Interest-free';

  const upiLine = record.upiId ? `\n💳 *Direct UPI Payment Link:* upi://pay?pa=${record.upiId}&pn=TechPaySettlement&am=${record.totalMaturityAmount}` : '';

  return `Namaste ${record.personName}, 

Hope you are doing well. This is a gentle friendly reminder regarding the friendly loan of *₹${record.principalAmount.toLocaleString('en-IN')}* initiated on *${record.startDate}*.

📊 *Loan Summary (via TechPay)*:
• Principal Amount: ₹${record.principalAmount.toLocaleString('en-IN')}
${isInterestBearing ? `• Agreed Interest Rate: ${rateText}\n• Accrued Interest: ₹${record.accruedInterest.toLocaleString('en-IN')}` : ''}
• *Total Payable Amount:* *₹${record.totalMaturityAmount.toLocaleString('en-IN')}*
${record.dueDate ? `• Target Due Date: ${record.dueDate}` : ''}
${upiLine}

Kindly let me know once settled. Thank you!`;
}
