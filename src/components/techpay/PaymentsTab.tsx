import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  Smartphone,
  Building2,
  Send,
  ArrowRightLeft,
  Tv,
  Zap,
  Droplets,
  Wifi,
  Flame,
  CreditCard,
  GraduationCap,
  Car,
  Landmark,
  ShieldCheck,
  RefreshCw,
  Clock,
  ChevronRight,
  User,
  Plus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { BillPaymentModal, BillCategoryType } from './BillPaymentModal';
import { RequestMoneyModal } from './RequestMoneyModal';
import { ReceiveMoneyModal } from './ReceiveMoneyModal';
import confetti from 'canvas-confetti';

interface PaymentsTabProps {
  onOpenMakePayment: (defaultRecipient?: any) => void;
  onNavigateSection?: (section: string) => void;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({
  onOpenMakePayment,
  onNavigateSection
}) => {
  const {
    activeProfile,
    accountBalance,
    autoPayMandates,
    toggleAutoPay,
    formatPrivateAmount,
    formatMaskedAccount,
    formatMaskedUpi,
    isBalanceRevealed,
    setIsCheckBalanceOpen,
    theme
  } = useApp();

  const isDark = theme === 'dark';

  const [billCategory, setBillCategory] = useState<BillCategoryType | null>(null);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'TRANSFERS' | 'BILLS' | 'AUTOPAY'>('TRANSFERS');

  const bbpsBillItems = [
    { id: 'mobile', label: 'Mobile Recharge', icon: Smartphone, color: 'text-indigo-600' },
    { id: 'electricity', label: 'Electricity Bill', icon: Zap, color: 'text-amber-500' },
    { id: 'dth', label: 'DTH Recharge', icon: Tv, color: 'text-violet-600' },
    { id: 'water', label: 'Water Utility', icon: Droplets, color: 'text-cyan-500' },
    { id: 'broadband', label: 'Broadband / Wi-Fi', icon: Wifi, color: 'text-blue-500' },
    { id: 'gas', label: 'Piped Gas / LPG', icon: Flame, color: 'text-rose-500' },
    { id: 'card', label: 'Credit Card Bill', icon: CreditCard, color: 'text-emerald-600' },
    { id: 'loan', label: 'Loan Repayment', icon: Building2, color: 'text-purple-600' },
    { id: 'education', label: 'School / College Fees', icon: GraduationCap, color: 'text-indigo-500' },
    { id: 'fastag', label: 'FASTag Recharge', icon: Car, color: 'text-orange-500' },
    { id: 'municipal', label: 'Municipal Property Tax', icon: Landmark, color: 'text-teal-600' }
  ];

  return (
    <div className="space-y-6 pb-20 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-[#21152D] rounded-3xl border border-[#E8E1F2] dark:border-[#3D2854] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold text-[#172033] dark:text-white flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-[#5F259F]" />
            <span>Payments & Transfers Hub</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Instant UPI transfers, BBPS utility bill payments, and recurring AutoPay mandates.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-purple-950/40 border border-slate-200 dark:border-purple-900/30">
          {(['TRANSFERS', 'BILLS', 'AUTOPAY'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveSubTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === tab
                  ? 'bg-[#5F259F] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab === 'TRANSFERS' ? 'Money Transfers' : tab === 'BILLS' ? 'Recharge & Bills' : 'AutoPay'}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: MONEY TRANSFERS */}
      {(activeSubTab === 'TRANSFERS' || activeSubTab === 'BILLS') && (
        <div className="bg-white dark:bg-[#21152D] rounded-3xl border border-[#E8E1F2] dark:border-[#3D2854] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2 border-purple-100 dark:border-purple-900/30">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
              Transfer Money via UPI
            </h2>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              24×7 Instant Settlement
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-1">
            {/* To Mobile */}
            <button
              type="button"
              onClick={() => onOpenMakePayment({ name: '', upiId: '', category: 'TRANSFER' })}
              className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100/60 dark:hover:bg-purple-900/50 border border-purple-100 dark:border-purple-900/30 flex flex-col items-center group transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-2">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">To Mobile</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Send via phone number</span>
            </button>

            {/* To Bank / IFSC */}
            <button
              type="button"
              onClick={() => onOpenMakePayment({ name: '', upiId: '', category: 'BANK_TRANSFER' })}
              className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100/60 dark:hover:bg-purple-900/50 border border-purple-100 dark:border-purple-900/30 flex flex-col items-center group transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-2">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">To Bank Account</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Transfer via Account & IFSC</span>
            </button>

            {/* Scan Any QR */}
            <button
              type="button"
              onClick={() => onNavigateSection?.('scan')}
              className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100/60 dark:hover:bg-purple-900/50 border border-purple-100 dark:border-purple-900/30 flex flex-col items-center group transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#38146B] to-[#5F259F] text-white flex items-center justify-center shadow-md shadow-[#5F259F]/30 group-hover:scale-105 transition-transform mb-2">
                <QrCode className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-[#5F259F] dark:text-purple-300">Scan Any QR</span>
              <span className="text-[10px] text-slate-400 mt-0.5">BharatQR / UPI merchant</span>
            </button>

            {/* Request Money */}
            <button
              type="button"
              onClick={() => setIsRequestOpen(true)}
              className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100/60 dark:hover:bg-purple-900/50 border border-purple-100 dark:border-purple-900/30 flex flex-col items-center group transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-2">
                <User className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">Request Money</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Collect from contact</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: BBPS RECHARGE & BILL PAYMENTS */}
      <div className="bg-white dark:bg-[#21152D] rounded-3xl border border-[#E8E1F2] dark:border-[#3D2854] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-2 border-purple-100 dark:border-purple-900/30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
              ✓
            </div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
              Bharat Bill Payment System (BBPS)
            </h2>
          </div>
          <span className="text-[10px] text-slate-400">Zero Convenience Fee</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {bbpsBillItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setBillCategory(item.id as BillCategoryType)}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-purple-950/30 hover:bg-purple-50 dark:hover:bg-purple-900/40 border border-slate-200 dark:border-purple-900/30 text-left flex items-center gap-3 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1C1427] border border-slate-200 dark:border-purple-800 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Instant Receipt</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 3: AUTOPAY MANDATES */}
      {(activeSubTab === 'AUTOPAY' || activeSubTab === 'TRANSFERS') && (
        <div className="bg-white dark:bg-[#21152D] rounded-3xl border border-[#E8E1F2] dark:border-[#3D2854] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2 border-purple-100 dark:border-purple-900/30">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#5F259F]" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                UPI AutoPay Mandates ({autoPayMandates.length})
              </h2>
            </div>
            <span className="text-[10px] text-slate-400">RBI E-Mandate Regulated</span>
          </div>

          <div className="space-y-3">
            {autoPayMandates.map(mandate => (
              <div
                key={mandate.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-purple-900/30 bg-slate-50/50 dark:bg-purple-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#5F259F] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {mandate.title}
                      </span>
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                          mandate.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        }`}
                      >
                        {mandate.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {mandate.merchant} • Next Debit: {mandate.nextDebitDate}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-purple-900/30">
                  <div className="text-left sm:text-right">
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      ₹{mandate.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      {mandate.frequency}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleAutoPay(mandate.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      mandate.status === 'ACTIVE'
                        ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {mandate.status === 'ACTIVE' ? 'Pause AutoPay' : 'Resume'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODALS */}
      {billCategory && (
        <BillPaymentModal
          isOpen={Boolean(billCategory)}
          initialCategory={billCategory}
          onClose={() => setBillCategory(null)}
        />
      )}

      {isRequestOpen && (
        <RequestMoneyModal
          isOpen={isRequestOpen}
          onClose={() => setIsRequestOpen(false)}
        />
      )}

      {isReceiveOpen && (
        <ReceiveMoneyModal
          isOpen={isReceiveOpen}
          onClose={() => setIsReceiveOpen(false)}
        />
      )}
    </div>
  );
};
