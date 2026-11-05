import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Scale, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface IncomeTaxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFullTaxHub?: () => void;
}

export const IncomeTaxModal: React.FC<IncomeTaxModalProps> = ({ isOpen, onClose, onOpenFullTaxHub }) => {
  const { monthlyIncome, taxComparison, activeRegime, toggleRegime } = useApp();

  const [annualIncome, setAnnualIncome] = useState<string>((monthlyIncome * 12).toString());
  const [deductions80C, setDeductions80C] = useState<string>('150000');
  const [deductions80D, setDeductions80D] = useState<string>('25000');
  const [homeLoanInterest, setHomeLoanInterest] = useState<string>('200000');

  if (!isOpen) return null;

  const grossIncome = parseFloat(annualIncome) || 0;
  const d80C = Math.min(150000, parseFloat(deductions80C) || 0);
  const d80D = Math.min(75000, parseFloat(deductions80D) || 0);
  const dHomeLoan = Math.min(200000, parseFloat(homeLoanInterest) || 0);

  // New Regime Calculation (Budget 2024 / FY 2024-25)
  // Standard Deduction = ₹75,000
  const newNetTaxable = Math.max(0, grossIncome - 75000);
  let newTax = 0;
  if (newNetTaxable > 300000) {
    if (newNetTaxable <= 700000) {
      newTax += (newNetTaxable - 300000) * 0.05;
    } else {
      newTax += 400000 * 0.05; // 20,000
      if (newNetTaxable <= 1000000) {
        newTax += (newNetTaxable - 700000) * 0.10;
      } else {
        newTax += 300000 * 0.10; // 30,000
        if (newNetTaxable <= 1200000) {
          newTax += (newNetTaxable - 1000000) * 0.15;
        } else {
          newTax += 200000 * 0.15; // 30,000
          if (newNetTaxable <= 1500000) {
            newTax += (newNetTaxable - 1200000) * 0.20;
          } else {
            newTax += 300000 * 0.20; // 60,000
            newTax += (newNetTaxable - 1500000) * 0.30;
          }
        }
      }
    }
  }
  // Sec 87A rebate for New Regime up to ₹7,000,00 (effectively taxable income <= 7.75L with std deduction)
  if (newNetTaxable <= 700000) {
    newTax = 0;
  }
  const newTaxWithCess = Math.round(newTax * 1.04);

  // Old Regime Calculation
  // Standard Deduction = ₹50,000
  const oldNetTaxable = Math.max(0, grossIncome - 50000 - d80C - d80D - dHomeLoan);
  let oldTax = 0;
  if (oldNetTaxable > 250000) {
    if (oldNetTaxable <= 500000) {
      oldTax += (oldNetTaxable - 250000) * 0.05;
    } else {
      oldTax += 250000 * 0.05; // 12,500
      if (oldNetTaxable <= 1000000) {
        oldTax += (oldNetTaxable - 500000) * 0.20;
      } else {
        oldTax += 500000 * 0.20; // 1,00,000
        oldTax += (oldNetTaxable - 1000000) * 0.30;
      }
    }
  }
  if (oldNetTaxable <= 500000) {
    oldTax = 0;
  }
  const oldTaxWithCess = Math.round(oldTax * 1.04);

  const betterRegime = newTaxWithCess < oldTaxWithCess ? 'NEW' : 'OLD';
  const taxSaved = Math.abs(oldTaxWithCess - newTaxWithCess);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#16A36A] text-white flex items-center justify-center shadow-sm">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Income Tax Regime Calculator</h3>
              <p className="text-[10px] text-slate-500">FY 2024-25 (AY 2025-26) Budget 2024 Slabs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form & Results */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-bold mb-1">Gross Annual Income (₹) *</label>
            <input
              type="number"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-black text-base focus:outline-none focus:border-[#5F259F]"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-slate-500 font-bold text-[10px] mb-1">Sec 80C (PPF/ELSS)</label>
              <input
                type="number"
                value={deductions80C}
                onChange={(e) => setDeductions80C(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold text-[10px] mb-1">Sec 80D (Health Ins)</label>
              <input
                type="number"
                value={deductions80D}
                onChange={(e) => setDeductions80D(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold text-[10px] mb-1">Sec 24(b) (Home Loan)</label>
              <input
                type="number"
                value={homeLoanInterest}
                onChange={(e) => setHomeLoanInterest(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 font-bold"
              />
            </div>
          </div>

          {/* Side by Side Comparison Cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* New Regime */}
            <div className={`p-4 rounded-2xl border transition-all ${
              betterRegime === 'NEW'
                ? 'bg-[#F0EAF8] border-[#5F259F] shadow-sm ring-1 ring-[#5F259F]/20'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-slate-900">New Regime (Sec 115BAC)</span>
                {betterRegime === 'NEW' && (
                  <span className="text-[9px] bg-[#16A36A] text-white px-2 py-0.5 rounded-full font-bold">Recommended</span>
                )}
              </div>
              <div className="text-xl font-black text-slate-900 mt-2">
                ₹{newTaxWithCess.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 space-y-0.5">
                <div>Std Deduction: ₹75,000</div>
                <div>Tax Slabs: 0% to 30%</div>
              </div>
            </div>

            {/* Old Regime */}
            <div className={`p-4 rounded-2xl border transition-all ${
              betterRegime === 'OLD'
                ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-1 ring-emerald-500/20'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-slate-900">Old Tax Regime</span>
                {betterRegime === 'OLD' && (
                  <span className="text-[9px] bg-[#16A36A] text-white px-2 py-0.5 rounded-full font-bold">Recommended</span>
                )}
              </div>
              <div className="text-xl font-black text-slate-900 mt-2">
                ₹{oldTaxWithCess.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 space-y-0.5">
                <div>Std Deduction: ₹50,000</div>
                <div>Claimed: ₹{(d80C + d80D + dHomeLoan).toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>

          {/* Recommendation Banner */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold">
                You save ₹{taxSaved.toLocaleString('en-IN')} by choosing the {betterRegime} Regime!
              </span>
            </div>
            <button
              onClick={toggleRegime}
              className="text-[11px] font-bold underline hover:text-emerald-950"
            >
              Switch Now
            </button>
          </div>

          {onOpenFullTaxHub && (
            <button
              onClick={() => {
                onClose();
                onOpenFullTaxHub();
              }}
              className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Open TaxSaathi Statutory CA Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

