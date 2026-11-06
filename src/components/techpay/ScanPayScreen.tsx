import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentLocation } from '../../types/tax';
import {
  QrCode,
  Camera,
  Flashlight,
  Image,
  Smartphone,
  Send,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  RefreshCw,
  Search,
  Sparkles,
  MapPin,
  Lock,
  Download,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScanPayScreenProps {
  onBackToHome?: () => void;
  onOpenHistory?: () => void;
}

const PRESET_MERCHANTS = [
  {
    name: 'Starbucks Coffee',
    upiId: 'starbucks.blr@icici',
    suggestedAmount: 680,
    category: 'CAFE',
    location: {
      shopName: 'Starbucks Coffee Flagship',
      street: '100 Feet Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      landmark: 'Near 12th Main',
      latitude: 12.9784,
      longitude: 77.6408,
      category: 'CAFE' as const
    }
  },
  {
    name: 'Reliance Smart Superstore',
    upiId: 'reliancesmart@hdfcbank',
    suggestedAmount: 1850,
    category: 'GROCERY',
    location: {
      shopName: 'Reliance Smart Point',
      street: 'CMH Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      landmark: 'Opp Metro Pillar 42',
      latitude: 12.9772,
      longitude: 77.6415,
      category: 'GROCERY' as const
    }
  },
  {
    name: 'Apollo Pharmacy 24/7',
    upiId: 'apollopharmacy@axisbank',
    suggestedAmount: 1240,
    category: 'HEALTH',
    location: {
      shopName: 'Apollo Pharmacy 24/7',
      street: 'Sector 18 Market',
      city: 'Noida',
      state: 'Uttar Pradesh',
      landmark: 'Near Metro Station',
      latitude: 28.5708,
      longitude: 77.3260,
      category: 'HEALTH' as const
    }
  },
  {
    name: 'Blue Tokai Coffee Roasters',
    upiId: 'bluetokai@yesbank',
    suggestedAmount: 420,
    category: 'CAFE',
    location: {
      shopName: 'Blue Tokai Koramangala',
      street: '80 Feet Road, 4th Block',
      city: 'Bengaluru',
      state: 'Karnataka',
      landmark: 'Opp Sony Center',
      latitude: 12.9345,
      longitude: 77.6258,
      category: 'CAFE' as const
    }
  }
];

export const ScanPayScreen: React.FC<ScanPayScreenProps> = ({ onBackToHome, onOpenHistory }) => {
  const {
    accountBalance,
    sendPayment,
    safeDiscretionaryBudget,
    currentDiscretionarySpent,
    unpaidLockedAmount,
    totalLockedAmount
  } = useApp();

  const [flashlight, setFlashlight] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [selectedMerchant, setSelectedMerchant] = useState<typeof PRESET_MERCHANTS[0] | null>(null);
  const [enteredAmount, setEnteredAmount] = useState<string>('680');
  const [enteredNote, setEnteredNote] = useState<string>('Coffee & snacks');
  const [manualUpiId, setManualUpiId] = useState<string>('');
  const [manualMobile, setManualMobile] = useState<string>('');

  // Flow steps: 'SCANNER' | 'AMOUNT' | 'RESERVED_WARNING' | 'CONFIRM' | 'PIN' | 'SUCCESS'
  const [step, setStep] = useState<'SCANNER' | 'AMOUNT' | 'RESERVED_WARNING' | 'CONFIRM' | 'PIN' | 'SUCCESS'>('SCANNER');
  const [pin, setPin] = useState<string>('');
  const [completedTx, setCompletedTx] = useState<any>(null);
  const [reservedConfirmed, setReservedConfirmed] = useState(false);
  const [checkboxAccepted, setCheckboxAccepted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gallery QR upload handler
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Pick merchant 0 as simulated scan
      const merchant = PRESET_MERCHANTS[0];
      handleScanDetected(merchant);
    }
  };

  const handleScanDetected = (merchant: typeof PRESET_MERCHANTS[0]) => {
    setSelectedMerchant(merchant);
    setEnteredAmount(merchant.suggestedAmount.toString());
    setStep('AMOUNT');
  };

  const handleManualUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUpiId.trim()) return;
    const custom = {
      name: manualUpiId.split('@')[0].toUpperCase() + ' (Merchant)',
      upiId: manualUpiId.trim(),
      suggestedAmount: 500,
      category: 'SHOPPING',
      location: PRESET_MERCHANTS[0].location
    };
    handleScanDetected(custom as any);
  };

  const handleManualMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualMobile.trim()) return;
    const custom = {
      name: `Contact (${manualMobile})`,
      upiId: `${manualMobile}@upi`,
      suggestedAmount: 1000,
      category: 'TRANSFER',
      location: PRESET_MERCHANTS[1].location
    };
    handleScanDetected(custom as any);
  };

  // Safe spending & reserved money calculations
  const numAmount = parseFloat(enteredAmount) || 0;
  const currentDiscretionaryRemaining = Math.max(0, safeDiscretionaryBudget - currentDiscretionarySpent);
  const freeLiquidBalance = Math.max(0, accountBalance - unpaidLockedAmount);
  const safeAvailableLimit = Math.min(currentDiscretionaryRemaining, freeLiquidBalance);
  const isReservedMoneyBreach = numAmount > safeAvailableLimit;
  const reservedMoneyDeficit = isReservedMoneyBreach ? numAmount - safeAvailableLimit : 0;

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(enteredAmount) || 0;
    if (num <= 0) return;
    if (num > accountBalance) {
      alert('Amount exceeds your available bank balance.');
      return;
    }
    // Check if this payment dips into the locked budget vault
    if (isReservedMoneyBreach && !reservedConfirmed) {
      setStep('RESERVED_WARNING');
      return;
    }
    setStep('CONFIRM');
  };

  const handleProceedToPin = () => {
    setPin('');
    setStep('PIN');
  };

  const handlePinDigit = (digit: string) => {
    if (pin.length < 4) {
      const next = pin + digit;
      setPin(next);
      if (next.length === 4) {
        setTimeout(() => {
          executePayment();
        }, 300);
      }
    }
  };

  const handlePinDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const executePayment = () => {
    if (!selectedMerchant) return;
    const num = parseFloat(enteredAmount) || 0;
    const res = sendPayment({
      recipientName: selectedMerchant.name,
      recipientUpiId: selectedMerchant.upiId,
      amount: num,
      description: enteredNote || `Payment to ${selectedMerchant.name}`,
      category: selectedMerchant.category,
      location: selectedMerchant.location,
      paymentMethod: 'QR_SCAN'
    });

    if (res.success) {
      setCompletedTx(res.tx);
      setStep('SUCCESS');
      try {
        confetti({ particleCount: 80, spread: 70 });
      } catch (e) {}
    }
  };

  const resetAll = () => {
    setSelectedMerchant(null);
    setEnteredAmount('');
    setEnteredNote('');
    setPin('');
    setReservedConfirmed(false);
    setCheckboxAccepted(false);
    setStep('SCANNER');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-24 animate-fadeIn">
      {/* 1. Header Navigation */}
      <div className="flex items-center justify-between bg-white rounded-3xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center shadow-md shadow-[#5F259F]/20">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Scan & Pay Any QR</h2>
            <p className="text-xs text-slate-500">BharatQR, PhonePe, Paytm, Google Pay supported</p>
          </div>
        </div>

        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* STEP 1: SCANNER VIEW */}
      {step === 'SCANNER' && (
        <div className="space-y-5">
          {/* Viewfinder Canvas */}
          <div className="relative aspect-square max-w-sm mx-auto bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 flex flex-col items-center justify-between p-6">
            {/* Flashlight Glow Simulation */}
            {flashlight && (
              <div className="absolute inset-0 bg-yellow-100/20 pointer-events-none mix-blend-screen animate-pulse"></div>
            )}

            {/* Top Toolbar inside scanner */}
            <div className="w-full flex items-center justify-between z-10">
              <button
                type="button"
                onClick={() => setFlashlight(!flashlight)}
                className={`p-2.5 rounded-2xl backdrop-blur-md transition-all ${
                  flashlight
                    ? 'bg-amber-400 text-slate-950 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                title="Toggle Torch"
              >
                <Flashlight className="w-5 h-5" />
              </button>

              <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Align QR inside frame</span>
              </div>

              <button
                type="button"
                onClick={() => setCameraActive(!cameraActive)}
                className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all"
                title="Switch Camera"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            {/* Target Reticle & Laser Sweep Animation */}
            <div className="relative w-56 h-56 my-auto flex items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#5F259F] rounded-tl-xl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#5F259F] rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#5F259F] rounded-bl-xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#5F259F] rounded-br-xl"></div>

              {/* Animated Laser Bar */}
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#5F259F] to-transparent shadow-[0_0_12px_#5F259F] animate-bounce"></div>

              <div className="text-center text-white/50 text-[10px] uppercase tracking-wider font-mono">
                NPCI BharatQR Switch
              </div>
            </div>

            {/* Bottom Controls inside scanner */}
            <div className="w-full flex items-center justify-around z-10 pt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleGalleryUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition-all"
              >
                <Image className="w-4 h-4" />
                <span>Upload from Gallery</span>
              </button>
            </div>
          </div>

          {/* Quick Tap to Test Sample QRs */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Simulate Scan on Verified Merchant QR</span>
              </span>
              <span className="text-[10px] text-slate-400">1-Tap Scan</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {PRESET_MERCHANTS.map((m) => (
                <button
                  key={m.name}
                  onClick={() => handleScanDetected(m)}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-[#5F259F] hover:bg-[#F0EAF8]/50 text-left transition-all space-y-1 shadow-xs group"
                >
                  <div className="font-bold text-xs text-slate-900 group-hover:text-[#5F259F] flex items-center justify-between">
                    <span>{m.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#5F259F] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="text-[10px] text-slate-500">{m.location.city} • ₹{m.suggestedAmount}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Enter UPI ID / Mobile Directly */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* By UPI ID */}
            <form onSubmit={handleManualUpiSubmit} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2 text-xs">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-[#5F259F]" />
                <span>Pay to any UPI ID / VPA</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="name@okhdfcbank"
                  value={manualUpiId}
                  onChange={(e) => setManualUpiId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#5F259F]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-[#5F259F] text-white font-bold text-xs shrink-0"
                >
                  Verify
                </button>
              </div>
            </form>

            {/* By Mobile */}
            <form onSubmit={handleManualMobileSubmit} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2 text-xs">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#38146B]" />
                <span>Pay to Mobile Number</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  maxLength={10}
                  required
                  placeholder="9876543210"
                  value={manualMobile}
                  onChange={(e) => setManualMobile(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#5F259F]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-[#38146B] text-white font-bold text-xs shrink-0"
                >
                  Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STEP 2: AMOUNT ENTRY SCREEN */}
      {step === 'AMOUNT' && selectedMerchant && (
        <form onSubmit={handleProceedToConfirm} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5 animate-fadeIn">
          {/* Verified Merchant Badge */}
          <div className="p-4 rounded-2xl bg-[#F0EAF8] border border-[#5F259F]/20 flex items-start justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>NPCI Verified Merchant</span>
              </div>
              <h3 className="text-base font-black text-slate-900">{selectedMerchant.name}</h3>
              <div className="text-xs text-slate-500 font-mono">{selectedMerchant.upiId}</div>
              <div className="text-[11px] text-slate-600 flex items-center gap-1 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#5F259F]" />
                <span>{selectedMerchant.location.street}, {selectedMerchant.location.city}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              Change
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-2 text-center py-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enter Amount</label>
            <div className="relative max-w-xs mx-auto">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-400">₹</span>
              <input
                type="number"
                min="1"
                required
                value={enteredAmount}
                onChange={(e) => setEnteredAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 text-4xl font-black text-slate-900 text-center focus:outline-none focus:border-[#5F259F]"
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex gap-2 justify-center pt-2">
              {[100, 500, 1000, 2000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setEnteredAmount(amt.toString())}
                  className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  +₹{amt}
                </button>
              ))}
            </div>

            {/* Real-time Reserved Money Warning Banner */}
            {isReservedMoneyBreach && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 text-xs space-y-1.5 text-left animate-fadeIn mt-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-extrabold flex items-center gap-1.5 text-rose-700">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Dipping into Reserved Money!</span>
                  </span>
                  {safeAvailableLimit > 0 && (
                    <button
                      type="button"
                      onClick={() => setEnteredAmount(safeAvailableLimit.toString())}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 transition-colors"
                    >
                      Cap to Safe ₹{safeAvailableLimit.toLocaleString('en-IN')}
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-rose-800 leading-snug">
                  Safe discretionary balance is <strong>₹{safeAvailableLimit.toLocaleString('en-IN')}</strong>. This QR payment draws <strong>₹{reservedMoneyDeficit.toLocaleString('en-IN')}</strong> from your locked Rent & EMI vault.
                </p>
              </div>
            )}
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Add a message / note</label>
            <input
              type="text"
              value={enteredNote}
              onChange={(e) => setEnteredNote(e.target.value)}
              placeholder="e.g. Lunch with team, Groceries"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F259F]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={resetAll}
              className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-[#5F259F] hover:bg-[#38146B] text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Pay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP: CRITICAL RESERVED MONEY WARNING GUARDRAIL */}
      {step === 'RESERVED_WARNING' && selectedMerchant && (
        <div className="bg-white rounded-3xl p-6 border border-rose-300 shadow-xl space-y-5 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-rose-900">
                  🚨 Warning: QR Payment Exceeds Free Spending!
                </h4>
                <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                  Paying <strong>₹{numAmount.toLocaleString('en-IN')}</strong> to <strong>{selectedMerchant.name}</strong> will consume funds locked in your Reserved Money Vault for mandatory expenses.
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
                <span>Reserved Commitments (₹{unpaidLockedAmount.toLocaleString('en-IN')}) at Risk:</span>
              </div>
              <div className="text-[11px] text-rose-800 leading-relaxed pl-4 space-y-0.5">
                <p>• SBI Home Loan EMI (₹38,000) & Apartment Rent (₹25,000) are due soon.</p>
                <p>• If you spend this money, you may face bounce charges, overdue interest or bill penalties.</p>
              </div>
            </div>
          </div>

          {/* Guardrail Action 1: Auto-adjust to safe amount */}
          {safeAvailableLimit > 0 && (
            <button
              type="button"
              onClick={() => {
                setEnteredAmount(safeAvailableLimit.toString());
                setStep('CONFIRM');
              }}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Adjust to Safe Limit (₹{safeAvailableLimit.toLocaleString('en-IN')}) & Proceed</span>
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
                I understand that this QR payment consumes <strong className="text-rose-600">₹{reservedMoneyDeficit.toLocaleString('en-IN')}</strong> of my locked reserved money for Rent/EMI, and I accept the risk of overspending.
              </span>
            </label>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('AMOUNT')}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Change Amount
              </button>

              <button
                type="button"
                disabled={!checkboxAccepted}
                onClick={() => {
                  setReservedConfirmed(true);
                  setStep('CONFIRM');
                }}
                className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
                  checkboxAccepted
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: PAYMENT CONFIRMATION SCREEN */}
      {step === 'CONFIRM' && selectedMerchant && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-5 animate-fadeIn">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Confirmation</span>
            <div className="text-3xl font-black text-slate-900">₹{parseFloat(enteredAmount || '0').toLocaleString('en-IN')}</div>
            <div className="text-xs text-slate-600">to <strong>{selectedMerchant.name}</strong></div>
          </div>

          {/* Payment breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Debiting from:</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Building2 className="w-4 h-4 text-[#5F259F]" />
                <span>HDFC Bank •••• 4892</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Available Balance:</span>
              <span className="font-semibold text-slate-800">₹{accountBalance.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>UPI Convenience Fee:</span>
              <span className="font-bold text-emerald-600">FREE (₹0)</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Merchant Address:</span>
              <span className="font-medium text-slate-800 truncate max-w-[200px]">{selectedMerchant.location.street}</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-2 text-[11px] text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>256-bit NPCI encryption. No PIN is stored or shared.</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('AMOUNT')}
              className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={handleProceedToPin}
              className="flex-1 py-3 rounded-2xl bg-[#5F259F] hover:bg-[#38146B] text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Enter 4-Digit UPI PIN</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AUTHENTIC 4-DIGIT UPI PIN SCREEN */}
      {step === 'PIN' && selectedMerchant && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-6 animate-fadeIn max-w-sm mx-auto">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              <Lock className="w-3.5 h-3.5 text-[#5F259F]" />
              <span>HDFC Bank UPI Switch</span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 mt-2">Paying ₹{enteredAmount}</div>
            <div className="text-xs text-slate-500">{selectedMerchant.name}</div>
          </div>

          {/* 4 PIN Dots */}
          <div className="flex justify-center gap-4 py-2">
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = pin.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    isFilled ? 'bg-[#5F259F] scale-125 shadow-sm' : 'border-2 border-slate-300'
                  }`}
                ></div>
              );
            })}
          </div>

          {/* Simulated Keypad */}
          <div className="grid grid-cols-3 gap-2.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handlePinDigit(digit)}
                className="py-3 rounded-2xl bg-slate-50 hover:bg-[#F0EAF8] active:scale-95 text-slate-900 font-black text-lg transition-all"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setStep('CONFIRM')}
              className="py-3 rounded-2xl bg-slate-50 text-slate-400 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handlePinDigit('0')}
              className="py-3 rounded-2xl bg-slate-50 hover:bg-[#F0EAF8] active:scale-95 text-slate-900 font-black text-lg transition-all"
            >
              0
            </button>
            <button
              type="button"
              onClick={handlePinDelete}
              className="py-3 rounded-2xl bg-slate-50 hover:bg-rose-50 text-slate-600 font-bold text-xs flex items-center justify-center"
            >
              ⌫
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: PAYMENT SUCCESS SCREEN */}
      {step === 'SUCCESS' && selectedMerchant && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Payment Successful</span>
            <div className="text-3xl font-black text-slate-900">₹{enteredAmount}</div>
            <div className="text-sm font-bold text-slate-700">Paid to {selectedMerchant.name}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-left">
            <div className="flex justify-between text-slate-500">
              <span>UPI Transaction ID:</span>
              <span className="font-mono font-bold text-slate-800">{completedTx?.upiRefId || 'T24110509428574920'}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Debited Account:</span>
              <span className="font-bold text-slate-800">HDFC Bank •••• 4892</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Date & Time:</span>
              <span className="font-semibold text-slate-800">Just now</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Location:</span>
              <span className="font-semibold text-slate-800">{selectedMerchant.location.city}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                const receiptContent = `TECHPAY OFFICIAL PAYMENT RECEIPT
=================================
Amount: INR ${enteredAmount}
Paid To: ${selectedMerchant.name} (${selectedMerchant.upiId})
Debited Account: HDFC Bank A/c •••• 4892
Transaction ID: ${completedTx?.upiRefId || 'T24110509428574920'}
Location: ${selectedMerchant.location.street}, ${selectedMerchant.location.city}
Status: SUCCESSFUL (NPCI Switch)
=================================`;
                const blob = new Blob([receiptContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `TechPay_Receipt_${Date.now()}.txt`;
                a.click();
              }}
              className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Receipt</span>
            </button>

            <button
              onClick={resetAll}
              className="flex-1 py-3 rounded-2xl bg-[#5F259F] hover:bg-[#38146B] text-white font-extrabold text-xs shadow-md active:scale-95 transition-all"
            >
              Done / Pay Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

