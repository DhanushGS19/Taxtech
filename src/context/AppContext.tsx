import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  AnomalyItem,
  AutoPayMandate,
  ChatMessage,
  FamilyProfile,
  FixedCommitment,
  LoanRecord,
  PaymentLocation,
  PaymentTransaction,
  RegimeComparison,
  SipFund,
  TaxCalendarEvent,
  TaxHealthScore
} from '../types/tax';
import { AIPersonalCAEngine } from '../engine/aiCaEngine';
import { IndianTaxRulesEngine } from '../engine/taxRulesEngine';
import { TransactionIntelligenceEngine } from '../engine/transactionIntelligence';
import {
  INITIAL_AUTOPAY_MANDATES,
  INITIAL_FIXED_COMMITMENTS,
  INITIAL_LOAN_RECORDS,
  INITIAL_PROFILES,
  INITIAL_SIP_FUNDS,
  INITIAL_TRANSACTIONS,
  TAX_CALENDAR_EVENTS
} from '../data/mockData';

export type AppFace = 'TECHPAY' | 'TAXSAATHI';

interface AppContextType {
  activeFace: AppFace;
  setActiveFace: (face: AppFace) => void;
  accountBalance: number;
  monthlyIncome: number;
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
  isBalanceRevealed: boolean;
  setIsBalanceRevealed: (revealed: boolean) => void;
  isCheckBalanceOpen: boolean;
  setIsCheckBalanceOpen: (open: boolean) => void;
  formatPrivateAmount: (amount: number, forceShow?: boolean) => string;
  goldBalanceGrams: number;
  goldRatePerGram: number;
  profiles: FamilyProfile[];
  activeProfile: FamilyProfile;
  setActiveProfileId: (id: string) => void;
  addProfile: (profile: FamilyProfile) => void;
  transactions: PaymentTransaction[];
  sendPayment: (params: {
    recipientUpiId: string;
    recipientName: string;
    amount: number;
    description: string;
    category?: string;
    location?: PaymentLocation;
    paymentMethod?: 'UPI_APP' | 'QR_SCAN' | 'AUTOPAY' | 'NET_BANKING' | 'DEBIT_CARD';
  }) => { success: boolean; tx?: PaymentTransaction; warning?: string };
  deleteTransaction: (id: string) => void;
  resolveDuplicate: (id: string) => void;
  commitments: FixedCommitment[];
  totalLockedAmount: number;
  unpaidLockedAmount: number;
  safeDiscretionaryBudget: number;
  currentDiscretionarySpent: number;
  overspendingAlert: string | null;
  markCommitmentPaid: (id: string) => void;
  addCommitment: (com: FixedCommitment) => void;
  autoPayMandates: AutoPayMandate[];
  toggleAutoPay: (id: string) => void;
  addAutoPay: (mandate: AutoPayMandate) => void;
  sipFunds: SipFund[];
  buyGold: (amountInInr: number) => boolean;
  sellGold: (grams: number) => boolean;
  startSip: (fundId: string, amount: number) => void;
  financialYear: '2024-25' | '2025-26';
  setFinancialYear: (fy: '2024-25' | '2025-26') => void;
  activeRegime: 'NEW' | 'OLD';
  setActiveRegime: (regime: 'NEW' | 'OLD') => void;
  toggleRegime: () => void;
  taxComparison: RegimeComparison;
  anomalies: AnomalyItem[];
  resolveAnomaly: (id: string) => void;
  healthScore: TaxHealthScore;
  calendarEvents: TaxCalendarEvent[];
  toggleCalendarEvent: (id: string) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  clearChat: () => void;
  language: 'EN' | 'HINGLISH';
  setLanguage: (lang: 'EN' | 'HINGLISH') => void;
  isSpeaking: boolean;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  resetToSampleData: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeLocation: string;
  setActiveLocation: (loc: string) => void;
  walletBalance: number;
  rewardsCount: number;
  loanRecords: LoanRecord[];
  addLoanRecord: (record: Omit<LoanRecord, 'id'>) => void;
  updateLoanRecord: (id: string, updates: Partial<LoanRecord>) => void;
  deleteLoanRecord: (id: string) => void;
  isLoanTrackerOpen: boolean;
  setIsLoanTrackerOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeFace, setActiveFace] = useState<AppFace>('TECHPAY');
  const [accountBalance, setAccountBalance] = useState<number>(64850);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(150000);

  // Privacy & Balance Masking (PhonePe / Google Pay Reference)
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('tp_privacy_mode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isBalanceRevealed, setIsBalanceRevealed] = useState<boolean>(false);
  const [isCheckBalanceOpen, setIsCheckBalanceOpen] = useState<boolean>(false);

  const togglePrivacyMode = () => {
    setIsPrivacyMode(prev => {
      const next = !prev;
      localStorage.setItem('tp_privacy_mode', JSON.stringify(next));
      if (next) {
        setIsBalanceRevealed(false);
      }
      return next;
    });
  };

  const formatPrivateAmount = (amount: number, forceShow: boolean = false): string => {
    if (!isPrivacyMode || forceShow) {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
    return '₹••••••';
  };

  const [goldBalanceGrams, setGoldBalanceGrams] = useState<number>(4.25);
  const [goldRatePerGram, setGoldRatePerGram] = useState<number>(7865);
  const [walletBalance, setWalletBalance] = useState<number>(1250);
  const [rewardsCount, setRewardsCount] = useState<number>(4);

  // Theme support (light vs dark - PhonePe reference)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('tp_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('tp_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Location selector (PhonePe reference: "Work • Tathawade / Indiranagar")
  const [activeLocation, setActiveLocation] = useState<string>(() => {
    return localStorage.getItem('tp_location') || 'Work • Indiranagar, Bengaluru';
  });

  const handleSetActiveLocation = (loc: string) => {
    setActiveLocation(loc);
    localStorage.setItem('tp_location', loc);
  };

  const [profiles, setProfiles] = useState<FamilyProfile[]>(() => {
    const s = localStorage.getItem('tp_profiles');
    return s ? JSON.parse(s) : INITIAL_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>('prof-rahul');

  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    const s = localStorage.getItem('tp_txs');
    return s ? JSON.parse(s) : INITIAL_TRANSACTIONS;
  });

  const [commitments, setCommitments] = useState<FixedCommitment[]>(() => {
    const s = localStorage.getItem('tp_commitments');
    return s ? JSON.parse(s) : INITIAL_FIXED_COMMITMENTS;
  });

  const [loanRecords, setLoanRecords] = useState<LoanRecord[]>(() => {
    const s = localStorage.getItem('tp_loan_records');
    return s ? JSON.parse(s) : INITIAL_LOAN_RECORDS;
  });
  const [isLoanTrackerOpen, setIsLoanTrackerOpen] = useState<boolean>(false);

  const [autoPayMandates, setAutoPayMandates] = useState<AutoPayMandate[]>(INITIAL_AUTOPAY_MANDATES);
  const [sipFunds, setSipFunds] = useState<SipFund[]>(INITIAL_SIP_FUNDS);
  const [calendarEvents, setCalendarEvents] = useState<TaxCalendarEvent[]>(TAX_CALENDAR_EVENTS);
  const [resolvedAnomalyIds, setResolvedAnomalyIds] = useState<string[]>([]);

  const [financialYear, setFinancialYear] = useState<'2024-25' | '2025-26'>('2024-25');
  const [activeRegime, setActiveRegime] = useState<'NEW' | 'OLD'>('NEW');
  const [language, setLanguage] = useState<'EN' | 'HINGLISH'>('EN');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Active Profile
  const activeProfile = useMemo(() => {
    return profiles.find(p => p.id === activeProfileId) || profiles[0];
  }, [profiles, activeProfileId]);

  // Synchronize with LocalStorage
  useEffect(() => {
    localStorage.setItem('tp_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('tp_txs', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('tp_commitments', JSON.stringify(commitments));
  }, [commitments]);

  useEffect(() => {
    localStorage.setItem('tp_loan_records', JSON.stringify(loanRecords));
  }, [loanRecords]);

  // Fixed Budget & Locked Vault Calculations
  const totalLockedAmount = useMemo(() => {
    return commitments.reduce((sum, c) => sum + c.allocatedAmount, 0);
  }, [commitments]);

  const unpaidLockedAmount = useMemo(() => {
    return commitments.filter(c => !c.isPaidThisMonth).reduce((sum, c) => sum + c.allocatedAmount, 0);
  }, [commitments]);

  const safeDiscretionaryBudget = useMemo(() => {
    return Math.max(0, monthlyIncome - totalLockedAmount);
  }, [monthlyIncome, totalLockedAmount]);

  const currentDiscretionarySpent = useMemo(() => {
    return transactions
      .filter(t => t.type === 'DEBIT' && t.budgetCategory === 'DISCRETIONARY')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Overspending Warning Monitor
  const overspendingAlert = useMemo(() => {
    const remainingFreeLimit = safeDiscretionaryBudget - currentDiscretionarySpent;
    if (remainingFreeLimit < 0) {
      return `⚠️ OVERSPENDING ALERT: You have exceeded your safe discretionary budget by ₹${Math.abs(remainingFreeLimit).toLocaleString('en-IN')}! Essential locked commitments (₹${unpaidLockedAmount.toLocaleString('en-IN')} for EMI/Rent) are at severe risk.`;
    } else if (remainingFreeLimit < 5000) {
      return `⚠️ BUDGET WARNING: Only ₹${remainingFreeLimit.toLocaleString('en-IN')} remains in your safe discretionary budget! You have ₹${unpaidLockedAmount.toLocaleString('en-IN')} locked for upcoming EMI & Rent due soon.`;
    }
    return null;
  }, [safeDiscretionaryBudget, currentDiscretionarySpent, unpaidLockedAmount]);

  // Tax Comparison Calculation (Deterministic)
  const taxComparison = useMemo(() => {
    return IndianTaxRulesEngine.calculateTax({
      transactions,
      profile: activeProfile,
      financialYear
    });
  }, [transactions, activeProfile, financialYear]);

  // Anomalies
  const anomalies = useMemo(() => {
    const rawAnomalies = TransactionIntelligenceEngine.detectAnomalies(transactions);
    return rawAnomalies.map(a => ({
      ...a,
      resolved: resolvedAnomalyIds.includes(a.id)
    }));
  }, [transactions, resolvedAnomalyIds]);

  // Tax Health Score
  const healthScore = useMemo((): TaxHealthScore => {
    let comp = 18;
    if (transactions.length >= 6) comp += 4;
    const unresolvedCount = anomalies.filter(a => !a.resolved).length;
    const anomScore = unresolvedCount === 0 ? 25 : Math.max(10, 25 - (unresolvedCount * 5));
    const dedScore = taxComparison.recommendedRegime === activeRegime ? 25 : 20;
    const readyScore = overspendingAlert ? 18 : 25;
    const total = Math.min(100, comp + anomScore + dedScore + readyScore);

    let grade: 'A+' | 'A' | 'B' | 'C' | 'NEEDS_ATTENTION' = 'B';
    if (total >= 92) grade = 'A+';
    else if (total >= 85) grade = 'A';
    else if (total >= 70) grade = 'B';
    else grade = 'C';

    const recs: string[] = [];
    if (overspendingAlert) {
      recs.push('Pause discretionary dining/shopping to protect your locked EMI/Rent commitments.');
    }
    if (taxComparison.recommendedRegime !== activeRegime) {
      recs.push(`Switch to ${taxComparison.recommendedRegime} Tax Regime to save ₹${taxComparison.taxSavings.toLocaleString('en-IN')}.`);
    }
    if (unresolvedCount > 0) {
      recs.push(`Review ${unresolvedCount} flagged anomaly in the Audit Center.`);
    }

    return {
      score: total,
      grade,
      breakdown: {
        recordCompleteness: comp,
        anomalyResolution: anomScore,
        deductionOptimization: dedScore,
        complianceFilingReady: readyScore
      },
      recommendations: recs
    };
  }, [transactions, anomalies, taxComparison, activeRegime, overspendingAlert]);

  // Chat Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'CA_SAATHI',
      text: `Namaste! I am **CA Vikram Saathi**, your personal AI Chartered Accountant inside TechPay.\n\nI actively monitor both your **daily UPI payments & locked commitments** (EMI, Rent, Bills) and your **annual income tax liabilities** for FY ${financialYear}.\n\nAsk me about safe spending limits, tax-deductible payments, or which regime saves you more money!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: ['Income Tax Act 1961', 'TechPay Smart Banking Engine'],
      suggestedActions: [
        { label: 'Can I afford to spend today?', actionType: 'ASK_QUERY', payload: 'Can I afford to spend money today?' },
        { label: 'How much tax do I need to pay?', actionType: 'ASK_QUERY', payload: 'How much tax do I need to pay?' },
        { label: 'Which regime is better for me?', actionType: 'ASK_QUERY', payload: 'Which regime is better for me?' }
      ]
    }
  ]);

  // Send UPI Payment Action
  const sendPayment = (params: {
    recipientUpiId: string;
    recipientName: string;
    amount: number;
    description: string;
    category?: string;
    location?: PaymentLocation;
    paymentMethod?: 'UPI_APP' | 'QR_SCAN' | 'AUTOPAY' | 'NET_BANKING' | 'DEBIT_CARD';
  }) => {
    const { recipientUpiId, recipientName, amount, description, location, paymentMethod = 'UPI_APP' } = params;

    // Check if user has sufficient bank balance
    if (amount > accountBalance) {
      return { success: false, warning: 'Insufficient bank balance for this payment.' };
    }

    // Default real-world Indian location if not passed
    const realLocation: PaymentLocation = location || {
      shopName: recipientName,
      street: '100 Feet Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      landmark: 'Near Metro Station',
      latitude: 12.9784,
      longitude: 77.6408,
      category: 'SHOPPING'
    };

    // Analyze Indian tax implications automatically
    const analysis = TransactionIntelligenceEngine.analyze(description, amount, 'DEBIT', 'MERCHANT', recipientName);

    const isFixed = analysis.isFixedCommitment || false;
    const now = new Date();

    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      upiRefId: `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}/HDFC`,
      senderUpiId: activeProfile.upiId,
      recipientUpiId,
      recipientName,
      description: description || analysis.category,
      rawNarration: `UPI-${recipientName.toUpperCase()}-${realLocation.city.toUpperCase()}`,
      type: 'DEBIT',
      amount,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      account: 'HDFC Bank *4892',
      party: recipientName,
      partyRelationship: analysis.partyRelationship || 'MERCHANT',
      category: analysis.category,
      status: 'SUCCESS',
      paymentMethod,
      location: realLocation,
      classification: analysis.classification,
      isFixedCommitment: isFixed,
      budgetCategory: isFixed ? 'FIXED_COMMITMENT' : (analysis.budgetCategory || 'DISCRETIONARY'),
      tags: analysis.suggestedTags
    };

    // Deduct from balance
    setAccountBalance(prev => prev - amount);
    setTransactions(prev => [newTx, ...prev]);

    // Check if this payment matches an unpaid fixed commitment (e.g. Home Loan EMI or Rent)
    if (isFixed) {
      setCommitments(prev =>
        prev.map(c => {
          if (recipientName.toLowerCase().includes(c.category.toLowerCase()) || description.toLowerCase().includes(c.title.toLowerCase())) {
            return { ...c, isPaidThisMonth: true };
          }
          return c;
        })
      );
    }

    // Overspending warning check
    let warning: string | undefined = undefined;
    if (!isFixed) {
      const remainingFree = safeDiscretionaryBudget - (currentDiscretionarySpent + amount);
      if (remainingFree < 0) {
        warning = `Payment successful, but you have breached your safe discretionary budget by ₹${Math.abs(remainingFree).toLocaleString('en-IN')}. Please protect your ₹${unpaidLockedAmount.toLocaleString('en-IN')} locked commitments!`;
      }
    }

    return { success: true, tx: newTx, warning };
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const resolveDuplicate = (id: string) => {
    deleteTransaction(id);
  };

  const markCommitmentPaid = (id: string) => {
    setCommitments(prev =>
      prev.map(c => (c.id === id ? { ...c, isPaidThisMonth: !c.isPaidThisMonth } : c))
    );
  };

  const addCommitment = (com: FixedCommitment) => {
    setCommitments(prev => [...prev, com]);
  };

  const addLoanRecord = (record: Omit<LoanRecord, 'id'>) => {
    const newRecord: LoanRecord = {
      ...record,
      id: `loan-${Date.now()}`
    };
    setLoanRecords(prev => [newRecord, ...prev]);
  };

  const updateLoanRecord = (id: string, updates: Partial<LoanRecord>) => {
    setLoanRecords(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const deleteLoanRecord = (id: string) => {
    setLoanRecords(prev => prev.filter(r => r.id !== id));
  };

  const toggleAutoPay = (id: string) => {
    setAutoPayMandates(prev =>
      prev.map(m => (m.id === id ? { ...m, status: m.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : m))
    );
  };

  const addAutoPay = (mandate: AutoPayMandate) => {
    setAutoPayMandates(prev => [...prev, mandate]);
  };

  const buyGold = (amountInInr: number): boolean => {
    if (amountInInr > accountBalance) return false;
    const grams = amountInInr / goldRatePerGram;
    setAccountBalance(prev => prev - amountInInr);
    setGoldBalanceGrams(prev => prev + grams);

    // Record transaction
    const now = new Date();
    const newTx: PaymentTransaction = {
      id: `gold-buy-${Date.now()}`,
      upiRefId: `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}/GOLD`,
      senderUpiId: activeProfile.upiId,
      recipientUpiId: 'safegold.vault@icici',
      recipientName: 'Augmont 24K Digital Gold Vault',
      description: `Bought ${grams.toFixed(3)}g 24K 999.9 Pure Gold`,
      rawNarration: 'UPI-AUGMONT DIGITAL GOLD-BOM',
      type: 'DEBIT',
      amount: amountInInr,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      account: 'HDFC Bank *4892',
      party: 'Augmont Gold',
      partyRelationship: 'MERCHANT',
      category: 'Gold & Commodities',
      status: 'SUCCESS',
      paymentMethod: 'UPI_APP',
      location: {
        shopName: 'Bullion India Vaults',
        street: 'Bandra Kurla Complex (BKC)',
        city: 'Mumbai',
        state: 'Maharashtra',
        landmark: 'Diamond Bourse Gate 2',
        latitude: 19.0657,
        longitude: 72.8687,
        category: 'INVESTMENT'
      },
      classification: {
        status: 'NON_TAXABLE',
        deductionSection: 'Capital Asset (Gold)',
        taxablePercentage: 0,
        taxableAmount: 0,
        deductibleAmount: 0,
        legalBasis: 'Purchase of gold is a capital investment; capital gains tax applies only upon future redemption.',
        confidenceScore: 99,
        aiExplanation: '24K Digital gold investment stored in insured vaults. No tax deduction at purchase.'
      },
      isFixedCommitment: false,
      budgetCategory: 'SAVINGS_INVESTMENT',
      tags: ['Gold', '24K', 'Asset']
    };

    setTransactions(prev => [newTx, ...prev]);
    return true;
  };

  const sellGold = (grams: number): boolean => {
    if (grams > goldBalanceGrams) return false;
    const inrValue = Math.round(grams * goldRatePerGram * 0.97); // 3% spread
    setGoldBalanceGrams(prev => prev - grams);
    setAccountBalance(prev => prev + inrValue);
    return true;
  };

  const startSip = (fundId: string, amount: number) => {
    setSipFunds(prev =>
      prev.map(f => (f.id === fundId ? { ...f, monthlyAmount: amount } : f))
    );
  };

  const toggleRegime = () => {
    setActiveRegime(prev => (prev === 'NEW' ? 'OLD' : 'NEW'));
  };

  const toggleCalendarEvent = (id: string) => {
    setCalendarEvents(prev =>
      prev.map(e => (e.id === id ? { ...e, completed: !e.completed } : e))
    );
  };

  const resolveAnomaly = (id: string) => {
    setResolvedAnomalyIds(prev => [...prev, id]);
  };

  const addProfile = (profile: FamilyProfile) => {
    setProfiles(prev => [...prev, profile]);
    setActiveProfileId(profile.id);
  };

  const resetToSampleData = () => {
    setProfiles(INITIAL_PROFILES);
    setTransactions(INITIAL_TRANSACTIONS);
    setCommitments(INITIAL_FIXED_COMMITMENTS);
    setAutoPayMandates(INITIAL_AUTOPAY_MANDATES);
    setSipFunds(INITIAL_SIP_FUNDS);
    setAccountBalance(64850);
    setGoldBalanceGrams(4.25);
    localStorage.removeItem('tp_profiles');
    localStorage.removeItem('tp_txs');
    localStorage.removeItem('tp_commitments');
  };

  const sendChatMessage = (userText: string) => {
    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'USER',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const caResult = AIPersonalCAEngine.answerQuestion(userText, {
        profile: activeProfile,
        transactions,
        taxCalculation: taxComparison,
        anomalies,
        commitments,
        monthlyIncome,
        financialYear,
        language
      });

      const caMsg: ChatMessage = {
        id: `msg-ca-${Date.now()}`,
        sender: 'CA_SAATHI',
        text: caResult.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: caResult.citations,
        suggestedActions: caResult.suggestedActions
      };

      setChatMessages(prev => [...prev, caMsg]);
    }, 350);
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: `msg-init-${Date.now()}`,
        sender: 'CA_SAATHI',
        text: `Chat cleared. Ask me any payment, budget, or tax question!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const speak = (text: string) => {
    setIsSpeaking(true);
    AIPersonalCAEngine.speakText(text, () => setIsSpeaking(false));
  };

  const stopSpeaking = () => {
    AIPersonalCAEngine.stopSpeaking();
    setIsSpeaking(false);
  };

  return (
    <AppContext.Provider
      value={{
        activeFace,
        setActiveFace,
        accountBalance,
        monthlyIncome,
        isPrivacyMode,
        togglePrivacyMode,
        isBalanceRevealed,
        setIsBalanceRevealed,
        isCheckBalanceOpen,
        setIsCheckBalanceOpen,
        formatPrivateAmount,
        goldBalanceGrams,
        goldRatePerGram,
        profiles,
        activeProfile,
        setActiveProfileId,
        addProfile,
        transactions,
        sendPayment,
        deleteTransaction,
        resolveDuplicate,
        commitments,
        totalLockedAmount,
        unpaidLockedAmount,
        safeDiscretionaryBudget,
        currentDiscretionarySpent,
        overspendingAlert,
        markCommitmentPaid,
        addCommitment,
        autoPayMandates,
        toggleAutoPay,
        addAutoPay,
        sipFunds,
        buyGold,
        sellGold,
        startSip,
        financialYear,
        setFinancialYear,
        activeRegime,
        setActiveRegime,
        toggleRegime,
        taxComparison,
        anomalies,
        resolveAnomaly,
        healthScore,
        calendarEvents,
        toggleCalendarEvent,
        chatMessages,
        sendChatMessage,
        clearChat,
        language,
        setLanguage,
        isSpeaking,
        speak,
        stopSpeaking,
        resetToSampleData,
        theme,
        toggleTheme,
        activeLocation,
        setActiveLocation: handleSetActiveLocation,
        walletBalance,
        rewardsCount,
        loanRecords,
        addLoanRecord,
        updateLoanRecord,
        deleteLoanRecord,
        isLoanTrackerOpen,
        setIsLoanTrackerOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
