import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SipFund } from '../../types/tax';
import {
  Coins,
  TrendingUp,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Landmark,
  PiggyBank,
  Percent,
  Clock,
  ArrowUpRight,
  Info,
  DollarSign,
  Compass,
  Award,
  Lock,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

type WealthTabType = 'all' | 'gold' | 'sip' | 'fd' | 'goals';

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

  const [activeWealthTab, setActiveWealthTab] = useState<WealthTabType>('all');
  const [activeModal, setActiveModal] = useState<'BUY_GOLD' | 'SELL_GOLD' | null>(null);
  const [goldBuyAmount, setGoldBuyAmount] = useState('1000');
  const [goldSellGrams, setGoldSellGrams] = useState('1');

  // SIP Calculator State
  const [sipAmount, setSipAmount] = useState(10000);
  const [sipYears, setSipYears] = useState(5);
  const [expectedRate, setExpectedRate] = useState(14); // 14% CAGR

  // Fixed Deposit State
  const [fdPrincipal, setFdPrincipal] = useState(100000);
  const [fdTenureMonths, setFdTenureMonths] = useState(24);
  const [fdInterestRate, setFdInterestRate] = useState(7.5);

  // Goal Planner State
  const [goalTargetAmount, setGoalTargetAmount] = useState(500000);
  const [goalYears, setGoalYears] = useState(3);
  const [goalRate, setGoalRate] = useState(12);

  // SIP Calculation: M * [ (1+i)^n - 1 ] * (1+i)/i
  const monthlyRate = expectedRate / 12 / 100;
  const totalMonths = sipYears * 12;
  const totalInvested = sipAmount * totalMonths;
  const estimatedFutureValue = Math.round(
    sipAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)
  );
  const totalWealthGained = estimatedFutureValue - totalInvested;
  // Approx tax saved under 80C
  const taxSaved = Math.min(totalInvested, 150000) * 0.312;

  // FD Maturity Calculation: Compound interest quarterly A = P * (1 + r/4)^(4*t)
  const fdYears = fdTenureMonths / 12;
  const fdMaturity = Math.round(
    fdPrincipal * Math.pow(1 + (fdInterestRate / 100) / 4, 4 * fdYears)
  );
  const fdInterestEarned = fdMaturity - fdPrincipal;

  // Goal Required Monthly Investment: Target * i / [ ((1+i)^n - 1) * (1+i) ]
  const goalMonthlyRate = goalRate / 12 / 100;
  const goalMonths = goalYears * 12;
  const goalMonthlyRequired = Math.round(
    (goalTargetAmount * goalMonthlyRate) /
    ((Math.pow(1 + goalMonthlyRate, goalMonths) - 1) * (1 + goalMonthlyRate))
  );

  const handleBuyGoldSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inr = parseFloat(goldBuyAmount);
    if (!inr || inr <= 0) return;

    const ok = buyGold(inr);
    if (ok) {
      setActiveModal(null);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch (err) {}
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
      alert(`Sold ${g}g gold. Funds credited to your primary bank account!`);
    } else {
      alert('Grams entered exceed your vault balance.');
    }
  };

  const bankFdPartners = [
    { name: 'Bajaj Finserv', type: 'AAA NBFC', rate: '7.85%', tenor: '24-36 Mo', badge: 'Highest Return' },
    { name: 'Shriram Finance', type: 'Credit Rating AA+', rate: '8.10%', tenor: '36 Mo', badge: 'Top Rated' },
    { name: 'HDFC Bank', type: 'Scheduled Commercial', rate: '7.40%', tenor: '15-18 Mo', badge: 'Most Popular' },
    { name: 'State Bank of India', type: 'Sovereign Backed', rate: '7.10%', tenor: '1-3 Yr', badge: 'Safest' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-[#172033]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5F259F]/10 text-[#5F259F] text-xs font-bold border border-[#5F259F]/20 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Wealth & Financial Services Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#172033]">
            Wealth Centre & Investments
          </h1>
          <p className="text-xs text-[#718096]">
            Grow your savings with 24K 999.9 digital gold, high-return SIPs, guaranteed bank FDs, and goal planning.
          </p>
        </div>

        {/* Wealth Category Filter Tabs */}
        <div className="flex items-center gap-1 bg-white dark:bg-[#21152D] p-1 rounded-xl border border-[#E8E1F2] dark:border-[#3D2854] shadow-xs overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Services' },
            { id: 'gold', label: '24K Gold' },
            { id: 'sip', label: 'SIP & Mutual Funds' },
            { id: 'fd', label: 'Fixed Deposits' },
            { id: 'goals', label: 'Savings Calculator' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveWealthTab(tab.id as WealthTabType)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeWealthTab === tab.id
                  ? 'bg-[#5F259F] text-white shadow-xs'
                  : 'text-[#718096] dark:text-slate-300 hover:text-[#172033] dark:hover:text-white hover:bg-[#F8F9FC] dark:hover:bg-[#2A1C39]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* QUICK WEALTH METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-[#21152D] p-4 rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] shadow-xs">
          <span className="text-[11px] font-bold text-[#718096] dark:text-purple-200 uppercase tracking-wider block">Gold Vault</span>
          <div className="text-lg sm:text-xl font-black text-[#172033] dark:text-white mt-1">
            {goldBalanceGrams.toFixed(3)} <span className="text-xs text-[#718096] dark:text-slate-400 font-normal">grams</span>
          </div>
          <div className="text-xs font-bold text-[#E9A23B] mt-0.5">
            ≈ ₹{Math.round(goldBalanceGrams * goldRatePerGram).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-white dark:bg-[#21152D] p-4 rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] shadow-xs">
          <span className="text-[11px] font-bold text-[#718096] dark:text-purple-200 uppercase tracking-wider block">Active SIPs</span>
          <div className="text-lg sm:text-xl font-black text-[#5F259F] dark:text-purple-300 mt-1">
            ₹15,000<span className="text-xs text-[#718096] dark:text-slate-400 font-normal"> /mo</span>
          </div>
          <div className="text-xs font-semibold text-[#16A36A] mt-0.5">
            3 Running on AutoPay
          </div>
        </div>

        <div className="bg-white dark:bg-[#21152D] p-4 rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] shadow-xs">
          <span className="text-[11px] font-bold text-[#718096] dark:text-purple-200 uppercase tracking-wider block">Mutual Fund Value</span>
          <div className="text-lg sm:text-xl font-black text-[#172033] dark:text-white mt-1">
            ₹1,47,500
          </div>
          <div className="text-xs font-semibold text-[#16A36A] mt-0.5 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-[#16A36A]" />
            <span>+16.4% Overall Return</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#21152D] p-4 rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] shadow-xs">
          <span className="text-[11px] font-bold text-[#718096] dark:text-purple-200 uppercase tracking-wider block">Tax Saved (80C)</span>
          <div className="text-lg sm:text-xl font-black text-[#16A36A] mt-1">
            ₹46,800
          </div>
          <div className="text-xs font-semibold text-[#718096] dark:text-slate-400 mt-0.5">
            Section 80C ELSS Cap
          </div>
        </div>
      </div>

      {/* SECTION 1: 24K DIGITAL GOLD HERO */}
      {(activeWealthTab === 'all' || activeWealthTab === 'gold') && (
        <div className="bg-white dark:bg-[#21152D] rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border-b border-[#E8E1F2] dark:border-[#3D2854]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E9A23B]/10 text-amber-800 dark:text-amber-300 text-xs font-bold border border-[#E9A23B]/30">
                  <Coins className="w-3.5 h-3.5 text-[#E9A23B]" />
                  <span>Augmont 999.9 Pure 24K Gold • 100% Insured BRINKS Vaults</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-2xl sm:text-3xl font-black text-[#172033] dark:text-white">
                    ₹{goldRatePerGram.toLocaleString('en-IN')}
                    <span className="text-sm font-semibold text-[#718096]"> / gram</span>
                  </h3>
                  <span className="text-xs font-bold text-[#16A36A] bg-[#16A36A]/10 px-2 py-0.5 rounded-full">
                    +1.2% Today
                  </span>
                </div>
                <p className="text-xs text-[#718096]">
                  Live bullion market price (exclusive of 3% GST). Start micro-investing with as low as ₹10.
                </p>
              </div>

              {/* User Gold Holdings Card */}
              <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] min-w-[240px] shrink-0">
                <div className="flex items-center justify-between text-xs font-bold text-[#718096]">
                  <span>Your Gold Vault</span>
                  <span className="text-amber-600 font-extrabold">24K 999.9 Pure</span>
                </div>
                <div className="text-2xl font-black text-[#172033] mt-1">
                  {goldBalanceGrams.toFixed(3)} <span className="text-xs text-[#718096] font-normal">grams</span>
                </div>
                <div className="text-xs font-bold text-[#172033] mt-0.5">
                  ≈ ₹{Math.round(goldBalanceGrams * goldRatePerGram).toLocaleString('en-IN')}
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setActiveModal('BUY_GOLD')}
                    className="flex-1 py-2 rounded-xl bg-[#5F259F] hover:bg-[#35145F] text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                  >
                    Buy Gold
                  </button>
                  <button
                    onClick={() => setActiveModal('SELL_GOLD')}
                    className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#172033] font-bold text-xs border border-[#E2E8F0] transition-colors"
                  >
                    Sell to Bank
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Gold Value Propositions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E8F0] text-xs p-4 bg-[#F8F9FC]">
            <div className="p-2 sm:px-4 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#16A36A] shrink-0" />
              <div>
                <p className="font-bold text-[#172033]">100% Insured Custody</p>
                <p className="text-[#718096] text-[11px]">Stored in Grade-A BRINKS vaults with zero theft risk</p>
              </div>
            </div>
            <div className="p-2 sm:px-4 flex items-center gap-3">
              <Coins className="w-5 h-5 text-[#E9A23B] shrink-0" />
              <div>
                <p className="font-bold text-[#172033]">Doorstep Physical Delivery</p>
                <p className="text-[#718096] text-[11px]">Convert digital gold into hallmarked coins & bars anytime</p>
              </div>
            </div>
            <div className="p-2 sm:px-4 flex items-center gap-3">
              <Landmark className="w-5 h-5 text-[#5F259F] shrink-0" />
              <div>
                <p className="font-bold text-[#172033]">Instant Bank Liquidity</p>
                <p className="text-[#718096] text-[11px]">Sell at live market rates with immediate UPI credit to bank</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CURATED MUTUAL FUNDS & SIPS */}
      {(activeWealthTab === 'all' || activeWealthTab === 'sip') && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-extrabold text-[#172033] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#5F259F]" />
                <span>Curated Direct Mutual Funds & SIPs</span>
              </h2>
              <p className="text-xs text-[#718096]">
                Zero-commission direct mutual fund plans with verified 3-year performance.
              </p>
            </div>
            <span className="text-xs font-bold text-[#5F259F] bg-[#5F259F]/10 px-3 py-1 rounded-full self-start sm:self-auto">
              0% Brokerage • AMFI Registered
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sipFunds.map(fund => (
              <div
                key={fund.id}
                className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs hover:border-[#5F259F]/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5F259F]/10 text-[#5F259F]">
                      {fund.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-black text-[#16A36A] bg-[#16A36A]/10 px-2 py-0.5 rounded-md">
                      +{fund.cagr3Yr}% 3Y CAGR
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#172033] line-clamp-1">{fund.fundName}</h3>
                    <p className="text-xs text-[#718096]">{fund.amc}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#718096]">Your Investment:</span>
                      <span className="font-bold text-[#172033]">₹{fund.currentValue.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#718096]">Monthly SIP:</span>
                      <span className="font-extrabold text-[#5F259F]">₹{fund.monthlyAmount.toLocaleString('en-IN')}/mo</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#718096] leading-relaxed">
                    {fund.taxBenefit}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-[#E2E8F0]">
                  <button
                    onClick={() => alert(`Active SIP of ₹${fund.monthlyAmount.toLocaleString('en-IN')}/mo is securely active on TechPay AutoPay!`)}
                    className="w-full py-2 rounded-xl bg-[#F8F9FC] hover:bg-[#5F259F] text-[#172033] hover:text-white font-bold text-xs border border-[#E2E8F0] hover:border-transparent transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Manage SIP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: INTERACTIVE SIP CALCULATOR */}
      {(activeWealthTab === 'all' || activeWealthTab === 'sip') && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#5F259F]/10 text-[#5F259F] flex items-center justify-center font-bold">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-[#172033]">
                  Interactive SIP & Tax Reduction Calculator
                </h2>
                <p className="text-xs text-[#718096]">
                  Estimate your wealth accumulation and Section 80C tax savings over time.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#5F259F] bg-[#5F259F]/10 px-3 py-1 rounded-full self-start sm:self-auto">
              Compounded Monthly @ {expectedRate}% CAGR
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4 text-xs">
              {/* Monthly SIP Slider */}
              <div>
                <div className="flex justify-between font-bold mb-1.5">
                  <span className="text-[#718096]">Monthly SIP Investment</span>
                  <span className="text-[#5F259F] font-black text-sm">₹{sipAmount.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="500"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  className="w-full accent-[#5F259F] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#718096] mt-1">
                  <span>₹1,000</span>
                  <span>₹25,000</span>
                  <span>₹50,000</span>
                </div>
              </div>

              {/* Investment Tenure */}
              <div>
                <div className="flex justify-between font-bold mb-1.5">
                  <span className="text-[#718096]">Investment Period (Tenure)</span>
                  <span className="text-[#5F259F] font-black text-sm">{sipYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={sipYears}
                  onChange={(e) => setSipYears(Number(e.target.value))}
                  className="w-full accent-[#5F259F] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#718096] mt-1">
                  <span>1 Year</span>
                  <span>10 Years</span>
                  <span>20 Years</span>
                </div>
              </div>

              {/* Expected Rate Slider */}
              <div>
                <div className="flex justify-between font-bold mb-1.5">
                  <span className="text-[#718096]">Expected Annual Return (CAGR)</span>
                  <span className="text-[#16A36A] font-black text-sm">{expectedRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="20"
                  step="0.5"
                  value={expectedRate}
                  onChange={(e) => setExpectedRate(Number(e.target.value))}
                  className="w-full accent-[#16A36A] cursor-pointer"
                />
              </div>
            </div>

            {/* Projection Output Card */}
            <div className="p-5 rounded-2xl bg-[#172033] text-white space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Total Amount Invested:</span>
                  <span className="font-bold text-white">₹{totalInvested.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Estimated Wealth Gained:</span>
                  <span className="font-bold text-[#16A36A]">+₹{totalWealthGained.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Potential Tax Saved (u/s 80C):</span>
                  <span className="font-bold text-[#E9A23B]">₹{Math.round(taxSaved).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Projected Maturity Value</span>
                  <span className="text-2xl font-black text-white">
                    ₹{estimatedFutureValue.toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={() => alert(`Starting SIP of ₹${sipAmount.toLocaleString('en-IN')}/mo in top-rated ELSS Tax Saver!`)}
                  className="px-4 py-2.5 rounded-xl bg-[#5F259F] hover:bg-[#35145F] text-white font-bold text-xs shadow-sm transition-all"
                >
                  Start This SIP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: FIXED DEPOSITS & RECURRING DEPOSITS */}
      {(activeWealthTab === 'all' || activeWealthTab === 'fd') && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-extrabold text-[#172033] flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#5F259F]" />
                <span>Guaranteed Fixed & Recurring Deposits</span>
              </h2>
              <p className="text-xs text-[#718096]">
                Earn up to 8.10% p.a. guaranteed returns with RBI-regulated banks & AAA-rated NBFCs.
              </p>
            </div>
            <span className="text-xs font-bold text-[#16A36A] bg-[#16A36A]/10 px-3 py-1 rounded-full self-start sm:self-auto">
              DICGC Insured up to ₹5 Lakh
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bankFdPartners.map((bank, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16A36A]/10 text-[#16A36A]">
                      {bank.badge}
                    </span>
                    <span className="text-[10px] text-[#718096]">{bank.tenor}</span>
                  </div>
                  <h3 className="text-sm font-black text-[#172033]">{bank.name}</h3>
                  <p className="text-xs text-[#718096]">{bank.type}</p>
                  <div className="mt-3">
                    <span className="text-2xl font-black text-[#5F259F]">{bank.rate}</span>
                    <span className="text-xs text-[#718096]"> p.a.</span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Booking ${bank.name} Fixed Deposit at ${bank.rate} p.a.`)}
                  className="w-full py-2 rounded-xl bg-[#F8F9FC] hover:bg-[#5F259F] text-[#172033] hover:text-white font-bold text-xs border border-[#E2E8F0] hover:border-transparent transition-all"
                >
                  Book Deposit
                </button>
              </div>
            ))}
          </div>

          {/* Interactive FD Calculator */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-[#172033] flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#5F259F]" />
              <span>Fixed Deposit (FD) Return Simulator</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[#718096] font-bold mb-1">Deposit Principal (₹)</label>
                <input
                  type="number"
                  step="5000"
                  value={fdPrincipal}
                  onChange={(e) => setFdPrincipal(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] font-bold text-sm text-[#172033] focus:outline-none focus:border-[#5F259F]"
                />
              </div>

              <div>
                <label className="block text-[#718096] font-bold mb-1">Tenure ({fdTenureMonths} Months)</label>
                <input
                  type="range"
                  min="6"
                  max="60"
                  step="6"
                  value={fdTenureMonths}
                  onChange={(e) => setFdTenureMonths(Number(e.target.value))}
                  className="w-full accent-[#5F259F] cursor-pointer mt-2"
                />
              </div>

              <div>
                <label className="block text-[#718096] font-bold mb-1">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={fdInterestRate}
                  onChange={(e) => setFdInterestRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] font-bold text-sm text-[#172033] focus:outline-none focus:border-[#5F259F]"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-[#718096] block">Total Principal:</span>
                  <span className="font-bold text-[#172033]">₹{fdPrincipal.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[#718096] block">Interest Earned:</span>
                  <span className="font-extrabold text-[#16A36A]">+₹{fdInterestEarned.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#718096] block font-semibold">Total Maturity Amount:</span>
                <span className="text-xl font-black text-[#5F259F]">₹{fdMaturity.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: SAVINGS & FINANCIAL GOAL CALCULATOR */}
      {(activeWealthTab === 'all' || activeWealthTab === 'goals') && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-base font-extrabold text-[#172033] flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-[#5F259F]" />
                <span>Smart Goal Planner & Savings Calculator</span>
              </h2>
              <p className="text-xs text-[#718096]">
                Determine exact monthly contributions required to hit your home, car, or dream milestone.
              </p>
            </div>
            <span className="text-xs font-bold text-[#5F259F] bg-[#5F259F]/10 px-3 py-1 rounded-full self-start sm:self-auto">
              Automate via Locked Vault
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#718096] font-bold mb-1">Target Goal Amount (₹)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="50000"
                    value={goalTargetAmount}
                    onChange={(e) => setGoalTargetAmount(Number(e.target.value))}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E2E8F0] font-bold text-sm text-[#172033] focus:outline-none focus:border-[#5F259F]"
                  />
                  <div className="flex gap-1">
                    {[300000, 500000, 1000000].map(val => (
                      <button
                        key={val}
                        onClick={() => setGoalTargetAmount(val)}
                        className="px-2.5 py-1 rounded-lg bg-[#F8F9FC] hover:bg-[#5F259F]/10 text-xs font-bold border border-[#E2E8F0]"
                      >
                        ₹{(val / 100000).toFixed(0)}L
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-[#718096]">Timeline to Achieve Goal</span>
                  <span className="text-[#5F259F] font-black">{goalYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={goalYears}
                  onChange={(e) => setGoalYears(Number(e.target.value))}
                  className="w-full accent-[#5F259F] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-[#718096]">Expected Annual Growth</span>
                  <span className="text-[#16A36A] font-black">{goalRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="16"
                  step="1"
                  value={goalRate}
                  onChange={(e) => setGoalRate(Number(e.target.value))}
                  className="w-full accent-[#16A36A] cursor-pointer"
                />
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider">Required Monthly SIP</span>
                <div className="text-3xl font-black text-[#5F259F]">
                  ₹{goalMonthlyRequired.toLocaleString('en-IN')}
                  <span className="text-xs text-[#718096] font-normal"> / month</span>
                </div>
                <p className="text-xs text-[#718096]">
                  By saving <strong>₹{goalMonthlyRequired.toLocaleString('en-IN')}</strong> every month for {goalYears} years, you will reach your target of <strong>₹{goalTargetAmount.toLocaleString('en-IN')}</strong>.
                </p>
              </div>

              <button
                onClick={() => alert(`Goal created! Monthly ₹${goalMonthlyRequired.toLocaleString('en-IN')} auto-transfer configured.`)}
                className="w-full py-2.5 rounded-xl bg-[#5F259F] hover:bg-[#35145F] text-white font-bold text-xs shadow-xs transition-all"
              >
                Create Goal & Automate Monthly Debit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BUY GOLD */}
      {activeModal === 'BUY_GOLD' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-[#E2E8F0] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-[#E9A23B]" />
                <h3 className="text-sm font-black text-[#172033]">Buy 24K 999.9 Pure Gold</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-[#718096] hover:text-[#172033] font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleBuyGoldSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#718096] font-bold mb-1">Enter Investment Amount (₹)</label>
                <input
                  type="number"
                  min="10"
                  required
                  value={goldBuyAmount}
                  onChange={(e) => setGoldBuyAmount(e.target.value)}
                  className="w-full px-3 py-2 text-lg font-black rounded-xl border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#5F259F]"
                />
                <div className="flex gap-1.5 mt-2">
                  {['500', '1000', '5000', '10000'].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setGoldBuyAmount(val)}
                      className="px-2.5 py-1 rounded-lg bg-[#F8F9FC] hover:bg-[#5F259F]/10 text-xs font-bold border border-[#E2E8F0]"
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50/80 rounded-xl text-amber-950 text-xs space-y-1 border border-amber-200">
                <div className="flex justify-between">
                  <span>Approx Gold Received:</span>
                  <strong className="font-extrabold text-[#172033]">{(parseFloat(goldBuyAmount) / goldRatePerGram || 0).toFixed(4)} grams</strong>
                </div>
                <div className="text-[10px] text-amber-800">
                  Live Rate: ₹{goldRatePerGram.toLocaleString('en-IN')}/g • Insured in BRINKS vault.
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#5F259F] hover:bg-[#35145F] text-white font-extrabold text-xs shadow-xs transition-all active:scale-95"
              >
                Pay & Buy Gold via UPI
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SELL GOLD */}
      {activeModal === 'SELL_GOLD' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-[#E2E8F0] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#5F259F]" />
                <h3 className="text-sm font-black text-[#172033]">Sell Gold to Bank Account</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-[#718096] hover:text-[#172033] font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleSellGoldSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#718096] font-bold mb-1">Grams to Sell</label>
                <input
                  type="number"
                  step="0.001"
                  max={goldBalanceGrams}
                  required
                  value={goldSellGrams}
                  onChange={(e) => setGoldSellGrams(e.target.value)}
                  className="w-full px-3 py-2 text-lg font-black rounded-xl border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#5F259F]"
                />
              </div>

              <div className="p-3 bg-[#F8F9FC] rounded-xl text-[#172033] text-xs space-y-1 border border-[#E2E8F0]">
                <div className="flex justify-between">
                  <span className="text-[#718096]">Vault Balance:</span>
                  <strong>{goldBalanceGrams.toFixed(3)}g</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718096]">Credit to HDFC Bank:</span>
                  <strong className="text-[#16A36A] font-extrabold">
                    ₹{Math.round(parseFloat(goldSellGrams) * goldRatePerGram * 0.97 || 0).toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#172033] hover:bg-slate-800 text-white font-extrabold text-xs shadow-xs transition-all active:scale-95"
              >
                Confirm Instant Credit to Bank
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
