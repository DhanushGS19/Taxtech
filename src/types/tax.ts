export type TransactionType = 'CREDIT' | 'DEBIT';

export type IncomeHead = 
  | 'SALARY'
  | 'HOUSE_PROPERTY'
  | 'PGBP' // Profits and Gains of Business or Profession
  | 'CAPITAL_GAINS'
  | 'OTHER_SOURCES'
  | 'EXEMPT_INCOME'
  | 'NON_TAXABLE_TRANSFER';

export type TaxImplicationStatus = 
  | 'TAXABLE'
  | 'NON_TAXABLE'
  | 'TAX_DEDUCTIBLE'
  | 'TAX_CREDIT'
  | 'NEEDS_VERIFICATION'
  | 'PARTIALLY_TAXABLE';

export interface TaxClassification {
  status: TaxImplicationStatus;
  head?: IncomeHead;
  deductionSection?: string; // e.g. "Sec 80C", "Sec 16(ia)", "Sec 44ADA", "Sec 56(2)(x)"
  taxablePercentage: number;
  taxableAmount: number;
  deductibleAmount: number;
  tdsAmount?: number;
  legalBasis: string;
  confidenceScore: number;
  aiExplanation: string;
  userOverridden?: boolean;
}

export interface PaymentLocation {
  shopName: string;
  street: string;
  city: string;
  state: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  category: 'CAFE' | 'GROCERY' | 'HEALTH' | 'FUEL' | 'SHOPPING' | 'UTILITY' | 'RENT' | 'INVESTMENT' | 'TRANSFER' | 'SALARY';
}

export interface PaymentTransaction {
  id: string;
  upiRefId: string;
  senderUpiId: string;
  recipientUpiId: string;
  recipientName: string;
  description: string;
  rawNarration: string;
  type: TransactionType;
  amount: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  account: string; // e.g. "HDFC Bank *4892"
  party?: string;
  partyRelationship?: 'EMPLOYER' | 'CLIENT' | 'RELATIVE' | 'NON_RELATIVE' | 'BANK' | 'GOVERNMENT' | 'MERCHANT' | 'SELF';
  category: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  paymentMethod: 'UPI_APP' | 'QR_SCAN' | 'AUTOPAY' | 'NET_BANKING' | 'DEBIT_CARD';
  location: PaymentLocation;
  classification: TaxClassification;
  isFixedCommitment: boolean; // Part of locked bills/EMI/rent vault
  budgetCategory: 'FIXED_COMMITMENT' | 'DISCRETIONARY' | 'SAVINGS_INVESTMENT' | 'INCOME';
  isDuplicate?: boolean;
  duplicateOfId?: string;
  notes?: string;
  tags?: string[];
}

export interface FixedCommitment {
  id: string;
  title: string;
  allocatedAmount: number;
  dueDateDescription: string; // e.g. "Due on 5th of every month"
  daysRemaining: number;
  category: 'EMI' | 'RENT' | 'FEE' | 'BILL' | 'INSURANCE';
  isPaidThisMonth: boolean;
  taxDeductible: boolean;
  taxSection?: string;
}

export interface AutoPayMandate {
  id: string;
  title: string;
  merchant: string;
  upiId: string;
  amount: number;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  nextDebitDate: string;
  status: 'ACTIVE' | 'PAUSED';
  category: 'INVESTMENT' | 'UTILITY' | 'ENTERTAINMENT' | 'LOAN';
  taxDeductible: boolean;
  taxSection?: string;
}

export interface SipFund {
  id: string;
  fundName: string;
  amc: string;
  category: 'ELSS_TAX_SAVER' | 'NIFTY_INDEX' | 'FLEXI_CAP' | 'GOLD_ETF';
  monthlyAmount: number;
  totalInvested: number;
  currentValue: number;
  returnsPercentage: number;
  cagr3Yr: number;
  riskLevel: 'LOW' | 'MODERATE' | 'VERY_HIGH';
  taxBenefit: string;
  lockInPeriodYears: number;
}

export interface TaxRegimeBreakdown {
  regime: 'NEW' | 'OLD';
  grossTotalIncome: number;
  exemptions: number;
  standardDeduction: number;
  chapter6ADeductions: {
    section80C: number;
    section80CCD1B: number;
    section80D: number;
    section80TTA: number;
    section80E: number;
    section80G: number;
    otherDeductions: number;
    total: number;
  };
  section24bHomeLoanInterest: number;
  presumptiveDeductions: number;
  netTaxableIncome: number;
  incomeTaxBeforeRebate: number;
  section87ARebate: number;
  netIncomeTax: number;
  surcharge: number;
  cess: number;
  totalTaxLiability: number;
  tdsCredits: number;
  advanceTaxPaid: number;
  selfAssessmentTaxPaid: number;
  totalTaxesPaid: number;
  netTaxPayableOrRefund: number;
  isRefund: boolean;
  effectiveTaxRate: number;
  slabsBreakdown: {
    slab: string;
    rate: string;
    taxableInSlab: number;
    taxInSlab: number;
  }[];
}

export interface RegimeComparison {
  newRegime: TaxRegimeBreakdown;
  oldRegime: TaxRegimeBreakdown;
  recommendedRegime: 'NEW' | 'OLD';
  taxSavings: number;
  explanation: string;
  formRequired?: string;
}

export interface FamilyProfile {
  id: string;
  name: string;
  relationship: string;
  pan: string;
  upiId: string;
  age: number;
  residentStatus: 'RESIDENT' | 'NON_RESIDENT';
  employmentType: 'SALARIED' | 'FREELANCER_PROFESSIONAL' | 'BUSINESS' | 'SENIOR_CITIZEN_PENSIONER' | 'STUDENT';
  hasPresumptiveIncome: boolean;
  avatarColor: string;
  defaultRegime: 'NEW' | 'OLD';
}

export interface TaxCalendarEvent {
  id: string;
  title: string;
  dueDate: string;
  category: 'ITR' | 'ADVANCE_TAX' | 'TDS' | 'INVESTMENT_DEADLINE' | 'TAX_AUDIT';
  description: string;
  applicableTo: string;
  penaltyWarning: string;
  completed: boolean;
  urgent: boolean;
}

export interface AnomalyItem {
  id: string;
  transactionId?: string;
  title: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'CASH_LIMIT' | 'GIFT_TAX' | 'TDS_MISMATCH' | 'HIGH_VALUE_SFT' | 'DUPLICATE' | 'MISSING_DEDUCTION';
  description: string;
  recommendation: string;
  taxSection: string;
  resolved: boolean;
}

export interface TaxHealthScore {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'NEEDS_ATTENTION';
  breakdown: {
    recordCompleteness: number;
    anomalyResolution: number;
    deductionOptimization: number;
    complianceFilingReady: number;
  };
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'CA_SAATHI';
  text: string;
  timestamp: string;
  citations?: string[];
  suggestedActions?: {
    label: string;
    actionType: string;
    payload?: any;
  }[];
}
