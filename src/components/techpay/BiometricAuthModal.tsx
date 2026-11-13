import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Fingerprint,
  Lock,
  ShieldCheck,
  X,
  ScanFace,
  CheckCircle2,
  KeyRound,
  AlertCircle
} from 'lucide-react';

export const BiometricAuthModal: React.FC = () => {
  const {
    isBiometricAuthOpen,
    setIsBiometricAuthOpen,
    biometricAuthReason,
    confirmBiometricSuccess,
    theme
  } = useApp();

  const isDark = theme === 'dark';
  const [authMode, setAuthMode] = useState<'BIOMETRIC' | 'PIN'>('BIOMETRIC');
  const [pin, setPin] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isBiometricAuthOpen) {
      setPin('');
      setErrorMsg(null);
      setAuthSuccess(false);
      setAuthMode('BIOMETRIC');
      setIsScanning(false);
    }
  }, [isBiometricAuthOpen]);

  if (!isBiometricAuthOpen) return null;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setErrorMsg(null);
    setTimeout(() => {
      setIsScanning(false);
      setAuthSuccess(true);
      setTimeout(() => {
        confirmBiometricSuccess();
      }, 500);
    }, 900);
  };

  const handlePinKey = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMsg(null);
      if (nextPin.length === 4) {
        // Any 4-digit PIN is accepted or check 1234 / 4892
        setTimeout(() => {
          setAuthSuccess(true);
          setTimeout(() => {
            confirmBiometricSuccess();
          }, 400);
        }, 200);
      }
    }
  };

  const handlePinDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border flex flex-col transition-all ${
          isDark
            ? 'bg-[#1C1427] border-purple-900/40 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-purple-100 dark:border-purple-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#5F259F] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black tracking-tight">TechPay Privacy Shield</h3>
              <p className="text-[10px] text-slate-400">Security & Access Gate</p>
            </div>
          </div>
          <button
            onClick={() => setIsBiometricAuthOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-purple-950 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 text-center space-y-5">
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-[#172033] dark:text-white">
              {authMode === 'BIOMETRIC' ? 'Biometric Authentication' : 'Enter 4-Digit App PIN'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              {biometricAuthReason}
            </p>
          </div>

          {authSuccess ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-2 animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center border-2 border-emerald-500">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold text-emerald-600">Identity Verified</span>
            </div>
          ) : authMode === 'BIOMETRIC' ? (
            /* Fingerprint Scan Simulator */
            <div className="py-4 flex flex-col items-center justify-center space-y-4">
              <button
                type="button"
                onClick={handleSimulateScan}
                disabled={isScanning}
                className="relative group focus:outline-none"
                title="Tap to scan fingerprint"
              >
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                    isScanning
                      ? 'bg-purple-600 text-white scale-105 shadow-xl shadow-purple-600/40 ring-4 ring-purple-300'
                      : 'bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800'
                  }`}
                >
                  <Fingerprint className={`w-12 h-12 transition-transform ${isScanning ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                </div>
                {isScanning && (
                  <span className="absolute inset-0 rounded-full border-2 border-purple-500 animate-ping pointer-events-none"></span>
                )}
              </button>

              <div className="space-y-1">
                <p className="text-xs font-bold text-[#5F259F] dark:text-purple-300">
                  {isScanning ? 'Verifying biometric sensor...' : 'Tap sensor above to scan fingerprint'}
                </p>
                <p className="text-[10px] text-slate-400">
                  Touch ID / Face ID hardware simulated
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAuthMode('PIN')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#5F259F] dark:hover:text-purple-300 transition-colors pt-2"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Use 4-Digit App PIN instead</span>
              </button>
            </div>
          ) : (
            /* 4-Digit PIN Keypad */
            <div className="space-y-4">
              {/* PIN Indicator Dots */}
              <div className="flex items-center justify-center gap-3 py-2">
                {[0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      pin.length > i
                        ? 'bg-[#5F259F] border-[#5F259F] scale-110 shadow-sm'
                        : 'border-slate-300 dark:border-purple-900/50 bg-slate-100 dark:bg-purple-950/40'
                    }`}
                  />
                ))}
              </div>

              {/* Number Keypad */}
              <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto pt-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handlePinKey(d)}
                    className="h-11 rounded-2xl bg-slate-100 dark:bg-[#251A34] hover:bg-purple-100 dark:hover:bg-purple-900/50 text-slate-800 dark:text-white font-extrabold text-sm active:scale-95 transition-all shadow-xs"
                  >
                    {d}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAuthMode('BIOMETRIC')}
                  className="h-11 rounded-2xl text-[10px] font-bold text-slate-500 hover:text-purple-600 flex items-center justify-center"
                >
                  <Fingerprint className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handlePinKey('0')}
                  className="h-11 rounded-2xl bg-slate-100 dark:bg-[#251A34] hover:bg-purple-100 dark:hover:bg-purple-900/50 text-slate-800 dark:text-white font-extrabold text-sm active:scale-95 transition-all shadow-xs"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handlePinDelete}
                  className="h-11 rounded-2xl text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center justify-center active:scale-95 transition-all"
                >
                  ⌫
                </button>
              </div>

              <button
                type="button"
                onClick={() => setAuthMode('BIOMETRIC')}
                className="text-xs font-bold text-[#5F259F] dark:text-purple-300 hover:underline pt-1 inline-block"
              >
                Switch back to Fingerprint
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-[#21152D] border-t border-purple-100 dark:border-purple-900/30 text-[10px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
          <Lock className="w-3 h-3 text-[#5F259F]" />
          <span>Protected by TechPay On-Device Enclave • NPCI Certified</span>
        </div>
      </div>
    </div>
  );
};
