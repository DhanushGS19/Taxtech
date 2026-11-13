import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  Smartphone,
  Building2,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Coins,
  Sparkles,
  Clock,
  TrendingUp,
  PieChart,
  Bell,
  User,
  Copy,
  Check,
  Calculator,
  Scale,
  Gift,
  Wallet,
  ExternalLink,
  Shield,
  Info,
  Calendar,
  AlertTriangle,
  Receipt,
  Landmark,
  X,
  KeyRound
} from 'lucide-react';
import { RequestMoneyModal } from './RequestMoneyModal';
import { ReceiveMoneyModal } from './ReceiveMoneyModal';
import { BillPaymentModal, BillCategoryType } from './BillPaymentModal';
import confetti from 'canvas-confetti';

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
    transactions,
    activeProfile,
    privacyLevel,
    privacySettings,
    isBalanceRevealed,
    setIsBalanceRevealed,
    isRecentAmountsRevealed,
    toggleRecentAmountsRevealed,
    triggerBiometricAuth,
    setIsPrivacyShieldModalOpen,
    formatPrivateAmount,
    formatMaskedUpi,
    formatMaskedAccount,
    theme,
    loanRecords,
    setIsLoanTrackerOpen
  } = useApp();

  const isDark = theme === 'dark';

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [billModalCategory, setBillModalCategory] = useState<BillCategoryType | null>(null);
  const [isAccountDetailsOpen, setIsAccountDetailsOpen] = useState(false);

  // Copy Masked / Unmasked UPI ID
  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(activeProfile.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Toggle Balance with Biometric protection if in Secure mode
  const handleToggleBalance = () => {
    if (!isBalanceRevealed) {
      triggerBiometricAuth('Verify Identity to View Available Balance', () => {
        setIsBalanceRevealed(true);
      });
    } else {
      setIsBalanceRevealed(false);
    }
  };

  // Last 3 Transactions for Privacy Preview (as specified by user)
  const recentThreeTxs = useMemo(() => {
    return transactions.slice(0, 3);
  }, [transactions]);

  return (
    <div className="space-y-4 sm:space-y-5 pb-8 animate-fadeIn max-w-3xl mx-auto">
      {/* ================================================================ */}
      {/* SECTION 1: HEADER (CLEAN, NO WORKPLACE LEAK, PRIVACY BADGE)     */}
      {/* ================================================================ */}
      <div className="flex items-center justify-between gap-3 px-1 pt-1">
        {/* Left: User Profile & Warm Greeting */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onNavigateSection('profile')}
            className="relative cursor-pointer group"
            title="Open Profile Settings"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#35145F] to-[#5F259F] text-white font-black text-base flex items-center justify-center border-2 border-white dark:border-[#35145F] shadow-xs group-hover:scale-105 transition-transform">
              {activeProfile.name.charAt(0)}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#16A36A] border-2 border-white dark:border-[#180E24]"></span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-[#172033] dark:text-white tracking-tight">
                Good morning, {activeProfile.name.split(' ')[0]}!
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A36A] shrink-0" />
              <span>Your payments are protected.</span>
            </div>
          </div>
        </div>

        {/* Right: TechPay Privacy Shield & Notifications */}
        <div className="flex items-center gap-2">
          {/* Privacy Shield Pill Button */}
          <button
            type="button"
            onClick={() => setIsPrivacyShieldModalOpen(true)}
            className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 ${
              privacySettings.isEmergencyLocked
                ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200'
                : privacyLevel === 'SECURE'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200'
                : privacyLevel === 'PRIVACY'
                ? 'bg-purple-50 text-[#5F259F] border-purple-200 dark:bg-purple-950/60 dark:text-purple-300'
                : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-purple-900/40 dark:text-slate-300'
            }`}
            title="Configure TechPay Privacy Shield"
          >
            <Shield className="w-3.5 h-3.5 text-[#5F259F] dark:text-purple-300" />
            <span className="hidden sm:inline">Privacy Shield:</span>
            <span className="uppercase text-[10px] tracking-wider font-extrabold">
              {privacySettings.isEmergencyLocked ? 'FROZEN' : privacyLevel}
            </span>
          </button>

          {/* Quick Notification Bell */}
          <button
            type="button"
            onClick={() => onNavigateSection('history')}
            className="p-2.5 rounded-full bg-white dark:bg-[#21152D] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-purple-900/40 border border-[#E8E1F2] dark:border-[#3D2854] shadow-xs relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#5F259F] ring-2 ring-white dark:ring-[#21152D]"></span>
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* SECTION 2: BANK ACCOUNT AND BALANCE (PRIVACY-FIRST CARD)         */}
      {/* ================================================================ */}
      <div className="bg-gradient-to-br from-[#35145F] via-[#5F259F] to-[#4A1D82] text-white rounded-3xl p-5 sm:p-6 shadow-md border border-purple-900/30 relative overflow-hidden space-y-4">
        {/* Subtle background glow */}
        <div className="absolute -right-8 -bottom-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none blur-2xl"></div>

        {/* Top: Connected Bank Account info */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/15">
              <Building2 className="w-4 h-4 text-purple-200" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200/80 block">
                Primary Bank Account
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-white tracking-wide">
                {formatMaskedAccount('HDFC Bank 4892')}
              </span>
            </div>
          </div>

          {/* Masked UPI ID chip */}
          <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-xl text-[11px] font-mono border border-white/10">
            <span className="text-purple-200">
              {formatMaskedUpi(activeProfile.upiId)}
            </span>
            <button
              type="button"
              onClick={handleCopyUpi}
              className="p-1 hover:text-white text-purple-300 transition-colors"
              title="Copy UPI ID"
            >
              {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Middle: Available Balance with Show/Hide toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 pt-1">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-purple-200 font-medium">
              <span>Available Balance</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight mt-1 text-white font-mono">
              {isBalanceRevealed ? (
                `₹${accountBalance.toLocaleString('en-IN')}`
              ) : (
                '₹ ••••••••'
              )}
            </div>
          </div>

          {/* Eye Action Button */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleToggleBalance}
              className="px-4 py-2 rounded-xl bg-white text-[#35145F] hover:bg-purple-50 font-extrabold text-xs shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-2"
            >
              {isBalanceRevealed ? (
                <>
                  <EyeOff className="w-4 h-4 text-[#5F259F]" />
                  <span>Hide Balance</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-[#5F259F]" />
                  <span>Show Balance</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom: View Account Details link & NPCI Security Rule */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/10 text-[11px] relative z-10 text-purple-200/90">
          <button
            type="button"
            onClick={() => setIsAccountDetailsOpen(prev => !prev)}
            className="font-bold underline hover:text-white text-left flex items-center gap-1 transition-colors"
          >
            <span>{isAccountDetailsOpen ? 'Hide Account Details' : 'View Account Details'}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isAccountDetailsOpen ? 'rotate-90' : ''}`} />
          </button>

          <span className="text-[10px] text-purple-200/70 italic">
            🛡️ Safe UPI Rule: Receiving money NEVER requires entering your UPI PIN.
          </span>
        </div>

        {/* Expandable Account Details Drawer */}
        {isAccountDetailsOpen && (
          <div className="mt-3 p-4 rounded-2xl bg-white/10 border border-white/15 text-xs text-white space-y-2.5 animate-fadeIn">
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-purple-200 block text-[10px] uppercase font-bold">Bank Name</span>
                <span className="font-extrabold">HDFC Bank Ltd</span>
              </div>
              <div>
                <span className="text-purple-200 block text-[10px] uppercase font-bold">Account Number</span>
                <span className="font-mono font-bold">•••• •••• •••• 4892</span>
              </div>
              <div>
                <span className="text-purple-200 block text-[10px] uppercase font-bold">IFSC Code</span>
                <span className="font-mono font-bold">HDFC0001234</span>
              </div>
              <div>
                <span className="text-purple-200 block text-[10px] uppercase font-bold">Branch</span>
                <span className="font-semibold">Indiranagar, Bengaluru</span>
              </div>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-purple-200">Daily UPI Transfer Limit:</span>
              <span className="font-bold">₹1,00,000 / day (Remaining: ₹95,450)</span>
            </div>
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* SECTION 3: QUICK PAYMENT ACTIONS (4 PRIMARY UPI ACTIONS)         */}
      {/* ================================================================ */}
      <div className="bg-white dark:bg-[#21152D] rounded-3xl border border-[#E8E1F2] dark:border-[#3D2854] p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-[#F6F3FA] dark:border-[#2E1F3D]">
          <h2 className="text-xs sm:text-sm font-extrabold text-[#172033] dark:text-white uppercase tracking-wider">
            Quick Payment Actions
          </h2>
          <button
            type="button"
            onClick={() => onNavigateSection('payments')}
            className="text-xs font-bold text-[#5F259F] dark:text-[#A855F7] hover:underline flex items-center gap-0.5"
          >
            <span>All Payments</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Prominent Payment Actions */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center pt-1">
          {/* 1. To Mobile Number */}
          <button
            type="button"
            onClick={() => onOpenMakePayment({ name: '', upiId: '', category: 'TRANSFER' })}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center shadow-xs group-hover:scale-105 active:scale-95 transition-all">
              <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[11px] font-bold text-[#172033] dark:text-slate-200 mt-2 leading-tight">
              To Mobile
            </span>
          </button>

          {/* 2. To Bank Account */}
          <button
            type="button"
            onClick={() => onOpenMakePayment({ name: '', upiId: '', category: 'BANK_TRANSFER' })}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center shadow-xs group-hover:scale-105 active:scale-95 transition-all">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[11px] font-bold text-[#172033] dark:text-slate-200 mt-2 leading-tight">
              To Bank
            </span>
          </button>

          {/* 3. Scan & Pay (Elevated Primary QR) */}
          <button
            type="button"
            onClick={() => onNavigateSection('scan')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-[#38146B] to-[#5F259F] text-white flex items-center justify-center shadow-md shadow-[#5F259F]/30 ring-2 ring-[#5F259F]/20 group-hover:scale-105 active:scale-95 transition-all">
              <QrCode className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="text-[11px] font-black text-[#5F259F] dark:text-purple-300 mt-2 leading-tight">
              Scan & Pay
            </span>
          </button>

          {/* 4. Request Money */}
          <button
            type="button"
            onClick={() => setIsRequestOpen(true)}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center shadow-xs group-hover:scale-105 active:scale-95 transition-all">
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[11px] font-bold text-[#172033] dark:text-slate-200 mt-2 leading-tight">
              Request Money
            </span>
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* SECTION 4: RECENT ACTIVITY (TOP 3 ONLY WITH AMOUNT PRIVACY EYE) */}
      {/* ================================================================ */}
      <div className="bg-white dark:bg-[#21152D] rounded-3xl border border-[#E8E1F2] dark:border-[#3D2854] p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-[#F6F3FA] dark:border-[#2E1F3D]">
          <div className="flex items-center gap-2">
            <h2 className="text-xs sm:text-sm font-extrabold text-[#172033] dark:text-white uppercase tracking-wider">
              Recent Activity
            </h2>
            {/* Eye toggle to reveal/hide amounts */}
            <button
              type="button"
              onClick={toggleRecentAmountsRevealed}
              className="p-1 rounded-md text-slate-400 hover:text-[#5F259F] dark:hover:text-purple-300 transition-colors"
              title={isRecentAmountsRevealed ? 'Mask Transaction Amounts' : 'Reveal Transaction Amounts (Biometrics Required)'}
            >
              {isRecentAmountsRevealed ? <Eye className="w-3.5 h-3.5 text-[#16A36A]" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>

          <button
            type="button"
            onClick={() => onNavigateSection('history')}
            className="text-xs font-bold text-[#5F259F] dark:text-[#A855F7] hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* If user enabled "Hide Recent Activity on Home" in Privacy Shield settings */}
        {privacySettings.hideRecentActivityOnHome ? (
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 text-center space-y-2">
            <Shield className="w-6 h-6 mx-auto text-[#5F259F] dark:text-purple-300 opacity-70" />
            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
              Recent activity preview concealed by Privacy Shield
            </p>
            <button
              type="button"
              onClick={() => onNavigateSection('history')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#5F259F] text-white text-[11px] font-bold"
            >
              <span>Authenticate to View in History</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        ) : (
          /* Top 3 Transactions list */
          <div className="divide-y divide-[#F6F3FA] dark:divide-[#2E1F3D]">
            {recentThreeTxs.map(tx => {
              const isCredit = tx.type === 'CREDIT';

              return (
                <div
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx.id)}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-purple-950/30 px-2 rounded-2xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-bold text-xs ${
                        isCredit
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#16A36A] border border-emerald-200 dark:border-emerald-800'
                          : 'bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                      }`}
                    >
                      {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#172033] dark:text-white">
                        {tx.recipientName}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {tx.date} • {tx.time}
                      </div>
                    </div>
                  </div>

                  {/* Amount with privacy mask */}
                  <div className="text-right">
                    <div
                      className={`text-xs sm:text-sm font-black font-mono tracking-tight ${
                        isCredit ? 'text-[#16A36A]' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {isRecentAmountsRevealed
                        ? `${isCredit ? '+' : '-'} ₹${tx.amount.toLocaleString('en-IN')}`
                        : `${isCredit ? '+' : '-'} ₹••••`}
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">
                      {tx.category || 'UPI'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* SECTION 5: FINANCIAL MANAGEMENT & WEALTH SHORTCUTS (UNCLUTTERED) */}
      {/* ================================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* 5A: Financial Management Card */}
        <div className="bg-white dark:bg-[#21152D] rounded-3xl border border-[#E8E1F2] dark:border-[#3D2854] p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-[#F6F3FA] dark:border-[#2E1F3D]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#5F259F] text-white flex items-center justify-center">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#172033] dark:text-white">
                Financial Management
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateSection('budgets')}
              className="text-xs font-bold text-[#5F259F] dark:text-[#A855F7] hover:underline"
            >
              Vault
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <button
              type="button"
              onClick={() => onNavigateSection('budgets')}
              className="p-2.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-100 dark:border-purple-900/30 flex flex-col items-center group transition-all"
            >
              <Lock className="w-4 h-4 text-[#5F259F] dark:text-purple-300 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Budget Vault</span>
              <span className="text-[9px] text-slate-400">Locked Funds</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateSection('expenses')}
              className="p-2.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-100 dark:border-purple-900/30 flex flex-col items-center group transition-all"
            >
              <PieChart className="w-4 h-4 text-[#5F259F] dark:text-purple-300 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Expenses</span>
              <span className="text-[9px] text-slate-400">Analytics</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateSection('budgets')}
              className="p-2.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-100 dark:border-purple-900/30 flex flex-col items-center group transition-all"
            >
              <Calendar className="w-4 h-4 text-[#5F259F] dark:text-purple-300 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">EMI Manager</span>
              <span className="text-[9px] text-slate-400">Due Tracker</span>
            </button>
          </div>
        </div>

        {/* 5B: Wealth & Financial Services Card */}
        <div className="bg-white dark:bg-[#21152D] rounded-3xl border border-[#E8E1F2] dark:border-[#3D2854] p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-[#F6F3FA] dark:border-[#2E1F3D]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#5F259F] text-white flex items-center justify-center">
                <Coins className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#172033] dark:text-white">
                Wealth & Services
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateSection('wealth')}
              className="text-xs font-bold text-[#5F259F] dark:text-[#A855F7] hover:underline"
            >
              Explore
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <button
              type="button"
              onClick={() => onNavigateSection('tax')}
              className="p-2.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-100 dark:border-purple-900/30 flex flex-col items-center group transition-all"
            >
              <Scale className="w-4 h-4 text-[#5F259F] dark:text-purple-300 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">TaxSaathi</span>
              <span className="text-[9px] text-emerald-600 font-semibold">AI CA Vikram</span>
            </button>

            <button
              type="button"
              onClick={() => setIsLoanTrackerOpen(true)}
              className="p-2.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-100 dark:border-purple-900/30 flex flex-col items-center group transition-all"
            >
              <Calculator className="w-4 h-4 text-[#5F259F] dark:text-purple-300 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">P2P Udhaar</span>
              <span className="text-[9px] text-slate-400">Interest Calc</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateSection('wealth')}
              className="p-2.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-100 dark:border-purple-900/30 flex flex-col items-center group transition-all"
            >
              <Coins className="w-4 h-4 text-amber-500 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Gold & SIP</span>
              <span className="text-[9px] text-slate-400">Investments</span>
            </button>
          </div>
        </div>
      </div>

      {/* REQUEST MONEY MODAL */}
      {isRequestOpen && (
        <RequestMoneyModal
          isOpen={isRequestOpen}
          onClose={() => setIsRequestOpen(false)}
        />
      )}

      {/* RECEIVE MONEY MODAL */}
      {isReceiveOpen && (
        <ReceiveMoneyModal
          isOpen={isReceiveOpen}
          onClose={() => setIsReceiveOpen(false)}
        />
      )}

      {/* BILL PAYMENT MODAL */}
      {billModalCategory && (
        <BillPaymentModal
          isOpen={Boolean(billModalCategory)}
          initialCategory={billModalCategory}
          onClose={() => setBillModalCategory(null)}
        />
      )}
    </div>
  );
};
