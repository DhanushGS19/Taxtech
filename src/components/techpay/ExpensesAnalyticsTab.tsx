import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  ShoppingBag,
  Coffee,
  Home,
  HeartPulse,
  Fuel,
  CreditCard,
  Building2,
  Calendar,
  ArrowUpRight,
  ShieldAlert,
  Zap,
  Info
} from 'lucide-react';

export const ExpensesAnalyticsTab: React.FC = () => {
  const {
    transactions,
    monthlyIncome,
    totalLockedAmount,
    unpaidLockedAmount,
    safeDiscretionaryBudget,
    currentDiscretionarySpent,
    formatPrivateAmount
  } = useApp();

  const [selectedTimeframe, setSelectedTimeframe] = useState<'THIS_MONTH' | 'LAST_MONTH'>('THIS_MONTH');

  // Compute category totals from transactions
  const debitTransactions = transactions.filter(t => t.type === 'DEBIT' && !t.isDuplicate);

  const categoryTotals: Record<string, { total: number; count: number; icon: any; color: string; bg: string }> = {
    HOUSING: { total: 0, count: 0, icon: Home, color: 'text-[#5F259F]', bg: 'bg-[#5F259F]' },
    GROCERY: { total: 0, count: 0, icon: ShoppingBag, color: 'text-[#16A36A]', bg: 'bg-[#16A36A]' },
    CAFE: { total: 0, count: 0, icon: Coffee, color: 'text-[#E9A23B]', bg: 'bg-[#E9A23B]' },
    HEALTH: { total: 0, count: 0, icon: HeartPulse, color: 'text-rose-600', bg: 'bg-rose-500' },
    FUEL: { total: 0, count: 0, icon: Fuel, color: 'text-blue-600', bg: 'bg-blue-500' },
    SHOPPING: { total: 0, count: 0, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-600' },
    EMI: { total: 0, count: 0, icon: CreditCard, color: 'text-slate-600', bg: 'bg-slate-700' },
    INVESTMENT: { total: 0, count: 0, icon: Zap, color: 'text-teal-600', bg: 'bg-teal-600' },
    OTHER: { total: 0, count: 0, icon: Building2, color: 'text-[#718096]', bg: 'bg-[#718096]' }
  };

  let totalExpenses = 0;
  debitTransactions.forEach(tx => {
    totalExpenses += tx.amount;
    const cat = (tx.category || 'OTHER').toUpperCase();
    if (categoryTotals[cat]) {
      categoryTotals[cat].total += tx.amount;
      categoryTotals[cat].count += 1;
    } else {
      categoryTotals.OTHER.total += tx.amount;
      categoryTotals.OTHER.count += 1;
    }
  });

  // Top spending merchants
  const merchantSpends: Record<string, { amount: number; count: number; city: string; category: string }> = {};
  debitTransactions.forEach(tx => {
    const name = tx.recipientName;
    if (!merchantSpends[name]) {
      merchantSpends[name] = {
        amount: 0,
        count: 0,
        city: tx.location?.city || 'India',
        category: tx.category || 'Expense'
      };
    }
    merchantSpends[name].amount += tx.amount;
    merchantSpends[name].count += 1;
  });

  const sortedMerchants = Object.entries(merchantSpends)
    .sort((a, b) => b[1].amount - a[1].amount)
    .slice(0, 5);

  const todayDate = new Date().getDate();
  const daysInMonth = 30;
  const dailyBurnRate = todayDate > 0 ? Math.round(currentDiscretionarySpent / todayDate) : 0;
  const projectedDiscretionaryMonthEnd = Math.round(dailyBurnRate * daysInMonth);
  const isProjectedOverbudget = projectedDiscretionaryMonthEnd > safeDiscretionaryBudget;

  const remainingDiscretionary = Math.max(0, safeDiscretionaryBudget - currentDiscretionarySpent);
  const isEmergencyRisk = remainingDiscretionary < unpaidLockedAmount * 0.25;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-[#172033]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5F259F]/10 text-[#5F259F] text-xs font-bold border border-[#5F259F]/20 mb-1">
            <PieChart className="w-3.5 h-3.5" />
            <span>Monthly Expenditure Intelligence</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#172033]">
            Expenses & Spending Analytics
          </h1>
          <p className="text-xs text-[#718096]">
            Categorised spending breakdowns, merchant analytics, and end-of-month expense forecasting.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E2E8F0] self-start sm:self-auto text-xs font-bold shadow-xs">
          <button
            onClick={() => setSelectedTimeframe('THIS_MONTH')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedTimeframe === 'THIS_MONTH' ? 'bg-[#5F259F] text-white shadow-xs' : 'text-[#718096] hover:text-[#172033]'
            }`}
          >
            Current Month (November)
          </button>
          <button
            onClick={() => setSelectedTimeframe('LAST_MONTH')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedTimeframe === 'LAST_MONTH' ? 'bg-[#5F259F] text-white shadow-xs' : 'text-[#718096] hover:text-[#172033]'
            }`}
          >
            Previous Month
          </button>
        </div>
      </div>

      {/* Emergency Alert Banner if remaining funds are tight */}
      {isEmergencyRisk && (
        <div className="bg-amber-50 border border-[#E9A23B]/30 p-4 rounded-2xl text-amber-950 flex items-start gap-3 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-[#E9A23B] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h3 className="text-xs font-extrabold flex items-center gap-2">
              <span>Low Balance Warning</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.2 rounded-full font-bold">Action Needed</span>
            </h3>
            <p className="text-xs leading-relaxed text-[#718096]">
              Your flexible allowance remaining ({formatPrivateAmount(remainingDiscretionary)}) is falling close to your pending fixed obligations ({formatPrivateAmount(unpaidLockedAmount)}). Avoid discretionary spends until all monthly EMIs and rent are settled.
            </p>
          </div>
        </div>
      )}

      {/* 3 Executive Overview KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Debits */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">Total Outflow This Month</span>
          <div className="text-2xl sm:text-3xl font-black text-[#172033] mt-1.5">
            {formatPrivateAmount(totalExpenses)}
          </div>
          <p className="text-xs text-[#718096] mt-1">Across {debitTransactions.length} recorded payments</p>
        </div>

        {/* Card 2: Daily Spending Velocity */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">Daily Spending Burn Rate</span>
            <TrendingUp className="w-4 h-4 text-[#5F259F]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#5F259F] mt-1.5">
            {formatPrivateAmount(dailyBurnRate)}<span className="text-xs text-[#718096] font-normal"> / day</span>
          </div>
          <p className="text-xs text-[#718096] mt-1">Average flexible outflow per day</p>
        </div>

        {/* Card 3: Projected Month-End Spend */}
        <div className={`p-5 rounded-2xl border shadow-xs ${
          isProjectedOverbudget ? 'bg-amber-50/50 border-[#E9A23B]/30' : 'bg-white border-[#E2E8F0]'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">Projected Month-End Spend</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isProjectedOverbudget ? 'bg-amber-100 text-amber-800' : 'bg-[#16A36A]/10 text-[#16A36A]'
            }`}>
              {isProjectedOverbudget ? 'Overbudget Forecast' : 'Healthy Forecast'}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#172033] mt-1.5">
            {formatPrivateAmount(projectedDiscretionaryMonthEnd)}
          </div>
          <p className="text-xs text-[#718096] mt-1">
            Planned discretionary cap: {formatPrivateAmount(safeDiscretionaryBudget)}
          </p>
        </div>
      </div>

      {/* 2-Column Main Section: Category Breakdown + Spending Behaviour Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Category Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-[#172033]">
                Expenditure by Category
              </h2>
              <p className="text-xs text-[#718096]">
                Automatic transaction categorization matching Indian merchant patterns.
              </p>
            </div>
            <span className="text-xs font-bold text-[#718096]">
              {debitTransactions.length} Payments
            </span>
          </div>

          <div className="space-y-4">
            {Object.entries(categoryTotals)
              .filter(([_, data]) => data.total > 0)
              .sort((a, b) => b[1].total - a[1].total)
              .map(([key, data]) => {
                const Icon = data.icon;
                const percentage = totalExpenses > 0 ? Math.round((data.total / totalExpenses) * 100) : 0;

                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl ${data.bg} text-white flex items-center justify-center shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-[#172033]">{key}</span>
                          <span className="text-[#718096] text-[10px] ml-1.5">({data.count} txns)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-[#172033]">
                          {formatPrivateAmount(data.total)}
                        </span>
                        <span className="text-[#718096] text-[11px] ml-2 font-semibold">
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    <div className="h-2 w-full bg-[#F8F9FC] rounded-full overflow-hidden border border-[#E2E8F0]/50">
                      <div
                        style={{ width: `${percentage}%` }}
                        className={`h-full ${data.bg} transition-all duration-500 rounded-full`}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Right 1 Col: Spending Behaviour Insights */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
              <Sparkles className="w-4 h-4 text-[#5F259F]" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#172033]">
                Smart Spending Insights
              </h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] space-y-1">
                <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Cafe & Dining (+34%)</span>
                </div>
                <p className="text-[#718096] text-[11px]">
                  You have made 3 visits to Starbucks Indiranagar totaling ₹1,850. Consider setting a weekend coffee limit.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] space-y-1">
                <div className="flex items-center gap-1.5 text-[#16A36A] font-bold">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Grocery Spend Optimal</span>
                </div>
                <p className="text-[#718096] text-[11px]">
                  D-Mart monthly grocery trip was completed at ₹3,200, remaining well within your ₹4,000 monthly grocery budget.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] space-y-1">
                <div className="flex items-center gap-1.5 text-[#5F259F] font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Upcoming Fixed Outflow</span>
                </div>
                <p className="text-[#718096] text-[11px]">
                  SBI Home Loan EMI (₹38,000) and Apartment Rent (₹25,000) are protected in your Locked Vault for payment on 10th November.
                </p>
              </div>
            </div>
          </div>

          {/* Top Merchant Spends */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 space-y-3">
            <h4 className="text-xs font-extrabold text-[#172033] uppercase tracking-wider pb-2 border-b border-[#E2E8F0]">
              Top Verified Merchants
            </h4>
            <div className="space-y-2.5">
              {sortedMerchants.map(([name, data], idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#172033]">{name}</div>
                    <div className="text-[10px] text-[#718096]">{data.city} • {data.count} visits</div>
                  </div>
                  <div className="text-right font-black text-[#172033]">
                    {formatPrivateAmount(data.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
