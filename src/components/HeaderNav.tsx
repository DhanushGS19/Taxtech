import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Zap,
  Home,
  CreditCard,
  Receipt,
  Coins,
  Scale,
  Lock,
  PieChart,
  Bell,
  HelpCircle,
  Eye,
  EyeOff,
  Mic,
  FileText,
  User,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Settings
} from 'lucide-react';
import { NotificationsModal } from './techpay/NotificationsModal';
import { HelpSupportModal } from './techpay/HelpSupportModal';

interface HeaderNavProps {
  activeSection?: string;
  setActiveSection?: (section: string) => void;
  onOpenVoiceCa: () => void;
  onOpenMakePayment: () => void;
  onOpenReport: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeSection = 'home',
  setActiveSection,
  onOpenVoiceCa,
  onOpenMakePayment,
  onOpenReport
}) => {
  const {
    accountBalance,
    activeProfile,
    profiles,
    setActiveProfileId,
    isPrivacyMode,
    togglePrivacyMode,
    activeRegime,
    toggleRegime
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'scan', label: 'Payments', icon: CreditCard },
    { id: 'history', label: 'History', icon: Receipt },
    { id: 'wealth', label: 'Wealth', icon: Coins },
    { id: 'tax', label: 'Tax', icon: Scale },
    { id: 'budgets', label: 'Budgets', icon: Lock }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.03)] h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
          {/* Left: TechPay Logo, Name & Tagline */}
          <div
            className="flex items-center gap-3 cursor-pointer shrink-0"
            onClick={() => setActiveSection?.('home')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#35145F] to-[#5F259F] flex items-center justify-center text-white shadow-sm shadow-[#5F259F]/20">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-[#172033]">
                  TechPay
                </span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#F3EEF9] text-[#5F259F]">
                  Fintech
                </span>
              </div>
              <p className="text-[11px] text-[#718096] font-medium leading-none hidden sm:block">
                Digital Payments & Tax Intelligence
              </p>
            </div>
          </div>

          {/* Centre: Clean Desktop Navigation (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeSection === item.id ||
                (item.id === 'scan' && activeSection === 'payments') ||
                (item.id === 'history' && activeSection === 'payments-history');

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection?.(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#F3EEF9] text-[#5F259F] font-bold shadow-xs'
                      : 'text-[#718096] hover:text-[#172033] hover:bg-[#F8F9FC]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Notifications, Help, User Profile & Settings */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Voice CA Assistant Button */}
            <button
              type="button"
              onClick={onOpenVoiceCa}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F9FC] hover:bg-[#F3EEF9] text-[#5F259F] border border-[#E2E8F0] text-xs font-bold transition-all shadow-xs"
              title="Ask AI CA Vikram"
            >
              <Mic className="w-3.5 h-3.5 text-[#5F259F] animate-pulse" />
              <span>Voice CA</span>
            </button>

            {/* Privacy Shield Toggle */}
            <button
              type="button"
              onClick={togglePrivacyMode}
              title={
                isPrivacyMode
                  ? 'Privacy Active: Balances and loans are masked'
                  : 'Privacy Inactive: Balances are visible'
              }
              className={`p-2 rounded-xl border text-xs transition-all ${
                isPrivacyMode
                  ? 'bg-amber-50 text-[#E9A23B] border-amber-200'
                  : 'bg-[#F8F9FC] hover:bg-slate-100 text-[#718096] border-[#E2E8F0]'
              }`}
            >
              {isPrivacyMode ? <EyeOff className="w-4 h-4 text-[#E9A23B]" /> : <Eye className="w-4 h-4 text-[#718096]" />}
            </button>

            {/* Notifications Bell */}
            <button
              type="button"
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2 rounded-xl bg-[#F8F9FC] hover:bg-[#F3EEF9] text-[#718096] hover:text-[#5F259F] border border-[#E2E8F0] transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#5F259F] ring-2 ring-white"></span>
            </button>

            {/* Help & Support */}
            <button
              type="button"
              onClick={() => setIsHelpOpen(true)}
              className="p-2 rounded-xl bg-[#F8F9FC] hover:bg-[#F3EEF9] text-[#718096] hover:text-[#5F259F] border border-[#E2E8F0] transition-all"
              title="Help and Support"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* User Profile & Account Settings */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-[#F8F9FC] border border-[#E2E8F0] transition-all"
              >
                <div className={`w-7 h-7 rounded-lg ${activeProfile.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                  {activeProfile.name.charAt(0)}
                </div>
                <div className="text-left hidden xl:block">
                  <div className="text-xs font-bold text-[#172033] leading-none flex items-center gap-1">
                    <span>{activeProfile.name}</span>
                    <CheckCircle2 className="w-3 h-3 text-[#16A36A]" />
                  </div>
                  <div className="text-[10px] text-[#718096] font-mono leading-none mt-1">
                    HDFC ••4892
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#718096]" />
              </button>

              {/* Profile Menu Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E2E8F0] shadow-xl py-2 z-50 text-xs animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="font-bold text-[#172033]">{activeProfile.name}</div>
                    <div className="text-[11px] text-[#718096] font-mono">{activeProfile.upiId}</div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#16A36A] text-[10px] font-bold">
                      Aadhaar & PAN KYC Verified
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setActiveSection?.('profile');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#F8F9FC] text-[#172033] font-semibold flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-[#5F259F]" />
                    <span>View Profile & Bank Accounts</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      toggleRegime();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#F8F9FC] text-[#172033] font-semibold flex items-center justify-between"
                  >
                    <span>Tax Regime:</span>
                    <span className="px-2 py-0.5 rounded bg-[#F3EEF9] text-[#5F259F] font-bold text-[10px]">
                      {activeRegime} Regime
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenReport();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#F8F9FC] text-[#172033] font-semibold flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-[#16A36A]" />
                    <span>Download ITR Summary</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notifications and Help Modals */}
      <NotificationsModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onNavigateSection={(sec) => setActiveSection?.(sec)}
      />

      <HelpSupportModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </>
  );
};
