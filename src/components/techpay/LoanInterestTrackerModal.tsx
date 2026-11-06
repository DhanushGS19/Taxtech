import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LoanRecord } from '../../types/tax';
import {
  calculateLoanInterest,
  generateWhatsAppReminder,
  InterestCalculationParams
} from '../../utils/interestCalculator';
import {
  X,
  Calculator,
  BookOpen,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Percent,
  Plus,
  Share2,
  CheckCircle2,
  Clock,
  Trash2,
  AlertTriangle,
  Smartphone,
  CreditCard,
  User,
  Search,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoanInterestTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMakePayment?: (data: { name: string; upiId: string; amount: number; category: string }) => void;
}

export const LoanInterestTrackerModal: React.FC<LoanInterestTrackerModalProps> = ({
  isOpen,
  onClose,
  onOpenMakePayment
}) => {
  const {
    loanRecords,
    addLoanRecord,
    updateLoanRecord,
    deleteLoanRecord,
    theme
  } = useApp();

  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'CALCULATOR' | 'LEDGER'>('CALCULATOR');
  const [ledgerFilter, setLedgerFilter] = useState<'ALL' | 'GIVEN' | 'BORROWED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // -------------------------------------------------------------
  // CALCULATOR STATE
  // -------------------------------------------------------------
  const [calcPrincipal, setCalcPrincipal] = useState<number>(25000);
  const [calcRate, setCalcRate] = useState<number>(12);
  const [calcPeriod, setCalcPeriod] = useState<'ANNUAL' | 'MONTHLY'>('ANNUAL');
  const [calcType, setCalcType] = useState<'SIMPLE' | 'COMPOUND'>('SIMPLE');
  const [calcDurationMode, setCalcDurationMode] = useState<'DATES' | 'TENURE'>('TENURE');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const defaultEndStr = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split('T')[0];
  }, []);

  const [calcStartDate, setCalcStartDate] = useState<string>(todayStr);
  const [calcEndDate, setCalcEndDate] = useState<string>(defaultEndStr);
  const [calcMonths, setCalcMonths] = useState<number>(6);

  // Live Calculator computation
  const calcResult = useMemo(() => {
    const params: InterestCalculationParams = {
      principal: calcPrincipal,
      rate: calcRate,
      period: calcPeriod,
      type: calcType,
      ...(calcDurationMode === 'DATES'
        ? { startDate: calcStartDate, endDate: calcEndDate }
        : { durationMonths: calcMonths })
    };
    return calculateLoanInterest(params);
  }, [calcPrincipal, calcRate, calcPeriod, calcType, calcDurationMode, calcStartDate, calcEndDate, calcMonths]);

  // -------------------------------------------------------------
  // ADD NEW RECORD MODAL / FORM STATE
  // -------------------------------------------------------------
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [formType, setFormType] = useState<'GIVEN' | 'BORROWED'>('GIVEN');
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formUpi, setFormUpi] = useState('');
  const [formPrincipal, setFormPrincipal] = useState<number>(25000);
  const [formRate, setFormRate] = useState<number>(12);
  const [formPeriod, setFormPeriod] = useState<'ANNUAL' | 'MONTHLY'>('ANNUAL');
  const [formInterestType, setFormInterestType] = useState<'SIMPLE' | 'COMPOUND'>('SIMPLE');
  const [formStartDate, setFormStartDate] = useState<string>(todayStr);
  const [formDueDate, setFormDueDate] = useState<string>(defaultEndStr);
  const [formNotes, setFormNotes] = useState('');

  // Pre-fill add record form from calculator
  const handleSaveCalcToLedger = (type: 'GIVEN' | 'BORROWED') => {
    setFormType(type);
    setFormPrincipal(calcPrincipal);
    setFormRate(calcRate);
    setFormPeriod(calcPeriod);
    setFormInterestType(calcType);
    setFormStartDate(calcDurationMode === 'DATES' ? calcStartDate : todayStr);
    if (calcDurationMode === 'DATES') {
      setFormDueDate(calcEndDate);
    } else {
      const d = new Date();
      d.setMonth(d.getMonth() + calcMonths);
      setFormDueDate(d.toISOString().split('T')[0]);
    }
    setFormNotes(`Calculated via TechPay Interest Engine (${calcRate}% ${calcPeriod === 'MONTHLY' ? 'p.m.' : 'p.a.'} ${calcType})`);
    setIsAddFormOpen(true);
    setActiveTab('LEDGER');
  };

  const handleCreateLoanRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrincipal <= 0) return;

    addLoanRecord({
      type: formType,
      personName: formName.trim(),
      phoneNumber: formPhone.trim() || undefined,
      upiId: formUpi.trim() || undefined,
      principalAmount: formPrincipal,
      interestRate: formRate,
      interestPeriod: formPeriod,
      interestType: formInterestType,
      startDate: formStartDate,
      dueDate: formDueDate || undefined,
      notes: formNotes.trim() || undefined,
      status: 'PENDING'
    });

    setIsAddFormOpen(false);
    // Reset form fields
    setFormName('');
    setFormPhone('');
    setFormUpi('');
    setFormNotes('');
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (err) {}
  };

  // -------------------------------------------------------------
  // LEDGER COMPUTATIONS
  // -------------------------------------------------------------
  const ledgerMetrics = useMemo(() => {
    let totalGivenPrincipal = 0;
    let totalGivenAccruedInterest = 0;
    let totalBorrowedPrincipal = 0;
    let totalBorrowedAccruedInterest = 0;

    loanRecords.forEach(rec => {
      if (rec.status !== 'SETTLED') {
        const res = calculateLoanInterest({
          principal: rec.principalAmount,
          rate: rec.interestRate,
          period: rec.interestPeriod,
          type: rec.interestType,
          startDate: rec.startDate,
          endDate: todayStr
        });

        if (rec.type === 'GIVEN') {
          totalGivenPrincipal += rec.principalAmount;
          totalGivenAccruedInterest += res.accruedInterest;
        } else {
          totalBorrowedPrincipal += rec.principalAmount;
          totalBorrowedAccruedInterest += res.accruedInterest;
        }
      }
    });

    const totalGivenTotal = totalGivenPrincipal + totalGivenAccruedInterest;
    const totalBorrowedTotal = totalBorrowedPrincipal + totalBorrowedAccruedInterest;
    const netPosition = totalGivenTotal - totalBorrowedTotal;

    return {
      totalGivenPrincipal,
      totalGivenAccruedInterest,
      totalGivenTotal,
      totalBorrowedPrincipal,
      totalBorrowedAccruedInterest,
      totalBorrowedTotal,
      netPosition
    };
  }, [loanRecords, todayStr]);

  const filteredRecords = useMemo(() => {
    return loanRecords.filter(rec => {
      const matchType = ledgerFilter === 'ALL' || rec.type === ledgerFilter;
      const matchSearch =
        rec.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rec.phoneNumber && rec.phoneNumber.includes(searchQuery)) ||
        (rec.upiId && rec.upiId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (rec.notes && rec.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchType && matchSearch;
    });
  }, [loanRecords, ledgerFilter, searchQuery]);

  // Share reminder via WhatsApp
  const handleShareWhatsApp = (rec: LoanRecord, accrued: number, total: number) => {
    const text = generateWhatsAppReminder({
      personName: rec.personName,
      principalAmount: rec.principalAmount,
      accruedInterest: accrued,
      totalMaturityAmount: total,
      rate: rec.interestRate,
      period: rec.interestPeriod,
      startDate: rec.startDate,
      dueDate: rec.dueDate,
      upiId: rec.upiId
    });

    const cleanPhone = rec.phoneNumber ? rec.phoneNumber.replace(/[^0-9]/g, '') : '';
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-3xl max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl border flex flex-col transition-colors ${
          isDark
            ? 'bg-[#1C1427] border-purple-900/40 text-slate-100 shadow-purple-950/50'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/40'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
            isDark
              ? 'bg-[#251A34] border-purple-900/30'
              : 'bg-gradient-to-r from-purple-50 via-white to-purple-50/50 border-purple-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center shadow-md shadow-[#5F259F]/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-tight">
                  Interest Calculator & Udhaar Ledger
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                  P2P Khaata
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Calculate interest & track money given to or borrowed from others
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-purple-900/40 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div
          className={`flex border-b px-5 pt-2 gap-6 shrink-0 ${
            isDark ? 'border-purple-900/30 bg-[#21152D]' : 'border-slate-100 bg-slate-50/70'
          }`}
        >
          <button
            onClick={() => {
              setActiveTab('CALCULATOR');
              setIsAddFormOpen(false);
            }}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'CALCULATOR'
                ? 'border-[#5F259F] text-[#5F259F] dark:text-purple-400 dark:border-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Interactive Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('LEDGER')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'LEDGER'
                ? 'border-[#5F259F] text-[#5F259F] dark:text-purple-400 dark:border-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Borrow & Lend Ledger</span>
            <span
              className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === 'LEDGER'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-200 text-slate-600 dark:bg-purple-950 dark:text-purple-300'
              }`}
            >
              {loanRecords.length}
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* ============================================================== */}
          {/* TAB 1: INTERACTIVE CALCULATOR */}
          {/* ============================================================== */}
          {activeTab === 'CALCULATOR' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Inputs Column */}
                <div className="md:col-span-7 space-y-4">
                  {/* Principal Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Principal Amount (₹ INR)
                      </label>
                      <span className="text-[11px] font-mono text-[#5F259F] dark:text-purple-300 font-bold">
                        ₹{calcPrincipal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={calcPrincipal || ''}
                        onChange={e => setCalcPrincipal(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                          isDark
                            ? 'bg-[#291E3B] border-purple-900/40 text-white'
                            : 'bg-white border-slate-200 text-slate-900'
                        }`}
                        placeholder="e.g. 50000"
                      />
                    </div>
                    {/* Quick Amount Chips */}
                    <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
                      {[10000, 25000, 50000, 100000, 200000].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setCalcPrincipal(amt)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors shrink-0 ${
                            calcPrincipal === amt
                              ? 'bg-[#5F259F] text-white shadow-sm'
                              : isDark
                              ? 'bg-purple-950/40 text-purple-300 hover:bg-purple-900/40'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          +₹{(amt / 1000).toLocaleString('en-IN')}k
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interest Rate & Period Mode */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Interest Rate (%)
                        </label>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {calcPeriod === 'MONTHLY' ? 'per month' : 'per annum'}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={calcRate}
                          onChange={e => setCalcRate(Math.max(0, parseFloat(e.target.value) || 0))}
                          className={`w-full px-3 py-2.5 rounded-xl border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                            isDark
                              ? 'bg-[#291E3B] border-purple-900/40 text-white'
                              : 'bg-white border-slate-200 text-slate-900'
                          }`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                          %
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Rate Period
                      </label>
                      <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-purple-950/40 border border-slate-200 dark:border-purple-900/30">
                        <button
                          type="button"
                          onClick={() => {
                            setCalcPeriod('ANNUAL');
                            if (calcRate === 1.5 || calcRate === 2) setCalcRate(12);
                          }}
                          className={`py-1.5 rounded-lg text-[10px] font-extrabold transition-all ${
                            calcPeriod === 'ANNUAL'
                              ? 'bg-[#5F259F] text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          % p.a. (Annual)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCalcPeriod('MONTHLY');
                            if (calcRate === 12) setCalcRate(1.5);
                          }}
                          className={`py-1.5 rounded-lg text-[10px] font-extrabold transition-all ${
                            calcPeriod === 'MONTHLY'
                              ? 'bg-[#5F259F] text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          % p.m. (Monthly)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Calculation Mode: Simple vs Compound */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Interest Calculation Formula
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCalcType('SIMPLE')}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          calcType === 'SIMPLE'
                            ? 'border-[#5F259F] bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold'
                            : isDark
                            ? 'border-purple-900/30 bg-[#291E3B] text-slate-400'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        <div className="text-xs font-extrabold">Simple Interest (SI)</div>
                        <div className="text-[10px] text-slate-400">P × R × T / 100 (Standard peer loans)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCalcType('COMPOUND')}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          calcType === 'COMPOUND'
                            ? 'border-[#5F259F] bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold'
                            : isDark
                            ? 'border-purple-900/30 bg-[#291E3B] text-slate-400'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        <div className="text-xs font-extrabold">Compound Interest (CI)</div>
                        <div className="text-[10px] text-slate-400">P(1 + r/n)^nt (Interest on interest)</div>
                      </button>
                    </div>
                  </div>

                  {/* Duration Mode Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Duration / Tenure
                      </label>
                      <div className="flex gap-2 text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setCalcDurationMode('TENURE')}
                          className={`underline-offset-2 ${
                            calcDurationMode === 'TENURE'
                              ? 'text-[#5F259F] dark:text-purple-300 underline font-black'
                              : 'text-slate-400'
                          }`}
                        >
                          By Months
                        </button>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <button
                          type="button"
                          onClick={() => setCalcDurationMode('DATES')}
                          className={`underline-offset-2 ${
                            calcDurationMode === 'DATES'
                              ? 'text-[#5F259F] dark:text-purple-300 underline font-black'
                              : 'text-slate-400'
                          }`}
                        >
                          Exact Dates (Calendar)
                        </button>
                      </div>
                    </div>

                    {calcDurationMode === 'TENURE' ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="1"
                            max="60"
                            value={calcMonths}
                            onChange={e => setCalcMonths(parseInt(e.target.value) || 1)}
                            className="flex-1 accent-[#5F259F] h-2 bg-slate-200 dark:bg-purple-950 rounded-lg cursor-pointer"
                          />
                          <span className="w-16 text-right font-mono font-bold text-xs text-[#5F259F] dark:text-purple-300">
                            {calcMonths} Months
                          </span>
                        </div>
                        <div className="flex gap-1.5">
                          {[1, 3, 6, 12, 24, 36].map(m => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setCalcMonths(m)}
                              className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${
                                calcMonths === m
                                  ? 'border-[#5F259F] bg-[#5F259F] text-white'
                                  : isDark
                                  ? 'border-purple-900/30 bg-[#291E3B] text-slate-400'
                                  : 'border-slate-200 bg-white text-slate-600'
                              }`}
                            >
                              {m}M
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-semibold text-slate-500 mb-1 block">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={calcStartDate}
                            onChange={e => setCalcStartDate(e.target.value)}
                            className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none ${
                              isDark
                                ? 'bg-[#291E3B] border-purple-900/40 text-white'
                                : 'bg-white border-slate-200 text-slate-900'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-slate-500 mb-1 block">
                            End / Settlement Date
                          </label>
                          <input
                            type="date"
                            value={calcEndDate}
                            onChange={e => setCalcEndDate(e.target.value)}
                            className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none ${
                              isDark
                                ? 'bg-[#291E3B] border-purple-900/40 text-white'
                                : 'bg-white border-slate-200 text-slate-900'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Output & Action Card */}
                <div className="md:col-span-5 flex flex-col justify-between">
                  <div
                    className={`p-5 rounded-2xl border space-y-4 shadow-sm ${
                      isDark
                        ? 'bg-gradient-to-br from-[#271A3B] to-[#1C1427] border-purple-900/40'
                        : 'bg-gradient-to-br from-purple-50/70 via-white to-slate-50 border-purple-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5F259F] dark:text-purple-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Calculation Result
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">
                        {calcResult.effectiveDays} Days ({calcResult.effectiveMonths} Mo)
                      </span>
                    </div>

                    {/* Total Repayable Amount */}
                    <div className="pt-1">
                      <div className="text-[11px] text-slate-500 font-semibold">
                        Total Maturity / Return Amount
                      </div>
                      <div className="text-3xl font-black tracking-tight text-[#5F259F] dark:text-purple-300">
                        ₹{calcResult.totalMaturityAmount.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-2 pt-2 border-t border-purple-100 dark:border-purple-900/30 text-xs">
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span>Principal:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          ₹{calcResult.principal.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                          Accrued Interest:
                        </span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400">
                          +₹{calcResult.accruedInterest.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span>Monthly Equivalent:</span>
                        <span className="font-bold">
                          ₹{calcResult.monthlyInterest.toLocaleString('en-IN')}/mo
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span>Daily Accrual:</span>
                        <span className="font-mono text-[11px]">
                          ₹{calcResult.dailyInterest.toLocaleString('en-IN')}/day
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span>Effective Annual Rate:</span>
                        <span className="font-mono text-[11px] text-[#5F259F] dark:text-purple-300 font-bold">
                          {calcResult.annualEquivalentRate}% p.a.
                        </span>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-[11px] text-purple-900 dark:text-purple-200 border border-purple-500/20 flex gap-2 items-start">
                      <Info className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                      <span>
                        Under {calcType === 'SIMPLE' ? 'Simple Interest' : 'Compound Interest'}, ₹{calcPrincipal.toLocaleString('en-IN')} grows by ₹{calcResult.accruedInterest.toLocaleString('en-IN')} at {calcRate}% {calcPeriod === 'MONTHLY' ? 'p.m.' : 'p.a.'}.
                      </span>
                    </div>
                  </div>

                  {/* Save to Ledger Actions */}
                  <div className="pt-4 space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Record This In My Khaata:
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveCalcToLedger('GIVEN')}
                        className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                        <span>I Lent This (Given)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveCalcToLedger('BORROWED')}
                        className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/20 transition-all"
                      >
                        <ArrowDownLeft className="w-4 h-4" />
                        <span>I Borrowed This</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: BORROW & LEND LEDGER (KHAATA) */}
          {/* ============================================================== */}
          {activeTab === 'LEDGER' && (
            <div className="space-y-5">
              {/* Summary Metrics Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Given (Receivable) */}
                <div
                  className={`p-4 rounded-2xl border ${
                    isDark
                      ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                      : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                      Given (Receivable)
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600">
                      Lent
                    </span>
                  </div>
                  <div className="text-xl font-black">
                    ₹{ledgerMetrics.totalGivenTotal.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    ₹{ledgerMetrics.totalGivenPrincipal.toLocaleString('en-IN')} principal + ₹{ledgerMetrics.totalGivenAccruedInterest.toLocaleString('en-IN')} interest
                  </div>
                </div>

                {/* Borrowed (Payable) */}
                <div
                  className={`p-4 rounded-2xl border ${
                    isDark
                      ? 'bg-amber-950/20 border-amber-900/40 text-amber-300'
                      : 'bg-amber-50/70 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <ArrowDownLeft className="w-3.5 h-3.5 text-amber-600" />
                      Borrowed (Payable)
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600">
                      Taken
                    </span>
                  </div>
                  <div className="text-xl font-black">
                    ₹{ledgerMetrics.totalBorrowedTotal.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                    ₹{ledgerMetrics.totalBorrowedPrincipal.toLocaleString('en-IN')} principal + ₹{ledgerMetrics.totalBorrowedAccruedInterest.toLocaleString('en-IN')} interest
                  </div>
                </div>

                {/* Net Position */}
                <div
                  className={`p-4 rounded-2xl border ${
                    ledgerMetrics.netPosition >= 0
                      ? isDark
                        ? 'bg-purple-950/30 border-purple-900/40 text-purple-200'
                        : 'bg-purple-50/70 border-purple-200 text-purple-900'
                      : isDark
                      ? 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                      : 'bg-rose-50/70 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Net Position
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300">
                      Balance
                    </span>
                  </div>
                  <div className="text-xl font-black">
                    {ledgerMetrics.netPosition >= 0 ? '+' : ''}₹{ledgerMetrics.netPosition.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] font-semibold mt-0.5 opacity-80">
                    {ledgerMetrics.netPosition >= 0 ? 'You are net owed by others' : 'You net owe others'}
                  </div>
                </div>
              </div>

              {/* Action & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Filter Pills */}
                  <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-purple-950/40 border border-slate-200 dark:border-purple-900/30">
                    {(['ALL', 'GIVEN', 'BORROWED'] as const).map(tab => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setLedgerFilter(tab)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          ledgerFilter === tab
                            ? 'bg-[#5F259F] text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {tab === 'ALL' ? 'All Loans' : tab === 'GIVEN' ? 'Given (Lent)' : 'Borrowed'}
                      </button>
                    ))}
                  </div>

                  {/* Search */}
                  <div className="relative flex-1 sm:w-52">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search person or note..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className={`w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs focus:outline-none ${
                        isDark
                          ? 'bg-[#291E3B] border-purple-900/40 text-white placeholder-slate-500'
                          : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Add Record Trigger */}
                <button
                  type="button"
                  onClick={() => setIsAddFormOpen(true)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#5F259F] hover:bg-[#4E1E82] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20 transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record New Loan</span>
                </button>
              </div>

              {/* ADD RECORD INLINE MODAL / DRAWER */}
              {isAddFormOpen && (
                <form
                  onSubmit={handleCreateLoanRecord}
                  className={`p-5 rounded-2xl border space-y-4 animate-fadeIn ${
                    isDark
                      ? 'bg-[#251A36] border-purple-700/50 text-white'
                      : 'bg-purple-50/40 border-purple-200 text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between border-b pb-3 border-purple-100 dark:border-purple-900/30">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#5F259F] text-white flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-extrabold">New Loan Contract / Udhaar Entry</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddFormOpen(false)}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Loan Direction */}
                    <div className="sm:col-span-2">
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                        Loan Direction *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormType('GIVEN')}
                          className={`py-2 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                            formType === 'GIVEN'
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                              : isDark
                              ? 'bg-[#1C1427] border-purple-900/30 text-slate-400'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          <ArrowUpRight className="w-4 h-4" />
                          <span>Money Given (I Lent)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormType('BORROWED')}
                          className={`py-2 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                            formType === 'BORROWED'
                              ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20'
                              : isDark
                              ? 'bg-[#1C1427] border-purple-900/30 text-slate-400'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          <ArrowDownLeft className="w-4 h-4" />
                          <span>Money Borrowed (I Owe)</span>
                        </button>
                      </div>
                    </div>

                    {/* Person Name */}
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                        {formType === 'GIVEN' ? 'Borrower Name (Who received)' : 'Lender Name (Who lent you)'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={e => setFormName(e.target.value)}
                        placeholder="e.g. Rohan Verma, Suresh Patil"
                        className={`w-full px-3 py-2 rounded-xl border font-semibold focus:outline-none ${
                          isDark ? 'bg-[#1C1427] border-purple-900/40 text-white' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>

                    {/* Principal Amount */}
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                        Principal Amount (₹ INR) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formPrincipal || ''}
                        onChange={e => setFormPrincipal(parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 25000"
                        className={`w-full px-3 py-2 rounded-xl border font-bold text-sm focus:outline-none ${
                          isDark ? 'bg-[#1C1427] border-purple-900/40 text-white' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                        Phone Number (For WhatsApp reminders)
                      </label>
                      <input
                        type="tel"
                        value={formPhone}
                        onChange={e => setFormPhone(e.target.value)}
                        placeholder="+91 98450 12345"
                        className={`w-full px-3 py-2 rounded-xl border font-mono focus:outline-none ${
                          isDark ? 'bg-[#1C1427] border-purple-900/40 text-white' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>

                    {/* UPI ID */}
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                        UPI ID (For direct payment link)
                      </label>
                      <input
                        type="text"
                        value={formUpi}
                        onChange={e => setFormUpi(e.target.value)}
                        placeholder="e.g. rohan@okhdfcbank"
                        className={`w-full px-3 py-2 rounded-xl border font-mono focus:outline-none ${
                          isDark ? 'bg-[#1C1427] border-purple-900/40 text-white' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>

                    {/* Rate & Period */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                          Interest Rate (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formRate}
                          onChange={e => setFormRate(Math.max(0, parseFloat(e.target.value) || 0))}
                          className={`w-full px-3 py-2 rounded-xl border font-bold focus:outline-none ${
                            isDark ? 'bg-[#1C1427] border-purple-900/40 text-white' : 'bg-white border-slate-200'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                          Period
                        </label>
                        <select
                          value={formPeriod}
                          onChange={e => setFormPeriod(e.target.value as any)}
                          className={`w-full px-3 py-2 rounded-xl border font-bold focus:outline-none ${
                            isDark ? 'bg-[#1C1427] border-purple-900/40 text-white' : 'bg-white border-slate-200'
                          }`}
                        >
                          <option value="ANNUAL">% p.a. (Annual)</option>
                          <option value="MONTHLY">% p.m. (Monthly)</option>
                        </select>
                      </div>
                    </div>

                    {/* Interest Formula */}
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                        Interest Type
                      </label>
                      <select
                        value={formInterestType}
                        onChange={e => setFormInterestType(e.target.value as any)}
                        className={`w-full px-3 py-2 rounded-xl border font-bold focus:outline-none ${
                          isDark ? 'bg-[#1C1427] border-purple-900/40 text-white' : 'bg-white border-slate-200'
                        }`}
                      >
                        <option value="SIMPLE">Simple Interest (SI)</option>
                        <option value="COMPOUND">Compound Interest (CI)</option>
                      </select>
                    </div>

                    {/* Start Date */}
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                        Date Given / Borrowed *
                      </label>
                      <input
                        type="date"
                        required
                        value={formStartDate}
                        onChange={e => setFormStartDate(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border font-semibold focus:outline-none ${
                          isDark ? 'bg-[#1C1427] border-purple-900/40 text-white' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                        Target Due Date
                      </label>
                      <input
                        type="date"
                        value={formDueDate}
                        onChange={e => setFormDueDate(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border font-semibold focus:outline-none ${
                          isDark ? 'bg-[#1C1427] border-purple-900/40 text-white' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>

                    {/* Purpose / Notes */}
                    <div className="sm:col-span-2">
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                        Purpose / Note
                      </label>
                      <input
                        type="text"
                        value={formNotes}
                        onChange={e => setFormNotes(e.target.value)}
                        placeholder="e.g. Emergency medical expenses, shop inventory, friendly bridge loan"
                        className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                          isDark ? 'bg-[#1C1427] border-purple-900/40 text-white' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddFormOpen(false)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold ${
                        isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#5F259F] hover:bg-[#4E1E82] text-white text-xs font-extrabold shadow-md shadow-purple-600/20"
                    >
                      Save Contract to Ledger
                    </button>
                  </div>
                </form>
              )}

              {/* Records List */}
              {filteredRecords.length === 0 ? (
                <div
                  className={`p-10 rounded-2xl border text-center space-y-3 ${
                    isDark ? 'bg-[#221731] border-purple-900/30' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <BookOpen className="w-10 h-10 mx-auto text-slate-400 opacity-60" />
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    No loan records match your filter
                  </div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Record money you have lent to friends or borrowed for emergencies. We automatically calculate interest accrual every day.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAddFormOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5F259F] text-white text-xs font-bold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add First Loan Record</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredRecords.map(rec => {
                    const isGiven = rec.type === 'GIVEN';
                    const isSettled = rec.status === 'SETTLED';

                    // Compute live accrued interest
                    const liveRes = calculateLoanInterest({
                      principal: rec.principalAmount,
                      rate: rec.interestRate,
                      period: rec.interestPeriod,
                      type: rec.interestType,
                      startDate: rec.startDate,
                      endDate: todayStr
                    });

                    // Check if overdue
                    const isOverdue =
                      !isSettled &&
                      rec.dueDate &&
                      new Date(rec.dueDate).getTime() < new Date(todayStr).getTime();

                    return (
                      <div
                        key={rec.id}
                        className={`p-4 rounded-2xl border transition-all hover:shadow-md ${
                          isSettled
                            ? isDark
                              ? 'bg-slate-900/40 border-slate-800 opacity-60'
                              : 'bg-slate-50 border-slate-200 opacity-65'
                            : isDark
                            ? 'bg-[#251A36] border-purple-900/30 text-white'
                            : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Left: Person & Badges */}
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm shadow-sm ${
                                isGiven
                                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                                  : 'bg-amber-600 text-white shadow-amber-600/20'
                              }`}
                            >
                              {isGiven ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                            </div>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-extrabold">{rec.personName}</h4>
                                <span
                                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                    isGiven
                                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20'
                                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20'
                                  }`}
                                >
                                  {isGiven ? 'Money Lent (Receivable)' : 'Money Borrowed (Payable)'}
                                </span>

                                {isSettled ? (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    ✓ Settled
                                  </span>
                                ) : isOverdue ? (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    Overdue
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300">
                                    Active ({liveRes.effectiveDays}d elapsed)
                                  </span>
                                )}
                              </div>

                              {/* Subtitle / Details */}
                              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1 flex-wrap">
                                {rec.phoneNumber && (
                                  <span className="flex items-center gap-1">
                                    <Smartphone className="w-3 h-3 text-slate-400" />
                                    {rec.phoneNumber}
                                  </span>
                                )}
                                {rec.upiId && (
                                  <span className="font-mono text-[11px] text-[#5F259F] dark:text-purple-300">
                                    • {rec.upiId}
                                  </span>
                                )}
                                <span className="font-semibold text-slate-400">
                                  • Started: {rec.startDate}
                                </span>
                                {rec.dueDate && (
                                  <span
                                    className={`font-semibold ${
                                      isOverdue ? 'text-rose-600 font-bold' : 'text-slate-400'
                                    }`}
                                  >
                                    • Due: {rec.dueDate}
                                  </span>
                                )}
                              </div>

                              {rec.notes && (
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic mt-1">
                                  "{rec.notes}"
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right: Amounts & Status */}
                          <div className="text-left sm:text-right shrink-0">
                            <div className="text-lg font-black tracking-tight">
                              ₹{liveRes.totalMaturityAmount.toLocaleString('en-IN')}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Principal ₹{rec.principalAmount.toLocaleString('en-IN')}{' '}
                              {rec.interestRate > 0 && (
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                  + ₹{liveRes.accruedInterest.toLocaleString('en-IN')} ({rec.interestRate}%{' '}
                                  {rec.interestPeriod === 'MONTHLY' ? 'p.m.' : 'p.a.'})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Actions Footer */}
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-purple-900/30 flex items-center justify-between gap-2 flex-wrap">
                          <div className="text-[11px] text-slate-400 font-mono">
                            {rec.interestRate === 0
                              ? '0% Interest-free Friendly Loan'
                              : `${rec.interestType === 'SIMPLE' ? 'Simple Interest' : 'Compound Interest'} • ₹${liveRes.dailyInterest}/day`}
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* WhatsApp Reminder (Only for Given/Lent) */}
                            {isGiven && !isSettled && (
                              <button
                                type="button"
                                onClick={() => handleShareWhatsApp(rec, liveRes.accruedInterest, liveRes.totalMaturityAmount)}
                                className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1 border border-emerald-500/20 transition-colors"
                                title="Send WhatsApp Reminder with polite breakdown and UPI link"
                              >
                                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>WhatsApp Reminder</span>
                              </button>
                            )}

                            {/* Pay via UPI (For Borrowed/Payable) */}
                            {!isGiven && !isSettled && onOpenMakePayment && (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onOpenMakePayment({
                                    name: rec.personName,
                                    upiId: rec.upiId || 'lender@upi',
                                    amount: liveRes.totalMaturityAmount,
                                    category: 'LOAN_REPAYMENT'
                                  });
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-[#5F259F] hover:bg-[#4E1E82] text-white font-extrabold text-xs flex items-center gap-1 shadow-sm transition-all"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Pay ₹{liveRes.totalMaturityAmount.toLocaleString('en-IN')} via UPI</span>
                              </button>
                            )}

                            {/* Mark Settled Toggle */}
                            <button
                              type="button"
                              onClick={() => {
                                updateLoanRecord(rec.id, {
                                  status: isSettled ? 'PENDING' : 'SETTLED',
                                  settledAmount: isSettled ? undefined : liveRes.totalMaturityAmount
                                });
                                if (!isSettled) {
                                  try {
                                    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
                                  } catch (e) {}
                                }
                              }}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                                isSettled
                                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                  : 'bg-purple-500/10 hover:bg-purple-500/20 text-[#5F259F] dark:text-purple-300 border border-purple-500/20'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isSettled ? 'Mark Unsettled' : 'Mark Settled'}</span>
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete record for ${rec.personName}?`)) {
                                  deleteLoanRecord(rec.id);
                                }
                              }}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Delete contract"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
