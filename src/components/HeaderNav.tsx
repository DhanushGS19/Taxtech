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
  User,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Settings,
  QrCode,
  MapPin,
  Sun,
  Moon,
  Sparkles
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
    theme,
    toggleTheme,
    activeLocation,
    setActiveLocation
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'scan', label: 'Scan & Pay', icon: QrCode },
    { id: 'history', label: 'History', icon: Receipt },
    { id: 'wealth', label: 'Wealth', icon: Coins },
    { id: 'tax', label: 'TaxSaathi', icon: Scale },
    { id: 'budgets', label: 'Budgets', icon: Lock }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white dark:bg-[#21152D] border-b border-[#E8E1F2] dark:border-[#3D2854] shadow-[0_1px_3px_rgba(0,0,0,0.03)] h-16 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-3 sm:gap-4">
          {/* ============================================================ */}
          {/* LEFT: User Profile Image, Greeting & Location Selection      */}
          {/* ============================================================ */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* User Profile Avatar with Online indicator */}
            <div
              onClick={() => setActiveSection?.('profile')}
              className="relative cursor-pointer group"
              title="View Profile"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#35145F] to-[#5F259F] text-white flex items-center justify-center font-black text-sm shadow-xs border-2 border-white dark:border-[#35145F] group-hover:scale-105 transition-transform">
                {activeProfile.name.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#16A36A] border-2 border-white dark:border-[#21152D]"></span>
            </div>

            {/* Greeting & Location Selector */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span
                  onClick={() => setActiveSection?.('home')}
                  className="text-xs sm:text-sm font-extrabold text-[#172033] dark:text-white cursor-pointer hover:text-[#5F259F] transition-colors"
                >
                  TechPay
                </span>
                <span className="text-[9px] font-bold uppercase px-1 py-0.2 rounded bg-purple-100 dark:bg-purple-900/60 text-[#5F259F] dark:text-purple-300">
                  UPI
                </span>
              </div>

              {/* Location Selector Pill */}
              <div className="relative mt-0.5">
                <button
                  type="button"
                  onClick={() => setIsLocationMenuOpen(prev => !prev)}
                  className="flex items-center gap-1 text-[11px] text-[#718096] dark:text-purple-200/80 hover:text-[#172033] dark:hover:text-white font-semibold transition-colors"
                >
                  <MapPin className="w-3 h-3 text-[#5F259F] dark:text-purple-400 shrink-0" />
                  <span className="truncate max-w-[130px] sm:max-w-[180px]">{activeLocation}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {/* Location dropdown */}
                {isLocationMenuOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#2A1C39] rounded-xl border border-[#E8E1F2] dark:border-[#3D2854] shadow-xl py-2 z-50 text-xs">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">Select Location</div>
                    {[
                      'Work • Indiranagar, Bengaluru',
                      'Home • Koramangala, Bengaluru',
                      'Parents’ Home • Shivaji Nagar, Pune',
                      'Office • Cyber City, Gurugram'
                    ].map((loc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setActiveLocation(loc);
                          setIsLocationMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#F6F3FA] dark:hover:bg-[#35145F] ${
                          activeLocation === loc ? 'text-[#5F259F] dark:text-purple-300 font-bold' : 'text-[#172033] dark:text-slate-200'
                        }`}
                      >
                        <span className="truncate">{loc}</span>
                        {activeLocation === loc && <CheckCircle2 className="w-3.5 h-3.5 text-[#5F259F]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* CENTRE: Desktop Navigation Links (Hidden on Mobile)          */}
          {/* ============================================================ */}
          <nav className="hidden lg:flex items-center gap-1">
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-50 dark:bg-purple-950/70 text-[#5F259F] dark:text-purple-300 font-bold border border-purple-200/60 dark:border-purple-800'
                      : 'text-[#718096] dark:text-slate-300 hover:text-[#172033] dark:hover:text-white hover:bg-[#F6F3FA] dark:hover:bg-[#2A1C39]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* ============================================================ */}
          {/* RIGHT: QR Shortcut, Notifications, Help & Theme Toggle      */}
          {/* ============================================================ */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Ask AI CA Shortcut */}
            <button
              type="button"
              onClick={onOpenVoiceCa}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-[#5F259F] dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5F259F] dark:text-purple-300" />
              <span>Voice CA</span>
            </button>

            {/* QR Scanner Shortcut Button */}
            <button
              type="button"
              onClick={() => setActiveSection?.('scan')}
              title="Scan Any QR"
              className="p-2 rounded-xl bg-[#F6F3FA] dark:bg-[#2A1C39] hover:bg-purple-100 dark:hover:bg-purple-900 text-[#5F259F] dark:text-purple-300 border border-[#E8E1F2] dark:border-[#3D2854] transition-colors"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setIsNotifOpen(true)}
              title="Notifications"
              className="relative p-2 rounded-xl bg-[#F6F3FA] dark:bg-[#2A1C39] hover:bg-slate-100 dark:hover:bg-[#35145F] text-[#718096] dark:text-slate-300 border border-[#E8E1F2] dark:border-[#3D2854] transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            </button>

            {/* 24x7 Help & Support */}
            <button
              type="button"
              onClick={() => setIsHelpOpen(true)}
              title="24x7 Help & Support"
              className="p-2 rounded-xl bg-[#F6F3FA] dark:bg-[#2A1C39] hover:bg-slate-100 dark:hover:bg-[#35145F] text-[#718096] dark:text-slate-300 border border-[#E8E1F2] dark:border-[#3D2854] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Theme Switcher Toggle (Light vs Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-2 rounded-xl bg-[#F6F3FA] dark:bg-[#2A1C39] hover:bg-slate-100 dark:hover:bg-[#35145F] text-[#718096] dark:text-amber-400 border border-[#E8E1F2] dark:border-[#3D2854] transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-purple-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* User Profile Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(prev => !prev)}
                className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-[#F6F3FA] dark:hover:bg-[#2A1C39] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#5F259F] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {activeProfile.name.charAt(0)}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Menu Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#2A1C39] rounded-2xl border border-[#E8E1F2] dark:border-[#3D2854] shadow-xl p-3 z-50 text-xs space-y-2 animate-fadeIn">
                  <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-extrabold text-[#172033] dark:text-white">{activeProfile.name}</p>
                    <p className="text-[11px] text-[#718096] dark:text-slate-400 font-mono">{activeProfile.upiId}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-[#5F259F] dark:text-purple-300">
                      Primary UPI ID: HDFC Bank
                    </span>
                  </div>

                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection?.('profile');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-[#F6F3FA] dark:hover:bg-[#35145F] text-[#172033] dark:text-slate-200 font-medium flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-[#5F259F]" />
                      <span>Profile & Linked Banks</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection?.('family');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-[#F6F3FA] dark:hover:bg-[#35145F] text-[#172033] dark:text-slate-200 font-medium flex items-center gap-2"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#16A36A]" />
                      <span>Family Budget Profiles</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onOpenReport();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-[#F6F3FA] dark:hover:bg-[#35145F] text-[#172033] dark:text-slate-200 font-medium flex items-center gap-2"
                    >
                      <Receipt className="w-3.5 h-3.5 text-blue-600" />
                      <span>Download Tax & UPI Statement</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      {isNotifOpen && (
        <NotificationsModal
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
        />
      )}

      {/* Help & Support Drawer */}
      {isHelpOpen && (
        <HelpSupportModal
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
        />
      )}
    </>
  );
};
