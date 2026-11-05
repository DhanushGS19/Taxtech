import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Coins,
  ArrowRight,
  Calculator,
  Lock,
  Percent,
  Info
} from 'lucide-react';

export const TaxPlanningTab: React.FC = () => {
  const { taxComparison, financialYear } = useApp();

  const [sim80C, setSim80C] = useState(150000);
  const [simNPS, setSimNPS] = useState(50000);
  const [sim80D, setSim80D] = useState(35000);
  const [simHomeLoan, setSimHomeLoan] = useState(180000);

  const totalDeductions = sim80C + simNPS + sim80D + Math.min(simHomeLoan, 200000);
  const estTaxSaved = Math.round(totalDeductions * 0.312);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-[#172033]">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5F259F]/10 text-[#5F259F] text-xs font-bold border border-[#5F259F]/20 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Statutory Tax Optimization</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#172033]">
          Legal Tax Saving & Deductions Simulator (FY {financialYear})
        </h1>
        <p className="text-xs text-[#718096]">
          Actionable tax-saving strategies compliant with Indian Income Tax Act, 1961 provisions.
        </p>
      </div>

      {/* Recommended Strategy Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#16A36A]/10 text-[#16A36A] px-2.5 py-1 rounded-full border border-[#16A36A]/20">
            Recommended Optimal Choice
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#172033]">
            Save ₹{taxComparison.taxSavings.toLocaleString('en-IN')} with the {taxComparison.recommendedRegime} Tax Regime
          </h2>
          <p className="text-xs text-[#718096] leading-relaxed">
            {taxComparison.explanation}
          </p>
        </div>

        <div className="bg-[#F8F9FC] p-4 rounded-xl text-center shrink-0 border border-[#E2E8F0] min-w-[200px]">
          <div className="text-xs text-[#718096]">Tax Saving Deadline</div>
          <div className="text-lg font-black text-[#5F259F] mt-0.5">31st March 2025</div>
          <div className="text-[10px] text-[#718096]">For claiming FY 2024-25 deductions</div>
        </div>
      </div>

      {/* Simulator */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-[#172033] flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#5F259F]" />
              <span>Interactive Tax Deduction Simulator</span>
            </h3>
            <p className="text-xs text-[#718096]">Simulate Chapter VI-A deductions under the Old Tax Regime</p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-[#718096] block">Estimated Tax Saved:</span>
            <div className="text-lg font-black text-[#16A36A]">₹{estTaxSaved.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span className="text-[#172033]">Section 80C (ELSS / PPF / EPF / Tuition)</span>
              <span className="text-[#5F259F] font-black">₹{sim80C.toLocaleString('en-IN')} / ₹1.5L</span>
            </div>
            <input
              type="range"
              min="0"
              max="150000"
              step="5000"
              value={sim80C}
              onChange={(e) => setSim80C(Number(e.target.value))}
              className="w-full accent-[#5F259F] cursor-pointer"
            />
            <p className="text-[11px] text-[#718096]">ELSS mutual funds offer the shortest 3-year lock-in with equity returns.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span className="text-[#172033]">Section 80CCD(1B) NPS Extra</span>
              <span className="text-[#5F259F] font-black">₹{simNPS.toLocaleString('en-IN')} / ₹50k</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="2500"
              value={simNPS}
              onChange={(e) => setSimNPS(Number(e.target.value))}
              className="w-full accent-[#5F259F] cursor-pointer"
            />
            <p className="text-[11px] text-[#718096]">Exclusive additional deduction of ₹50,000 above the Section 80C limit.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span className="text-[#172033]">Section 80D Health Insurance</span>
              <span className="text-[#5F259F] font-black">₹{sim80D.toLocaleString('en-IN')} / ₹1L</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="5000"
              value={sim80D}
              onChange={(e) => setSim80D(Number(e.target.value))}
              className="w-full accent-[#5F259F] cursor-pointer"
            />
            <p className="text-[11px] text-[#718096]">₹25k for self/family + up to ₹50k for senior citizen parents.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span className="text-[#172033]">Section 24(b) Home Loan Interest</span>
              <span className="text-[#5F259F] font-black">₹{simHomeLoan.toLocaleString('en-IN')} / ₹2.0L</span>
            </div>
            <input
              type="range"
              min="0"
              max="200000"
              step="10000"
              value={simHomeLoan}
              onChange={(e) => setSimHomeLoan(Number(e.target.value))}
              className="w-full accent-[#5F259F] cursor-pointer"
            />
            <p className="text-[11px] text-[#718096]">Maximum deduction on self-occupied house property home loan interest.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
