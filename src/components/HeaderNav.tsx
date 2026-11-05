import React from 'react';
import { useApp, AppFace } from '../context/AppContext';
import {
  Zap,
  Scale,
  Mic,
  FileText,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building
} from 'lucide-react';

interface HeaderNavProps {
  onOpenVoiceCa: () => void;
  onOpenMakePayment: () => void;
  onOpenReport: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenVoiceCa,
  onOpenMakePayment,
  onOpenReport
}) => {
  const {
    activeFace,
    setActiveFace,
    accountBalance,
    activeProfile,
    profiles,
    setActiveProfileId,
    overspendingAlert,
    taxComparison,
    resetToSampleData,
    activeRegime,
    toggleRegime
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Utility Ticker */}
      <div className="bg-slate-950 text-slate-300 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-white">Live UPI & Indian Tax Engine Active:</span>
          <span className="text-slate-400 hidden sm:inline">FY 2024-25 | Standard Deduction ₹75,000 | 24K Gold ₹7,865/g</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Overspending Banner Pill if active */}
          {overspendingAlert && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-600/40 animate-pulse">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Budget Guardrail Triggered</span>
            </div>
          )}

          {/* Quick Regime Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-0.5 rounded-full text-[11px]">
            <span className="text-slate-400">Tax Regime:</span>
            <button
              onClick={toggleRegime}
              className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                activeRegime === 'NEW' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
              }`}
            >
              {activeRegime} (Save ₹{taxComparison.taxSavings.toLocaleString('en-IN')})
            </button>
          </div>

          <button
            onClick={resetToSampleData}
            title="Reset to sample data"
            className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Dominant Face Switcher */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveFace('TECHPAY')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Zap className="w-6 h-6 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900">
                    TECH<span className="text-indigo-600">PAY</span>
                  </span>
                  <span className="text-slate-300">/</span>
                  <span className="text-sm font-bold text-emerald-700">TaxSaathi</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                  Smart Payments • Location History • Personal AI CA
                </p>
              </div>
            </div>

            {/* TWO DOMINANT FACES SWITCHER PILL */}
            <div className="p-1 bg-slate-100 rounded-2xl flex items-center shadow-inner ml-2">
              <button
                onClick={() => setActiveFace('TECHPAY')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFace === 'TECHPAY'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>TechPay (Face 1)</span>
              </button>
              <button
                onClick={() => setActiveFace('TAXSAATHI')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFace === 'TAXSAATHI'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>TaxSaathi AI CA (Face 2)</span>
              </button>
            </div>
          </div>

          {/* Action Center: Pay Button, Voice CA, Profile, Balance */}
          <div className="flex items-center gap-2.5">
            {/* Pay Button */}
            <button
              onClick={onOpenMakePayment}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay via UPI</span>
            </button>

            {/* Voice CA Quick Button */}
            <button
              onClick={onOpenVoiceCa}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200 transition-all shadow-xs active:scale-95"
            >
              <Mic className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span className="hidden sm:inline">Voice CA</span>
            </button>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className={`w-8 h-8 rounded-full ${activeProfile.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-sm`}>
                {activeProfile.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <select
                  value={activeProfile.id}
                  onChange={(e) => setActiveProfileId(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer"
                >
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.relationship})
                    </option>
                  ))}
                </select>
                <div className="text-[10px] text-slate-500 font-mono">
                  {activeProfile.upiId}
                </div>
              </div>
            </div>

            {/* ITR Summary Button */}
            <button
              onClick={onOpenReport}
              className="hidden lg:flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>ITR Sheet</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
