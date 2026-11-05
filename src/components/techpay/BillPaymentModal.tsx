import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Smartphone,
  Zap,
  Droplets,
  Tv,
  Wifi,
  Flame,
  CreditCard,
  Building,
  Shield,
  GraduationCap,
  Car,
  Landmark,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type BillCategoryType = 
  | 'mobile'
  | 'electricity'
  | 'water'
  | 'dth'
  | 'broadband'
  | 'gas'
  | 'credit-card'
  | 'loan-emi'
  | 'insurance'
  | 'education'
  | 'fastag'
  | 'municipal';

interface BillPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: BillCategoryType;
}

const BILL_PROVIDERS: Record<BillCategoryType, { name: string; title: string; icon: any; billers: string[]; sampleAmt: number }> = {
  mobile: {
    name: 'Mobile Recharge',
    title: 'Prepaid & Postpaid Recharge',
    icon: Smartphone,
    billers: ['Jio Prepaid', 'Airtel India', 'Vodafone Idea (Vi)', 'BSNL Mobile'],
    sampleAmt: 299
  },
  electricity: {
    name: 'Electricity Bill',
    title: 'State Electricity Boards',
    icon: Zap,
    billers: ['BESCOM - Bengaluru', 'Tata Power - Mumbai & Delhi', 'Adani Electricity - Mumbai', 'MSEDCL - Maharashtra', 'BSES Rajdhani - Delhi'],
    sampleAmt: 1450
  },
  water: {
    name: 'Water Bill',
    title: 'Municipal Water Supply',
    icon: Droplets,
    billers: ['BWSSB - Bengaluru', 'Delhi Jal Board', 'MCGM Water - Mumbai', 'HMWSSB - Hyderabad'],
    sampleAmt: 420
  },
  dth: {
    name: 'DTH / Cable TV',
    title: 'Direct-to-Home Television',
    icon: Tv,
    billers: ['Tata Play (Tata Sky)', 'Airtel Digital TV', 'Dish TV India', 'Sun Direct'],
    sampleAmt: 450
  },
  broadband: {
    name: 'Broadband / Wi-Fi',
    title: 'High Speed Fiber Internet',
    icon: Wifi,
    billers: ['Airtel Xstream Fiber', 'JioFiber', 'ACT Fibernet', 'Hathway Broadband', 'Tata Play Fiber'],
    sampleAmt: 899
  },
  gas: {
    name: 'Gas Cylinder & PNG',
    title: 'LPG Booking & Piped Gas',
    icon: Flame,
    billers: ['Indane Gas (Indian Oil)', 'Bharat Gas (BPCL)', 'HP Gas (HPCL)', 'Indraprastha Gas (IGL)', 'Mahanagar Gas (MGL)'],
    sampleAmt: 850
  },
  'credit-card': {
    name: 'Credit Card Bill',
    title: 'Pay Any Bank Credit Card',
    icon: CreditCard,
    billers: ['HDFC Bank Credit Card', 'ICICI Bank Credit Card', 'SBI Card', 'Axis Bank Credit Card', 'Amex India'],
    sampleAmt: 12450
  },
  'loan-emi': {
    name: 'Loan EMI',
    title: 'Home, Car & Personal Loans',
    icon: Building,
    billers: ['HDFC Home Loans', 'Bajaj Finance', 'SBI Home Finance', 'Tata Capital', 'Muthoot Finance'],
    sampleAmt: 38000
  },
  insurance: {
    name: 'Insurance Premium',
    title: 'Life & Health Insurance (Sec 80D)',
    icon: Shield,
    billers: ['LIC of India', 'HDFC Life Insurance', 'ICICI Prudential Life', 'Star Health Allied Insurance', 'Max Life'],
    sampleAmt: 6500
  },
  education: {
    name: 'Education Fees',
    title: 'Schools, Colleges & Institutes',
    icon: GraduationCap,
    billers: ['Delhi Public School (DPS)', 'Ryan International Group', 'NPS Bengaluru', 'Amity University', 'Symbiosis Pune'],
    sampleAmt: 18000
  },
  fastag: {
    name: 'FASTag Recharge',
    title: 'NETC National Highway Tolls',
    icon: Car,
    billers: ['HDFC Bank FASTag', 'ICICI Bank FASTag', 'Paytm Payments Bank FASTag', 'SBI FASTag', 'Axis FASTag'],
    sampleAmt: 1000
  },
  municipal: {
    name: 'Municipal Payments',
    title: 'Property Tax & Trade License',
    icon: Landmark,
    billers: ['BBMP Property Tax - Bengaluru', 'MCD Property Tax - Delhi', 'BMC Property Tax - Mumbai', 'GHMC Hyderabad'],
    sampleAmt: 3200
  }
};

export const BillPaymentModal: React.FC<BillPaymentModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'electricity'
}) => {
  const { sendPayment, accountBalance } = useApp();

  const [category, setCategory] = useState<BillCategoryType>(initialCategory);
  const [selectedBiller, setSelectedBiller] = useState<string>('');
  const [consumerNumber, setConsumerNumber] = useState<string>('1098472910');
  const [amount, setAmount] = useState<string>('');
  const [isFetched, setIsFetched] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    const info = BILL_PROVIDERS[category];
    if (info) {
      setSelectedBiller(info.billers[0]);
      setAmount(info.sampleAmt.toString());
      setIsFetched(false);
      setIsPaid(false);
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const currentInfo = BILL_PROVIDERS[category];
  const Icon = currentInfo.icon;

  const handleFetchBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumerNumber.trim()) return;
    setIsFetched(true);
  };

  const handlePayBill = () => {
    const numAmt = parseFloat(amount) || currentInfo.sampleAmt;
    if (numAmt > accountBalance) {
      alert('Insufficient account balance.');
      return;
    }

    sendPayment({
      recipientName: selectedBiller,
      recipientUpiId: `${category}.bbps@npci`,
      amount: numAmt,
      description: `${currentInfo.name} - A/c ${consumerNumber}`,
      category: 'UTILITY',
      paymentMethod: 'UPI_APP'
    });

    setIsPaid(true);
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (e) {}

    setTimeout(() => {
      setIsPaid(false);
      setIsFetched(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center shadow-sm">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">{currentInfo.name}</h3>
              <p className="text-[10px] text-slate-500">Bharat Bill Payment System (BBPS)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pill Scroller */}
        <div className="p-2.5 bg-slate-100/70 border-b border-slate-200 overflow-x-auto no-scrollbar flex gap-1.5">
          {(Object.keys(BILL_PROVIDERS) as BillCategoryType[]).map((cat) => {
            const isSel = cat === category;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                  isSel
                    ? 'bg-[#5F259F] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {BILL_PROVIDERS[cat].name.replace(' Bill', '')}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {isPaid ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900">Bill Paid Successfully!</h4>
              <p className="text-xs text-slate-600">
                ₹{amount} paid to <strong>{selectedBiller}</strong> via BBPS UPI switch.
              </p>
              <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] font-mono text-slate-500">
                BBPS Ref: BBPS{Math.floor(100000000000 + Math.random() * 900000000000)}
              </div>
            </div>
          ) : (
            <>
              {/* Select Biller */}
              <div>
                <label className="block text-slate-600 font-bold mb-1">Select Service Provider / Board</label>
                <select
                  value={selectedBiller}
                  onChange={(e) => setSelectedBiller(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-bold bg-white focus:outline-none focus:border-[#5F259F]"
                >
                  {currentInfo.billers.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Consumer / Account Number */}
              <form onSubmit={handleFetchBill} className="space-y-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">
                    {category === 'mobile'
                      ? 'Mobile Number (10 digits)'
                      : category === 'credit-card'
                      ? 'Last 4 digits of Card'
                      : category === 'fastag'
                      ? 'Vehicle Registration Number'
                      : 'Consumer / Account / Customer ID'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={consumerNumber}
                      onChange={(e) => {
                        setConsumerNumber(e.target.value);
                        setIsFetched(false);
                      }}
                      placeholder="e.g. 1098472910"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-[#5F259F]"
                    />
                    {!isFetched && (
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs whitespace-nowrap"
                      >
                        Fetch Bill
                      </button>
                    )}
                  </div>
                </div>
              </form>

              {/* Fetched Bill Card */}
              {isFetched && (
                <div className="p-4 rounded-2xl bg-[#F0EAF8] border border-[#5F259F]/20 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#5F259F] uppercase tracking-wider">
                        Verified Outstanding Bill
                      </span>
                      <h4 className="text-sm font-black text-slate-900">{selectedBiller}</h4>
                      <p className="text-[11px] text-slate-500">Consumer: Rahul Sharma (A/c {consumerNumber})</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400">Due in 5 days</span>
                      <div className="text-xl font-black text-slate-900">₹{amount}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#5F259F]/10 flex items-center justify-between text-[11px] text-slate-600">
                    <span>Payment Mode: Instant UPI (HDFC •••• 4892)</span>
                    <span className="text-emerald-700 font-bold">Convenience Fee: ₹0</span>
                  </div>

                  <button
                    type="button"
                    onClick={handlePayBill}
                    className="w-full py-3 rounded-2xl bg-[#5F259F] hover:bg-[#38146B] text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Confirm & Pay ₹{amount}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* BBPS Assurance */}
              <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>NPCI Bharat BillPay • Guaranteed instant receipt & settlement</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

