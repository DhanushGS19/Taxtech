import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  Send,
  Users,
  Building2,
  Receipt,
  Lock,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  MapPin,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

interface PaymentHomeProps {
  onOpenMakePayment: (defaultRecipient?: { name: string; upiId: string; amount?: number; category?: string; location?: any }) => void;
  onNavigateSubtab: (subtab: string) => void;
  onSelectTransaction: (txId: string) => void;
}

export const PaymentHome: React.FC<PaymentHomeProps> = ({
  onOpenMakePayment,
  onNavigateSubtab,
  onSelectTransaction
}) => {
  const {
    accountBalance,
    monthlyIncome,
    totalLockedAmount,
    unpaidLockedAmount,
    safeDiscretionaryBudget,
    currentDiscretionarySpent,
    overspendingAlert,
    commitments,
    transactions,
    activeProfile,
    goldBalanceGrams,
    goldRatePerGram
  } = useApp();

  const freeSpendingRemaining = Math.max(0, safeDiscretionaryBudget - currentDiscretionarySpent);
  const percentSpent = safeDiscretionaryBudget > 0
    ? Math.min(100, Math.round((currentDiscretionarySpent / safeDiscretionaryBudget) * 100))
    : 0;

  // Recent popular merchants with real Indian locations
  const quickMerchants = [
    {
      name: 'Starbucks Coffee',
      upiId: 'starbucks.blr@icici',
      category: 'CAFE',
      city: 'Bengaluru',
      street: '100ft Road, Indiranagar',
      avatar: '☕'
    },
    {
      name: 'Apollo Pharmacy 24/7',
      upiId: 'apollo.sec18@axisbank',
      category: 'HEALTH',
      city: 'Noida',
      street: 'Sector 18 Market',
      avatar: '💊'
    },
    {
      name: 'D-Mart Hypermarket',
      upiId: 'dmart.hinjewadi@yesbank',
      category: 'GROCERY',
      city: 'Pune',
      street: 'Hinjewadi Link Road',
      avatar: '🛒'
    },
    {
      name: 'Shell Fuel Station',
      upiId: 'shell.mgroad@hdfcbank',
      category: 'FUEL',
      city: 'Gurugram',
      street: 'MG Road DLF',
      avatar: '⛽'
    },
    {
      name: 'Apartment Landlord Rent',
      upiId: 'landlord.rent@okhdfcbank',
      category: 'RENT',
      city: 'Bengaluru',
      street: 'Koramangala 4th Block',
      avatar: '🏠'
    }
  ];

  const recentTxList = transactions.slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* Overspending Critical Warning Banner */}
      {overspendingAlert && (
        <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border-2 border-amber-400 p-4 rounded-2xl shadow-sm text-slate-900 flex items-start justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-amber-950">
                Expenditure Control Reminder (Fixed Budget Protected)
              </h3>
              <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                {overspendingAlert}
              </p>
              <div className="mt-2 flex items-center gap-2 flex-wrap text-[11px] font-semibold text-slate-800">
                <span className="bg-white/80 px-2 py-0.5 rounded border border-amber-300">
                  Locked for Commitments: ₹{totalLockedAmount.toLocaleString('en-IN')}
                </span>
                <span className="bg-white/80 px-2 py-0.5 rounded border border-amber-300">
                  Unpaid EMI & Rent: ₹{unpaidLockedAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateSubtab('vault')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs whitespace-nowrap shadow-sm transition-all shrink-0"
          >
            Review Locked Vault
          </button>
        </div>
      )}

      {/* Hero: Google Pay Style Account Balance & Quick UPI Action Hub */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified UPI Linked Bank Account: HDFC Bank *4892</span>
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Available Bank Balance</div>
            <div className="text-3xl sm:text-4xl font-black text-white mt-1">
              ₹{accountBalance.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              UPI ID: {activeProfile.upiId}
            </p>
          </div>

          {/* Quick Pay Action Buttons */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => onOpenMakePayment()}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all active:scale-95 text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white mb-1 shadow-md group-hover:scale-105 transition-transform">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-200">Scan QR</span>
            </button>

            <button
              onClick={() => onOpenMakePayment()}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all active:scale-95 text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white mb-1 shadow-md group-hover:scale-105 transition-transform">
                <Send className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-200">Pay UPI</span>
            </button>

            <button
              onClick={() => onNavigateSubtab('autopay')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all active:scale-95 text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white mb-1 shadow-md group-hover:scale-105 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-200">AutoPay</span>
            </button>

            <button
              onClick={() => onNavigateSubtab('investments')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all active:scale-95 text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold mb-1 shadow-md group-hover:scale-105 transition-transform">
                <span>24K</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-200">Gold / SIP</span>
            </button>
          </div>
        </div>
      </div>

      {/* CORE INNOVATION: FIXED BUDGET SYSTEM & LOCKED COMMITMENT VAULT */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Fixed Budget & Locked Expense Vault
                </h2>
                <p className="text-xs text-slate-500">
                  Protects mandatory obligations (EMI, Rent, School Fees, Bills) so you never accidentally overspend.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateSubtab('vault')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Manage Vault Commitments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3-Tier Budget Flow Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Box 1: Monthly Income */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Monthly Net Income</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ₹{monthlyIncome.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">100% of your earnings</p>
          </div>

          {/* Box 2: Locked Commitments Vault */}
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900">Locked Vault (Committed)</span>
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-indigo-950 mt-1">
              ₹{totalLockedAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-indigo-800 mt-1 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Pending Unpaid: ₹{unpaidLockedAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Box 3: Safe Discretionary Limit */}
          <div className={`p-4 rounded-2xl border ${
            freeSpendingRemaining < 5000
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider">Safe Flexible Allowance</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/70">
                {percentSpent}% Used
              </span>
            </div>
            <div className="text-2xl font-black mt-1">
              ₹{freeSpendingRemaining.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] mt-1 opacity-80">
              Discretionary spend so far: ₹{currentDiscretionarySpent.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Visual Progress Bar of Commitments vs Discretionary */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-600 font-medium">
            <span>Budget Allocation Breakdown</span>
            <span>Locked: {Math.round((totalLockedAmount / monthlyIncome) * 100)}% | Free: {100 - Math.round((totalLockedAmount / monthlyIncome) * 100)}%</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${(totalLockedAmount / monthlyIncome) * 100}%` }}
              className="bg-indigo-600 h-full"
              title="Locked for EMI, Rent, Fees"
            ></div>
            <div
              style={{ width: `${(currentDiscretionarySpent / monthlyIncome) * 100}%` }}
              className="bg-rose-500 h-full"
              title="Discretionary Spent"
            ></div>
            <div
              style={{ width: `${(freeSpendingRemaining / monthlyIncome) * 100}%` }}
              className="bg-emerald-400 h-full"
              title="Remaining Safe Allowance"
            ></div>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600"></span> Locked Obligations</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Flexible Spent</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Safe Remaining</span>
          </div>
        </div>

        {/* Locked Commitments Snapshot Pills */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Locked Bills, EMI & Rent Commitments:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {commitments.map(com => (
              <div
                key={com.id}
                className={`p-2.5 rounded-xl border text-left text-xs ${
                  com.isPaidThisMonth
                    ? 'bg-slate-50 border-slate-200 text-slate-500 opacity-60'
                    : 'bg-indigo-50/50 border-indigo-200 text-slate-800'
                }`}
              >
                <div className="font-bold truncate text-[11px]">{com.title}</div>
                <div className="font-extrabold text-xs text-indigo-950 mt-0.5">
                  ₹{com.allocatedAmount.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {com.isPaidThisMonth ? '✓ Paid' : `In ${com.daysRemaining} days`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Pay to Popular Verified Indian Merchants with Real Locations */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Pay Nearby & Verified Merchants (Auto-Location Tagging)
            </h3>
            <p className="text-xs text-slate-500">
              One-tap UPI payment with instant street location history & Indian tax classification
            </p>
          </div>
          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold">
            Google Pay Style
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {quickMerchants.map((m, idx) => (
            <button
              key={idx}
              onClick={() => onOpenMakePayment({
                name: m.name,
                upiId: m.upiId,
                category: m.category,
                location: {
                  shopName: m.name,
                  street: m.street,
                  city: m.city,
                  state: 'India',
                  latitude: 12.97,
                  longitude: 77.64,
                  category: m.category as any
                }
              })}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all text-left bg-slate-50/50 hover:bg-white group"
            >
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-lg mb-2 group-hover:scale-105 transition-transform">
                {m.avatar}
              </div>
              <div className="font-bold text-xs text-slate-900 truncate">{m.name}</div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-2.5 h-2.5 text-indigo-500 shrink-0" />
                <span>{m.city}</span>
              </div>
              <div className="text-[9px] text-indigo-600 font-semibold mt-1">Tap to Pay</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Payments with Location History & Tax Relevance */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Payment & Location History</h3>
            <p className="text-xs text-slate-500">
              Shows where every payment occurred and its tax deduction/income status
            </p>
          </div>

          <button
            onClick={() => onNavigateSubtab('history')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All with Map ({transactions.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentTxList.map(tx => {
            const isCredit = tx.type === 'CREDIT';
            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx.id)}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {tx.recipientName || tx.description}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{tx.location.shopName}, {tx.location.city}</span>
                      <span>• {tx.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={`text-xs font-black ${isCredit ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {isCredit ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      tx.classification.status === 'TAX_DEDUCTIBLE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : tx.classification.status === 'TAXABLE'
                        ? 'bg-rose-100 text-rose-800'
                        : tx.classification.status === 'PARTIALLY_TAXABLE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tx.classification.deductionSection || tx.classification.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
