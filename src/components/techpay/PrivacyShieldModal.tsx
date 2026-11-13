import React from 'react';
import { useApp } from '../../context/AppContext';
import { PrivacyLevel } from '../../types/tax';
import {
  ShieldCheck,
  Shield,
  ShieldAlert,
  X,
  EyeOff,
  Eye,
  Lock,
  Smartphone,
  CreditCard,
  KeyRound,
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Unlock
} from 'lucide-react';

export const PrivacyShieldModal: React.FC = () => {
  const {
    isPrivacyShieldModalOpen,
    setIsPrivacyShieldModalOpen,
    privacyLevel,
    setPrivacyLevel,
    privacySettings,
    updatePrivacySettings,
    lockEmergencyAccount,
    unlockEmergencyAccount,
    triggerBiometricAuth,
    theme
  } = useApp();

  const isDark = theme === 'dark';

  if (!isPrivacyShieldModalOpen) return null;

  const handleLevelChange = (level: PrivacyLevel) => {
    if (level === 'SECURE') {
      triggerBiometricAuth('Enable Secure Biometric Lock Mode', () => {
        setPrivacyLevel('SECURE');
      });
    } else {
      setPrivacyLevel(level);
    }
  };

  const handleEmergencyToggle = () => {
    if (!privacySettings.isEmergencyLocked) {
      if (window.confirm('🚨 EMERGENCY ACCOUNT FREEZE: This will immediately block all outgoing UPI payments, mask all balances, and freeze digital transactions. Continue?')) {
        lockEmergencyAccount();
      }
    } else {
      triggerBiometricAuth('Verify Identity to Unfreeze Account', () => {
        unlockEmergencyAccount();
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-xl max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl border flex flex-col transition-all ${
          isDark
            ? 'bg-[#1C1427] border-purple-900/40 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 border-b flex items-center justify-between shrink-0 ${
            privacySettings.isEmergencyLocked
              ? 'bg-rose-600 text-white border-rose-700'
              : isDark
              ? 'bg-[#251A34] border-purple-900/30'
              : 'bg-gradient-to-r from-purple-50 via-white to-purple-50/50 border-purple-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
                privacySettings.isEmergencyLocked
                  ? 'bg-white text-rose-600'
                  : 'bg-[#5F259F] text-white shadow-[#5F259F]/30'
              }`}
            >
              {privacySettings.isEmergencyLocked ? <AlertOctagon className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-tight">
                  TechPay Privacy Shield
                </h3>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    privacySettings.isEmergencyLocked
                      ? 'bg-white text-rose-700'
                      : privacyLevel === 'SECURE'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : privacyLevel === 'PRIVACY'
                      ? 'bg-purple-500/10 text-[#5F259F] dark:text-purple-300 border border-purple-500/20'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {privacySettings.isEmergencyLocked ? 'ACCOUNT FROZEN' : `${privacyLevel} MODE`}
                </span>
              </div>
              <p className="text-xs opacity-80 mt-0.5">
                Zero-exposure financial privacy & anti-shoulder-surfing protection
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPrivacyShieldModalOpen(false)}
            className="p-2 rounded-full hover:bg-black/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* EMERGENCY STATUS BANNER */}
          {privacySettings.isEmergencyLocked && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 text-rose-950 dark:text-rose-100 flex items-start justify-between gap-3 animate-pulse">
              <div className="flex items-start gap-2.5">
                <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-rose-900 dark:text-rose-200 uppercase tracking-wider">
                    Emergency Account Freeze Active
                  </h4>
                  <p className="text-xs leading-relaxed text-rose-800 dark:text-rose-300">
                    All outgoing transfers and UPI PIN authorisations are locked. Account numbers and balances are masked across all tabs.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleEmergencyToggle}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shrink-0 flex items-center gap-1 shadow-md shadow-rose-600/30"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Unfreeze</span>
              </button>
            </div>
          )}

          {/* 1. THREE PRIVACY LEVELS */}
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Choose Privacy Shield Level
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Tailor your financial visibility depending on whether you are at home or in public.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Level 1: Normal */}
              <button
                type="button"
                onClick={() => handleLevelChange('NORMAL')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  privacyLevel === 'NORMAL' && !privacySettings.isEmergencyLocked
                    ? 'border-slate-800 dark:border-white bg-slate-100 dark:bg-purple-950/60 ring-2 ring-slate-400'
                    : isDark
                    ? 'border-purple-900/30 bg-[#251A34] text-slate-400 hover:border-purple-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#172033] dark:text-white">Normal</span>
                  {privacyLevel === 'NORMAL' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] leading-relaxed opacity-80">
                  Standard visibility for trusted private environments. Balances visible on dashboard.
                </p>
              </button>

              {/* Level 2: Privacy Mode */}
              <button
                type="button"
                onClick={() => handleLevelChange('PRIVACY')}
                className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                  privacyLevel === 'PRIVACY' && !privacySettings.isEmergencyLocked
                    ? 'border-[#5F259F] bg-purple-500/10 dark:bg-purple-950/80 ring-2 ring-[#5F259F]'
                    : isDark
                    ? 'border-purple-900/30 bg-[#251A34] text-slate-400 hover:border-purple-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="absolute -top-2 right-3 text-[9px] font-black px-2 py-0.2 rounded-full bg-[#5F259F] text-white">
                  RECOMMENDED
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#5F259F] dark:text-purple-300">Privacy Mode</span>
                  {privacyLevel === 'PRIVACY' && <CheckCircle2 className="w-4 h-4 text-[#5F259F]" />}
                </div>
                <p className="text-[11px] leading-relaxed opacity-80">
                  Hides balances (`₹••••••••`) and masks transaction amounts from casual over-the-shoulder peeking.
                </p>
              </button>

              {/* Level 3: Secure Mode */}
              <button
                type="button"
                onClick={() => handleLevelChange('SECURE')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  privacyLevel === 'SECURE' && !privacySettings.isEmergencyLocked
                    ? 'border-emerald-600 bg-emerald-500/10 dark:bg-emerald-950/60 ring-2 ring-emerald-500'
                    : isDark
                    ? 'border-purple-900/30 bg-[#251A34] text-slate-400 hover:border-purple-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">Secure Mode</span>
                  {privacyLevel === 'SECURE' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] leading-relaxed opacity-80">
                  Demands Biometric / App PIN authentication to reveal balances or inspect statements.
                </p>
              </button>
            </div>
          </div>

          {/* 2. GRANULAR PRIVACY CONTROLS */}
          <div className="space-y-3 pt-2 border-t border-purple-100 dark:border-purple-900/30">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Granular Privacy Controls
            </h4>

            <div className="space-y-2.5">
              {/* Toggle 1: Hide Balance by default */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#251A34] border border-slate-200 dark:border-purple-900/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#5F259F] dark:text-purple-300 flex items-center justify-center">
                    <EyeOff className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#172033] dark:text-white">
                      Hide Balance by Default
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Shows `₹••••••••` until you tap the eye icon
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.hideBalanceByDefault}
                  onChange={e => updatePrivacySettings({ hideBalanceByDefault: e.target.checked })}
                  className="w-5 h-5 accent-[#5F259F] rounded cursor-pointer"
                />
              </div>

              {/* Toggle 2: Hide Transaction Amounts */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#251A34] border border-slate-200 dark:border-purple-900/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#5F259F] dark:text-purple-300 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#172033] dark:text-white">
                      Mask Transaction Amounts
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Conceals recent debit/credit values as `- ₹••••`
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.hideTransactionAmounts}
                  onChange={e => updatePrivacySettings({ hideTransactionAmounts: e.target.checked })}
                  className="w-5 h-5 accent-[#5F259F] rounded cursor-pointer"
                />
              </div>

              {/* Toggle 3: Mask Account & UPI Details */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#251A34] border border-slate-200 dark:border-purple-900/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#5F259F] dark:text-purple-300 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#172033] dark:text-white">
                      Mask Account & UPI Identifiers
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Shows `HDFC Bank •••• 4892` and `rah•••••@okhdfcbank`
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.maskAccountDetails}
                  onChange={e => updatePrivacySettings({ maskAccountDetails: e.target.checked })}
                  className="w-5 h-5 accent-[#5F259F] rounded cursor-pointer"
                />
              </div>

              {/* Toggle 4: Hide Recent Activity on Home */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#251A34] border border-slate-200 dark:border-purple-900/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#5F259F] dark:text-purple-300 flex items-center justify-center">
                    <EyeOff className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#172033] dark:text-white">
                      Disable Home Recent Activity Preview
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Keep transactions viewable only inside protected History tab
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.hideRecentActivityOnHome}
                  onChange={e => updatePrivacySettings({ hideRecentActivityOnHome: e.target.checked })}
                  className="w-5 h-5 accent-[#5F259F] rounded cursor-pointer"
                />
              </div>

              {/* Toggle 5: Require Biometrics for Sensitive Actions */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#251A34] border border-slate-200 dark:border-purple-900/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#5F259F] dark:text-purple-300 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#172033] dark:text-white">
                      Biometric App Lock
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Require fingerprint or PIN before opening Statements or TaxSaathi
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.requireBiometricForSensitive}
                  onChange={e => updatePrivacySettings({ requireBiometricForSensitive: e.target.checked })}
                  className="w-5 h-5 accent-[#5F259F] rounded cursor-pointer"
                />
              </div>

              {/* Inactivity Auto-Lock Dropdown */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#251A34] border border-slate-200 dark:border-purple-900/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#5F259F] dark:text-purple-300 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#172033] dark:text-white">
                      Auto-Hide Balance Timeout
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Re-masks values automatically after switching tabs or inactivity
                    </div>
                  </div>
                </div>
                <select
                  value={privacySettings.autoLockTimeoutSeconds}
                  onChange={e => updatePrivacySettings({ autoLockTimeoutSeconds: Number(e.target.value) })}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold focus:outline-none ${
                    isDark ? 'bg-[#1C1427] border-purple-900/40 text-white' : 'bg-white border-slate-200'
                  }`}
                >
                  <option value={0}>Immediate (On blur)</option>
                  <option value={30}>30 Seconds</option>
                  <option value={60}>1 Minute</option>
                  <option value={300}>5 Minutes</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. EMERGENCY KILLSWITCH */}
          <div className="pt-2 border-t border-purple-100 dark:border-purple-900/30">
            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h5 className="text-xs font-black text-rose-950 dark:text-rose-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Emergency Account Freeze (Killswitch)</span>
                </h5>
                <p className="text-[11px] text-rose-900/80 dark:text-rose-300 mt-0.5 max-w-sm">
                  Lost device or security compromise? Immediately freeze all outgoing UPI payments and mask all personal finances.
                </p>
              </div>

              <button
                type="button"
                onClick={handleEmergencyToggle}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm active:scale-95 transition-all shrink-0 ${
                  privacySettings.isEmergencyLocked
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                {privacySettings.isEmergencyLocked ? 'Unfreeze Account' : 'Freeze Account Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-100 dark:border-purple-900/30 flex items-center justify-between text-xs bg-slate-50 dark:bg-[#251A34]">
          <span className="text-slate-400 text-[11px]">
            Compliant with RBI Digital Banking & NPCI UPI Privacy Directives
          </span>
          <button
            type="button"
            onClick={() => setIsPrivacyShieldModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-[#5F259F] text-white font-extrabold text-xs shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
