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
  Receipt
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
    isPrivacyMode,
    togglePrivacyMode,
    isBalanceRevealed,
    autoPayMandates,
    commitments,
    formatPrivateAmount
  } = useApp();

  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [upiDailyLimit, setUpiDailyLimit] = useState(100000);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowSuccessToast(msg);
    setTimeout(() => setShowSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-20 right-4 z-50 bg-[#16A36A] text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{showSuccessToast}</span>
        </div>
      )}

      {/* Header Profile Card - Royal Purple Gradient */}
      <div className="bg-gradient-to-r from-[#38146B] via-[#5F259F] to-[#7A38BE] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 blur-2xl rounded-full pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl ${activeProfile.avatarColor} text-white flex items-center justify-center font-black text-2xl shadow-lg border-2 border-white/20`}>
              {activeProfile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{activeProfile.name}</h1>
                <span className="px-2 py-0.5 rounded-full bg-[#16A36A] text-white text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>KYC Verified</span>
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-0.5 font-mono">
                Primary UPI ID: {activeProfile.upiId}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap text-[11px] text-purple-200">
                <span className="bg-white/10 px-2 py-0.5 rounded border border-white/10">
                  PAN: {activeProfile.pan}
                </span>
                <span className="bg-white/10 px-2 py-0.5 rounded border border-white/10">
                  {activeProfile.employmentType.replace('_', ' ')}
                </span>
                <span className="bg-white/10 px-2 py-0.5 rounded border border-white/10">
                  {activeProfile.defaultRegime} Regime
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => onNavigateSection('family')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Users className="w-4 h-4" />
              <span>Switch Family Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Linked Bank Accounts (PhonePe Style Dedicated Interface) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#5F259F]" />
              <span>Linked Bank Accounts & Balance Interface</span>
            </h3>
            <p className="text-xs text-slate-500">
              Accounts verified through NPCI 2-factor authentication switch • Never stores PIN
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#5F259F] bg-[#F0EAF8] px-2.5 py-1 rounded-full">
              3 Accounts Linked
            </span>
            <button
              onClick={() => triggerToast('Select your bank to link via NPCI OTP verification')}
              className="px-3 py-1 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center gap-1"
            >
              <span>+ Add Bank</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {/* Account 1: HDFC Bank (Primary) */}
          <div className="p-4 rounded-2xl border-2 border-[#5F259F]/30 bg-[#F7F6FA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-xs shrink-0">
                🏦
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">HDFC Bank Limited</h4>
                  <span className="px-2 py-0.2 rounded bg-[#5F259F] text-white text-[9px] font-bold">
                    PRIMARY UPI
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Savings A/c •••• 4892 • IFSC: HDFC0001042 • Branch: Indiranagar, BLR
                </p>
                <div className="text-[11px] text-[#16A36A] font-semibold flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>UPI Autopay & IMPS Active • VPA: rahul.techpay@hdfcbank</span>
                </div>
                {isBalanceRevealed && (
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Last updated: Today at 09:12 PM</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {isBalanceRevealed ? (
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Available Balance</span>
                  <div className="text-lg font-black text-slate-900">
                    {formatPrivateAmount(accountBalance, true)}
                  </div>
                  <button
                    onClick={onOpenCheckBalance}
                    className="text-[10px] text-[#5F259F] font-bold hover:underline"
                  >
                    Refresh Balance
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenCheckBalance}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                >
                  <Lock className="w-3.5 h-3.5 text-[#5F259F]" />
                  <span>Check Balance</span>
                </button>
              )}
            </div>
          </div>

          {/* Account 2: ICICI Bank */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-xl shadow-xs shrink-0">
                🏢
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">ICICI Bank Limited</h4>
                  <span className="px-2 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px] font-bold">
                    SALARY A/C
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Salary A/c •••• 1084 • IFSC: ICIC0000021 • Branch: Koramangala, BLR
                </p>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <span>Linked UPI VPA: rahul@icici</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={onOpenCheckBalance}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Lock className="w-3.5 h-3.5 text-slate-600" />
                <span>Check Balance</span>
              </button>
            </div>
          </div>

          {/* Account 3: State Bank of India */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-xl shadow-xs shrink-0">
                🏛️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">State Bank of India (SBI)</h4>
                  <span className="px-2 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px] font-bold">
                    SAVINGS
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Savings A/c •••• 9211 • IFSC: SBIN0004521 • Branch: MG Road, BLR
                </p>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <span>Linked UPI VPA: 9876543210@sbi</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={onOpenCheckBalance}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Lock className="w-3.5 h-3.5 text-slate-600" />
                <span>Check Balance</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Security & Privacy Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security & Limits */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#5F259F]" />
            <span>Transaction Security & Limits</span>
          </h3>

          <div className="space-y-3 text-xs">
            {/* Daily UPI Limit Slider */}
            <div className="p-3.5 rounded-2xl bg-[#F7F6FA] border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700">Daily UPI Spending Limit</span>
                <span className="font-extrabold text-[#5F259F] text-sm">₹{upiDailyLimit.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="100000"
                step="5000"
                value={upiDailyLimit}
                onChange={(e) => {
                  setUpiDailyLimit(Number(e.target.value));
                  triggerToast(`Daily UPI Limit set to ₹${Number(e.target.value).toLocaleString('en-IN')}`);
                }}
                className="w-full accent-[#5F259F] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>₹10,000 (Conservative)</span>
                <span>₹1,00,000 (NPCI Max)</span>
              </div>
            </div>

            {/* Biometric App Lock */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F6FA] border border-slate-200">
              <div>
                <div className="font-bold text-slate-800">Biometric / Fingerprint Lock</div>
                <div className="text-[11px] text-slate-500">Require FaceID or Fingerprint before viewing balances</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBiometricEnabled(!biometricEnabled);
                  triggerToast(biometricEnabled ? 'Biometric security disabled' : 'Biometric security enabled');
                }}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${biometricEnabled ? 'bg-[#5F259F]' : 'bg-slate-300'
                  }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white transition-transform transform shadow-sm ${biometricEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            {/* UPI PIN Note */}
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-[11px] space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <Key className="w-3.5 h-3.5" />
                <span>Zero-Knowledge PIN Architecture</span>
              </div>
              <p className="text-slate-600">
                TechPay never stores or logs your 4-digit or 6-digit UPI PINs. All PIN inputs are encrypted end-to-end via the NPCI UPI switch.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy & Alerts */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#5F259F]" />
            <span>Privacy & Notification Settings</span>
          </h3>

          <div className="space-y-3 text-xs">
            {/* Global Privacy Shield */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F6FA] border border-slate-200">
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>Privacy Shield Mode</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                    PhonePe / GPay Style
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Masks bank balance and loan EMI amounts in public spaces
                </div>
              </div>
              <button
                type="button"
                onClick={togglePrivacyMode}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${isPrivacyMode ? 'bg-[#5F259F]' : 'bg-slate-300'
                  }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white transition-transform transform shadow-sm ${isPrivacyMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            {/* Instant SMS Alerts */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F6FA] border border-slate-200">
              <div>
                <div className="font-bold text-slate-800">SMS Transaction Receipts</div>
                <div className="text-[11px] text-slate-500">Receive free SMS for every credit & debit</div>
              </div>
              <button
                type="button"
                onClick={() => setSmsAlerts(!smsAlerts)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${smsAlerts ? 'bg-[#5F259F]' : 'bg-slate-300'
                  }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white transition-transform transform shadow-sm ${smsAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            {/* WhatsApp Bill Reminders */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F6FA] border border-slate-200">
              <div>
                <div className="font-bold text-slate-800">WhatsApp Due Date Reminders</div>
                <div className="text-[11px] text-slate-500">3-day advance notice for upcoming EMI & utility bills</div>
              </div>
              <button
                type="button"
                onClick={() => setWhatsappAlerts(!whatsappAlerts)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${whatsappAlerts ? 'bg-[#5F259F]' : 'bg-slate-300'
                  }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white transition-transform transform shadow-sm ${whatsappAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Activity & Statements */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <Download className="w-4 h-4 text-[#5F259F]" />
          <span>Statements & Activity Reports</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <button
            onClick={() => triggerToast('Annual Transaction Statement generated (PDF ready)')}
            className="p-3.5 rounded-2xl border border-slate-200 hover:border-[#5F259F] text-left hover:bg-[#F0EAF8]/40 transition-all space-y-1"
          >
            <div className="font-bold text-slate-900">Monthly Statement</div>
            <p className="text-[11px] text-slate-500">November 2026 PDF with GST breakdown</p>
          </button>

          <button
            onClick={() => onNavigateSection('tax')}
            className="p-3.5 rounded-2xl border border-slate-200 hover:border-[#5F259F] text-left hover:bg-[#F0EAF8]/40 transition-all space-y-1"
          >
            <div className="font-bold text-slate-900">ITR Ready Computation Sheet</div>
            <p className="text-[11px] text-slate-500">Sec 115BAC verified computation</p>
          </button>

          <button
            onClick={() => onNavigateSection('payments')}
            className="p-3.5 rounded-2xl border border-slate-200 hover:border-[#5F259F] text-left hover:bg-[#F0EAF8]/40 transition-all space-y-1"
          >
            <div className="font-bold text-slate-900">AutoPay Mandates Summary</div>
            <p className="text-[11px] text-slate-500">{autoPayMandates.length} active recurring mandates</p>
          </button>
        </div>
      </div>

      {/* Help & 24x7 Support */}
      <div className="bg-[#F0EAF8] border border-[#5F259F]/20 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#38146B]">24x7 Customer Grievance & NPCI Helpdesk</h4>
            <p className="text-xs text-slate-600">Instant resolution for failed UPI transactions & refund tracking</p>
          </div>
        </div>

        <button
          onClick={() => triggerToast('Help ticket created. Support agent connecting in 60 seconds.')}
          className="px-4 py-2 rounded-xl bg-[#5F259F] hover:bg-[#38146B] text-white font-bold text-xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          Contact 24x7 Support
        </button>
      </div>
    </div>
  );
};

