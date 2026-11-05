import { FamilyProfile, PaymentTransaction, RegimeComparison, TaxRegimeBreakdown } from '../types/tax';

export interface TaxComputationInput {
  transactions: PaymentTransaction[];
  profile: FamilyProfile;
  financialYear: '2024-25' | '2025-26';
}

export class IndianTaxRulesEngine {
  
  public static calculateTax(input: TaxComputationInput): RegimeComparison {
    const { transactions, profile, financialYear } = input;

    let salaryGross = 0;
    let businessGross = 0;
    let professionalGross = 0;
    let rentalGross = 0;
    let otherSourcesGross = 0;
    let exemptGross = 0;

    let investment80C = 0;
    let nps80CCD1B = 0;
    let healthInsurance80D = 0;
    let homeLoanInterest24b = 0;
    let educationLoan80E = 0;
    let donation80G = 0;
    let savingsInterest = 0;
    let businessExpenses = 0;

    let tdsCredits = 0;
    let advanceTaxPaid = 0;
    let selfAssessmentTaxPaid = 0;

    transactions.forEach(tx => {
      if (tx.isDuplicate) return;

      if (tx.type === 'CREDIT') {
        const taxableAmt = tx.classification.taxableAmount;
        const head = tx.classification.head;

        switch (head) {
          case 'SALARY':
            salaryGross += taxableAmt;
            break;
          case 'PGBP':
            if (tx.classification.deductionSection?.includes('44ADA')) {
              professionalGross += tx.amount;
            } else {
              businessGross += taxableAmt;
            }
            break;
          case 'HOUSE_PROPERTY':
            rentalGross += taxableAmt;
            break;
          case 'OTHER_SOURCES':
            otherSourcesGross += taxableAmt;
            if (tx.classification.deductionSection?.includes('80TTA') || tx.category.includes('Savings')) {
              savingsInterest += tx.amount;
            }
            break;
          case 'EXEMPT_INCOME':
          case 'NON_TAXABLE_TRANSFER':
            exemptGross += tx.amount;
            break;
          default:
            if (tx.classification.status === 'TAXABLE') {
              otherSourcesGross += taxableAmt;
            }
            break;
        }

        if (tx.classification.tdsAmount) {
          tdsCredits += tx.classification.tdsAmount;
        }
      } else if (tx.type === 'DEBIT') {
        const cat = tx.category;
        const dedSection = tx.classification.deductionSection;

        if (cat === 'Tax Saving Investment (80C)' || dedSection === 'Sec 80C') {
          investment80C += tx.amount;
        } else if (cat === 'NPS Investment (80CCD)' || dedSection === 'Sec 80CCD(1B)') {
          nps80CCD1B += tx.amount;
        } else if (cat === 'Health Insurance (80D)' || dedSection === 'Sec 80D') {
          healthInsurance80D += tx.amount;
        } else if (cat === 'Home Loan EMI' || dedSection === 'Sec 24(b) & Sec 80C') {
          homeLoanInterest24b += tx.amount * 0.65;
          investment80C += tx.amount * 0.35;
        } else if (cat === 'Education Loan (80E)' || dedSection === 'Sec 80E') {
          educationLoan80E += tx.amount;
        } else if (cat === 'Charity Donation (80G)' || dedSection === 'Sec 80G') {
          donation80G += tx.amount;
        } else if (cat === 'Business & Professional Expense' || dedSection === 'Sec 37') {
          businessExpenses += tx.amount;
        } else if (cat === 'Advance Tax Payment') {
          advanceTaxPaid += tx.amount;
        } else if (cat === 'Self Assessment Tax') {
          selfAssessmentTaxPaid += tx.amount;
        } else if (cat === 'TDS Payment') {
          tdsCredits += tx.amount;
        }
      }
    });

    const netHousePropertyIncome = Math.max(0, rentalGross * 0.70);
    const netProfessionalIncome44ADA = professionalGross * 0.50;
    const netBusinessIncomeNormal = Math.max(0, businessGross - businessExpenses);
    const totalPGBPIncome = netProfessionalIncome44ADA + netBusinessIncomeNormal;

    const newRegime = this.computeNewRegime({
      salaryGross,
      netHousePropertyIncome,
      totalPGBPIncome,
      otherSourcesGross,
      exemptGross,
      tdsCredits,
      advanceTaxPaid,
      selfAssessmentTaxPaid,
      profile,
      financialYear
    });

    const oldRegime = this.computeOldRegime({
      salaryGross,
      netHousePropertyIncome,
      totalPGBPIncome,
      otherSourcesGross,
      exemptGross,
      investment80C,
      nps80CCD1B,
      healthInsurance80D,
      homeLoanInterest24b,
      educationLoan80E,
      donation80G,
      savingsInterest,
      tdsCredits,
      advanceTaxPaid,
      selfAssessmentTaxPaid,
      profile,
      financialYear
    });

    const diff = oldRegime.totalTaxLiability - newRegime.totalTaxLiability;
    let recommendedRegime: 'NEW' | 'OLD' = 'NEW';
    let taxSavings = 0;
    let explanation = '';
    let formRequired: string | undefined = undefined;

    if (diff > 0) {
      recommendedRegime = 'NEW';
      taxSavings = diff;
      explanation = `The New Tax Regime saves you ₹${Math.round(taxSavings).toLocaleString('en-IN')} over the Old Regime due to lower slab rates, standard deduction of ₹75,000, and full rebate up to ₹7,00,000.`;
    } else if (diff < 0) {
      recommendedRegime = 'OLD';
      taxSavings = Math.abs(diff);
      explanation = `The Old Tax Regime saves you ₹${Math.round(taxSavings).toLocaleString('en-IN')} because your claimed deductions under 80C, 80D, NPS, and Home Loan interest exceed the threshold.`;
      if (profile.employmentType === 'BUSINESS' || profile.hasPresumptiveIncome) {
        formRequired = 'Form 10-IEA must be filed before July 31 to opt for Old Regime with business/profession income.';
      }
    } else {
      recommendedRegime = 'NEW';
      taxSavings = 0;
      explanation = 'Both regimes result in identical tax. The New Tax Regime is recommended for simplicity.';
    }

    return {
      newRegime,
      oldRegime,
      recommendedRegime,
      taxSavings,
      explanation,
      formRequired
    };
  }

  private static computeNewRegime(params: {
    salaryGross: number;
    netHousePropertyIncome: number;
    totalPGBPIncome: number;
    otherSourcesGross: number;
    exemptGross: number;
    tdsCredits: number;
    advanceTaxPaid: number;
    selfAssessmentTaxPaid: number;
    profile: FamilyProfile;
    financialYear: string;
  }): TaxRegimeBreakdown {
    const {
      salaryGross,
      netHousePropertyIncome,
      totalPGBPIncome,
      otherSourcesGross,
      exemptGross,
      tdsCredits,
      advanceTaxPaid,
      selfAssessmentTaxPaid,
      profile
    } = params;

    const grossTotalIncome = salaryGross + netHousePropertyIncome + totalPGBPIncome + otherSourcesGross;

    let standardDeduction = 0;
    if (salaryGross > 0 || profile.employmentType === 'SALARIED' || profile.employmentType === 'SENIOR_CITIZEN_PENSIONER') {
      standardDeduction = Math.min(salaryGross > 0 ? salaryGross : 75000, 75000);
    }

    const netTaxableIncome = Math.max(0, grossTotalIncome - standardDeduction);

    const slabsBreakdown = [];
    let remainingIncome = netTaxableIncome;
    let tax = 0;

    // Slab 1: 0 - 3L (0%)
    const s1 = Math.min(remainingIncome, 300000);
    slabsBreakdown.push({ slab: '₹0 - ₹3,00,000', rate: '0%', taxableInSlab: s1, taxInSlab: 0 });
    remainingIncome = Math.max(0, remainingIncome - 300000);

    // Slab 2: 3L - 7L (5%)
    const s2 = Math.min(remainingIncome, 400000);
    const taxS2 = s2 * 0.05;
    slabsBreakdown.push({ slab: '₹3,00,001 - ₹7,00,000', rate: '5%', taxableInSlab: s2, taxInSlab: taxS2 });
    tax += taxS2;
    remainingIncome = Math.max(0, remainingIncome - 400000);

    // Slab 3: 7L - 10L (10%)
    const s3 = Math.min(remainingIncome, 300000);
    const taxS3 = s3 * 0.10;
    slabsBreakdown.push({ slab: '₹7,00,001 - ₹10,00,000', rate: '10%', taxableInSlab: s3, taxInSlab: taxS3 });
    tax += taxS3;
    remainingIncome = Math.max(0, remainingIncome - 300000);

    // Slab 4: 10L - 12L (15%)
    const s4 = Math.min(remainingIncome, 200000);
    const taxS4 = s4 * 0.15;
    slabsBreakdown.push({ slab: '₹10,00,001 - ₹12,00,000', rate: '15%', taxableInSlab: s4, taxInSlab: taxS4 });
    tax += taxS4;
    remainingIncome = Math.max(0, remainingIncome - 200000);

    // Slab 5: 12L - 15L (20%)
    const s5 = Math.min(remainingIncome, 300000);
    const taxS5 = s5 * 0.20;
    slabsBreakdown.push({ slab: '₹12,00,001 - ₹15,00,000', rate: '20%', taxableInSlab: s5, taxInSlab: taxS5 });
    tax += taxS5;
    remainingIncome = Math.max(0, remainingIncome - 300000);

    // Slab 6: Above 15L (30%)
    const s6 = remainingIncome;
    const taxS6 = s6 * 0.30;
    slabsBreakdown.push({ slab: 'Above ₹15,00,000', rate: '30%', taxableInSlab: s6, taxInSlab: taxS6 });
    tax += taxS6;

    const incomeTaxBeforeRebate = tax;

    let section87ARebate = 0;
    if (netTaxableIncome <= 700000) {
      section87ARebate = incomeTaxBeforeRebate;
    } else {
      const excessIncome = netTaxableIncome - 700000;
      if (incomeTaxBeforeRebate > excessIncome) {
        section87ARebate = incomeTaxBeforeRebate - excessIncome;
      }
    }

    const netIncomeTax = Math.max(0, incomeTaxBeforeRebate - section87ARebate);
    const surcharge = 0;
    const cess = Math.round(netIncomeTax * 0.04);
    const totalTaxLiability = netIncomeTax + cess;

    const totalTaxesPaid = tdsCredits + advanceTaxPaid + selfAssessmentTaxPaid;
    const netTaxPayableOrRefund = totalTaxLiability - totalTaxesPaid;

    return {
      regime: 'NEW',
      grossTotalIncome,
      exemptions: exemptGross,
      standardDeduction,
      chapter6ADeductions: {
        section80C: 0,
        section80CCD1B: 0,
        section80D: 0,
        section80TTA: 0,
        section80E: 0,
        section80G: 0,
        otherDeductions: 0,
        total: 0
      },
      section24bHomeLoanInterest: 0,
      presumptiveDeductions: 0,
      netTaxableIncome,
      incomeTaxBeforeRebate,
      section87ARebate,
      netIncomeTax,
      surcharge,
      cess,
      totalTaxLiability,
      tdsCredits,
      advanceTaxPaid,
      selfAssessmentTaxPaid,
      totalTaxesPaid,
      netTaxPayableOrRefund,
      isRefund: netTaxPayableOrRefund < 0,
      effectiveTaxRate: grossTotalIncome > 0 ? (totalTaxLiability / grossTotalIncome) * 100 : 0,
      slabsBreakdown
    };
  }

  private static computeOldRegime(params: {
    salaryGross: number;
    netHousePropertyIncome: number;
    totalPGBPIncome: number;
    otherSourcesGross: number;
    exemptGross: number;
    investment80C: number;
    nps80CCD1B: number;
    healthInsurance80D: number;
    homeLoanInterest24b: number;
    educationLoan80E: number;
    donation80G: number;
    savingsInterest: number;
    tdsCredits: number;
    advanceTaxPaid: number;
    selfAssessmentTaxPaid: number;
    profile: FamilyProfile;
    financialYear: string;
  }): TaxRegimeBreakdown {
    const {
      salaryGross,
      netHousePropertyIncome,
      totalPGBPIncome,
      otherSourcesGross,
      exemptGross,
      investment80C,
      nps80CCD1B,
      healthInsurance80D,
      homeLoanInterest24b,
      educationLoan80E,
      donation80G,
      savingsInterest,
      tdsCredits,
      advanceTaxPaid,
      selfAssessmentTaxPaid,
      profile
    } = params;

    const grossTotalIncome = salaryGross + netHousePropertyIncome + totalPGBPIncome + otherSourcesGross;

    let standardDeduction = 0;
    if (salaryGross > 0 || profile.employmentType === 'SALARIED' || profile.employmentType === 'SENIOR_CITIZEN_PENSIONER') {
      standardDeduction = Math.min(salaryGross > 0 ? salaryGross : 50000, 50000);
    }

    const allowed24b = Math.min(homeLoanInterest24b, 200000);
    const allowed80C = Math.min(investment80C, 150000);
    const allowed80CCD1B = Math.min(nps80CCD1B, 50000);
    const max80D = profile.age >= 60 ? 50000 : 25000;
    const allowed80D = Math.min(healthInsurance80D, max80D + 25000);
    const allowedSavingsInterest = profile.age >= 60 
      ? Math.min(savingsInterest, 50000)
      : Math.min(savingsInterest, 10000);
    const allowed80E = educationLoan80E;
    const allowed80G = donation80G * 0.50;

    const totalChapter6A = allowed80C + allowed80CCD1B + allowed80D + allowedSavingsInterest + allowed80E + allowed80G;
    const netTaxableIncome = Math.max(0, grossTotalIncome - standardDeduction - allowed24b - totalChapter6A);

    let basicExemption = 250000;
    if (profile.age >= 80) basicExemption = 500000;
    else if (profile.age >= 60) basicExemption = 300000;

    const slabsBreakdown = [];
    let remainingIncome = netTaxableIncome;
    let tax = 0;

    const s1 = Math.min(remainingIncome, basicExemption);
    slabsBreakdown.push({ slab: `₹0 - ₹${(basicExemption / 100000).toFixed(1)}L`, rate: '0%', taxableInSlab: s1, taxInSlab: 0 });
    remainingIncome = Math.max(0, remainingIncome - basicExemption);

    const s2Limit = Math.max(0, 500000 - basicExemption);
    const s2 = Math.min(remainingIncome, s2Limit);
    const taxS2 = s2 * 0.05;
    if (s2Limit > 0) {
      slabsBreakdown.push({ slab: `₹${(basicExemption / 100000).toFixed(1)}L - ₹5,00,000`, rate: '5%', taxableInSlab: s2, taxInSlab: taxS2 });
      tax += taxS2;
      remainingIncome = Math.max(0, remainingIncome - s2Limit);
    }

    const s3 = Math.min(remainingIncome, 500000);
    const taxS3 = s3 * 0.20;
    slabsBreakdown.push({ slab: '₹5,00,001 - ₹10,00,000', rate: '20%', taxableInSlab: s3, taxInSlab: taxS3 });
    tax += taxS3;
    remainingIncome = Math.max(0, remainingIncome - 500000);

    const s4 = remainingIncome;
    const taxS4 = s4 * 0.30;
    slabsBreakdown.push({ slab: 'Above ₹10,00,000', rate: '30%', taxableInSlab: s4, taxInSlab: taxS4 });
    tax += taxS4;

    const incomeTaxBeforeRebate = tax;

    let section87ARebate = 0;
    if (netTaxableIncome <= 500000) {
      section87ARebate = Math.min(incomeTaxBeforeRebate, 12500);
    }

    const netIncomeTax = Math.max(0, incomeTaxBeforeRebate - section87ARebate);
    const surcharge = 0;
    const cess = Math.round(netIncomeTax * 0.04);
    const totalTaxLiability = netIncomeTax + cess;

    const totalTaxesPaid = tdsCredits + advanceTaxPaid + selfAssessmentTaxPaid;
    const netTaxPayableOrRefund = totalTaxLiability - totalTaxesPaid;

    return {
      regime: 'OLD',
      grossTotalIncome,
      exemptions: exemptGross,
      standardDeduction,
      chapter6ADeductions: {
        section80C: allowed80C,
        section80CCD1B: allowed80CCD1B,
        section80D: allowed80D,
        section80TTA: allowedSavingsInterest,
        section80E: allowed80E,
        section80G: allowed80G,
        otherDeductions: 0,
        total: totalChapter6A
      },
      section24bHomeLoanInterest: allowed24b,
      presumptiveDeductions: 0,
      netTaxableIncome,
      incomeTaxBeforeRebate,
      section87ARebate,
      netIncomeTax,
      surcharge,
      cess,
      totalTaxLiability,
      tdsCredits,
      advanceTaxPaid,
      selfAssessmentTaxPaid,
      totalTaxesPaid,
      netTaxPayableOrRefund,
      isRefund: netTaxPayableOrRefund < 0,
      effectiveTaxRate: grossTotalIncome > 0 ? (totalTaxLiability / grossTotalIncome) * 100 : 0,
      slabsBreakdown
    };
  }
}

