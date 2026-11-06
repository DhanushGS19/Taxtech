import React, { useState } from 'react';
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
  ArrowRight,
  ChevronRight,
  FileText,
  AlertCircle,
  HelpCircle,
  Building2,
  Receipt,
  Briefcase
} from 'lucide-react';
import { GstCalculatorModal } from '../techpay/GstCalculatorModal';
import { IncomeTaxModal } from '../techpay/IncomeTaxModal';

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
    financialYear,
    formatPrivateAmount
  } = useApp();

  const [isGstModalOpen, setIsGstModalOpen] = useState(false);
  const [isTaxCalcModalOpen, setIsTaxCalcModalOpen] = useState(false);

  const currentRegimeData = activeRegime === 'NEW' ? taxComparison.newRegime : taxComparison.oldRegime;

  let totalCredits = 0;
  let totalDebits = 0;
  let nonTaxableReceipts = 0;
  let eligibleDeductions = 0;
  let salaryIncome = 0;
  let freelanceIncome = 0;
  let interestIncome = 0;

  transactions.forEach(t => {
    if (t.isDuplicate) return;
    if (t.type === 'CREDIT') {
      totalCredits += t.amount;
      if (t.classification.status === 'NON_TAXABLE') {
        nonTaxableReceipts += t.amount;
      } else {
        if (t.category === 'SALARY') salaryIncome += t.amount;
        else if (t.category === 'BUSINESS' || t.category === 'FREELANCE') freelanceIncome += t.amount;
        else interestIncome += t.amount;
      }
    } else {
      totalDebits += t.amount;
      if (t.classification.deductibleAmount > 0) {
        eligibleDeductions += t.classification.deductibleAmount;
      }
    }
  });

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-[#172033] dark:text-white">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#21152D] rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] shadow-xs p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5F259F]/10 dark:bg-[#5F259F]/30 text-[#5F259F] dark:text-purple-300 text-xs font-bold border border-[#5F259F]/20 dark:border-[#5F259F]/40">
              <Scale className="w-3.5 h-3.5" />
              <span>TaxSaathi AI CA • Budget 2024 Section 115BAC Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#172033] dark:text-white">
              {currentRegimeData.isRefund ? (
                <span className="text-[#16A36A]">
                  Estimated Refund: {formatPrivateAmount(Math.abs(currentRegimeData.netTaxPayableOrRefund))}
                </span>
              ) : currentRegimeData.netTaxPayableOrRefund === 0 ? (
                <span className="text-[#16A36A]">Zero Tax Liability (₹0 Due)</span>
              ) : (
                <span>Estimated Net Tax Due: {formatPrivateAmount(currentRegimeData.netTaxPayableOrRefund)}</span>
              )}
            </h1>
            <p className="text-xs text-[#718096] dark:text-slate-300 leading-relaxed">
              {taxComparison.explanation}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={() => setIsTaxCalcModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#F8F9FC] dark:bg-[#2A1C39] hover:bg-[#5F259F]/10 text-[#172033] dark:text-white font-bold text-xs border border-[#E8E1F2] dark:border-[#3D2854] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Calculator className="w-4 h-4 text-[#5F259F] dark:text-purple-300" />
              <span>Tax Calculator</span>
            </button>
            <button
              onClick={() => setIsGstModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#F8F9FC] dark:bg-[#2A1C39] hover:bg-[#5F259F]/10 text-[#172033] dark:text-white font-bold text-xs border border-[#E8E1F2] dark:border-[#3D2854] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Receipt className="w-4 h-4 text-[#16A36A]" />
              <span>GST Calculator</span>
            </button>
            <button
              onClick={onOpenVoiceCa}
              className="px-4 py-2.5 rounded-xl bg-[#5F259F] hover:bg-[#35145F] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Personal CA</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Statutory Dashboard Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-[#21152D] p-4 rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] shadow-xs">
          <div className="flex items-center justify-between text-[#718096] dark:text-purple-200 text-[11px] font-bold uppercase tracking-wider">
            <span>Total Credits</span>
            <ArrowDownLeft className="w-3.5 h-3.5 text-[#16A36A]" />
          </div>
          <div className="text-lg sm:text-xl font-black text-[#172033] dark:text-white mt-2">{formatPrivateAmount(totalCredits)}</div>
          <p className="text-[10px] text-[#718096] dark:text-slate-400 mt-0.5">All inflows</p>
        </div>

        <div className="bg-white dark:bg-[#21152D] p-4 rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] shadow-xs">
          <div className="flex items-center justify-between text-[#718096] dark:text-purple-200 text-[11px] font-bold uppercase tracking-wider">
            <span>Non-Taxable</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#16A36A]" />
          </div>
          <div className="text-lg sm:text-xl font-black text-[#16A36A] mt-2">{formatPrivateAmount(nonTaxableReceipts)}</div>
          <p className="text-[10px] text-[#718096] dark:text-slate-400 mt-0.5">Gifts & refunds</p>
        </div>

        <div className="bg-white dark:bg-[#21152D] p-4 rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] shadow-xs">
          <div className="flex items-center justify-between text-[#718096] dark:text-purple-200 text-[11px] font-bold uppercase tracking-wider">
            <span>Taxable Income</span>
            <Calculator className="w-3.5 h-3.5 text-[#5F259F] dark:text-purple-300" />
          </div>
          <div className="text-lg sm:text-xl font-black text-[#5F259F] dark:text-purple-300 mt-2">{formatPrivateAmount(currentRegimeData.netTaxableIncome)}</div>
          <p className="text-[10px] text-[#718096] dark:text-slate-400 mt-0.5">After std deduction</p>
        </div>

        <div className="bg-white dark:bg-[#21152D] p-4 rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] shadow-xs">
          <div className="flex items-center justify-between text-[#718096] dark:text-purple-200 text-[11px] font-bold uppercase tracking-wider">
            <span>Deductions</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#E9A23B]" />
          </div>
          <div className="text-lg sm:text-xl font-black text-[#172033] dark:text-white mt-2">{formatPrivateAmount(eligibleDeductions)}</div>
          <p className="text-[10px] text-[#718096] dark:text-slate-400 mt-0.5">80C, 80D & 24(b)</p>
        </div>

        <div className="bg-white dark:bg-[#21152D] p-4 rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] shadow-xs">
          <div className="flex items-center justify-between text-[#718096] dark:text-purple-200 text-[11px] font-bold uppercase tracking-wider">
            <span>Taxes Paid</span>
            <Award className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-[#172033] dark:text-white mt-2">{formatPrivateAmount(currentRegimeData.totalTaxesPaid)}</div>
          <p className="text-[10px] text-[#718096] dark:text-slate-400 mt-0.5">TDS credits</p>
        </div>

        <div className="bg-white dark:bg-[#21152D] p-4 rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] shadow-xs">
          <div className="flex items-center justify-between text-[#718096] dark:text-purple-200 text-[11px] font-bold uppercase tracking-wider">
            <span>Tax Due</span>
            <TrendingDown className="w-3.5 h-3.5 text-[#5F259F] dark:text-purple-300" />
          </div>
          <div className="text-lg sm:text-xl font-black text-[#5F259F] dark:text-purple-300 mt-2">{formatPrivateAmount(currentRegimeData.totalTaxLiability)}</div>
          <p className="text-[10px] text-[#718096] dark:text-slate-400 mt-0.5">Gross tax + 4% cess</p>
        </div>
      </div>

      {/* Side-by-Side Regime Comparison */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8F9FC]">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-[#172033]">
              Indian Tax Regime Comparison (FY {financialYear} / AY 2025-26)
            </h2>
            <p className="text-xs text-[#718096]">
              Statutory calculation comparing Revised Section 115BAC (Default) vs Old Regime.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#16A36A]/10 text-[#16A36A] border border-[#16A36A]/20">
              Optimal: {taxComparison.recommendedRegime} Regime (Save ₹{taxComparison.taxSavings.toLocaleString('en-IN')})
            </span>
            <button
              onClick={toggleRegime}
              className="px-3 py-1 rounded-xl bg-white hover:bg-slate-50 text-[#172033] font-bold text-xs border border-[#E2E8F0] transition-colors"
            >
              Switch to {activeRegime === 'NEW' ? 'Old' : 'New'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0] p-6 gap-6">
          {/* New Regime */}
          <div className={`p-5 rounded-2xl transition-all ${
            activeRegime === 'NEW'
              ? 'bg-[#5F259F]/5 border-2 border-[#5F259F]'
              : 'bg-[#F8F9FC] border border-[#E2E8F0]'
          }`}>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-black text-sm text-[#172033]">New Tax Regime (Section 115BAC)</h3>
                <span className="text-[10px] text-[#718096]">Budget 2024 Revised Slabs</span>
              </div>
              {taxComparison.recommendedRegime === 'NEW' && (
                <span className="text-[10px] bg-[#16A36A] text-white font-extrabold px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#718096]">Gross Total Income:</span>
                <span className="font-bold text-[#172033]">₹{taxComparison.newRegime.grossTotalIncome.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">Standard Deduction (Budget 2024):</span>
                <span className="font-bold text-[#16A36A]">-₹{taxComparison.newRegime.standardDeduction.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">Net Taxable Income:</span>
                <span className="font-bold text-[#172033]">₹{taxComparison.newRegime.netTaxableIncome.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">Section 87A Rebate:</span>
                <span className="font-bold text-[#16A36A]">-₹{taxComparison.newRegime.section87ARebate.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-[#E2E8F0]">
                <span className="text-[#172033]">Net Tax Liability:</span>
                <span className="text-[#5F259F] font-black text-sm">₹{taxComparison.newRegime.totalTaxLiability.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Old Regime */}
          <div className={`p-5 rounded-2xl transition-all ${
            activeRegime === 'OLD'
              ? 'bg-[#5F259F]/5 border-2 border-[#5F259F]'
              : 'bg-[#F8F9FC] border border-[#E2E8F0]'
          }`}>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-black text-sm text-[#172033]">Old Tax Regime</h3>
                <span className="text-[10px] text-[#718096]">With Full Chapter VI-A Deductions</span>
              </div>
              {taxComparison.recommendedRegime === 'OLD' && (
                <span className="text-[10px] bg-[#16A36A] text-white font-extrabold px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#718096]">Gross Total Income:</span>
                <span className="font-bold text-[#172033]">₹{taxComparison.oldRegime.grossTotalIncome.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">Standard Deduction:</span>
                <span className="font-bold text-[#16A36A]">-₹{taxComparison.oldRegime.standardDeduction.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">Chapter VI-A (80C, 80D, etc.):</span>
                <span className="font-bold text-[#16A36A]">-₹{taxComparison.oldRegime.chapter6ADeductions.total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">Section 24(b) Home Loan Interest:</span>
                <span className="font-bold text-[#16A36A]">-₹{taxComparison.oldRegime.section24bHomeLoanInterest.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-[#E2E8F0]">
                <span className="text-[#172033]">Net Tax Liability:</span>
                <span className="text-[#5F259F] font-black text-sm">₹{taxComparison.oldRegime.totalTaxLiability.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INCOME HEADS & TAXABLE ESTIMATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income Sources Breakdown */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-extrabold text-[#172033] flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#5F259F]" />
            <span>Income Heads Tracking</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] flex justify-between items-center">
              <div>
                <p className="font-bold text-[#172033]">Salary Income</p>
                <p className="text-[10px] text-[#718096]">Section 15, Form 16 verified</p>
              </div>
              <span className="font-black text-sm text-[#172033]">₹{salaryIncome.toLocaleString('en-IN')}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] flex justify-between items-center">
              <div>
                <p className="font-bold text-[#172033]">Business / PGBP / Freelance</p>
                <p className="text-[10px] text-[#718096]">Section 44ADA 50% presumptive rate</p>
              </div>
              <span className="font-black text-sm text-[#172033]">₹{freelanceIncome.toLocaleString('en-IN')}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] flex justify-between items-center">
              <div>
                <p className="font-bold text-[#172033]">Other Sources (Savings & FD Interest)</p>
                <p className="text-[10px] text-[#718096]">Section 56, 80TTA eligible</p>
              </div>
              <span className="font-black text-sm text-[#172033]">₹{interestIncome.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Deductions & Tax-Saving Guidance */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-extrabold text-[#172033] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#16A36A]" />
            <span>Deductions & Statutory Exemptions</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0]">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#172033]">Section 80C (PPF, ELSS, EPF)</span>
                <span className="font-extrabold text-[#16A36A]">₹1,50,000 / ₹1,50,000</span>
              </div>
              <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 mt-2">
                <div className="bg-[#16A36A] h-1.5 rounded-full w-full"></div>
              </div>
              <p className="text-[10px] text-[#718096] mt-1">100% Limit utilized under Old Regime</p>
            </div>

            <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0]">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#172033]">Section 80D (Health Insurance)</span>
                <span className="font-extrabold text-[#5F259F]">₹25,000 / ₹50,000</span>
              </div>
              <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 mt-2">
                <div className="bg-[#5F259F] h-1.5 rounded-full w-1/2"></div>
              </div>
              <p className="text-[10px] text-[#718096] mt-1">Can save up to ₹7,800 more tax by insuring parents</p>
            </div>

            <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0]">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#172033]">Section 24(b) Home Loan Interest</span>
                <span className="font-extrabold text-[#172033]">₹1,80,000 / ₹2,00,000</span>
              </div>
              <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 mt-2">
                <div className="bg-[#E9A23B] h-1.5 rounded-full w-[90%]"></div>
              </div>
              <p className="text-[10px] text-[#718096] mt-1">Deductible up to ₹2 Lakh for self-occupied property</p>
            </div>
          </div>
        </div>

        {/* Advance Tax & Compliance Calendar */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-extrabold text-[#172033] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#E9A23B]" />
            <span>Advance Tax & ITR Deadlines</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0]">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#172033]">Q3 Advance Tax (75%)</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">15 Dec 2024</span>
              </div>
              <p className="text-[11px] text-[#718096] mt-1">Pay 75% of net estimated tax if liability &gt; ₹10,000 to avoid Sec 234B/C interest</p>
            </div>

            <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0]">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#172033]">Q4 Advance Tax (100%)</span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">15 Mar 2025</span>
              </div>
              <p className="text-[11px] text-[#718096] mt-1">Final instalment of advance tax before financial year end</p>
            </div>

            <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0]">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#172033]">ITR Filing Due Date</span>
                <span className="text-[10px] font-bold text-[#16A36A] bg-[#16A36A]/10 px-2 py-0.5 rounded-full">31 Jul 2025</span>
              </div>
              <p className="text-[11px] text-[#718096] mt-1">Annual filing deadline for individuals and salaried professionals</p>
            </div>
          </div>
        </div>
      </div>

      {/* STATUTORY CLASSIFIED TRANSACTIONS LIST */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-[#172033] flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#5F259F]" />
              <span>Smart Transaction Tax Classification (Every Inflow Explained)</span>
            </h3>
            <p className="text-xs text-[#718096]">
              Every credit and debit classified according to the Income Tax Act, 1961.
            </p>
          </div>
          <span className="text-xs text-[#718096]">
            Showing latest {Math.min(transactions.length, 6)} classified transactions
          </span>
        </div>

        <div className="divide-y divide-[#E2E8F0]">
          {transactions.slice(0, 6).map(tx => {
            const isCredit = tx.type === 'CREDIT';
            const isNonTaxable = tx.classification.status === 'NON_TAXABLE';
            const isDeductible = tx.classification.deductibleAmount > 0;

            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx.id)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-[#F8F9FC] px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isCredit
                      ? isNonTaxable
                        ? 'bg-teal-50 text-teal-700'
                        : 'bg-emerald-50 text-[#16A36A]'
                      : isDeductible
                        ? 'bg-purple-50 text-[#5F259F]'
                        : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isCredit ? '+' : '-'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#172033]">{tx.recipientName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        isNonTaxable
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : isCredit
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : isDeductible
                              ? 'bg-purple-50 text-[#5F259F] border border-[#5F259F]/20'
                              : 'bg-slate-100 text-[#718096]'
                      }`}>
                        {tx.classification.status.replace('_', ' ')}
                      </span>
                      {tx.classification.deductionSection && (
                        <span className="text-[10px] font-mono text-[#718096]">
                          u/s {tx.classification.deductionSection}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#718096] line-clamp-1">
                      {tx.classification.aiExplanation || tx.classification.legalBasis}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-sm font-black ${isCredit ? 'text-[#16A36A]' : 'text-[#172033]'}`}>
                    {isCredit ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-[#718096] block">{tx.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STATUTORY DISCLAIMER FOOTER */}
      <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] flex items-start gap-3 text-xs text-[#718096]">
        <Info className="w-4 h-4 text-[#5F259F] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-[#172033]">Statutory Disclaimer & Professional Advice Notice</p>
          <p className="text-[11px] leading-relaxed">
            TaxSaathi provides automated algorithmic estimation based on transactions and Income Tax Act, 1961 provisions (including Budget 2024 amendments). Tax computations should be verified with an independent Chartered Accountant before official filing on incometax.gov.in.
          </p>
        </div>
      </div>

      {/* MODALS */}
      {isGstModalOpen && (
        <GstCalculatorModal
          isOpen={isGstModalOpen}
          onClose={() => setIsGstModalOpen(false)}
        />
      )}

      {isTaxCalcModalOpen && (
        <IncomeTaxModal
          isOpen={isTaxCalcModalOpen}
          onClose={() => setIsTaxCalcModalOpen(false)}
        />
      )}
    </div>
  );
};
