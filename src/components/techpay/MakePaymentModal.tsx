import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TransactionIntelligenceEngine } from '../../engine/transactionIntelligence';
import { PaymentLocation } from '../../types/tax';
import {
  X,
  CreditCard,
  Send,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
  FileText,
  Pencil,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MakePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultData?: {
    name?: string;
    upiId?: string;
    amount?: number;
    category?: string;
    location?: PaymentLocation;
  } | null;
}

const PRESET_LOCATIONS: PaymentLocation[] = [
  {
    shopName: 'Starbucks Coffee Flagship',
    street: '100 Feet Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    landmark: 'Near 12th Main Junction',
    latitude: 12.9784,
    longitude: 77.6408,
    category: 'CAFE'
  },
  {
    shopName: 'Apollo Pharmacy 24/7',
    street: 'Block J, Sector 18 Market',
    city: 'Noida',
    state: 'Uttar Pradesh',
    landmark: 'Near Metro Station',
    latitude: 28.5708,
    longitude: 77.3260,
    category: 'HEALTH'
  },
  {
    shopName: 'D-Mart Hypermarket',
    street: 'Hinjewadi-Wakad Link Road',
    city: 'Pune',
    state: 'Maharashtra',
    landmark: 'Near Shivaji Chowk',
    latitude: 18.5913,
    longitude: 73.7389,
    category: 'GROCERY'
  },
  {
    shopName: 'Shell Auto Fuel Station',
    street: 'MG Road, DLF Phase 2',
    city: 'Gurugram',
    state: 'Haryana',
    landmark: 'Near Sikanderpur Metro',
    latitude: 28.4795,
    longitude: 77.0801,
    category: 'FUEL'
  },
  {
    shopName: 'Apartment Landlord (Rent)',
    street: '4th Block, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    landmark: 'Near Sony World Signal',
    latitude: 12.9352,
    longitude: 77.6245,
    category: 'RENT'
  }
];

// Authentic Starbucks Siren Circular Logo
const StarbucksLogo: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <div className={`rounded-full bg-[#006241] flex items-center justify-center overflow-hidden shrink-0 shadow-xs ${className}`}>
    <svg viewBox="0 0 100 100" className="w-[88%] h-[88%]">
      <circle cx="50" cy="50" r="48" fill="#006241" />
      <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="2.5" />
      <path d="M38 32 L50 20 L62 32 L57 33 L50 28 L43 33 Z" fill="white" />
      <polygon points="50,14 52,19 57,19 53,22 55,27 50,24 45,27 47,22 43,19 48,19" fill="white" />
      <path d="M42 35 Q50 32 58 35 Q60 48 50 56 Q40 48 42 35 Z" fill="white" />
      <path d="M45 42 Q50 40 55 42 Q53 49 50 51 Q47 49 45 42 Z" fill="#006241" />
      <circle cx="48" cy="44" r="1.2" fill="white" />
      <circle cx="52" cy="44" r="1.2" fill="white" />
      <path d="M50 44 L50 47.5 L51.2 47.5" stroke="white" strokeWidth="0.8" fill="none" />
      <path d="M34 38 Q28 50 35 62 Q40 68 36 78 Q30 68 26 54 Q25 42 34 38 Z" fill="white" />
      <path d="M66 38 Q72 50 65 62 Q60 68 64 78 Q70 68 74 54 Q75 42 66 38 Z" fill="white" />
      <path d="M35 78 Q42 86 50 86 Q58 86 65 78 Q58 81 50 81 Q42 81 35 78 Z" fill="white" />
    </svg>
  </div>
);

// Verified checkmark badge
const VerifiedBadge: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none">
    <path
      d="M10.024 2.185c.823-.98 2.29-.98 3.114 0l.974 1.157c.379.45.945.696 1.534.667l1.507-.074c1.278-.063 2.316.975 2.253 2.253l-.074 1.507c-.029.589.217 1.155.667 1.534l1.157.974c.98.823.98 2.29 0 3.114l-1.157.974c-.45.379-.696.945-.667 1.534l.074 1.507c.063 1.278-.975 2.316-2.253 2.253l-1.507-.074c-.589-.029-1.155.217-1.534.667l-.974 1.157c-.823.98-2.29.98-3.114 0l-.974-1.157c-.379-.45-.945-.696-1.534-.667l-1.507.074c-1.278.063-2.316-.975-2.253-2.253l.074-1.507c.029-.589-.217-1.155-.667-1.534l-1.157-.974c-.98-.823-.98-2.29 0-3.114l1.157-.974c.45-.379.696-.945.667-1.534l-.074-1.507c-.063-1.278.975-2.316 2.253-2.253l1.507.074c.589.029 1.155-.217 1.534-.667l.974-1.157z"
      fill="#6366F1"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MakePaymentModal: React.FC<MakePaymentModalProps> = ({
  isOpen,
  onClose,
  defaultData
}) => {
  const {
    accountBalance,
    safeDiscretionaryBudget,
    currentDiscretionarySpent,
    unpaidLockedAmount,
    totalLockedAmount,
    sendPayment
  } = useApp();

  const [recipientName, setRecipientName] = useState('Starbucks Coffee');
  const [recipientUpiId, setRecipientUpiId] = useState('starbucks.blr@icici');
  const [amount, setAmount] = useState<string>('68001');
  const [description, setDescription] = useState('Cold Brew Coffee & Croissant');
  const [selectedLocation, setSelectedLocation] = useState<PaymentLocation>(PRESET_LOCATIONS[0]);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [step, setStep] = useState<'FORM' | 'RESERVED_WARNING' | 'PIN' | 'SUCCESS'>('FORM');
  const [pin, setPin] = useState('');
  const [paymentResultWarning, setPaymentResultWarning] = useState<string | null>(null);
  const [reservedWarningAcknowledged, setReservedWarningAcknowledged] = useState(false);
  const [checkboxAccepted, setCheckboxAccepted] = useState(false);

  useEffect(() => {
    if (defaultData) {
      if (defaultData.name) setRecipientName(defaultData.name);
      if (defaultData.upiId) setRecipientUpiId(defaultData.upiId);
      if (defaultData.amount) setAmount(defaultData.amount.toString());
      if (defaultData.location) setSelectedLocation(defaultData.location);
    }
  }, [defaultData]);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;

  // Real-time Tax Intelligence preview
  const taxPreview = TransactionIntelligenceEngine.analyze(
    description,
    numAmount,
    'DEBIT',
    'MERCHANT',
    recipientName
  );

  // Expenditure Control & Reserved Vault Protection
  const isFixedCommitment = taxPreview.isFixedCommitment || false;
  const currentDiscretionaryRemaining = Math.max(0, safeDiscretionaryBudget - currentDiscretionarySpent);
  const freeLiquidBalance = Math.max(0, accountBalance - unpaidLockedAmount);
  // Safe discretionary limit before dipping into reserved vault:
  const safeAvailableLimit = isFixedCommitment ? accountBalance : Math.min(currentDiscretionaryRemaining, freeLiquidBalance);

  // Checks if this payment eats into locked reserved funds (Rent, EMI, School Fees)
  const isReservedMoneyBreach = !isFixedCommitment && numAmount > safeAvailableLimit;
  const reservedMoneyDeficit = isReservedMoneyBreach ? numAmount - safeAvailableLimit : 0;

  const currentRemaining = safeDiscretionaryBudget - currentDiscretionarySpent;
  const afterPaymentRemaining = currentRemaining - numAmount;
  const isOverspendingRisk = !isFixedCommitment && afterPaymentRemaining < 0;

  const handleProceedToPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) return;
    if (numAmount > accountBalance) {
      alert('Amount exceeds your available bank balance.');
      return;
    }
    // Guardrail: Intercept if attempting to use reserved money
    if (isReservedMoneyBreach && !reservedWarningAcknowledged) {
      setStep('RESERVED_WARNING');
      return;
    }
    setStep('PIN');
  };

  const handleKeypadPress = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => {
          executePayment();
        }, 300);
      }
    }
  };

  const handleKeypadDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const executePayment = () => {
    const res = sendPayment({
      recipientUpiId,
      recipientName,
      amount: numAmount,
      description,
      location: selectedLocation,
      paymentMethod: 'UPI_APP'
    });

    if (res.success) {
      if (res.warning) {
        setPaymentResultWarning(res.warning);
      }
      setStep('SUCCESS');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleResetAndClose = () => {
    setStep('FORM');
    setPin('');
    setPaymentResultWarning(null);
    setReservedWarningAcknowledged(false);
    setCheckboxAccepted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[32px] max-w-[440px] w-full max-h-[95vh] overflow-y-auto border border-purple-100 shadow-2xl flex flex-col relative text-slate-800">
        
        {/* Header with gentle lavender gradient */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between bg-gradient-to-b from-[#F5F1FF] via-[#FAF8FF] to-white border-b border-purple-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6936F5] text-white flex items-center justify-center shadow-md shadow-[#6936F5]/25 shrink-0">
              <CreditCard className="w-5 h-5 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                {step === 'FORM'
                  ? 'Send Money via UPI'
                  : step === 'RESERVED_WARNING'
                  ? '⚠️ Reserved Money Alert'
                  : step === 'PIN'
                  ? 'Enter 4-Digit UPI PIN'
                  : 'Payment Successful'}
              </h3>
              <p className="text-[11.5px] text-slate-500 font-medium">
                {step === 'FORM'
                  ? 'With Location History & Tax Tracking'
                  : step === 'RESERVED_WARNING'
                  ? 'Locked Vault Protection Gate'
                  : step === 'PIN'
                  ? 'Secured by HDFC Bank'
                  : 'Recorded in Ledger'}
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: FORM (Matches UI Reference Pixel-by-Pixel) */}
        {step === 'FORM' && (
          <form onSubmit={handleProceedToPin} className="px-5 py-4 space-y-3.5 text-xs">
            
            {/* 1. Paying To (Shop or Person) */}
            <div>
              <label className="block text-slate-700 font-bold text-[11.5px] mb-1.5">
                Paying To (Shop or Person)
              </label>
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white shadow-2xs focus-within:ring-2 focus-within:ring-[#6936F5]/20 focus-within:border-[#6936F5] transition-all">
                {recipientName.toLowerCase().includes('starbucks') ? (
                  <StarbucksLogo className="w-9 h-9 shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-purple-100 text-[#6936F5] font-extrabold flex items-center justify-center text-xs shrink-0">
                    {recipientName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Starbucks Coffee"
                  className="flex-1 font-bold text-slate-900 text-[15px] bg-transparent focus:outline-none"
                />
                <VerifiedBadge className="w-4 h-4 shrink-0 text-[#6366F1]" />
              </div>
            </div>

            {/* 2. Recipient UPI ID & Amount (₹ INR) * (Side by Side) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-slate-800 font-bold text-[11px] mb-1.5">
                  <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[#6936F5]">
                    <Zap className="w-2.5 h-2.5 fill-[#6936F5]" />
                  </div>
                  <span>Recipient UPI ID</span>
                </label>
                <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <input
                    type="text"
                    required
                    value={recipientUpiId}
                    onChange={(e) => setRecipientUpiId(e.target.value)}
                    placeholder="starbucks.blr@icici"
                    className="w-full font-medium text-slate-800 text-xs bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-slate-800 font-bold text-[11px] mb-1.5">
                  <div className="w-4 h-4 rounded-full bg-[#6936F5] text-white flex items-center justify-center text-[10px] font-black">
                    ₹
                  </div>
                  <span>Amount (₹ INR) *</span>
                </label>
                <div className="relative px-3.5 py-2 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between">
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="68001"
                    className="w-full font-extrabold text-slate-900 text-base bg-transparent focus:outline-none pr-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <div className="absolute right-2.5 flex flex-col -space-y-0.5 text-slate-400">
                    <button
                      type="button"
                      onClick={() => setAmount(prev => ((parseFloat(prev) || 0) + 1).toString())}
                      className="hover:text-[#6936F5] p-0.5 transition-colors leading-none cursor-pointer"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount(prev => Math.max(1, (parseFloat(prev) || 0) - 1).toString())}
                      className="hover:text-[#6936F5] p-0.5 transition-colors leading-none cursor-pointer"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Alert Box 1: Attempting to Use Reserved Money */}
            {isReservedMoneyBreach && (
              <div className="p-3.5 rounded-2xl bg-[#FFF0F2] border border-[#FFD6DC] text-rose-950 text-xs space-y-1 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-[#E11D48] text-xs">
                  <AlertTriangle className="w-4 h-4 text-[#E11D48] shrink-0 fill-[#E11D48]/20" />
                  <span>Attempting to Use Reserved Money!</span>
                </div>
                <p className="text-[11.5px] text-rose-900 leading-snug font-normal">
                  Safe discretionary spending left is <strong className="font-bold text-slate-900">₹{safeAvailableLimit.toLocaleString('en-IN')}</strong>. This amount dips <strong className="font-bold text-[#E11D48]">₹{reservedMoneyDeficit.toLocaleString('en-IN')}</strong> into your locked Rent & EMI vault.
                </p>
              </div>
            )}

            {/* 4. Payment Note / Description */}
            <div>
              <label className="flex items-center gap-1.5 text-slate-800 font-bold text-[11px] mb-1.5">
                <div className="w-4 h-4 rounded-md bg-purple-100 flex items-center justify-center text-[#6936F5]">
                  <FileText className="w-3 h-3 text-[#6936F5]" />
                </div>
                <span>Payment Note / Description</span>
              </label>
              <div className="relative px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Cold Brew Coffee & Croissant"
                  className="w-full font-medium text-slate-900 text-xs bg-transparent focus:outline-none pr-8"
                />
                <button
                  type="button"
                  className="absolute right-3 text-[#6936F5] hover:text-[#5B25E6] p-1 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 5. Real-World Location History */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-[#6936F5] fill-[#6936F5]" />
                  <span>Real-World Location History</span>
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#059669]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#059669] fill-[#059669]/15" />
                  <span>GPS Verified</span>
                </span>
              </div>

              {/* Location Card with Dropdown */}
              <div className="relative">
                <div
                  onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                  className="w-full p-2.5 rounded-xl bg-[#F6F5FF] hover:bg-purple-50/90 border border-purple-100/70 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <StarbucksLogo className="w-6 h-6 shrink-0" />
                    <span className="font-semibold text-slate-800 text-[11.5px] truncate">
                      {selectedLocation.shopName} — {selectedLocation.street}, {selectedLocation.city}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#6936F5] shrink-0 transition-transform ${locationDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {locationDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-purple-100 shadow-xl z-20 py-1 max-h-48 overflow-y-auto">
                    {PRESET_LOCATIONS.map((loc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedLocation(loc);
                          setLocationDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-purple-50 flex items-center gap-2 text-xs text-slate-700 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#6936F5] shrink-0" />
                        <span className="truncate"><strong>{loc.shopName}</strong> — {loc.street}, {loc.city}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 pt-0.5">
                <MapPin className="w-3 h-3 text-[#6936F5] shrink-0" />
                <span>Lat: {selectedLocation.latitude}</span>
                <span>Long: {selectedLocation.longitude}</span>
                <span className="text-[#6936F5] font-semibold font-sans">• {selectedLocation.city}</span>
              </div>
            </div>

            {/* 6. Alert Box 2: Overspending Risk Detected */}
            {isOverspendingRisk && (
              <div className="p-3.5 rounded-2xl bg-[#FFF6ED] border border-[#FED7AA] text-amber-950 text-xs space-y-1 animate-fadeIn">
                <div className="flex items-center gap-1.5 font-bold text-[#C2410C] text-xs">
                  <AlertTriangle className="w-4 h-4 text-[#C2410C] shrink-0 fill-[#C2410C]/20" />
                  <span>Overspending Risk Detected!</span>
                </div>
                <p className="text-[11.5px] text-amber-950 leading-snug font-normal">
                  Paying <strong className="font-bold text-slate-900">₹{numAmount.toLocaleString('en-IN')}</strong> will breach your safe discretionary limit by <strong className="font-bold text-[#C2410C]">₹{Math.abs(afterPaymentRemaining).toLocaleString('en-IN')}</strong>! Remember: you have <strong className="font-bold text-slate-900">₹{unpaidLockedAmount.toLocaleString('en-IN')} locked for upcoming EMI & Rent</strong>.
                </p>
              </div>
            )}

            {/* 7. Action Button: Send Money */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#6936F5] hover:bg-[#5B25E6] text-white font-bold text-sm shadow-md shadow-[#6936F5]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
            >
              <Send className="w-4 h-4 text-white -rotate-12" />
              <span>Send Money</span>
            </button>

            {/* 8. Footer: AI CA Tax Implication */}
            <div className="flex items-center justify-between pt-1 px-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#6936F5]">
                <Info className="w-4 h-4 text-[#6936F5]" />
                <span>AI CA Tax Implication:</span>
              </div>
              <div className="px-3.5 py-1 rounded-full border border-purple-400 bg-white text-[#6936F5] font-semibold text-xs shadow-2xs">
                {taxPreview.classification.deductionSection || 'Personal Expenditure'}
              </div>
            </div>
          </form>
        )}

        {/* STEP 1.5: CRITICAL RESERVED MONEY WARNING GUARDRAIL */}
        {step === 'RESERVED_WARNING' && (
          <div className="p-6 space-y-5 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-rose-900">
                    🚨 Warning: Attempting to Use Reserved Money!
                  </h4>
                  <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                    This payment of <strong>₹{numAmount.toLocaleString('en-IN')}</strong> exceeds your free discretionary balance and attempts to withdraw from money reserved for mandatory commitments.
                  </p>
                </div>
              </div>

              {/* Three Metric Breakdown Cards */}
              <div className="bg-white/90 rounded-xl p-3 border border-rose-200 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Safe Free Balance</div>
                  <div className="text-sm font-black text-emerald-600">
                    ₹{safeAvailableLimit.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Payment Amount</div>
                  <div className="text-sm font-black text-slate-900">
                    ₹{numAmount.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-rose-600 font-bold uppercase">Reserved Deficit</div>
                  <div className="text-sm font-black text-rose-600">
                    -₹{reservedMoneyDeficit.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Endangered Commitments List */}
              <div className="space-y-1 text-xs">
                <div className="font-bold text-rose-950 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-600" />
                  <span>Locked Commitments (₹{unpaidLockedAmount.toLocaleString('en-IN')}) Endangered:</span>
                </div>
                <div className="text-[11px] text-rose-800 leading-relaxed pl-4 space-y-0.5">
                  <p>• SBI Home Loan EMI (₹38,000) & Apartment Flat Rent (₹25,000) are due soon.</p>
                  <p>• Dipping into reserved money risks bank ECS bounce charges, penalty interest, or landlord dispute.</p>
                </div>
              </div>
            </div>

            {/* Guardrail Action 1: Auto-adjust to safe amount */}
            {safeAvailableLimit > 0 && (
              <button
                type="button"
                onClick={() => {
                  setAmount(safeAvailableLimit.toString());
                  setStep('PIN');
                }}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Adjust Payment to Safe Limit of ₹{safeAvailableLimit.toLocaleString('en-IN')} & Proceed</span>
              </button>
            )}

            {/* Guardrail Action 2: Explicit Checkbox Confirmation */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={checkboxAccepted}
                  onChange={e => setCheckboxAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4 accent-rose-600 cursor-pointer"
                />
                <span className="font-semibold leading-relaxed">
                  I acknowledge that this payment consumes <strong className="text-rose-600">₹{reservedMoneyDeficit.toLocaleString('en-IN')}</strong> of my locked reserved money for Rent/EMI, and I accept the risk of overspending.
                </span>
              </label>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('FORM')}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Edit Amount
                </button>

                <button
                  type="button"
                  disabled={!checkboxAccepted}
                  onClick={() => {
                    setReservedWarningAcknowledged(true);
                    setStep('PIN');
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
                    checkboxAccepted
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Proceed to PIN Anyway
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: UPI PIN KEYPAD */}
        {step === 'PIN' && (
          <div className="p-6 text-center space-y-6">
            <div>
              <div className="text-xs text-slate-500">Paying securely to</div>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">{recipientName}</div>
              <div className="text-3xl font-black text-slate-900 mt-2">
                ₹{numAmount.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">{recipientUpiId}</div>
            </div>

            {/* PIN Dots */}
            <div className="flex items-center justify-center gap-4 py-2">
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    pin.length > i
                      ? 'bg-[#6936F5] border-[#6936F5] scale-110'
                      : 'border-slate-300 bg-slate-100'
                  }`}
                ></div>
              ))}
            </div>

            {/* Number Keypad */}
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleKeypadPress(d)}
                  className="py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-lg transition-colors active:scale-95 cursor-pointer"
                >
                  {d}
                </button>
              ))}
              <div></div>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-lg transition-colors active:scale-95 cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleKeypadDelete}
                className="py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors active:scale-95 flex items-center justify-center cursor-pointer"
              >
                ⌫
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT SUCCESS */}
        {step === 'SUCCESS' && (
          <div className="p-8 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Payment Successful</span>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                ₹{numAmount.toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Paid to {recipientName}</p>
            </div>

            {/* Location & Tax Receipt Stamp */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Location Tagged:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#6936F5]" />
                  {selectedLocation.shopName}, {selectedLocation.city}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">UPI Ref ID:</span>
                <span className="font-mono text-slate-700 text-[11px]">UPI/{Date.now()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Tax Implication:</span>
                <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {taxPreview.classification.deductionSection || taxPreview.classification.status}
                </span>
              </div>
            </div>

            {paymentResultWarning && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 text-left">
                {paymentResultWarning}
              </div>
            )}

            <button
              onClick={handleResetAndClose}
              className="w-full py-3.5 rounded-2xl bg-[#6936F5] hover:bg-[#5B25E6] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Done & Return to TechPay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
