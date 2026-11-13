import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  ShieldCheck,
  Building2,
  Lock,
  CreditCard,
  Bell,
  Eye,
  EyeOff,
  UserCheck,
  HelpCircle,
  Download,
  Key,
  Smartphone,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Settings,
  Receipt,
  AlertTriangle,
  Laptop,
  Check,
  Copy,
  AlertOctagon,
  Unlock,
  KeyRound
} from 'lucide-react';

interface ProfileSecurityTabProps {
  onNavigateSection: (section: string) => void;
  onOpenCheckBalance: () => void;
}

export const ProfileSecurityTab: React.FC<ProfileSecurityTabProps> = ({
  onNavigateSection,
  onOpenCheckBalance
}) => {
  const {
    activeProfile,
    profiles,
    setActiveProfileId,
    accountBalance,
    privacyLevel,
    setPrivacyLevel,
    privacySettings,
    updatePrivacySettings,
    setIsPrivacyShieldModalOpen,
    lockEmergencyAccount,
    unlockEmergencyAccount,
    triggerBiometricAuth,
    formatPrivateAmount,
    formatMaskedAccount,
    formatMaskedUpi,
    isBalanceRevealed,
    theme
  } = useApp();

  const isDark = theme === 'dark';

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowSuccessToast(msg);
    setTimeout(() => setShowSuccessToast(null), 3000);
  };

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(activeProfile.upiId);
    setCopiedUpi(true);
    triggerToast('Primary UPI ID copied to clipboard');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleEmergencyToggle = () => {
    if (!privacySettings.isEmergencyLocked) {
      if (window.confirm('🚨 EMERGENCY ACCOUNT FREEZE: This will immediately block all outgoing UPI payments, mask all balances, and freeze digital transactions. Continue?')) {
        lockEmergencyAccount();
        triggerToast('Account emergency frozen successfully');
      }
    } else {
      triggerBiometricAuth('Verify Identity to Unfreeze Account', () => {
        unlockEmergencyAccount();
        triggerToast('Account unfreezed successfully');
      });
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn max-w-4xl mx-auto">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-20 right-4 z-50 bg-[#16A36A] text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{showSuccessToast}</span>
        </div>
      )}

      {/* Emergency Freeze Banner */}
      {privacySettings.isEmergencyLocked && (
        <div className="p-4 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 text-rose-950 dark:text-rose-100 flex items-start justify-between gap-3 animate-pulse">
          <div className="flex items-start gap-2.5">
            <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-rose-900 dark:text-rose-200 uppercase tracking-wider">
                Emergency Account Freeze Active
              </h4>
              <p className="text-xs text-rose-800 dark:text-rose-300">
                All outgoing UPI transfers and PIN authorisations are frozen. Balances are masked.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleEmergencyToggle}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shrink-0 flex items-center gap-1 shadow-md shadow-rose-600/30"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Unfreeze Account</span>
          </button>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="bg-gradient-to-r from-[#35145F] via-[#5F259F] to-[#7A38BE] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 blur-2xl rounded-full pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl ${activeProfile.avatarColor} text-white flex items-center justify-center font-black text-2xl shadow-lg border-2 border-white/20 shrink-0`}>
              {activeProfile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">{activeProfile.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#16A36A] text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3 h-3" />
                  <span>KYC Verified</span>
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 font-mono text-xs text-purple-200">
                <span>UPI ID: {formatMaskedUpi(activeProfile.upiId)}</span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="p-1 hover:text-white text-purple-300 transition-colors"
                  title="Copy UPI ID"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap text-[11px] text-purple-200">
                <span className="bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
                  PAN: {activeProfile.pan.slice(0, 3)}••••{activeProfile.pan.slice(-2)}
                </span>
                <span className="bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
                  {activeProfile.employmentType.replace('_', ' ')}
                </span>
                <span className="bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
                  {activeProfile.defaultRegime} Tax Regime
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => onNavigateSection('family')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Users className="w-4 h-4" />
              <span>Switch Family Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* TECHPAY PRIVACY SHIELD CONTROL CENTER TRIGGER */}
      <div className="bg-white dark:bg-[#21152D] rounded-3xl border border-[#E8E1F2] dark:border-[#3D2854] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-purple-100 dark:border-purple-900/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center shadow-md shadow-[#5F259F]/20 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-[#172033] dark:text-white">
                  TechPay Privacy Shield
                </h3>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    privacyLevel === 'SECURE'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : privacyLevel === 'PRIVACY'
                      ? 'bg-purple-500/10 text-[#5F259F] dark:text-purple-300 border border-purple-500/20'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {privacyLevel} Level
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Anti-shoulder-surfing protection, automatic balance masking, and biometric app lock.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPrivacyShieldModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#5F259F] hover:bg-[#4E1E82] text-white font-extrabold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Open Privacy Shield Settings</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Toggles Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200 dark:border-purple-900/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Balance Masking</span>
            <div className="font-extrabold text-slate-800 dark:text-white">
              {privacySettings.hideBalanceByDefault ? '✓ Hidden by Default' : 'Visible'}
            </div>
            <p className="text-[10px] text-slate-400">Eye icon required to reveal balance</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200 dark:border-purple-900/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Biometric App Lock</span>
            <div className="font-extrabold text-slate-800 dark:text-white">
              {privacySettings.requireBiometricForSensitive ? '✓ Active (Fingerprint/PIN)' : 'Disabled'}
            </div>
            <p className="text-[10px] text-slate-400">Enforced for statements & TaxSaathi</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200 dark:border-purple-900/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Auto-Lock Timeout</span>
            <div className="font-extrabold text-slate-800 dark:text-white">
              {privacySettings.autoLockTimeoutSeconds === 0 ? 'Immediate on blur' : `${privacySettings.autoLockTimeoutSeconds} Seconds`}
            </div>
            <p className="text-[10px] text-slate-400">Auto-hides sensitive values</p>
          </div>
        </div>
      </div>

      {/* Linked Bank Accounts */}
      <div className="bg-white dark:bg-[#21152D] rounded-3xl border border-[#E8E1F2] dark:border-[#3D2854] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-purple-100 dark:border-purple-900/30">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#5F259F]" />
              <span>Linked Bank Accounts & UPI Mandates</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified through NPCI UPI Payment Gateway. Primary debit account for transfers.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCheckBalance}
            className="px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5F259F] dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors self-start sm:self-auto"
          >
            Check Balance via PIN
          </button>
        </div>

        {/* Bank Card */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-purple-900/30 bg-slate-50/50 dark:bg-purple-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#004C8F] text-white flex items-center justify-center font-black text-sm shrink-0">
              HDFC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  HDFC Bank Limited
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  Primary Account
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5 font-mono">
                Savings A/C •••• 4892 • IFSC: HDFC0001234
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xs text-slate-400 font-medium">Available Balance</div>
            <div className="text-base font-black text-slate-900 dark:text-white font-mono mt-0.5">
              {formatPrivateAmount(accountBalance, isBalanceRevealed)}
            </div>
          </div>
        </div>
      </div>

      {/* Logged-In Devices & Security Sessions */}
      <div className="bg-white dark:bg-[#21152D] rounded-3xl border border-[#E8E1F2] dark:border-[#3D2854] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-purple-100 dark:border-purple-900/30">
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-[#5F259F]" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Device Management & Login Alerts
            </h3>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
            2 Active Devices
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200 dark:border-purple-900/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Laptop className="w-5 h-5 text-indigo-600" />
              <div>
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Windows 11 Workstation (This Device)</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-600 text-white font-black">CURRENT</span>
                </div>
                <div className="text-[11px] text-slate-400">Chrome 131 • Bengaluru, India • Active now</div>
              </div>
            </div>
            <span className="text-emerald-600 font-bold text-[11px]">Secure Enclave</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200 dark:border-purple-900/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-bold text-slate-900 dark:text-white">iPhone 15 Pro (Mobile UPI App)</div>
                <div className="text-[11px] text-slate-400">iOS 18.1 • Face ID Enabled • Last active 2 hours ago</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => triggerToast('Logged out iPhone session successfully')}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Account Freeze Killswitch Card */}
      <div className="p-5 rounded-3xl bg-rose-50/70 dark:bg-rose-950/20 border-2 border-rose-300 dark:border-rose-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-rose-950 dark:text-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Emergency Killswitch: Freeze All UPI Payments</span>
          </h4>
          <p className="text-xs text-rose-900/80 dark:text-rose-300 mt-1 max-w-lg leading-relaxed">
            In case your phone or device is lost, you can instantly lock your account to block any unauthorized debits or transactions across all channels.
          </p>
        </div>

        <button
          type="button"
          onClick={handleEmergencyToggle}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold shadow-md active:scale-95 transition-all shrink-0 ${
            privacySettings.isEmergencyLocked
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
          }`}
        >
          {privacySettings.isEmergencyLocked ? 'Unfreeze Account' : 'Freeze Account Now'}
        </button>
      </div>
    </div>
  );
};
