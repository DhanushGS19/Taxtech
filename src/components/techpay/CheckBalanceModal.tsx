import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  Building2,
  Lock,
  Delete,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckBalanceModal: React.FC<CheckBalanceModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    accountBalance,
    activeProfile,
    setIsBalanceRevealed,
    isBalanceRevealed
  } = useApp();

  const [pin, setPin] = useState<string>('');
  const [step, setStep] = useState<'ENTER_PIN' | 'VERIFYING' | 'BALANCE_SHOWN'>('ENTER_PIN');
  const [isPinVisible, setIsPinVisible] = useState(false);
  const [fetchTimestamp, setFetchTimestamp] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setStep('ENTER_PIN');
      setIsPinVisible(false);
    }
  }, [isOpen]);

  // Physical keyboard support for numeric entry
  useEffect(() => {
    if (!isOpen || step !== 'ENTER_PIN') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        if (pin.length < 4) {
          handleDigitPress(e.key);
        }
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        if (pin.length === 4) {
          handleVerify();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, step, pin]);

  if (!isOpen) return null;

  const handleDigitPress = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        // Auto trigger verify when 4th digit entered
        setTimeout(() => {
          proceedToVerification();
        }, 150);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const proceedToVerification = () => {
    setStep('VERIFYING');
    setTimeout(() => {
      setStep('BALANCE_SHOWN');
      setIsBalanceRevealed(true);
      setFetchTimestamp(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // fallback
      }
    }, 850);
  };

  const handleVerify = () => {
    if (pin.length === 4) {
      proceedToVerification();
    }
  };

  const handleDone = (keepRevealed: boolean) => {
    setIsBalanceRevealed(keepRevealed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col transform transition-all">
        {/* Top Header - Authentic PhonePe / Google Pay UPI style */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                <Building2 className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">HDFC Bank</h3>
                <p className="text-[11px] text-slate-300">Savings A/c •••• 4892</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-indigo-200 border-t border-white/10 pt-2.5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>NPCI Unified Payments Interface</span>
            </div>
            <span className="font-mono text-slate-400">UPI 2.0</span>
          </div>
        </div>

        {/* Modal Body */}
        {step === 'ENTER_PIN' && (
          <div className="p-6 space-y-6 flex flex-col items-center">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <Lock className="w-3 h-3 text-indigo-600" />
                <span>Enter 4-Digit UPI PIN</span>
              </div>
              <p className="text-xs text-slate-500 max-w-[240px]">
                Enter UPI PIN to safely fetch your real-time bank balance from NPCI servers.
              </p>
            </div>

            {/* PIN Dots Display */}
            <div className="flex items-center gap-4 my-2">
              {[0, 1, 2, 3].map((index) => {
                const hasValue = pin.length > index;
                return (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black transition-all ${
                      hasValue
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                        : 'bg-slate-100 border-2 border-slate-200 text-slate-400'
                    }`}
                  >
                    {hasValue ? (isPinVisible ? pin[index] : '●') : ''}
                  </div>
                );
              })}
            </div>

            {/* Pin visibility toggle & demo hint */}
            <div className="flex items-center justify-between w-full text-xs px-2 text-slate-500">
              <button
                type="button"
                onClick={() => setIsPinVisible(!isPinVisible)}
                className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
              >
                {isPinVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isPinVisible ? 'Hide PIN' : 'Show PIN'}</span>
              </button>

              <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600">
                Demo PIN: Any 4 digits (e.g. 1234)
              </span>
            </div>

            {/* Numeric Keypad (GPay / PhonePe style) */}
            <div className="grid grid-cols-3 gap-3 w-full pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleDigitPress(num)}
                  className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-indigo-50 border border-slate-200 text-lg font-bold text-slate-800 active:scale-95 transition-all flex items-center justify-center shadow-xs"
                >
                  {num}
                </button>
              ))}

              <button
                type="button"
                onClick={handleBackspace}
                className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 transition-all flex items-center justify-center"
              >
                <Delete className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => handleDigitPress('0')}
                className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-lg font-bold text-slate-800 active:scale-95 transition-all flex items-center justify-center shadow-xs"
              >
                0
              </button>

              <button
                type="button"
                onClick={handleVerify}
                disabled={pin.length < 4}
                className={`h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                  pin.length === 4
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center leading-normal">
              NPCI Security Warning: Never share your UPI PIN or OTP with anyone. TechPay & TaxSaathi will never ask for your PIN over call.
            </p>
          </div>
        )}

        {/* Step 2: Verifying Loading State */}
        {step === 'VERIFYING' && (
          <div className="p-10 space-y-5 flex flex-col items-center justify-center text-center">
            <div className="relative w-16 h-16">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-slate-900">
                Contacting Bank Server...
              </h4>
              <p className="text-xs text-slate-500">
                Fetching balance securely from HDFC Bank via NPCI Central UPI Switch.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Verified Balance Revealed */}
        {step === 'BALANCE_SHOWN' && (
          <div className="p-6 space-y-6 flex flex-col items-center animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Available Bank Balance
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                ₹{accountBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 pt-1">
                <Clock className="w-3 h-3" />
                <span>As of today at {fetchTimestamp || 'Just now'}</span>
              </div>
            </div>

            {/* Account Details Box */}
            <div className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Bank Account</span>
                <span className="font-semibold text-slate-800">HDFC Bank Limited</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Account Type</span>
                <span className="font-semibold text-slate-800">Savings A/c •••• 4892</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Linked Profile</span>
                <span className="font-semibold text-slate-800">{activeProfile.name}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">UPI ID</span>
                <span className="font-mono text-indigo-600 font-semibold">{activeProfile.upiId}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="w-full space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleDone(true)}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>Keep Visible on Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => handleDone(false)}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <EyeOff className="w-4 h-4" />
                <span>Hide & Mask for Privacy</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

