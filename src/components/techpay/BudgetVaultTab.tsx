import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FixedCommitment } from '../../types/tax';
import {
  Lock,
  ShieldCheck,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  CreditCard,
  Building2,
  Eye,
  EyeOff,
  Home,
  GraduationCap,
  Zap,
  ShoppingBag,
  Car,
  Utensils,
  Coins
} from 'lucide-react';

interface BudgetVaultTabProps {
  onOpenMakePayment: (data: any) => void;
}

export const BudgetVaultTab: React.FC<BudgetVaultTabProps> = ({ onOpenMakePayment }) => {
  const {
    monthlyIncome,
    totalLockedAmount,
    unpaidLockedAmount,
    safeDiscretionaryBudget,
    currentDiscretionarySpent,
    overspendingAlert,
    commitments,
    markCommitmentPaid,
    addCommitment,
    isPrivacyMode,
    togglePrivacyMode,
    formatPrivateAmount
  } = useApp();

  const [unmaskedItems, setUnmaskedItems] = useState<Record<string, boolean>>({});
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('5000');
  const [newCategory, setNewCategory] = useState<'EMI' | 'RENT' | 'FEE' | 'BILL' | 'INSURANCE'>('EMI');
  const [newDueDate, setNewDueDate] = useState('Due on 10th of every month');
  const [newDays, setNewDays] = useState(5);

  const togglePeek = (key: string) => {
    setUnmaskedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const freeRemaining = Math.max(0, safeDiscretionaryBudget - currentDiscretionarySpent);
  const percentSpent = safeDiscretionaryBudget > 0
    ? Math.min(100, Math.round((currentDiscretionarySpent / safeDiscretionaryBudget) * 100))
    : 0;

  // The 8 Separate Budget Categories required by user
  const budgetCategories = [
    { name: 'Rent', icon: Home, allocated: 25000, spent: 25000, color: 'bg-indigo-500', note: 'HRA Sec 10(13A)' },
    { name: 'EMI', icon: Building2, allocated: 38000, spent: 0, color: 'bg-[#5F259F]', note: 'Sec 24(b) & 80C' },
    { name: 'Education Fees', icon: GraduationCap, allocated: 15000, spent: 0, color: 'bg-blue-500', note: 'Sec 80C' },
    { name: 'Electricity', icon: Zap, allocated: 2000, spent: 1450, color: 'bg-amber-500', note: 'BBPS Utility' },
    { name: 'Groceries', icon: Utensils, allocated: 12000, spent: 7800, color: 'bg-emerald-500', note: 'Essential Food' },
    { name: 'Travel', icon: Car, allocated: 8000, spent: 3400, color: 'bg-cyan-500', note: 'Fuel & Transit' },
    { name: 'Shopping', icon: ShoppingBag, allocated: 10000, spent: 6200, color: 'bg-rose-500', note: 'Discretionary' },
    { name: 'Savings', icon: Coins, allocated: 20000, spent: 20000, color: 'bg-teal-500', note: 'Gold & SIPs' }
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCom: FixedCommitment = {
      id: `com-${Date.now()}`,
      title: newTitle,
      allocatedAmount: parseFloat(newAmount) || 0,
      dueDateDescription: newDueDate,
      daysRemaining: Number(newDays),
      category: newCategory,
      isPaidThisMonth: false,
      taxDeductible: true,
      taxSection: newCategory === 'EMI' ? 'Sec 24(b) & 80C' : newCategory === 'RENT' ? 'Sec 10(13A)' : 'Sec 80C'
    };

    addCommitment(newCom);
    setIsAddOpen(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold text-[#172033] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#5F259F]" />
            <span>Smart Budget Vault & Financial Planning</span>
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Ring-fencing non-negotiable monthly expenses so your rent, EMIs, and school fees are 100% protected.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePrivacyMode}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              isPrivacyMode
                ? 'bg-amber-50 text-[#E9A23B] border-amber-200'
                : 'bg-[#F8F9FC] text-[#718096] border-[#E2E8F0]'
            }`}
          >
            {isPrivacyMode ? <EyeOff className="w-3.5 h-3.5 text-[#E9A23B]" /> : <Eye className="w-3.5 h-3.5 text-[#718096]" />}
            <span>{isPrivacyMode ? 'Privacy: Masked' : 'Privacy: Visible'}</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#5F259F] hover:bg-[#35145F] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Lock Commitment</span>
          </button>
        </div>
      </div>

      {/* Overspending Active Guardrail */}
      {overspendingAlert && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#E9A23B] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-amber-950">Active Budget Guardrail Warning</h3>
            <p className="text-xs text-amber-900 leading-relaxed">{overspendingAlert}</p>
          </div>
        </div>
      )}

      {/* 5 Top Financial Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* 1. Monthly Income */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#718096]">Monthly Income</span>
          <div className="text-lg font-black text-[#172033] mt-1">{formatPrivateAmount(monthlyIncome, unmaskedItems['income'])}</div>
          <p className="text-[10px] text-[#718096] mt-0.5">Total cash flow</p>
        </div>

        {/* 2. Available Spending Balance */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A36A]">Available Spending</span>
          <div className="text-lg font-black text-[#16A36A] mt-1">{formatPrivateAmount(freeRemaining, unmaskedItems['safe'])}</div>
          <p className="text-[10px] text-[#718096] mt-0.5">Safe discretionary</p>
        </div>

        {/* 3. Reserved Money */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F259F]">Reserved Money</span>
          <div className="text-lg font-black text-[#5F259F] mt-1">{formatPrivateAmount(totalLockedAmount, unmaskedItems['vault'])}</div>
          <p className="text-[10px] text-[#718096] mt-0.5">Ring-fenced in vault</p>
        </div>

        {/* 4. Monthly Expenses */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#718096]">Monthly Expenses</span>
          <div className="text-lg font-black text-[#172033] mt-1">{formatPrivateAmount(currentDiscretionarySpent, unmaskedItems['spent'])}</div>
          <p className="text-[10px] text-[#718096] mt-0.5">Discretionary spent</p>
        </div>

        {/* 5. Upcoming Commitments */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E9A23B]">Upcoming Pending</span>
          <div className="text-lg font-black text-[#E9A23B] mt-1">{formatPrivateAmount(unpaidLockedAmount, unmaskedItems['pending'])}</div>
          <p className="text-[10px] text-[#718096] mt-0.5">Due this month</p>
        </div>
      </div>

      {/* Allocation Progress Bar Meter */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-[#172033]">Monthly Cash Flow Allocation Breakdown</span>
          <span className="text-[#718096]">{percentSpent}% of discretionary spending limit consumed</span>
        </div>

        <div className="h-3 w-full bg-[#F8F9FC] border border-[#E2E8F0] rounded-full overflow-hidden flex">
          <div
            style={{ width: `${(totalLockedAmount / monthlyIncome) * 100}%` }}
            className="bg-[#5F259F] h-full"
            title="Reserved Vault"
          ></div>
          <div
            style={{ width: `${(currentDiscretionarySpent / monthlyIncome) * 100}%` }}
            className="bg-[#E9A23B] h-full"
            title="Discretionary Spent"
          ></div>
          <div
            style={{ width: `${(freeRemaining / monthlyIncome) * 100}%` }}
            className="bg-[#16A36A] h-full"
            title="Safe Allowance"
          ></div>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-[#718096] pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5F259F]"></span>
            <span>Locked Commitments ({Math.round((totalLockedAmount / monthlyIncome) * 100)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E9A23B]"></span>
            <span>Spent ({Math.round((currentDiscretionarySpent / monthlyIncome) * 100)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A]"></span>
            <span>Safe Remaining ({Math.round((freeRemaining / monthlyIncome) * 100)}%)</span>
          </div>
        </div>
      </div>

      {/* 8 SEPARATE BUDGET CATEGORIES (Requirement #6) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-extrabold text-[#172033]">8 Core Budget Planning Categories</h3>
            <p className="text-[11px] text-[#718096]">Category-wise expenditure limits and tax deductions</p>
          </div>
          <span className="text-xs font-bold text-[#5F259F]">All Protected</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {budgetCategories.map((cat) => {
            const Icon = cat.icon;
            const pct = Math.round((cat.spent / cat.allocated) * 100);
            return (
              <div
                key={cat.name}
                className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8F9FC] space-y-2 hover:border-[#5F259F]/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#5F259F]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#172033]">{cat.name}</div>
                      <div className="text-[10px] text-[#718096]">{cat.note}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#718096]">{pct}%</span>
                </div>

                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: `${pct}%` }} className={`${cat.color} h-full rounded-full`}></div>
                </div>

                <div className="flex justify-between text-[11px] font-mono text-[#718096]">
                  <span>₹{cat.spent.toLocaleString('en-IN')}</span>
                  <span className="font-bold text-[#172033]">₹{cat.allocated.toLocaleString('en-IN')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Locked Commitments List */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-extrabold text-[#172033]">Active Vault Commitments ({commitments.length})</h3>
            <p className="text-[11px] text-[#718096]">Click checkbox when paid or click "Pay via UPI"</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {commitments.map((com) => (
            <div
              key={com.id}
              className={`p-4 rounded-xl border transition-all ${
                com.isPaidThisMonth
                  ? 'bg-slate-50/70 border-slate-200 opacity-60'
                  : 'bg-white border-[#E2E8F0] shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => markCommitmentPaid(com.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                      com.isPaidThisMonth
                        ? 'bg-[#16A36A] text-white'
                        : 'border border-slate-300 hover:border-[#5F259F] bg-white'
                    }`}
                  >
                    {com.isPaidThisMonth && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  <div>
                    <h4 className={`text-xs font-bold ${com.isPaidThisMonth ? 'line-through text-slate-400' : 'text-[#172033]'}`}>
                      {com.title}
                    </h4>
                    <div className="text-[11px] text-[#718096]">{com.dueDateDescription}</div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F3EEF9] text-[#5F259F]">
                        {com.category}
                      </span>
                      {com.taxSection && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-[#16A36A]">
                          {com.taxSection}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-[#172033]">
                    {formatPrivateAmount(com.allocatedAmount, unmaskedItems[com.id])}
                  </div>
                  <div className="text-[10px] font-bold text-[#5F259F] mt-0.5">
                    {com.isPaidThisMonth ? '✓ Paid' : `Due in ${com.daysRemaining} days`}
                  </div>
                </div>
              </div>

              {!com.isPaidThisMonth && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#718096]">Funds locked</span>
                  <button
                    onClick={() => onOpenMakePayment({
                      name: com.title,
                      amount: com.allocatedAmount,
                      category: com.category
                    })}
                    className="px-3 py-1 rounded-lg bg-[#5F259F] hover:bg-[#35145F] text-white font-bold text-[11px] transition-colors"
                  >
                    Pay via UPI
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Commitment Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E2E8F0] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#172033]">Lock New Fixed Commitment</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-[#718096] hover:text-[#172033]">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#172033] font-bold mb-1">Commitment Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Car Loan EMI, Gym Fee, Property Tax"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#5F259F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#172033] font-bold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] bg-white font-semibold"
                  >
                    <option value="EMI">Loan EMI</option>
                    <option value="RENT">House Rent</option>
                    <option value="FEE">Education Fee</option>
                    <option value="BILL">Utility Bill</option>
                    <option value="INSURANCE">Insurance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#172033] font-bold mb-1">Locked Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] font-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#172033] font-bold mb-1">Due Date Description</label>
                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  placeholder="e.g. Due on 10th of every month"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#5F259F] hover:bg-[#35145F] text-white font-bold text-xs shadow-xs mt-2"
              >
                Confirm & Lock in Vault
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
