import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Scale,
  Calculator,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Award,
  Sparkles,
  TrendingDown,
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';

interface TaxDashboardTabProps {
  onNavigateTab: (tab: string) => void;
  onOpenVoiceCa: () => void;
  onSelectTransaction: (txId: string) => void;
}

export const TaxDashboardTab: React.FC<TaxDashboardTabProps> = ({
  onNavigateTab,
  onOpenVoiceCa,
  onSelectTransaction
}) => {
  const {
    activeProfile,
    transactions,
    activeRegime,
    toggleRegime,
    taxComparison,
    healthScore,
    financialYear
  } = useApp();

  const currentRegimeData = activeRegime === 'NEW' ? taxComparison.newRegime : taxComparison.oldRegime;

  let totalCredits = 0;
  let totalDebits = 0;
  let nonTaxableReceipts = 0;
  let eligibleDeductions = 0;

  transactions.forEach(t => {
    if (t.isDuplicate) return;
    if (t.type === 'CREDIT') {
      totalCredits += t.amount;
      if (t.classification.status === 'NON_TAXABLE') nonTaxableReceipts += t.amount;
    } else {
      totalDebits += t.amount;
      if (t.classification.deductibleAmount > 0) eligibleDeductions += t.classification.deductibleAmount;
    }
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Scale className="w-3.5 h-3.5" />
              <span>TaxSaathi AI CA • Section 115BAC Verified Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              {currentRegimeData.isRefund ? (
                <span className="text-emerald-400">
                  Estimated Tax Refund: ₹{Math.abs(currentRegimeData.netTaxPayableOrRefund).toLocaleString('en-IN')}
                </span>
              ) : currentRegimeData.netTaxPayableOrRefund === 0 ? (
                <span className="text-emerald-400">Net Tax Payable: ₹0 (Zero Tax Liability)</span>
              ) : (
                <span>Estimated Net Tax Due: ₹{currentRegimeData.netTaxPayableOrRefund.toLocaleString('en-IN')}</span>
              )}
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              {taxComparison.explanation}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onOpenVoiceCa}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Voice CA</span>
            </button>
            <button
              onClick={toggleRegime}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all text-center"
            >
              Switch to {activeRegime === 'NEW' ? 'Old' : 'New'} Regime
            </button>
          </div>
        </div>
      </div>

      {/* 7 Statutory Dashboard Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Credits</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">₹{totalCredits.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-slate-400 mt-1">All incoming receipts</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Debits</span>
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">₹{totalDebits.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-slate-400 mt-1">Payments & investments</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Taxable Income</span>
            <Calculator className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-950 mt-2">₹{currentRegimeData.netTaxableIncome.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-slate-400 mt-1">After standard & 44ADA deductions</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Non-Taxable</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-900 mt-2">₹{nonTaxableReceipts.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-slate-400 mt-1">Relative gifts, transfers, refunds</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Deductions</span>
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">₹{eligibleDeductions.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-slate-400 mt-1">80C, 80D, NPS & 24(b)</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>TDS & Tax Paid</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-900 mt-2">₹{currentRegimeData.totalTaxesPaid.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-slate-400 mt-1">Verified tax credits</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Tax Liability</span>
            <TrendingDown className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-950 mt-2">₹{currentRegimeData.totalTaxLiability.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-slate-400 mt-1">Gross tax + 4% cess</p>
        </div>

        <div className={`p-5 rounded-3xl border ${
          currentRegimeData.isRefund ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-amber-50 border-amber-200 text-amber-950'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
            <span>{currentRegimeData.isRefund ? 'Refund Due' : 'Balance Payable'}</span>
            <span>{currentRegimeData.isRefund ? '₹+' : '₹-'}</span>
          </div>
          <div className="text-2xl font-black mt-2">
            ₹{Math.abs(currentRegimeData.netTaxPayableOrRefund).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] mt-1 opacity-80">
            {currentRegimeData.isRefund ? 'Claim in upcoming ITR return' : 'Pay via Challan 280'}
          </p>
        </div>
      </div>

      {/* Side-by-Side Regime Comparison */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Indian Tax Regime Comparison (FY {financialYear})
            </h3>
            <p className="text-xs text-slate-500">
              Deterministic statutory calculation comparing Section 115BAC vs Old Regime
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Recommended: {taxComparison.recommendedRegime} Regime (Save ₹{taxComparison.taxSavings.toLocaleString('en-IN')})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 p-6 gap-6">
          {/* New Regime */}
          <div className={`p-5 rounded-2xl ${activeRegime === 'NEW' ? 'bg-emerald-50/30 border-2 border-emerald-500' : 'bg-slate-50'}`}>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-extrabold text-slate-900">New Tax Regime (Section 115BAC)</h4>
              {taxComparison.recommendedRegime === 'NEW' && (
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">Winner</span>
              )}
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Income:</span>
                <span className="font-bold">₹{taxComparison.newRegime.grossTotalIncome.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Standard Deduction u/s 16(ia):</span>
                <span className="font-bold text-emerald-600">-₹{taxComparison.newRegime.standardDeduction.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Section 87A Rebate:</span>
                <span className="font-bold text-emerald-600">-₹{taxComparison.newRegime.section87ARebate.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-slate-200">
                <span>Net Tax Liability:</span>
                <span>₹{taxComparison.newRegime.totalTaxLiability.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Old Regime */}
          <div className={`p-5 rounded-2xl ${activeRegime === 'OLD' ? 'bg-amber-50/30 border-2 border-amber-500' : 'bg-slate-50'}`}>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-extrabold text-slate-900">Old Tax Regime</h4>
              {taxComparison.recommendedRegime === 'OLD' && (
                <span className="text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded">Winner</span>
              )}
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Income:</span>
                <span className="font-bold">₹{taxComparison.oldRegime.grossTotalIncome.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chapter VI-A Deductions:</span>
                <span className="font-bold text-emerald-600">-₹{taxComparison.oldRegime.chapter6ADeductions.total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Section 24(b) Home Loan:</span>
                <span className="font-bold text-emerald-600">-₹{taxComparison.oldRegime.section24bHomeLoanInterest.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-slate-200">
                <span>Net Tax Liability:</span>
                <span>₹{taxComparison.oldRegime.totalTaxLiability.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
