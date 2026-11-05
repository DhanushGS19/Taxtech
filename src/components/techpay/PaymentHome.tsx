import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  Smartphone,
  Building2,
  Send,
  ArrowRightLeft,
  Lock,
  Search,
  Zap,
  Droplets,
  Wifi,
  Flame,
  CreditCard,
  Shield,
  GraduationCap,
  Scale,
  Calculator,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Coins,
  Copy,
  Check
} from 'lucide-react';

import { ReceiveMoneyModal } from './ReceiveMoneyModal';
import { RequestMoneyModal } from './RequestMoneyModal';
import { BillPaymentModal, BillCategoryType } from './BillPaymentModal';
import { GstCalculatorModal } from './GstCalculatorModal';
import { IncomeTaxModal } from './IncomeTaxModal';

interface PaymentHomeProps {
  onOpenMakePayment: (defaultRecipient?: { name: string; upiId: string; amount?: number; category?: string; location?: any }) => void;
  onNavigateSection: (section: string) => void;
  onSelectTransaction: (txId: string) => void;
}

export const PaymentHome: React.FC<PaymentHomeProps> = ({
  onOpenMakePayment,
  onNavigateSection,
  onSelectTransaction
}) => {
  const {
    accountBalance,
    monthlyIncome,
    totalLockedAmount,
    unpaidLockedAmount,
    safeDiscretionaryBudget,
    currentDiscretionarySpent,
    commitments,
    transactions,
    activeProfile,
    setIsCheckBalanceOpen,
    formatPrivateAmount
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Modals state
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [billModalCategory, setBillModalCategory] = useState<BillCategoryType | null>(null);
  const [isGstOpen, setIsGstOpen] = useState(false);
  const [isTaxCalcOpen, setIsTaxCalcOpen] = useState(false);

  const freeSpendingRemaining = Math.max(0, safeDiscretionaryBudget - currentDiscretionarySpent);
  const percentSpent = safeDiscretionaryBudget > 0
    ? Math.min(100, Math.round((currentDiscretionarySpent / safeDiscretionaryBudget) * 100))
    : 0;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(activeProfile.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // 9 Exact Bill Categories specified in requirement #3
  const billCategories: { id: BillCategoryType; title: string; icon: any }[] = [
    { id: 'mobile', title: 'Mobile Recharge', icon: Smartphone },
    { id: 'electricity', title: 'Electricity', icon: Zap },
    { id: 'water', title: 'Water', icon: Droplets },
    { id: 'broadband', title: 'Broadband', icon: Wifi },
    { id: 'gas', title: 'Gas Cylinder', icon: Flame },
    { id: 'credit-card', title: 'Credit Card', icon: CreditCard },
    { id: 'loan-emi', title: 'Loan EMI', icon: Building2 },
    { id: 'insurance', title: 'Insurance', icon: Shield },
    { id: 'education', title: 'Education Fees', icon: GraduationCap }
  ];

  // Filtered recent transactions
  const recentTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions.slice(0, 5);
    const q = searchQuery.toLowerCase();
    return transactions.filter(t => 
      t.recipientName.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.location?.city.toLowerCase().includes(q) ||
      t.amount.toString().includes(q)
    ).slice(0, 5);
  }, [transactions, searchQuery]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Universal Search & Quick UPI Handle Bar */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#718096] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts, mobile number, merchant name, or billers..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] text-xs font-medium text-[#172033] placeholder:text-[#718096] focus:outline-none focus:border-[#5F259F] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 px-3 py-2 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] text-xs">
          <span className="text-[#718096] text-[11px] font-medium">My UPI ID:</span>
          <span className="font-mono font-bold text-[#172033]">{activeProfile.upiId}</span>
          <button
            onClick={handleCopyUpi}
            className="p-1 text-[#5F259F] hover:text-[#35145F] transition-colors"
            title="Copy UPI ID"
          >
            {copiedUpi ? <Check className="w-3.5 h-3.5 text-[#16A36A]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. SECTION: MONEY TRANSFERS (Payment-First Experience) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#718096]">
            Money Transfers
          </h2>
          <span className="text-[11px] text-[#16A36A] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A]"></span>
            <span>NPCI UPI 2.0 Active</span>
          </span>
        </div>

        {/* 7 Clean Payment Actions (Scan & Pay has strongest visual emphasis) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* 1. Scan & Pay (STRONGEST VISUAL EMPHASIS) */}
          <button
            onClick={() => onNavigateSection('scan')}
            className="col-span-2 sm:col-span-2 lg:col-span-1 p-4 rounded-xl bg-gradient-to-br from-[#5F259F] to-[#35145F] text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center text-white">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="mt-4">
              <div className="text-sm font-extrabold text-white flex items-center justify-between">
                <span>Scan & Pay</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[11px] text-purple-200 mt-0.5">Any UPI QR</div>
            </div>
          </button>

          {/* 2. Check Balance */}
          <button
            onClick={() => setIsCheckBalanceOpen(true)}
            className="p-3.5 rounded-xl bg-[#F8F9FC] hover:bg-[#F3EEF9] border border-[#E2E8F0] hover:border-[#5F259F]/30 text-left transition-all active:scale-95 flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#16A36A] border border-emerald-100 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div className="mt-3">
              <div className="text-xs font-bold text-[#172033] group-hover:text-[#5F259F]">Check Balance</div>
              <div className="text-[10px] text-[#718096] mt-0.5 font-mono">HDFC ••4892</div>
            </div>
          </button>

          {/* 3. Send Money */}
          <button
            onClick={() => onOpenMakePayment({ name: 'Rahul Sharma', upiId: '9876543210@paytm' })}
            className="p-3.5 rounded-xl bg-[#F8F9FC] hover:bg-[#F3EEF9] border border-[#E2E8F0] hover:border-[#5F259F]/30 text-left transition-all active:scale-95 flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-[#5F259F] border border-purple-100 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="mt-3">
              <div className="text-xs font-bold text-[#172033] group-hover:text-[#5F259F]">Send Money</div>
              <div className="text-[10px] text-[#718096] mt-0.5">To Mobile No.</div>
            </div>
          </button>

          {/* 4. Bank Transfer */}
          <button
            onClick={() => onOpenMakePayment({ name: 'HDFC Bank Account Transfer', upiId: 'account.transfer@hdfcbank' })}
            className="p-3.5 rounded-xl bg-[#F8F9FC] hover:bg-[#F3EEF9] border border-[#E2E8F0] hover:border-[#5F259F]/30 text-left transition-all active:scale-95 flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="mt-3">
              <div className="text-xs font-bold text-[#172033] group-hover:text-[#5F259F]">Bank Transfer</div>
              <div className="text-[10px] text-[#718096] mt-0.5">A/c No & IFSC</div>
            </div>
          </button>

          {/* 5. UPI ID */}
          <button
            onClick={() => onOpenMakePayment()}
            className="p-3.5 rounded-xl bg-[#F8F9FC] hover:bg-[#F3EEF9] border border-[#E2E8F0] hover:border-[#5F259F]/30 text-left transition-all active:scale-95 flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-lg bg-violet-50 text-[#5F259F] border border-violet-100 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div className="mt-3">
              <div className="text-xs font-bold text-[#172033] group-hover:text-[#5F259F]">UPI ID</div>
              <div className="text-[10px] text-[#718096] mt-0.5">Instant VPA</div>
            </div>
          </button>

          {/* 6. Self Transfer */}
          <button
            onClick={() => onOpenMakePayment({ name: 'Self Savings Account', upiId: 'self.savings@icici' })}
            className="p-3.5 rounded-xl bg-[#F8F9FC] hover:bg-[#F3EEF9] border border-[#E2E8F0] hover:border-[#5F259F]/30 text-left transition-all active:scale-95 flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-[#E9A23B] border border-amber-100 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div className="mt-3">
              <div className="text-xs font-bold text-[#172033] group-hover:text-[#5F259F]">Self Transfer</div>
              <div className="text-[10px] text-[#718096] mt-0.5">Own Accounts</div>
            </div>
          </button>

          {/* 7. Request Money */}
          <button
            onClick={() => setIsRequestOpen(true)}
            className="p-3.5 rounded-xl bg-[#F8F9FC] hover:bg-[#F3EEF9] border border-[#E2E8F0] hover:border-[#5F259F]/30 text-left transition-all active:scale-95 flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#172033] border border-slate-200 flex items-center justify-center">
              <Send className="w-4 h-4 rotate-180" />
            </div>
            <div className="mt-3">
              <div className="text-xs font-bold text-[#172033] group-hover:text-[#5F259F]">Request Money</div>
              <div className="text-[10px] text-[#718096] mt-0.5">UPI Collect</div>
            </div>
          </button>
        </div>
      </div>

      {/* 3. SECTION: RECHARGE & BILLS (9 Categories) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#718096]">
            Recharge & Bill Payments
          </h2>
          <span className="text-[11px] text-[#718096] font-medium">Bharat BillPay (BBPS)</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
          {billCategories.map((b) => {
            const Icon = b.icon;
            return (
              <button
                key={b.id}
                onClick={() => setBillModalCategory(b.id)}
                className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-[#F8F9FC] border border-transparent hover:border-[#E2E8F0] transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#F8F9FC] group-hover:bg-[#F3EEF9] border border-[#E2E8F0] flex items-center justify-center text-[#5F259F] group-hover:scale-105 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-[#172033] mt-2 leading-tight group-hover:text-[#5F259F]">
                  {b.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. SECTION: FINANCIAL OVERVIEW & MONTHLY EXPENSES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Income Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#718096]">Monthly Net Income</span>
          <div className="text-xl font-extrabold text-[#172033] mt-1">₹{monthlyIncome.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-[#718096] mt-0.5">Verified salary & credited cash flow</p>
        </div>

        {/* Expenses Burn Rate */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#718096]">Discretionary Spent</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-[#172033]">{percentSpent}% used</span>
          </div>
          <div className="text-xl font-extrabold text-[#172033] mt-1">₹{currentDiscretionarySpent.toLocaleString('en-IN')}</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div style={{ width: `${percentSpent}%` }} className="bg-[#5F259F] h-full rounded-full"></div>
          </div>
        </div>

        {/* Safe Discretionary Remaining */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A36A]">Safe Spending Allowance</span>
          <div className="text-xl font-extrabold text-[#16A36A] mt-1">₹{freeSpendingRemaining.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-[#718096] mt-0.5">Protected from locked vault obligations</p>
        </div>
      </div>

      {/* 5. SECTION: RECENT TRANSACTIONS & UPCOMING COMMITMENTS (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-[#172033]">Recent Transactions</h3>
              <p className="text-[11px] text-[#718096]">Real-world merchant & location tagged</p>
            </div>
            <button
              onClick={() => onNavigateSection('history')}
              className="text-xs font-bold text-[#5F259F] hover:text-[#35145F] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentTransactions.map((tx) => {
              const isCredit = tx.type === 'CREDIT';
              return (
                <div
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx.id)}
                  className="py-3 px-2 rounded-xl hover:bg-[#F8F9FC] transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isCredit ? 'bg-emerald-50 text-[#16A36A] border border-emerald-100' : 'bg-[#F3EEF9] text-[#5F259F] border border-[#5F259F]/15'
                    }`}>
                      {tx.recipientName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#172033] group-hover:text-[#5F259F] transition-colors flex items-center gap-1.5">
                        <span>{tx.recipientName || tx.description}</span>
                        <CheckCircle2 className="w-3 h-3 text-[#16A36A]" />
                      </div>
                      <div className="text-[11px] text-[#718096] flex items-center gap-1.5 mt-0.5">
                        <span>{tx.date} • {tx.time}</span>
                        {tx.location?.city && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-slate-500">
                              <MapPin className="w-3 h-3 text-[#5F259F]" />
                              {tx.location.city}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`text-sm font-extrabold ${isCredit ? 'text-[#16A36A]' : 'text-[#172033]'}`}>
                      {isCredit ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-[#718096]">
                      Successful
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Upcoming Payments (Commitments Vault) */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-[#172033]">Upcoming Commitments</h3>
              <p className="text-[11px] text-[#718096]">₹{totalLockedAmount.toLocaleString('en-IN')} safely reserved</p>
            </div>
            <button
              onClick={() => onNavigateSection('budgets')}
              className="text-xs font-bold text-[#5F259F] hover:underline"
            >
              Vault →
            </button>
          </div>

          <div className="space-y-2.5">
            {commitments.slice(0, 3).map((com) => (
              <div
                key={com.id}
                className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8F9FC] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#172033]">{com.title}</h4>
                  <span className="text-xs font-extrabold text-[#172033]">₹{com.allocatedAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#718096]">
                  <span>{com.dueDateDescription}</span>
                  <button
                    onClick={() => onOpenMakePayment({
                      name: com.title,
                      upiId: `${com.title.toLowerCase().replace(/\s+/g, '')}@okaxis`,
                      amount: com.allocatedAmount,
                      category: com.category
                    })}
                    className="text-[10px] font-bold text-[#5F259F] hover:underline"
                  >
                    Pay via UPI
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tax Assistant Card (Requirement #8 preview) */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#35145F] to-[#5F259F] text-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-amber-300" />
                <span>TaxSaathi AI CA</span>
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">FY 2024-25</span>
            </div>
            <p className="text-[11px] text-purple-200 leading-relaxed">
              Section 115BAC automated tax savings engine is monitoring your transactions.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setIsTaxCalcOpen(true)}
                className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] text-center transition-all"
              >
                Calculate Tax
              </button>
              <button
                onClick={() => setIsGstOpen(true)}
                className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] text-center transition-all"
              >
                GST Calculator
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReceiveMoneyModal
        isOpen={isReceiveOpen}
        onClose={() => setIsReceiveOpen(false)}
      />

      <RequestMoneyModal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
      />

      {billModalCategory && (
        <BillPaymentModal
          isOpen={!!billModalCategory}
          onClose={() => setBillModalCategory(null)}
          initialCategory={billModalCategory}
        />
      )}

      <GstCalculatorModal
        isOpen={isGstOpen}
        onClose={() => setIsGstOpen(false)}
      />

      <IncomeTaxModal
        isOpen={isTaxCalcOpen}
        onClose={() => setIsTaxCalcOpen(false)}
        onOpenFullTaxHub={() => onNavigateSection('tax')}
      />
    </div>
  );
};
