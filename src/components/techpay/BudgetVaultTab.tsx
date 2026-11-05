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
  Building,
  HelpCircle
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
    addCommitment
  } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('5000');
  const [newCategory, setNewCategory] = useState<'EMI' | 'RENT' | 'FEE' | 'BILL' | 'INSURANCE'>('EMI');
  const [newDueDate, setNewDueDate] = useState('Due on 10th of every month');
  const [newDays, setNewDays] = useState(5);

  const freeRemaining = Math.max(0, safeDiscretionaryBudget - currentDiscretionarySpent);
  const percentSpent = safeDiscretionaryBudget > 0
    ? Math.min(100, Math.round((currentDiscretionarySpent / safeDiscretionaryBudget) * 100))
    : 0;

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
      taxDeductible: newCategory === 'EMI' || newCategory === 'RENT' || newCategory === 'FEE' || newCategory === 'INSURANCE',
      taxSection: newCategory === 'EMI' ? 'Sec 24(b) & 80C' : newCategory === 'RENT' ? 'Sec 10(13A) HRA' : newCategory === 'INSURANCE' ? 'Sec 80D' : 'Sec 80C'
    };

    addCommitment(newCom);
    setIsAddOpen(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Lock className="w-6 h-6 text-indigo-600" />
            <span>Fixed Budget & Locked Commitment Vault</span>
          </h2>
          <p className="text-xs text-slate-500">
            Guarantees your Home Loan EMI, Rent, School Fees & Bills are locked and protected from accidental overspending.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Lock New Commitment</span>
        </button>
      </div>

      {/* Overspending Active Guardrail */}
      {overspendingAlert && (
        <div className="bg-amber-50 border-2 border-amber-400 p-5 rounded-3xl text-amber-950 flex items-start gap-3.5 shadow-sm">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold">Active Overspending Reminder</h3>
            <p className="text-xs leading-relaxed">{overspendingAlert}</p>
          </div>
        </div>
      )}

      {/* 3-Pillar Budget Visualizer */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monthly Net Income</span>
            <div className="text-2xl font-black text-slate-900 mt-1">₹{monthlyIncome.toLocaleString('en-IN')}</div>
            <p className="text-xs text-slate-500 mt-1">Total incoming cash flow</p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider">Locked Commitments Vault</span>
              <Lock className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black mt-1">₹{totalLockedAmount.toLocaleString('en-IN')}</div>
            <div className="text-xs font-semibold text-indigo-800 mt-1">
              Unpaid Pending: ₹{unpaidLockedAmount.toLocaleString('en-IN')}
            </div>
          </div>

          <div className={`p-4 rounded-2xl border ${
            freeRemaining < 5000 ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider">Remaining Safe Allowance</span>
            <div className="text-2xl font-black mt-1">₹{freeRemaining.toLocaleString('en-IN')}</div>
            <p className="text-xs mt-1 opacity-80">Flexible spend so far: ₹{currentDiscretionarySpent.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-600 font-medium">
            <span>Budget Discipline Meter</span>
            <span>{percentSpent}% of safe discretionary limit consumed</span>
          </div>
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div style={{ width: `${(totalLockedAmount / monthlyIncome) * 100}%` }} className="bg-indigo-600 h-full"></div>
            <div style={{ width: `${(currentDiscretionarySpent / monthlyIncome) * 100}%` }} className="bg-rose-500 h-full"></div>
            <div style={{ width: `${(freeRemaining / monthlyIncome) * 100}%` }} className="bg-emerald-400 h-full"></div>
          </div>
        </div>
      </div>

      {/* Locked Commitments Detailed List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Locked Commitments ({commitments.length})
          </h3>
          <span className="text-xs text-slate-500">
            Click checkbox when paid or tap "Pay via UPI"
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commitments.map(com => (
            <div
              key={com.id}
              className={`p-5 rounded-3xl border transition-all ${
                com.isPaidThisMonth
                  ? 'bg-slate-50/80 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 shadow-sm hover:border-indigo-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => markCommitmentPaid(com.id)}
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                      com.isPaidThisMonth
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300 hover:border-indigo-600 bg-white'
                    }`}
                  >
                    {com.isPaidThisMonth && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div>
                    <h4 className={`text-sm font-bold ${com.isPaidThisMonth ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {com.title}
                    </h4>
                    <div className="text-xs text-slate-500 mt-0.5">{com.dueDateDescription}</div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        {com.category}
                      </span>
                      {com.taxSection && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {com.taxSection}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-slate-900">
                    ₹{com.allocatedAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs font-semibold text-indigo-600 mt-1">
                    {com.isPaidThisMonth ? '✓ Paid' : `Due in ${com.daysRemaining} days`}
                  </div>
                </div>
              </div>

              {!com.isPaidThisMonth && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Funds locked in vault</span>
                  <button
                    onClick={() => onOpenMakePayment({
                      name: com.title,
                      amount: com.allocatedAmount,
                      category: com.category
                    })}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay via UPI</span>
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
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Lock New Fixed Commitment</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Commitment Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Car Loan EMI, Gym Annual Fee, Gas Bill"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="EMI">EMI / Loan</option>
                    <option value="RENT">Rent</option>
                    <option value="FEE">School / College Fee</option>
                    <option value="BILL">Utility / Bill</option>
                    <option value="INSURANCE">Insurance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Locked Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Due Date Description</label>
                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  placeholder="e.g. Due on 10th of every month"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md mt-2"
              >
                Lock Amount in Vault
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
