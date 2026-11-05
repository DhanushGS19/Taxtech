import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SipFund } from '../../types/tax';
import {
  Sparkles,
  TrendingUp,
  Coins,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Lock,
  Award,
  BookOpen,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const InvestmentsTab: React.FC = () => {
  const {
    accountBalance,
    goldBalanceGrams,
    goldRatePerGram,
    buyGold,
    sellGold,
    sipFunds,
    startSip
  } = useApp();

  const [goldBuyAmount, setGoldBuyAmount] = useState('1000');
  const [goldSellGrams, setGoldSellGrams] = useState('1');
  const [activeModal, setActiveModal] = useState<'BUY_GOLD' | 'SELL_GOLD' | null>(null);

  // SIP Calculator State
  const [sipAmount, setSipAmount] = useState(12500);
  const [sipYears, setSipYears] = useState(3);
  const expectedRate = 15; // 15% CAGR

  // Calculate SIP returns: M * [ (1+i)^n - 1 ] * (1+i)/i
  const monthlyRate = expectedRate / 12 / 100;
  const totalMonths = sipYears * 12;
  const totalInvested = sipAmount * totalMonths;
  const estimatedFutureValue = Math.round(
    sipAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)
  );
  const totalWealthGained = estimatedFutureValue - totalInvested;

  // Approx tax saved under 80C (30% bracket + cess = 31.2%)
  const taxSaved = Math.min(totalInvested, 150000) * 0.312;

  const handleBuyGoldSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inr = parseFloat(goldBuyAmount);
    if (!inr || inr <= 0) return;

    const ok = buyGold(inr);
    if (ok) {
      setActiveModal(null);
      try {
        confetti({ particleCount: 60, spread: 60 });
      } catch (e) {}
    } else {
      alert('Insufficient bank balance to purchase gold.');
    }
  };

  const handleSellGoldSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const g = parseFloat(goldSellGrams);
    if (!g || g <= 0) return;

    const ok = sellGold(g);
    if (ok) {
      setActiveModal(null);
      alert(`Sold ${g}g gold. Funds credited to your HDFC bank account!`);
    } else {
      alert('Grams entered exceed your vault balance.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Coins className="w-6 h-6 text-amber-500" />
          <span>Wealth & Investment Hub (24K Gold & SIPs)</span>
        </h2>
        <p className="text-xs text-slate-500">
          Invest in 999.9 pure 24K digital gold and high-return mutual funds with verified Indian tax reduction guidance.
        </p>
      </div>

      {/* 24K DIGITAL GOLD SECTION */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-slate-950 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/20 text-slate-950 text-xs font-extrabold border border-slate-950/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Augmont 999.9 Pure 24K Gold • Insured BRINKS Vaults</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              ₹{goldRatePerGram.toLocaleString('en-IN')}<span className="text-sm font-bold opacity-80"> / gram</span>
            </h3>
            <p className="text-xs font-semibold opacity-90">
              Live Bullion Market Rate (+1.2% today) • Start investing with just ₹10
            </p>
          </div>

          {/* User Vault Holdings Card */}
          <div className="p-4 rounded-2xl bg-slate-950 text-white shadow-xl min-w-[220px] text-center shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Your Gold Vault Balance</span>
            <div className="text-2xl font-black text-white mt-1">
              {goldBalanceGrams.toFixed(3)} <span className="text-xs text-slate-400 font-normal">grams</span>
            </div>
            <div className="text-xs font-bold text-amber-400 mt-0.5">
              ≈ ₹{Math.round(goldBalanceGrams * goldRatePerGram).toLocaleString('en-IN')}
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setActiveModal('BUY_GOLD')}
                className="flex-1 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-sm transition-all active:scale-95"
              >
                Buy Gold
              </button>
              <button
                onClick={() => setActiveModal('SELL_GOLD')}
                className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
              >
                Sell
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SIP MUTUAL FUNDS HUB */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Curated Mutual Funds & SIPs
            </h3>
            <p className="text-xs text-slate-500">
              ELSS Tax Saver (Section 80C) and High-Growth Index Funds
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600">Zero Commission Direct Plans</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sipFunds.map(fund => (
            <div
              key={fund.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    {fund.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600">
                    +{fund.cagr3Yr}% 3Y CAGR
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{fund.fundName}</h4>
                <div className="text-xs text-slate-400">{fund.amc}</div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Holding:</span>
                    <span className="font-bold text-slate-900">₹{fund.currentValue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Monthly SIP:</span>
                    <span className="font-bold text-indigo-600">₹{fund.monthlyAmount.toLocaleString('en-IN')}/mo</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {fund.taxBenefit}
                </p>
              </div>

              <button
                onClick={() => alert(`Active SIP of ₹${fund.monthlyAmount.toLocaleString('en-IN')}/mo is running smoothly on AutoPay!`)}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                Manage Active SIP
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* INTERACTIVE SIP & TAX REDUCTION CALCULATOR */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Interactive SIP & Tax Saver Calculator</h3>
              <p className="text-xs text-slate-500">Project compounding wealth and annual income tax savings</p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            @ {expectedRate}% Expected CAGR
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 text-xs">
            {/* Monthly SIP Slider */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-600">Monthly SIP Amount</span>
                <span className="text-indigo-600 font-black text-sm">₹{sipAmount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={sipAmount}
                onChange={(e) => setSipAmount(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Investment Tenure */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-600">Investment Period (Years)</span>
                <span className="text-indigo-600 font-black text-sm">{sipYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={sipYears}
                onChange={(e) => setSipYears(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Result Card */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Total Amount Invested:</span>
              <span className="font-bold text-white">₹{totalInvested.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Estimated Capital Gains:</span>
              <span className="font-bold text-emerald-400">+₹{totalWealthGained.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Annual Tax Saved (Sec 80C):</span>
              <span className="font-bold text-amber-400">₹{Math.round(taxSaved).toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300">Projected Maturity Value:</span>
              <span className="text-xl font-black text-white">₹{estimatedFutureValue.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: BUY GOLD */}
      {activeModal === 'BUY_GOLD' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Buy 24K 999.9 Pure Gold</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleBuyGoldSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Enter Amount (₹ INR)</label>
                <input
                  type="number"
                  min="10"
                  required
                  value={goldBuyAmount}
                  onChange={(e) => setGoldBuyAmount(e.target.value)}
                  className="w-full px-3 py-2 text-base font-black rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-amber-950 text-xs space-y-1">
                <div>You receive approx: <strong>{(parseFloat(goldBuyAmount) / goldRatePerGram || 0).toFixed(4)} grams</strong></div>
                <div className="text-[10px] text-amber-800">Stored in 100% insured digital vaults.</div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md"
              >
                Pay & Buy Gold via UPI
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SELL GOLD */}
      {activeModal === 'SELL_GOLD' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Sell Gold to Bank</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleSellGoldSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Grams to Sell</label>
                <input
                  type="number"
                  step="0.001"
                  max={goldBalanceGrams}
                  required
                  value={goldSellGrams}
                  onChange={(e) => setGoldSellGrams(e.target.value)}
                  className="w-full px-3 py-2 text-base font-black rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-slate-800 text-xs space-y-1">
                <div>Available Vault Balance: <strong>{goldBalanceGrams.toFixed(3)}g</strong></div>
                <div>Credit to Bank: <strong>₹{Math.round(parseFloat(goldSellGrams) * goldRatePerGram * 0.97 || 0).toLocaleString('en-IN')}</strong></div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md"
              >
                Confirm Sell to Bank
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
