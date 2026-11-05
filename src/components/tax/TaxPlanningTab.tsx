import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Coins,
  ArrowRight
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
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-emerald-600" />
          <span>Legal Tax Saving Advisor (FY {financialYear})</span>
        </h2>
        <p className="text-xs text-slate-500">
          Actionable tax-saving strategies tailored to Indian Income Tax rules.
        </p>
      </div>

      {/* Regime Strategy */}
      <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full">
            Recommended Action
          </span>
          <h3 className="text-xl font-black">
            Save ₹{taxComparison.taxSavings.toLocaleString('en-IN')} with the {taxComparison.recommendedRegime} Tax Regime
          </h3>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            {taxComparison.explanation}
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl text-center shrink-0 border border-white/10">
          <div className="text-xs text-slate-300">Investment Deadline</div>
          <div className="text-lg font-black text-emerald-400 mt-1">31st March 2025</div>
          <div className="text-[10px] text-slate-400">For claiming FY 2024-25 deductions</div>
        </div>
      </div>

      {/* Simulator */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Interactive Tax Deduction Simulator</h3>
            <p className="text-xs text-slate-500">Simulate statutory deductions under the Old Tax Regime</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">Estimated Old Regime Tax Saved:</span>
            <div className="text-lg font-black text-emerald-600">₹{estTaxSaved.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span>Section 80C (ELSS / PPF / Tuition)</span>
              <span className="text-emerald-600">₹{sim80C.toLocaleString('en-IN')} / ₹1.5L</span>
            </div>
            <input
              type="range"
              min="0"
              max="150000"
              step="5000"
              value={sim80C}
              onChange={(e) => setSim80C(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">ELSS has shortest 3-year lock-in.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span>Section 80CCD(1B) NPS Extra</span>
              <span className="text-emerald-600">₹{simNPS.toLocaleString('en-IN')} / ₹50k</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="2500"
              value={simNPS}
              onChange={(e) => setSimNPS(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Exclusive additional deduction above 80C limit.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span>Section 80D Health Insurance</span>
              <span className="text-emerald-600">₹{sim80D.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="5000"
              value={sim80D}
              onChange={(e) => setSim80D(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">₹25k self/family + ₹50k for senior parents.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span>Section 24(b) Home Loan Interest</span>
              <span className="text-emerald-600">₹{simHomeLoan.toLocaleString('en-IN')} / ₹2.0L</span>
            </div>
            <input
              type="range"
              min="0"
              max="200000"
              step="10000"
              value={simHomeLoan}
              onChange={(e) => setSimHomeLoan(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Deduction on self-occupied house loan interest.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
