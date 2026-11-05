import { AnomalyItem, PaymentLocation, PaymentTransaction, TaxClassification, TransactionType } from '../types/tax';

export interface ClassificationRuleResult {
  category: string;
  classification: TaxClassification;
  party?: string;
  partyRelationship?: 'EMPLOYER' | 'CLIENT' | 'RELATIVE' | 'NON_RELATIVE' | 'BANK' | 'GOVERNMENT' | 'MERCHANT' | 'SELF';
  suggestedTags?: string[];
  isFixedCommitment?: boolean;
  budgetCategory?: 'FIXED_COMMITMENT' | 'DISCRETIONARY' | 'SAVINGS_INVESTMENT' | 'INCOME';
}

export class TransactionIntelligenceEngine {

  public static analyze(
    rawNarration: string,
    amount: number,
    type: TransactionType,
    existingPartyRelationship?: 'EMPLOYER' | 'CLIENT' | 'RELATIVE' | 'NON_RELATIVE' | 'BANK' | 'GOVERNMENT' | 'MERCHANT' | 'SELF',
    recipientName?: string
  ): ClassificationRuleResult {
    const text = (rawNarration + ' ' + (recipientName || '')).toUpperCase();

    if (type === 'CREDIT') {
      return this.analyzeCredit(text, amount, existingPartyRelationship);
    } else {
      return this.analyzeDebit(text, amount);
    }
  }

  private static analyzeCredit(
    text: string,
    amount: number,
    partyRelationship?: string
  ): ClassificationRuleResult {
    // 1. Salary
    if (text.includes('SALARY') || text.includes('PAYROLL') || text.includes('INFOSYS') || text.includes('TCS') || text.includes('WIPRO') || text.includes('STIPEND')) {
      const estimatedTds = amount > 50000 ? Math.round(amount * 0.10) : 0;
      return {
        category: 'Salary Received',
        party: this.extractParty(text, ['INFOSYS', 'TCS', 'WIPRO', 'TECH MAHINDRA', 'GOOGLE', 'MICROSOFT']) || 'Employer',
        partyRelationship: 'EMPLOYER',
        budgetCategory: 'INCOME',
        suggestedTags: ['Salary', 'Employment', 'Sec 192'],
        classification: {
          status: 'TAXABLE',
          head: 'SALARY',
          deductionSection: 'Sec 16(ia) Standard Deduction',
          taxablePercentage: 100,
          taxableAmount: amount,
          deductibleAmount: 0,
          tdsAmount: estimatedTds,
          legalBasis: 'Taxable under Section 15 of Income Tax Act 1961 as Income from Salaries. Eligible for standard deduction of ₹75,000 (New Regime) under Section 16(ia).',
          confidenceScore: 98,
          aiExplanation: `This ₹${amount.toLocaleString('en-IN')} credit is employment salary. You receive an automatic ₹75,000 Standard Deduction under the New Tax Regime.`
        }
      };
    }

    // 2. Freelancing / Consulting (44ADA)
    if (text.includes('FREELANCE') || text.includes('UPWORK') || text.includes('FIVERR') || text.includes('CONSULTING') || text.includes('INVOICE') || text.includes('DESIGN FEE')) {
      const taxableProfit = amount * 0.50;
      const probableTds = text.includes('TDS') || amount >= 30000 ? Math.round(amount * 0.10) : 0;
      return {
        category: 'Freelance & Professional Income',
        party: 'Client / Platform',
        partyRelationship: 'CLIENT',
        budgetCategory: 'INCOME',
        suggestedTags: ['Freelance', 'Presumptive', 'Sec 44ADA', 'Sec 194J'],
        classification: {
          status: 'PARTIALLY_TAXABLE',
          head: 'PGBP',
          deductionSection: 'Sec 44ADA (50% Presumptive Profit)',
          taxablePercentage: 50,
          taxableAmount: taxableProfit,
          deductibleAmount: amount * 0.50,
          tdsAmount: probableTds,
          legalBasis: 'Under Section 44ADA, professionals with gross receipts up to ₹75 Lakhs declare only 50% as taxable deemed profit without accounting books.',
          confidenceScore: 94,
          aiExplanation: `Super tax-saver! Under Section 44ADA, only 50% (₹${taxableProfit.toLocaleString('en-IN')}) is taxable. The other 50% is treated as allowable expense.`
        }
      };
    }

    // 3. Rental Income
    if (text.includes('RENT') || text.includes('TENANT') || text.includes('FLAT RENT')) {
      const deduction30 = amount * 0.30;
      const netRent = amount - deduction30;
      return {
        category: 'Rental Income',
        party: 'Tenant',
        partyRelationship: 'NON_RELATIVE',
        budgetCategory: 'INCOME',
        suggestedTags: ['Rental', 'House Property', 'Sec 24(a)'],
        classification: {
          status: 'PARTIALLY_TAXABLE',
          head: 'HOUSE_PROPERTY',
          deductionSection: 'Sec 24(a) 30% Statutory Deduction',
          taxablePercentage: 70,
          taxableAmount: netRent,
          deductibleAmount: deduction30,
          legalBasis: 'Section 24(a) provides a statutory deduction of 30% of Net Annual Value for repairs and maintenance.',
          confidenceScore: 92,
          aiExplanation: `Rental income received is classified under House Property. You get an automatic 30% flat deduction (₹${deduction30.toLocaleString('en-IN')}) u/s 24(a).`
        }
      };
    }

    // 4. Interest
    if (text.includes('INT.PD') || text.includes('INTEREST') || text.includes('FD INT')) {
      const isFD = text.includes('FD') || text.includes('TERM');
      return {
        category: isFD ? 'Fixed Deposit Interest' : 'Savings Bank Interest',
        party: 'Bank',
        partyRelationship: 'BANK',
        budgetCategory: 'INCOME',
        suggestedTags: isFD ? ['Interest', 'FD', '194A'] : ['Savings Interest', '80TTA'],
        classification: {
          status: isFD ? 'TAXABLE' : 'PARTIALLY_TAXABLE',
          head: 'OTHER_SOURCES',
          deductionSection: isFD ? 'Sec 56' : 'Sec 80TTA',
          taxablePercentage: isFD ? 100 : (amount > 10000 ? 100 : 0),
          taxableAmount: isFD ? amount : Math.max(0, amount - 10000),
          deductibleAmount: isFD ? 0 : Math.min(amount, 10000),
          legalBasis: isFD ? 'FD interest is fully taxable under Income from Other Sources.' : 'Savings interest exempt up to ₹10,000 u/s 80TTA in Old Regime.',
          confidenceScore: 95,
          aiExplanation: isFD ? 'FD interest is taxable at your income tax slab rate.' : 'Savings bank interest is tax-free up to ₹10,000 under Section 80TTA.'
        }
      };
    }

    // 5. Gifts & Family Transfers
    if (text.includes('GIFT') || text.includes('PAPA') || text.includes('MOM') || text.includes('FATHER') || text.includes('BROTHER') || text.includes('FAMILY')) {
      return {
        category: 'Gift from Relative',
        party: 'Relative',
        partyRelationship: 'RELATIVE',
        budgetCategory: 'INCOME',
        suggestedTags: ['Gift', 'Relative', 'Sec 56(2)(x) Exempt'],
        classification: {
          status: 'NON_TAXABLE',
          head: 'EXEMPT_INCOME',
          deductionSection: 'Sec 56(2)(x) Proviso',
          taxablePercentage: 0,
          taxableAmount: 0,
          deductibleAmount: 0,
          legalBasis: 'Under proviso to Section 56(2)(x), money received from defined relatives is 100% tax-free without ceiling.',
          confidenceScore: 99,
          aiExplanation: 'Tax-free transfer! Gifts or funds received from defined relatives are 100% tax-exempt.'
        }
      };
    }

    // Default Credit
    return {
      category: 'General Credit Receipt',
      party: 'Counterparty',
      partyRelationship: 'NON_RELATIVE',
      budgetCategory: 'INCOME',
      suggestedTags: ['Credit'],
      classification: {
        status: amount > 50000 ? 'NEEDS_VERIFICATION' : 'NON_TAXABLE',
        head: 'OTHER_SOURCES',
        deductionSection: 'General Receipt',
        taxablePercentage: 0,
        taxableAmount: 0,
        deductibleAmount: 0,
        legalBasis: 'General incoming credit.',
        confidenceScore: 70,
        aiExplanation: 'Incoming payment received in your account.'
      }
    };
  }

  private static analyzeDebit(text: string, amount: number): ClassificationRuleResult {
    // 1. Home Loan EMI (Fixed commitment & twin tax benefit)
    if (text.includes('HOME LOAN') || text.includes('HOUSING LOAN') || text.includes('SBI HOME') || text.includes('HDFC HOME') || text.includes('LIC HFL')) {
      return {
        category: 'Home Loan EMI',
        party: 'Housing Finance Bank',
        partyRelationship: 'BANK',
        isFixedCommitment: true,
        budgetCategory: 'FIXED_COMMITMENT',
        suggestedTags: ['Home Loan', 'Sec 24(b)', 'Sec 80C', 'Locked EMI'],
        classification: {
          status: 'TAX_DEDUCTIBLE',
          deductionSection: 'Sec 24(b) & Sec 80C',
          taxablePercentage: 0,
          taxableAmount: 0,
          deductibleAmount: amount,
          legalBasis: 'Interest portion deductible u/s 24(b) up to ₹2,00,000; Principal deductible u/s 80C up to ₹1,50,000.',
          confidenceScore: 95,
          aiExplanation: `Essential locked commitment. Twin tax benefit: Interest reduces taxable income u/s 24(b), and principal qualifies u/s 80C.`
        }
      };
    }

    // 2. House Rent (Fixed commitment)
    if (text.includes('HOUSE RENT') || text.includes('FLAT RENT') || text.includes('LANDLORD') || text.includes('NOBROKER')) {
      return {
        category: 'House Rent',
        party: 'Landlord',
        partyRelationship: 'NON_RELATIVE',
        isFixedCommitment: true,
        budgetCategory: 'FIXED_COMMITMENT',
        suggestedTags: ['Rent', 'HRA', 'Locked Commitment'],
        classification: {
          status: 'TAX_DEDUCTIBLE',
          deductionSection: 'Sec 10(13A) HRA / Sec 80GG',
          taxablePercentage: 0,
          taxableAmount: 0,
          deductibleAmount: amount,
          legalBasis: 'House rent qualifies for HRA exemption u/s 10(13A) or deduction u/s 80GG up to ₹60,000/yr.',
          confidenceScore: 92,
          aiExplanation: `Locked monthly fixed cost. Rent paid is eligible for HRA exemption under Section 10(13A) in Old Regime.`
        }
      };
    }

    // 3. School / College Tuition Fees (Fixed commitment)
    if (text.includes('SCHOOL') || text.includes('COLLEGE') || text.includes('TUITION') || text.includes('KIDZEE') || text.includes('DPS')) {
      return {
        category: 'Education & Tuition Fee',
        party: 'Educational Institution',
        partyRelationship: 'MERCHANT',
        isFixedCommitment: true,
        budgetCategory: 'FIXED_COMMITMENT',
        suggestedTags: ['Tuition Fee', '80C', 'Locked Fee'],
        classification: {
          status: 'TAX_DEDUCTIBLE',
          deductionSection: 'Sec 80C',
          taxablePercentage: 0,
          taxableAmount: 0,
          deductibleAmount: Math.min(amount, 150000),
          legalBasis: 'Full-time education tuition fees for up to 2 children are eligible for deduction u/s 80C.',
          confidenceScore: 94,
          aiExplanation: `Locked education commitment. Children's school tuition fee is tax-deductible under Section 80C.`
        }
      };
    }

    // 4. Utility Bills (Electricity, Water, Gas, Broadband - Fixed commitment)
    if (text.includes('ELECTRICITY') || text.includes('BESCOM') || text.includes('TATA POWER') || text.includes('MSEDCL') || text.includes('WATER') || text.includes('GAS') || text.includes('BROADBAND') || text.includes('JIO FIBER') || text.includes('AIRTEL BROADBAND')) {
      return {
        category: 'Utility & Bills',
        party: 'Utility Provider',
        partyRelationship: 'MERCHANT',
        isFixedCommitment: true,
        budgetCategory: 'FIXED_COMMITMENT',
        suggestedTags: ['Utility Bill', 'Locked Bill'],
        classification: {
          status: 'NON_TAXABLE',
          deductionSection: 'Household Essential',
          taxablePercentage: 0,
          taxableAmount: 0,
          deductibleAmount: 0,
          legalBasis: 'Essential household utility bill.',
          confidenceScore: 96,
          aiExplanation: `Essential locked household expense. Protected inside your Fixed Commitment Vault.`
        }
      };
    }

    // 5. Investments (ELSS, Mutual Fund SIP, PPF)
    if (text.includes('MUTUAL FUND') || text.includes('SIP') || text.includes('ELSS') || text.includes('PPF') || text.includes('ZERODHA') || text.includes('GROWW')) {
      return {
        category: 'Tax Saving Investment (80C)',
        party: 'Asset Management Company',
        partyRelationship: 'MERCHANT',
        isFixedCommitment: false,
        budgetCategory: 'SAVINGS_INVESTMENT',
        suggestedTags: ['80C', 'SIP', 'ELSS', 'Wealth'],
        classification: {
          status: 'TAX_DEDUCTIBLE',
          deductionSection: 'Sec 80C',
          taxablePercentage: 0,
          taxableAmount: 0,
          deductibleAmount: Math.min(amount, 150000),
          legalBasis: 'Eligible for deduction under Section 80C up to ₹1,50,000.',
          confidenceScore: 96,
          aiExplanation: `Smart wealth builder! ELSS mutual fund investment qualifies for Section 80C tax deduction.`
        }
      };
    }

    // 6. NPS (80CCD)
    if (text.includes('NPS') || text.includes('PFRDA') || text.includes('NATIONAL PENSION')) {
      return {
        category: 'NPS Investment (80CCD)',
        party: 'National Pension System',
        partyRelationship: 'MERCHANT',
        isFixedCommitment: false,
        budgetCategory: 'SAVINGS_INVESTMENT',
        suggestedTags: ['80CCD(1B)', 'NPS', 'Extra 50k'],
        classification: {
          status: 'TAX_DEDUCTIBLE',
          deductionSection: 'Sec 80CCD(1B)',
          taxablePercentage: 0,
          taxableAmount: 0,
          deductibleAmount: Math.min(amount, 50000),
          legalBasis: 'Exclusive extra deduction up to ₹50,000 under Section 80CCD(1B).',
          confidenceScore: 98,
          aiExplanation: `Exclusive ₹50,000 deduction under Section 80CCD(1B) beyond Section 80C.`
        }
      };
    }

    // 7. Health Insurance (80D)
    if (text.includes('HEALTH') || text.includes('MEDICLAIM') || text.includes('STAR HEALTH') || text.includes('CARE HEALTH') || text.includes('HDFC ERGO')) {
      return {
        category: 'Health Insurance (80D)',
        party: 'Insurance Company',
        partyRelationship: 'MERCHANT',
        isFixedCommitment: true,
        budgetCategory: 'FIXED_COMMITMENT',
        suggestedTags: ['80D', 'Insurance', 'Mediclaim'],
        classification: {
          status: 'TAX_DEDUCTIBLE',
          deductionSection: 'Sec 80D',
          taxablePercentage: 0,
          taxableAmount: 0,
          deductibleAmount: amount,
          legalBasis: 'Deductible under Section 80D up to ₹25,000 for self/family and ₹50,000 for senior parents.',
          confidenceScore: 96,
          aiExplanation: `Health insurance premium qualifies for deduction under Section 80D.`
        }
      };
    }

    // 8. Discretionary Spends (Groceries, Dining, Shopping, Fuel, Entertainment)
    return {
      category: 'Lifestyle & Discretionary',
      party: this.extractParty(text, ['STARBUCKS', 'SWIGGY', 'ZOMATO', 'AMAZON', 'FLIPKART', 'BLINKIT', 'ZEPTO', 'SHELL', 'PVR']) || 'Merchant',
      partyRelationship: 'MERCHANT',
      isFixedCommitment: false,
      budgetCategory: 'DISCRETIONARY',
      suggestedTags: ['Discretionary', 'Lifestyle'],
      classification: {
        status: 'NON_TAXABLE',
        deductionSection: 'Personal Expenditure',
        taxablePercentage: 0,
        taxableAmount: 0,
        deductibleAmount: 0,
        legalBasis: 'Personal, living, or family expenditure is non-deductible under Section 37.',
        confidenceScore: 98,
        aiExplanation: `Discretionary lifestyle spending. Counted towards your monthly flexible spending allowance.`
      }
    };
  }

  public static detectDuplicates(transactions: PaymentTransaction[]): PaymentTransaction[] {
    const updated = [...transactions];
    for (let i = 0; i < updated.length; i++) {
      for (let j = i + 1; j < updated.length; j++) {
        const tx1 = updated[i];
        const tx2 = updated[j];

        if (tx1.amount === tx2.amount && tx1.type === tx2.type) {
          const d1 = new Date(tx1.date).getTime();
          const d2 = new Date(tx2.date).getTime();
          const dayDiff = Math.abs(d1 - d2) / (1000 * 3600 * 24);

          if (dayDiff <= 2) {
            const s1 = tx1.rawNarration.toLowerCase().replace(/[^a-z0-9]/g, '');
            const s2 = tx2.rawNarration.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (s1 === s2 || s1.includes(s2) || s2.includes(s1)) {
              updated[j] = {
                ...tx2,
                isDuplicate: true,
                duplicateOfId: tx1.id
              };
            }
          }
        }
      }
    }
    return updated;
  }

  public static detectAnomalies(transactions: PaymentTransaction[]): AnomalyItem[] {
    const anomalies: AnomalyItem[] = [];
    let totalCashDeposits = 0;

    transactions.forEach(tx => {
      const narr = tx.rawNarration.toUpperCase();
      if (tx.type === 'CREDIT' && (narr.includes('CASH DEP') || narr.includes('CDM') || narr.includes('BY CASH'))) {
        totalCashDeposits += tx.amount;
        if (tx.amount >= 200000) {
          anomalies.push({
            id: `anom-cash-${tx.id}`,
            transactionId: tx.id,
            title: 'High-Value Cash Deposit Alert',
            severity: 'HIGH',
            category: 'CASH_LIMIT',
            description: `Cash deposit of ₹${tx.amount.toLocaleString('en-IN')} exceeds Section 269ST threshold.`,
            recommendation: 'Maintain documentary proof of cash source to answer any AIS verification query.',
            taxSection: 'Section 269ST / SFT Rule 114E',
            resolved: false
          });
        }
      }

      if (tx.type === 'CREDIT' && tx.partyRelationship === 'NON_RELATIVE' && tx.amount > 50000 && !narr.includes('SALARY') && !narr.includes('INVOICE')) {
        anomalies.push({
          id: `anom-gift-${tx.id}`,
          transactionId: tx.id,
          title: 'Unexplained Credit Exceeding ₹50,000',
          severity: 'HIGH',
          category: 'GIFT_TAX',
          description: `Credit of ₹${tx.amount.toLocaleString('en-IN')} from third party exceeds Section 56(2)(x) limit.`,
          recommendation: 'Verify if this is an expense reimbursement, loan return, or wedding gift; otherwise fully taxable.',
          taxSection: 'Section 56(2)(x)',
          resolved: false
        });
      }

      if (tx.isDuplicate) {
        anomalies.push({
          id: `anom-dup-${tx.id}`,
          transactionId: tx.id,
          title: 'Potential Duplicate Payment',
          severity: 'MEDIUM',
          category: 'DUPLICATE',
          description: `Payment of ₹${tx.amount.toLocaleString('en-IN')} on ${tx.date} appears identical to a previous entry.`,
          recommendation: 'Verify and remove duplicate to keep budget and tax records accurate.',
          taxSection: 'Payment Accuracy',
          resolved: false
        });
      }
    });

    if (totalCashDeposits >= 1000000) {
      anomalies.push({
        id: 'anom-sft-cash-10l',
        title: 'Annual Cash Deposit SFT Threshold Breached',
        severity: 'HIGH',
        category: 'HIGH_VALUE_SFT',
        description: `Aggregate cash deposits exceed ₹10,00,000 (Current: ₹${totalCashDeposits.toLocaleString('en-IN')}).`,
        recommendation: 'Bank reports this to IT Department via SFT. Be prepared with fund sources when filing ITR.',
        taxSection: 'Section 285BA / Rule 114E',
        resolved: false
      });
    }

    return anomalies;
  }

  private static extractParty(narr: string, keywords: string[]): string | undefined {
    for (const kw of keywords) {
      if (narr.includes(kw)) {
        return kw;
      }
    }
    return undefined;
  }
}

