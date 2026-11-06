import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  Smartphone,
  Building2,
  Send,
  ArrowRightLeft,
  Lock,
  Search,
  Zap,
  Droplets,
  Wifi,
  Flame,
  CreditCard,
  Shield,
  GraduationCap,
  Scale,
  Calculator,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Coins,
  Copy,
  Check,
  Tv,
  Car,
  Landmark,
  FileText,
  PieChart,
  HelpCircle,
  Bell,
  Wallet,
  Gift,
  Award,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  X,
  Eye,
  EyeOff,
  Percent,
  PiggyBank,
  BookOpen,
  LifeBuoy,
  RefreshCw,
  Sun,
  Moon,
  Receipt
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { ReceiveMoneyModal } from './ReceiveMoneyModal';
import { RequestMoneyModal } from './RequestMoneyModal';
import { BillPaymentModal, BillCategoryType } from './BillPaymentModal';
import { GstCalculatorModal } from './GstCalculatorModal';
import { IncomeTaxModal } from './IncomeTaxModal';

interface PaymentHomeProps {
  onOpenMakePayment: (defaultRecipient?: { name: string; upiId: string; amount?: number; category?: string; location?: any }) => void;
  onNavigateSection: (section: string) => void;
  onSelectTransaction: (txId: string) => void;
}

export const PaymentHome: React.FC<PaymentHomeProps> = ({
  onOpenMakePayment,
  onNavigateSection,
  onSelectTransaction
}) => {
  const {
    accountBalance,
    monthlyIncome,
    totalLockedAmount,
    unpaidLockedAmount,
    safeDiscretionaryBudget,
    currentDiscretionarySpent,
    commitments,
    transactions,
    activeProfile,
    isPrivacyMode,
    togglePrivacyMode,
    isBalanceRevealed,
    setIsCheckBalanceOpen,
    formatPrivateAmount,
    activeLocation,
    setActiveLocation,
    theme,
    toggleTheme,
    walletBalance,
    rewardsCount
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showAllBills, setShowAllBills] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [scratchedCardIndex, setScratchedCardIndex] = useState<number | null>(null);

  // Modals state
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [billModalCategory, setBillModalCategory] = useState<BillCategoryType | null>(null);
  const [isGstOpen, setIsGstOpen] = useState(false);
  const [isTaxCalcOpen, setIsTaxCalcOpen] = useState(false);

  // Promotional Banner Carousel State
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const banners = useMemo(() => [
    {
      id: 1,
      badge: 'Budget Vault',
      title: 'Lock Your Rent & EMIs Safely',
      subtitle: 'Never accidentally overspend on essentials • Automatic salary reserve',
      ctaText: 'Explore Vault',
      action: () => onNavigateSection('budgets'),
      gradient: 'from-[#35145F] via-[#5F259F] to-[#8B4DCC]',
      accentBg: 'bg-white/10 text-white',
      accentBorder: 'border-white/20',
      icon: Lock,
      tag: '0% Overspending'
    },
    {
      id: 2,
      badge: '24K Digital Gold',
      title: 'Augmont 999.9 Pure Gold',
      subtitle: 'Live Bullion Rate ₹7,865/g • Start micro-investing with just ₹10',
      ctaText: 'Buy Gold',
      action: () => onNavigateSection('wealth'),
      gradient: 'from-[#78350F] via-[#B45309] to-[#D97706]',
      accentBg: 'bg-amber-400/20 text-amber-200',
      accentBorder: 'border-amber-400/30',
      icon: Coins,
      tag: 'Insured Vaults'
    },
    {
      id: 3,
      badge: 'TaxSaathi AI CA',
      title: 'Budget 2024 Section 115BAC',
      subtitle: 'Zero income tax up to ₹7.75 Lakh • AI-guided statutory deduction check',
      ctaText: 'Ask CA Saathi',
      action: () => onNavigateSection('tax'),
      gradient: 'from-[#064E3B] via-[#047857] to-[#10B981]',
      accentBg: 'bg-emerald-400/20 text-emerald-200',
      accentBorder: 'border-emerald-400/30',
      icon: Scale,
      tag: 'Verified Rules'
    },
    {
      id: 4,
      badge: 'Direct SIPs',
      title: 'Save ₹46,800 Tax u/s 80C',
      subtitle: 'Curated ELSS Tax Saver & Nifty 50 Index funds • 0% Brokerage',
      ctaText: 'Start SIP',
      action: () => onNavigateSection('wealth'),
      gradient: 'from-[#1E1B4B] via-[#4338CA] to-[#6366F1]',
      accentBg: 'bg-indigo-400/20 text-indigo-200',
      accentBorder: 'border-indigo-400/30',
      icon: TrendingUp,
      tag: '+16.4% 3Y CAGR'
    },
    {
      id: 5,
      badge: 'Guaranteed Deposits',
      title: 'Earn Up to 8.10% p.a. Fixed Returns',
      subtitle: 'Book digital FDs with RBI-regulated banks & AAA NBFCs in 2 mins',
      ctaText: 'Book Deposit',
      action: () => onNavigateSection('wealth'),
      gradient: 'from-[#4C1D95] via-[#6D28D9] to-[#8B5CF6]',
      accentBg: 'bg-purple-400/20 text-purple-200',
      accentBorder: 'border-purple-400/30',
      icon: Landmark,
      tag: 'DICGC Insured'
    }
  ], [onNavigateSection]);

  // Auto-sliding banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(activeProfile.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const freeSpendingRemaining = Math.max(0, safeDiscretionaryBudget - currentDiscretionarySpent);

  // Scratchcard handler
  const handleScratch = (idx: number) => {
    setScratchedCardIndex(idx);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  // Recent transactions
  const recentTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions.slice(0, 5);
    const q = searchQuery.toLowerCase();
    return transactions.filter(t =>
      t.recipientName.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.location?.city.toLowerCase().includes(q) ||
      t.amount.toString().includes(q)
    ).slice(0, 5);
  }, [transactions, searchQuery]);

  return (
    <div className="space-y-4 sm:space-y-5 pb-8 animate-fadeIn max-w-4xl mx-auto">
      {/* ================================================================ */}
      {/* 1. HEADER ACCOUNT & PROFILE INFORMATION SECTION                 */}
      {/* ================================================================ */}
      <div className="bg-gradient-to-r from-[#35145F] via-[#5F259F] to-[#4A1D82] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-purple-900/30 relative overflow-hidden">
        {/* Subtle decorative background rings */}
        <div className="absolute -right-8 -bottom-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none blur-xl"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          {/* Left: User Profile & Location Details */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => onNavigateSection('profile')}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-purple-200 text-[#35145F] font-black text-lg flex items-center justify-center border-2 border-white/80 shadow-sm shrink-0 cursor-pointer hover:scale-105 transition-transform"
            >
              {activeProfile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-purple-200/90 font-medium">Hello,</span>
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-white">{activeProfile.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center gap-1 text-[11px] text-purple-200/80 hover:text-white mt-0.5 group text-left"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="font-semibold truncate max-w-[200px] sm:max-w-[260px]">{activeLocation}</span>
                <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right: Connected Bank Account & Check Balance */}
          <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
            <div className="text-left sm:text-right">
              <div className="flex items-center sm:justify-end gap-1.5 text-[11px] text-purple-200/80">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>HDFC Bank •••• 4892</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5 mt-0.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-white">
                  {formatPrivateAmount(accountBalance, isBalanceRevealed)}
                </span>
                <button
                  type="button"
                  onClick={togglePrivacyMode}
                  title="Toggle Balance Visibility"
                  className="p-1 rounded-lg hover:bg-white/10 text-purple-200 transition-colors"
                >
                  {isPrivacyMode && !isBalanceRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCheckBalanceOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white text-[#35145F] hover:bg-purple-50 font-extrabold text-xs shadow-sm hover:shadow active:scale-95 transition-all shrink-0 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-[#5F259F] fill-[#5F259F]" />
              <span>Check Balance</span>
            </button>
          </div>
        </div>

        {/* Universal Search Bar */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="relative">
            <Search className="w-4 h-4 text-purple-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts, mobile number, merchant name, or billers..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-[#172033] placeholder-purple-200 text-xs border border-white/15 focus:outline-none focus:border-white transition-all shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 2. PROMOTIONAL BANNER CAROUSEL (SECTION 3 OF PROMPT)             */}
      {/* ================================================================ */}
      <div className="relative rounded-2xl overflow-hidden shadow-xs border border-[#E8E1F2] dark:border-[#3D2854]">
        {banners.map((b, idx) => {
          const Icon = b.icon;
          const isActive = idx === currentBannerIndex;

          return (
            <div
              key={b.id}
              className={`bg-gradient-to-r ${b.gradient} text-white p-4 sm:p-5 transition-opacity duration-500 ${
                isActive ? 'block' : 'hidden'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                      {b.badge}
                    </span>
                    <span className="text-[10px] font-semibold text-white/80">{b.tag}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight">{b.title}</h3>
                  <p className="text-xs text-white/85 line-clamp-1">{b.subtitle}</p>
                </div>

                <button
                  type="button"
                  onClick={b.action}
                  className="px-4 py-2 rounded-xl bg-white text-[#172033] font-bold text-xs shrink-0 shadow-sm hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span>{b.ctaText}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#5F259F]" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Carousel indicators */}
        <div className="absolute bottom-2 right-4 flex items-center gap-1.5 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentBannerIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentBannerIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ================================================================ */}
      {/* 3. TRANSFER MONEY SECTION (SECTION 4 OF PROMPT)                 */}
      {/* ================================================================ */}
      <div className="bg-white dark:bg-[#21152D] rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-[#F6F3FA] dark:border-[#2E1F3D]">
          <h2 className="text-xs sm:text-sm font-extrabold text-[#172033] dark:text-white uppercase tracking-wider">
            Transfer Money
          </h2>
          <button
            type="button"
            onClick={() => onNavigateSection('history')}
            className="text-xs font-bold text-[#5F259F] dark:text-[#A855F7] hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Row 1: 4 Primary Transfer Shortcuts */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
          {/* 1. To Mobile Number */}
          <button
            type="button"
            onClick={() => onOpenMakePayment()}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center shadow-xs group-hover:scale-105 active:scale-95 transition-all">
              <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[11px] font-bold text-[#172033] dark:text-slate-200 mt-2 leading-tight">
              To Mobile Number
            </span>
          </button>

          {/* 2. To Bank / UPI ID */}
          <button
            type="button"
            onClick={() => onOpenMakePayment()}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center shadow-xs group-hover:scale-105 active:scale-95 transition-all">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[11px] font-bold text-[#172033] dark:text-slate-200 mt-2 leading-tight">
              To Bank/ UPI ID
            </span>
          </button>

          {/* 3. To Self Account */}
          <button
            type="button"
            onClick={() => onOpenMakePayment({ name: 'Rahul Sharma (Self)', upiId: 'rahul.self@icici' })}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center shadow-xs group-hover:scale-105 active:scale-95 transition-all">
              <ArrowRightLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[11px] font-bold text-[#172033] dark:text-slate-200 mt-2 leading-tight">
              To Self Account
            </span>
          </button>

          {/* 4. Check Bank Balance */}
          <button
            type="button"
            onClick={() => setIsCheckBalanceOpen(true)}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center shadow-xs group-hover:scale-105 active:scale-95 transition-all">
              <Landmark className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[11px] font-bold text-[#172033] dark:text-slate-200 mt-2 leading-tight">
              Check Bank Balance
            </span>
          </button>
        </div>

        {/* Row 2: 4 Secondary Transfer Shortcuts */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center pt-2">
          {/* 5. Scan Any QR */}
          <button
            type="button"
            onClick={() => onNavigateSection('scan')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#718096] dark:text-slate-300 mt-1.5 leading-tight">
              Scan Any QR
            </span>
          </button>

          {/* 6. Request Money */}
          <button
            type="button"
            onClick={() => setIsRequestOpen(true)}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <ArrowRight className="w-5 h-5 -rotate-45" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#718096] dark:text-slate-300 mt-1.5 leading-tight">
              Request Money
            </span>
          </button>

          {/* 7. Receive Money */}
          <button
            type="button"
            onClick={() => setIsReceiveOpen(true)}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <Send className="w-5 h-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#718096] dark:text-slate-300 mt-1.5 leading-tight">
              Receive Money
            </span>
          </button>

          {/* 8. Transaction History */}
          <button
            type="button"
            onClick={() => onNavigateSection('history')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#718096] dark:text-slate-300 mt-1.5 leading-tight">
              History
            </span>
          </button>
        </div>

        {/* My UPI ID Bar */}
        <div className="p-3 rounded-xl bg-[#F6F3FA] dark:bg-[#2A1C39] border border-[#E8E1F2] dark:border-[#3D2854] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#718096] dark:text-purple-200">My UPI ID:</span>
            <span className="font-mono font-bold text-[#5F259F] dark:text-purple-300">{activeProfile.upiId}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyUpi}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#35145F] text-[#5F259F] dark:text-white font-bold text-[11px] border border-[#E8E1F2] dark:border-[#3D2854] flex items-center gap-1 hover:bg-purple-50 transition-colors"
          >
            {copiedUpi ? <Check className="w-3 h-3 text-[#16A36A]" /> : <Copy className="w-3 h-3" />}
            <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 4. QUICK SERVICES (SECTION 5 OF PROMPT)                          */}
      {/* ================================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: TechPay Wallet */}
        <div
          onClick={() => setIsWalletModalOpen(true)}
          className="bg-white dark:bg-[#21152D] rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] p-4 shadow-xs hover:border-[#5F259F]/40 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#718096] dark:text-purple-200">
              <Wallet className="w-3.5 h-3.5 text-[#5F259F] dark:text-purple-400" />
              <span>TechPay Wallet</span>
            </div>
            <div className="text-base font-black text-[#172033] dark:text-white">
              ₹{walletBalance.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-[#16A36A] font-semibold">1-Click Fast Payments</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-[#5F259F] transition-all" />
        </div>

        {/* Card 2: Smart Rewards */}
        <div
          onClick={() => setIsRewardsModalOpen(true)}
          className="bg-white dark:bg-[#21152D] rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] p-4 shadow-xs hover:border-[#5F259F]/40 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#718096] dark:text-purple-200">
              <Gift className="w-3.5 h-3.5 text-amber-500" />
              <span>Smart Rewards</span>
            </div>
            <div className="text-base font-black text-[#172033] dark:text-white">
              {rewardsCount} Scratchcards
            </div>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">₹340 Cashback Won</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-[#5F259F] transition-all" />
        </div>

        {/* Card 3: Smart Financial Insights */}
        <div
          onClick={() => onNavigateSection('expenses')}
          className="bg-white dark:bg-[#21152D] rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] p-4 shadow-xs hover:border-[#5F259F]/40 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#718096] dark:text-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-[#5F259F] dark:text-purple-400" />
              <span>Financial Insights</span>
            </div>
            <div className="text-base font-black text-[#16A36A]">
              {formatPrivateAmount(freeSpendingRemaining)}
            </div>
            <p className="text-[10px] text-[#718096] dark:text-slate-300 font-medium">Safe Discretionary Allowance</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-[#5F259F] transition-all" />
        </div>
      </div>

      {/* ================================================================ */}
      {/* 5. RECHARGE AND BILL PAYMENTS (SECTION 6 OF PROMPT)             */}
      {/* ================================================================ */}
      <div className="bg-white dark:bg-[#21152D] rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-[#F6F3FA] dark:border-[#2E1F3D]">
          <h2 className="text-xs sm:text-sm font-extrabold text-[#172033] dark:text-white uppercase tracking-wider">
            Recharge & Pay Bills
          </h2>
          <button
            type="button"
            onClick={() => setShowAllBills(prev => !prev)}
            className="text-xs font-bold text-[#5F259F] dark:text-[#A855F7] hover:underline flex items-center gap-0.5"
          >
            <span>{showAllBills ? 'Collapse' : 'My Bills'}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAllBills ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* 4-Column Icon Grid (PhonePe Reference Exact Layout) */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
          {/* ROW 1 */}
          <button
            type="button"
            onClick={() => setBillModalCategory('mobile')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              Mobile Recharge
            </span>
          </button>

          <button
            type="button"
            onClick={() => setBillModalCategory('dth')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <Tv className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              DTH
            </span>
          </button>

          <button
            type="button"
            onClick={() => setBillModalCategory('electricity')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              Electricity
            </span>
          </button>

          <button
            type="button"
            onClick={() => setBillModalCategory('credit-card')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              Credit Card Bill
            </span>
          </button>

          {/* ROW 2 */}
          <button
            type="button"
            onClick={() => setBillModalCategory('loan-emi')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              Rent Payment
            </span>
          </button>

          <button
            type="button"
            onClick={() => setBillModalCategory('loan-emi')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              Loan Repayment
            </span>
          </button>

          <button
            type="button"
            onClick={() => setBillModalCategory('education')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              Education Fees
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowAllBills(prev => !prev)}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#5F259F] text-white flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all shadow-xs">
              <ChevronRight className={`w-5 h-5 transition-transform ${showAllBills ? 'rotate-90' : ''}`} />
            </div>
            <span className="text-[11px] font-bold text-[#5F259F] dark:text-purple-300 mt-1.5 leading-tight">
              {showAllBills ? 'Less' : 'See All'}
            </span>
          </button>
        </div>

        {/* Expanded Rows 3 & 4 (when "See All" is clicked) */}
        {showAllBills && (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center pt-3 border-t border-[#F6F3FA] dark:border-[#2E1F3D] animate-fadeIn">
            {/* ROW 3 */}
            <button
              type="button"
              onClick={() => setBillModalCategory('water')}
              className="flex flex-col items-center group"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5">Water Bill</span>
            </button>

            <button
              type="button"
              onClick={() => setBillModalCategory('broadband')}
              className="flex flex-col items-center group"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center">
                <Wifi className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5">Broadband</span>
            </button>

            <button
              type="button"
              onClick={() => setBillModalCategory('gas')}
              className="flex flex-col items-center group"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5">Gas Cylinder</span>
            </button>

            <button
              type="button"
              onClick={() => setBillModalCategory('insurance')}
              className="flex flex-col items-center group"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5">Insurance</span>
            </button>

            {/* ROW 4 */}
            <button
              type="button"
              onClick={() => setBillModalCategory('fastag')}
              className="flex flex-col items-center group"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5">FASTag</span>
            </button>

            <button
              type="button"
              onClick={() => setBillModalCategory('municipal')}
              className="flex flex-col items-center group"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5">Municipal Taxes</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateSection('history')}
              className="flex flex-col items-center group"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5">Subscriptions</span>
            </button>

            <button
              type="button"
              onClick={() => setBillModalCategory('electricity')}
              className="flex flex-col items-center group"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5">Other Bills</span>
            </button>
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* 6. MANAGE YOUR MONEY (SECTION 7 OF PROMPT)                       */}
      {/* ================================================================ */}
      <div className="bg-white dark:bg-[#21152D] rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-[#F6F3FA] dark:border-[#2E1F3D]">
          <h2 className="text-xs sm:text-sm font-extrabold text-[#172033] dark:text-white uppercase tracking-wider">
            Manage Your Money
          </h2>
          <button
            type="button"
            onClick={() => onNavigateSection('budgets')}
            className="text-xs font-bold text-[#5F259F] dark:text-[#A855F7] hover:underline flex items-center gap-0.5"
          >
            <span>Budget Vault</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
          <button
            type="button"
            onClick={() => onNavigateSection('expenses')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <PieChart className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              Expense Tracker
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('budgets')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              Monthly Budget
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('budgets')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              Reserved Money
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('budgets')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              EMI Manager
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('budgets')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <Bell className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              Bill Reminders
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('history')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <RefreshCw className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              AutoPay
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('tax')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              Financial Calendar
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('expenses')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              Spending Analytics
            </span>
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 7. GROW YOUR WEALTH (SECTION 8 OF PROMPT)                        */}
      {/* ================================================================ */}
      <div className="bg-white dark:bg-[#21152D] rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-[#F6F3FA] dark:border-[#2E1F3D]">
          <h2 className="text-xs sm:text-sm font-extrabold text-[#172033] dark:text-white uppercase tracking-wider">
            Grow Your Wealth
          </h2>
          <button
            type="button"
            onClick={() => onNavigateSection('wealth')}
            className="text-xs font-bold text-[#5F259F] dark:text-[#A855F7] hover:underline flex items-center gap-0.5"
          >
            <span>All Wealth Services</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
          <button
            type="button"
            onClick={() => onNavigateSection('wealth')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all relative">
              <Coins className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1 text-[8px] bg-amber-500 text-slate-950 font-black px-1 rounded-full">
                24K
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              Digital Gold
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('wealth')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              SIP
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('wealth')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              Mutual Funds
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('wealth')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all relative">
              <Percent className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1 text-[8px] bg-emerald-600 text-white font-black px-1 rounded-full">
                8.1%
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              Fixed Deposits
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('wealth')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <PiggyBank className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              Recurring Deposits
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('wealth')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <Calculator className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              Savings Calculator
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('wealth')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              Investment Ed.
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('wealth')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-[#172033] dark:text-slate-200 mt-1.5 leading-tight">
              Emergency Fund
            </span>
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 8. TAXSAATHI – PERSONAL CA (SECTION 9 OF PROMPT)                 */}
      {/* ================================================================ */}
      <div className="bg-gradient-to-br from-white via-purple-50/40 to-white dark:from-[#21152D] dark:via-[#2A1C39] dark:to-[#21152D] rounded-2xl border-2 border-[#5F259F]/30 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E1F2] dark:border-[#3D2854]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#5F259F] text-white text-[10px] font-extrabold uppercase">
                TaxSaathi
              </span>
              <span className="text-xs font-bold text-[#16A36A]">Budget 2024 Revised Engine</span>
            </div>
            <h3 className="text-base font-black text-[#172033] dark:text-white">
              TaxSaathi – Your Personal AI Chartered Accountant
            </h3>
            <p className="text-xs text-[#718096] dark:text-slate-300">
              Deterministic statutory verification under Section 115BAC • Zero tax up to ₹7.75 Lakh.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateSection('ai-assistant')}
            className="px-4 py-2.5 rounded-xl bg-[#5F259F] hover:bg-[#35145F] text-white font-extrabold text-xs shadow-sm hover:shadow active:scale-95 transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask CA Saathi</span>
          </button>
        </div>

        {/* 4 Quick Tax Actions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => setIsTaxCalcOpen(true)}
            className="p-3 rounded-xl bg-white dark:bg-[#180E24] border border-[#E8E1F2] dark:border-[#3D2854] hover:border-[#5F259F] text-left transition-all group"
          >
            <Calculator className="w-4 h-4 text-[#5F259F] mb-1.5 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-bold text-[#172033] dark:text-white">Tax Calculator</h4>
            <p className="text-[10px] text-[#718096] dark:text-slate-400">Budget 2024 Slabs</p>
          </button>

          <button
            type="button"
            onClick={() => setIsGstOpen(true)}
            className="p-3 rounded-xl bg-white dark:bg-[#180E24] border border-[#E8E1F2] dark:border-[#3D2854] hover:border-[#5F259F] text-left transition-all group"
          >
            <Receipt className="w-4 h-4 text-[#16A36A] mb-1.5 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-bold text-[#172033] dark:text-white">GST Calculator</h4>
            <p className="text-[10px] text-[#718096] dark:text-slate-400">5%, 12%, 18%, 28%</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('tax')}
            className="p-3 rounded-xl bg-white dark:bg-[#180E24] border border-[#E8E1F2] dark:border-[#3D2854] hover:border-[#5F259F] text-left transition-all group"
          >
            <Scale className="w-4 h-4 text-[#8B4DCC] mb-1.5 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-bold text-[#172033] dark:text-white">Income Tracking</h4>
            <p className="text-[10px] text-[#718096] dark:text-slate-400">Salary, 44ADA & Int.</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('tax')}
            className="p-3 rounded-xl bg-white dark:bg-[#180E24] border border-[#E8E1F2] dark:border-[#3D2854] hover:border-[#5F259F] text-left transition-all group"
          >
            <FileText className="w-4 h-4 text-blue-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-bold text-[#172033] dark:text-white">Tax Reports & AIS</h4>
            <p className="text-[10px] text-[#718096] dark:text-slate-400">ITR-1 Summary</p>
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 9. RECENT TRANSACTIONS (SECTION 10 OF PROMPT)                    */}
      {/* ================================================================ */}
      <div className="bg-white dark:bg-[#21152D] rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-[#F6F3FA] dark:border-[#2E1F3D]">
          <h2 className="text-xs sm:text-sm font-extrabold text-[#172033] dark:text-white uppercase tracking-wider">
            Recent Transactions
          </h2>
          <button
            type="button"
            onClick={() => onNavigateSection('history')}
            className="text-xs font-bold text-[#5F259F] dark:text-[#A855F7] hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#F6F3FA] dark:divide-[#2E1F3D]">
          {recentTransactions.map(tx => {
            const isCredit = tx.type === 'CREDIT';
            const locationStr = tx.location?.city ? `${tx.location.shopName || tx.recipientName}, ${tx.location.city}` : tx.recipientName;

            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx.id)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-[#F6F3FA] dark:hover:bg-[#2A1C39] px-2 rounded-xl cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCredit
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#16A36A] border border-emerald-200 dark:border-emerald-800'
                      : 'bg-purple-50 dark:bg-purple-950/60 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                  }`}>
                    {tx.recipientName.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-extrabold text-[#172033] dark:text-white truncate">
                        {tx.recipientName}
                      </h4>
                      <span className="text-[10px] font-bold text-[#16A36A] bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                        Success
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#718096] dark:text-slate-400 truncate">
                      <span>{tx.date} • {tx.time}</span>
                      <span>•</span>
                      <span className="truncate">{locationStr}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-sm sm:text-base font-black ${
                    isCredit ? 'text-[#16A36A]' : 'text-[#172033] dark:text-white'
                  }`}>
                    {isCredit ? '+' : '-'}{formatPrivateAmount(tx.amount)}
                  </span>
                  <span className="text-[10px] text-[#718096] dark:text-slate-400 block font-mono">
                    {tx.account}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================================ */}
      {/* 10. FINANCIAL INSIGHTS & ALLOCATION SUMMARY                      */}
      {/* ================================================================ */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#21152D] border border-[#E8E1F2] dark:border-[#3D2854] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 flex items-center justify-center font-bold shrink-0">
            <Award className="w-5 h-5 text-[#5F259F]" />
          </div>
          <div>
            <h4 className="font-extrabold text-[#172033] dark:text-white">Tax Compliance Health: Grade A+</h4>
            <p className="text-[#718096] dark:text-slate-300 text-[11px]">
              0 high-risk SFT cash anomalies detected • Fully ready for CPC automated ITR filing.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateSection('tax')}
          className="px-3.5 py-2 rounded-xl bg-[#F6F3FA] dark:bg-[#2A1C39] hover:bg-[#5F259F] text-[#5F259F] hover:text-white dark:text-purple-300 font-bold text-xs border border-[#E8E1F2] dark:border-[#3D2854] transition-all self-start sm:self-auto shrink-0"
        >
          View Audit Health
        </button>
      </div>

      {/* ================================================================ */}
      {/* MODAL 1: LOCATION SELECTION MODAL                                */}
      {/* ================================================================ */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#21152D] rounded-2xl max-w-sm w-full p-5 border border-[#E8E1F2] dark:border-[#3D2854] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F6F3FA] dark:border-[#2E1F3D]">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#5F259F]" />
                <h3 className="text-sm font-extrabold text-[#172033] dark:text-white">Select Current Location</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                'Work • Indiranagar, Bengaluru',
                'Home • Koramangala, Bengaluru',
                'Parents’ Home • Shivaji Nagar, Pune',
                'Office • Cyber City, Gurugram'
              ].map((loc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveLocation(loc);
                    setIsLocationModalOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    activeLocation === loc
                      ? 'bg-purple-50 dark:bg-purple-950/50 border-[#5F259F] text-[#5F259F] dark:text-purple-200 font-bold'
                      : 'border-[#E8E1F2] dark:border-[#3D2854] text-[#172033] dark:text-slate-200 hover:bg-[#F6F3FA] dark:hover:bg-[#2A1C39]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#5F259F] shrink-0" />
                    <span>{loc}</span>
                  </div>
                  {activeLocation === loc && <CheckCircle2 className="w-4 h-4 text-[#5F259F]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL 2: TECHPAY WALLET MODAL                                    */}
      {/* ================================================================ */}
      {isWalletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#21152D] rounded-2xl max-w-sm w-full p-5 border border-[#E8E1F2] dark:border-[#3D2854] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F6F3FA] dark:border-[#2E1F3D]">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#5F259F]" />
                <h3 className="text-sm font-extrabold text-[#172033] dark:text-white">TechPay Wallet</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsWalletModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-center space-y-1">
              <span className="text-[10px] font-bold text-[#718096] dark:text-purple-300 uppercase">Available Wallet Balance</span>
              <div className="text-2xl font-black text-[#5F259F] dark:text-purple-200">
                ₹{walletBalance.toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-[#16A36A] font-semibold">Ready for instant zero-PIN payments</p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#718096] dark:text-purple-200">Quick Top-Up Chips:</span>
              <div className="grid grid-cols-3 gap-2">
                {['₹500', '₹1,000', '₹2,000'].map(chip => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      alert(`Added ${chip} to your TechPay Wallet via HDFC Bank UPI!`);
                      setIsWalletModalOpen(false);
                    }}
                    className="py-2 rounded-xl bg-[#F6F3FA] dark:bg-[#2A1C39] hover:bg-[#5F259F] text-[#172033] dark:text-white hover:text-white font-bold border border-[#E8E1F2] dark:border-[#3D2854] transition-colors"
                  >
                    +{chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL 3: SMART REWARDS SCRATCHCARDS MODAL                        */}
      {/* ================================================================ */}
      {isRewardsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#21152D] rounded-2xl max-w-sm w-full p-5 border border-[#E8E1F2] dark:border-[#3D2854] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F6F3FA] dark:border-[#2E1F3D]">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-extrabold text-[#172033] dark:text-white">Smart Rewards & Milestones</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRewardsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              {[
                { id: 0, reward: '₹25 Cashback', desc: 'On D-Mart UPI payment' },
                { id: 1, reward: '₹50 Gold Coin', desc: 'On 1st Digital Gold buy' },
                { id: 2, reward: '₹100 Off', desc: 'On Swiggy Gourmet' },
                { id: 3, reward: '₹15 Cashback', desc: 'On Electricity bill' }
              ].map(card => {
                const isScratched = scratchedCardIndex === card.id;

                return (
                  <div
                    key={card.id}
                    onClick={() => handleScratch(card.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isScratched
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-950 dark:text-amber-200'
                        : 'bg-gradient-to-tr from-[#35145F] to-[#5F259F] text-white hover:scale-105 shadow-sm'
                    }`}
                  >
                    {isScratched ? (
                      <div className="space-y-1">
                        <span className="text-sm font-black text-amber-600 dark:text-amber-300 block">{card.reward}</span>
                        <p className="text-[10px] text-slate-500 dark:text-slate-300">{card.desc}</p>
                        <span className="text-[9px] font-bold text-[#16A36A]">Credited to Bank</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Gift className="w-6 h-6 mx-auto text-amber-300" />
                        <span className="text-xs font-bold block">Tap to Scratch</span>
                        <span className="text-[9px] opacity-75">PhonePe Reward</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* OTHER FUNCTIONAL MODALS */}
      {isReceiveOpen && (
        <ReceiveMoneyModal
          isOpen={isReceiveOpen}
          onClose={() => setIsReceiveOpen(false)}
        />
      )}

      {isRequestOpen && (
        <RequestMoneyModal
          isOpen={isRequestOpen}
          onClose={() => setIsRequestOpen(false)}
        />
      )}

      {billModalCategory && (
        <BillPaymentModal
          isOpen={Boolean(billModalCategory)}
          onClose={() => setBillModalCategory(null)}
          initialCategory={billModalCategory}
        />
      )}

      {isGstOpen && (
        <GstCalculatorModal
          isOpen={isGstOpen}
          onClose={() => setIsGstOpen(false)}
        />
      )}

      {isTaxCalcOpen && (
        <IncomeTaxModal
          isOpen={isTaxCalcOpen}
          onClose={() => setIsTaxCalcOpen(false)}
        />
      )}
    </div>
  );
};
