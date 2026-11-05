import { AnomalyItem, FamilyProfile, FixedCommitment, PaymentTransaction, RegimeComparison } from '../types/tax';

export interface CaContext {
  profile: FamilyProfile;
  transactions: PaymentTransaction[];
  taxCalculation: RegimeComparison;
  anomalies: AnomalyItem[];
  commitments: FixedCommitment[];
  monthlyIncome: number;
  financialYear: '2024-25' | '2025-26';
  language: 'EN' | 'HINGLISH';
}

export class AIPersonalCAEngine {

  public static answerQuestion(query: string, context: CaContext): {
    response: string;
    citations: string[];
    suggestedActions?: { label: string; actionType: string; payload?: any }[];
  } {
    const q = query.toLowerCase().trim();
    const { profile, transactions, taxCalculation, anomalies, commitments, monthlyIncome, language, financialYear } = context;
    const isHinglish = language === 'HINGLISH';

    const currentRegime = profile.defaultRegime === 'OLD' ? taxCalculation.oldRegime : taxCalculation.newRegime;
    const grossIncome = currentRegime.grossTotalIncome;
    const taxPayable = currentRegime.netTaxPayableOrRefund;
    const totalTaxPaid = currentRegime.totalTaxesPaid;
    const totalLiability = currentRegime.totalTaxLiability;
    const recommended = taxCalculation.recommendedRegime;
    const savings = taxCalculation.taxSavings;

    // Fixed commitment totals
    const totalLockedCommitment = commitments.reduce((acc, c) => acc + c.allocatedAmount, 0);
    const unpaidLockedCommitment = commitments.filter(c => !c.isPaidThisMonth).reduce((acc, c) => acc + c.allocatedAmount, 0);
    const safeDiscretionaryBudget = Math.max(0, monthlyIncome - totalLockedCommitment);

    // 1. Budget & Overspending check queries
    if (q.includes('spend') || q.includes('budget') || q.includes('afford') || q.includes('can i buy') || q.includes('kharcha') || q.includes('locked')) {
      return {
        response: isHinglish
          ? `Aapka monthly income **₹${monthlyIncome.toLocaleString('en-IN')}** hai. Inme se **₹${totalLockedCommitment.toLocaleString('en-IN')}** aapke mandatory commitments (EMI, Rent, School Fees, Bills) ke liye **Vault me LOCKED** hain!\n\n` +
            `• **Unpaid Pending Bills & EMI:** ₹${unpaidLockedCommitment.toLocaleString('en-IN')}\n` +
            `• **Safe Free Spending Allowance:** ₹${safeDiscretionaryBudget.toLocaleString('en-IN')}\n\n` +
            `💡 CA Saathi Tip: Agar aap koi bada discretionary spend kar rahe hain, dhyan rakhein ki aapka ₹${unpaidLockedCommitment.toLocaleString('en-IN')} ka locked commitment buffer disturb na ho!`
          : `Your monthly income is **₹${monthlyIncome.toLocaleString('en-IN')}**. Out of this, **₹${totalLockedCommitment.toLocaleString('en-IN')}** is **LOCKED in your Commitment Vault** for mandatory obligations (Home Loan EMI, Rent, School Fees & Bills).\n\n` +
            `• **Pending Unpaid Commitments:** ₹${unpaidLockedCommitment.toLocaleString('en-IN')}\n` +
            `• **Safe Discretionary Allowance:** ₹${safeDiscretionaryBudget.toLocaleString('en-IN')}\n\n` +
            `💡 Guardrail: Ensure any new lifestyle spend does not breach your ₹${unpaidLockedCommitment.toLocaleString('en-IN')} locked obligations buffer!`,
        citations: ['50-30-20 Smart Financial Rule', 'Fixed Obligation Vault Rule'],
        suggestedActions: [
          { label: 'View Fixed Vault', actionType: 'NAVIGATE_BUDGET' },
          { label: 'Pay via UPI', actionType: 'OPEN_PAY' }
        ]
      };
    }

    // 2. Tax Payable / Liability
    if (q.includes('how much tax') || q.includes('tax to pay') || q.includes('tax liability') || q.includes('kitna tax') || q.includes('tax dena hai')) {
      if (currentRegime.isRefund) {
        const refundAmt = Math.abs(taxPayable);
        return {
          response: isHinglish
            ? `Bohot badiya khabar hai, ${profile.name}! Aapko koi tax nahi dena hai. Ulta income tax department se **₹${refundAmt.toLocaleString('en-IN')}** ka Tax Refund milne wala hai, kyunki aapka TDS (₹${totalTaxPaid.toLocaleString('en-IN')}) actual tax liability (₹${totalLiability.toLocaleString('en-IN')}) se zyada jama hua tha!`
            : `Great news, ${profile.name}! You do not owe any tax. In fact, you have an estimated **Tax Refund of ₹${refundAmt.toLocaleString('en-IN')}** due from the Income Tax Department, because your verified TDS credits (₹${totalTaxPaid.toLocaleString('en-IN')}) exceed your calculated liability (₹${totalLiability.toLocaleString('en-IN')}).`,
          citations: ['Section 237 (Refunds)', 'Section 244A (Interest on Refund)'],
          suggestedActions: [
            { label: 'View Tax Breakdown', actionType: 'NAVIGATE_TAX' },
            { label: 'Download ITR Summary', actionType: 'OPEN_REPORT' }
          ]
        };
      } else if (taxPayable === 0) {
        return {
          response: isHinglish
            ? `Aapka net tax liability **₹0 (Zero)** hai! Standard deduction aur Section 87A rebate ki badaulat aapka poora tax wipe out ho gaya hai. Bas time par ITR file karna zaroori hai.`
            : `Your estimated net tax payable is **₹0**! Thanks to the ₹75,000 standard deduction and Section 87A full rebate up to ₹7,00,000, your entire tax liability is eliminated.`,
          citations: ['Section 87A Rebate', 'Section 115BAC'],
          suggestedActions: [
            { label: 'Check ITR Deadlines', actionType: 'NAVIGATE_TAX' }
          ]
        };
      } else {
        return {
          response: isHinglish
            ? `Aapka FY ${financialYear} ka total tax liability **₹${totalLiability.toLocaleString('en-IN')}** hai. Aap already **₹${totalTaxPaid.toLocaleString('en-IN')}** (TDS/Advance Tax) pay kar chuke hain, isliye remaining **₹${taxPayable.toLocaleString('en-IN')}** payable hai.\n\n💡 CA Advice: ${recommended} Regime choose karke aap **₹${savings.toLocaleString('en-IN')}** bacha sakte hain!`
            : `For FY ${financialYear}, your total computed tax is **₹${totalLiability.toLocaleString('en-IN')}**. You have already paid **₹${totalTaxPaid.toLocaleString('en-IN')}** via TDS credits. Your remaining net tax due is **₹${taxPayable.toLocaleString('en-IN')}**.\n\n💡 Recommendation: Under the **${recommended} Tax Regime**, you can save **₹${savings.toLocaleString('en-IN')}**!`,
          citations: ['Section 115BAC', 'Section 208 (Advance Tax)'],
          suggestedActions: [
            { label: 'Compare Regimes', actionType: 'NAVIGATE_TAX' },
            { label: 'Pay Advance Tax', actionType: 'OPEN_PAY' }
          ]
        };
      }
    }

    // 3. Earnings & Income Breakdown
    if (q.includes('earn') || q.includes('total income') || q.includes('kamaya') || q.includes('earnings')) {
      return {
        response: isHinglish
          ? `Aapne is financial year me ab tak total **₹${grossIncome.toLocaleString('en-IN')}** earn kiya hai (Gross Total Income).\n\nInme se taxable income approx **₹${currentRegime.netTaxableIncome.toLocaleString('en-IN')}** hai (standard deductions aur permissible rebates ke baad).`
          : `Based on your analyzed financial ledger for FY ${financialYear}, your Total Gross Income is **₹${grossIncome.toLocaleString('en-IN')}**.\n\nAfter applying permissible deductions (₹${(grossIncome - currentRegime.netTaxableIncome).toLocaleString('en-IN')}), your Net Taxable Income stands at **₹${currentRegime.netTaxableIncome.toLocaleString('en-IN')}**.`,
        citations: ['Section 14 (Heads of Income)', 'Section 16(ia)'],
        suggestedActions: [
          { label: 'View Income Breakdown', actionType: 'NAVIGATE_TAX' }
        ]
      };
    }

    // 4. Taxable vs Non-Taxable Transactions
    if (q.includes('taxable') || q.includes('which transactions') || q.includes('kaunsa tax')) {
      return {
        response: isHinglish
          ? `Aapke incoming transactions ka breakdown:\n\n` +
            `• **100% Taxable:** Salary credits (Section 15) aur FD interest.\n` +
            `• **50% Tax-Exempt (Section 44ADA):** Freelancing aur consulting income me se 50% deemed expense discount milta hai!\n` +
            `• **100% Tax-Free:** Papa/mummy ya relatives se mile transfers (Section 56(2)(x) proviso) aur internal self-transfers.\n\n` +
            `Har credit tax nahi hota, aur TechPay/TaxSaathi ise automatically distinguish karta hai.`
          : `Here is the statutory tax treatment of your transactions:\n\n` +
            `• **Fully Taxable:** Employment salary (Section 15) and Fixed Deposit interest.\n` +
            `• **50% Tax-Free (Section 44ADA):** Freelancing and professional fees qualify for 50% deemed expense deduction without audits!\n` +
            `• **100% Tax-Free:** Gifts from defined relatives (Section 56(2)(x) proviso), ITR refunds, and self-account transfers.\n\n` +
            `Remember: Every credit is NOT taxable, and TechPay tags every payment accordingly.`,
        citations: ['Section 44ADA', 'Section 56(2)(x)', 'Section 10(1)'],
        suggestedActions: [
          { label: 'View Payment History', actionType: 'NAVIGATE_PAYMENTS' }
        ]
      };
    }

    // 5. ITR Filing
    if (q.includes('file') || q.includes('itr') || q.includes('return') || q.includes('form')) {
      const form = (profile.employmentType === 'FREELANCER_PROFESSIONAL' || profile.hasPresumptiveIncome) ? 'ITR-4 (Sugam)' : 'ITR-1 (Sahaj)';
      return {
        response: isHinglish
          ? `Haan, ${profile.name}! Aapko ITR zaroor file karna chahiye.\n\n` +
            `• **Kyun?** Aapki gross income ₹3,00,000 exemption limit se zyada hai, aur aapka TDS (₹${totalTaxPaid.toLocaleString('en-IN')}) claim karne ke liye return mandatory hai.\n` +
            `• **Recommended Form:** **${form}**\n` +
            `• **Due Date:** 31st July to avoid late fee u/s 234F.`
          : `Yes, ${profile.name}! Filing an ITR is mandatory for you.\n\n` +
            `• **Why?** Your gross income (₹${grossIncome.toLocaleString('en-IN')}) exceeds the basic exemption limit, and filing is necessary to claim your TDS credits (₹${totalTaxPaid.toLocaleString('en-IN')}).\n` +
            `• **Recommended Form:** **${form}**\n` +
            `• **Due Date:** July 31 for non-audit taxpayers.`,
        citations: ['Section 139(1)', 'Section 234F (Late Filing Fee)', 'Rule 12'],
        suggestedActions: [
          { label: 'Download CA Tax Summary', actionType: 'OPEN_REPORT' }
        ]
      };
    }

    // Default CA Response
    return {
      response: isHinglish
        ? `Namaste! Main hoon aapka Personal AI CA Vikram Saathi.\n\nAapki monthly income **₹${monthlyIncome.toLocaleString('en-IN')}** hai, jisme se **₹${totalLockedCommitment.toLocaleString('en-IN')}** bills/EMI ke liye locked hai. FY ${financialYear} me aapke paas **₹${totalTaxPaid.toLocaleString('en-IN')}** ke verified tax credits hain.\n\nAap mujhse payment limits, overspending reminders, tax savings ya ITR se juda koi bhi sawal pooch sakte hain!`
        : `Hello! I am your TechPay Personal AI CA. Your monthly income is **₹${monthlyIncome.toLocaleString('en-IN')}** with **₹${totalLockedCommitment.toLocaleString('en-IN')}** locked in your Fixed Commitments Vault. Your verified tax credits stand at **₹${totalTaxPaid.toLocaleString('en-IN')}**.\n\nYou can ask me about safe spending limits, tax-saving investments (ELSS, NPS, Gold), Old vs New regime, or ITR forms!`,
      citations: ['Indian Income Tax Act 1961', 'TechPay Smart Banking Engine'],
      suggestedActions: [
        { label: 'Can I afford to spend today?', actionType: 'ASK_QUERY', payload: 'Can I afford to spend money today?' },
        { label: 'How much tax do I owe?', actionType: 'ASK_QUERY', payload: 'How much tax do I need to pay?' },
        { label: 'Which regime is better?', actionType: 'ASK_QUERY', payload: 'Which regime is better for me?' }
      ]
    };
  }

  public static speakText(text: string, onEnd?: () => void): SpeechSynthesisUtterance | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/•/g, '')
      .replace(/₹/g, 'Rupees ')
      .replace(/💡/g, '')
      .replace(/⚠️/g, 'Warning: ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(v => v.lang.includes('en-IN') || v.name.includes('India'));
    if (indianVoice) utterance.voice = indianVoice;

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
    return utterance;
  }

  public static stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
