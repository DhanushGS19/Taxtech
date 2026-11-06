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
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight
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
    sendPayment,
    activeProfile
  } = useApp();

  const [recipientName, setRecipientName] = useState('Starbucks Coffee');
  const [recipientUpiId, setRecipientUpiId] = useState('starbucks.blr@icici');
  const [amount, setAmount] = useState<string>('680');
  const [description, setDescription] = useState('Cold Brew Coffee & Croissant');
  const [selectedLocation, setSelectedLocation] = useState<PaymentLocation>(PRESET_LOCATIONS[0]);
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
  const isTightBudget = !isFixedCommitment && afterPaymentRemaining >= 0 && afterPaymentRemaining < 5000;

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
        // Complete payment
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {step === 'FORM'
                  ? 'Send Money via UPI'
                  : step === 'RESERVED_WARNING'
                  ? '⚠️ Reserved Money Alert'
                  : step === 'PIN'
                  ? 'Enter 4-Digit UPI PIN'
                  : 'Payment Successful'}
              </h3>
              <p className="text-[11px] text-slate-500">
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
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: FORM */}
        {step === 'FORM' && (
          <form onSubmit={handleProceedToPin} className="p-6 space-y-4 text-xs">
            {/* Recipient Details */}
            <div className="space-y-3">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Paying To (Shop or Person)</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Starbucks Coffee or Landlord Rent"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Recipient UPI ID</label>
                  <input
                    type="text"
                    required
                    value={recipientUpiId}
                    onChange={(e) => setRecipientUpiId(e.target.value)}
                    placeholder="merchant@icici"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Amount (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full px-3.5 py-2 text-base font-black rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Real-time Reserved Money Warning Banner */}
              {isReservedMoneyBreach && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 text-xs space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold flex items-center gap-1.5 text-rose-700">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Attempting to Use Reserved Money!</span>
                    </span>
                    {safeAvailableLimit > 0 && (
                      <button
                        type="button"
                        onClick={() => setAmount(safeAvailableLimit.toString())}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 transition-colors"
                      >
                        Cap to Safe ₹{safeAvailableLimit.toLocaleString('en-IN')}
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-rose-800 leading-snug">
                    Safe discretionary spending left is <strong>₹{safeAvailableLimit.toLocaleString('en-IN')}</strong>. This amount dips <strong>₹{reservedMoneyDeficit.toLocaleString('en-IN')}</strong> into your locked Rent & EMI vault.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-slate-600 font-bold mb-1">Payment Note / Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Medicines, Flat rent, Dinner, Groceries"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* REAL-WORLD LOCATION PICKER */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Real-World Location History</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">GPS Verified</span>
              </div>

              <select
                value={selectedLocation.shopName}
                onChange={(e) => {
                  const match = PRESET_LOCATIONS.find(l => l.shopName === e.target.value);
                  if (match) setSelectedLocation(match);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs focus:outline-none"
              >
                {PRESET_LOCATIONS.map((loc, idx) => (
                  <option key={idx} value={loc.shopName}>
                    {loc.shopName} — {loc.street}, {loc.city}
                  </option>
                ))}
              </select>

              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 pt-0.5">
                <span>Lat: {selectedLocation.latitude}</span>
                <span>Long: {selectedLocation.longitude}</span>
                <span className="text-indigo-600 font-semibold">• {selectedLocation.city}</span>
              </div>
            </div>

            {/* EXPENDITURE CONTROL & OVERSPENDING REMINDER */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isOverspendingRisk
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : isTightBudget
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {isOverspendingRisk ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>⚠️ Overspending Risk Detected!</span>
                  </>
                ) : isTightBudget ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Caution: Discretionary Budget Running Tight</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Budget Guardrail Safe</span>
                  </>
                )}
              </div>

              <p className="text-[11px] leading-relaxed">
                {isFixedCommitment ? (
                  <span>This payment is an essential locked commitment. It protects your mandatory obligations without cutting into free spending.</span>
                ) : isOverspendingRisk ? (
                  <span>
                    Paying ₹{numAmount.toLocaleString('en-IN')} will breach your safe discretionary limit by ₹{Math.abs(afterPaymentRemaining).toLocaleString('en-IN')}!
                    Remember: you have <strong>₹{unpaidLockedAmount.toLocaleString('en-IN')} locked for upcoming EMI & Rent</strong>.
                  </span>
                ) : (
                  <span>
                    After paying ₹{numAmount.toLocaleString('en-IN')}, you will have ₹{afterPaymentRemaining.toLocaleString('en-IN')} remaining in your flexible allowance. Your locked commitments (₹{totalLockedAmount.toLocaleString('en-IN')}) are safe.
                  </span>
                )}
              </p>
            </div>

            {/* AI CA TAX IMPLICATION PREVIEW */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-indigo-950 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI CA Tax Implication:</span>
                </span>
                <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-indigo-200 text-indigo-900">
                  {taxPreview.classification.deductionSection || taxPreview.classification.status}
                </span>
              </div>
              <p className="text-[11px] text-indigo-900/90 leading-relaxed">
                {taxPreview.classification.aiExplanation}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all mt-2"
            >
              <span>Proceed to Pay ₹{numAmount.toLocaleString('en-IN')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
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
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
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
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20'
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
                      ? 'bg-indigo-600 border-indigo-600 scale-110'
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
                  className="py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-lg transition-colors active:scale-95"
                >
                  {d}
                </button>
              ))}
              <div></div>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-lg transition-colors active:scale-95"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleKeypadDelete}
                className="py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors active:scale-95 flex items-center justify-center"
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
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  {selectedLocation.shopName}, {selectedLocation.city}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">UPI Ref ID:</span>
                <span className="font-mono text-slate-700 text-[11px]">UPI/{Date.now()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Tax Implication:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
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
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
            >
              Done & Return to TechPay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

