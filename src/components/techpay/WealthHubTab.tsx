import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InvestmentsTab } from './InvestmentsTab';
import { TaxDashboardTab } from '../tax/TaxDashboardTab';
import { TaxAiChatTab } from '../tax/TaxAiChatTab';
import {
  Coins,
  Scale,
  Calculator,
  MessageSquare,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface WealthHubTabProps {
  initialSubTab?: 'investments' | 'tax' | 'loans' | 'chat';
  onOpenVoiceCa: () => void;
  onOpenReport: () => void;
  onSelectTransaction: (id: string) => void;
}

export const WealthHubTab: React.FC<WealthHubTabProps> = ({
  initialSubTab = 'investments',
  onOpenVoiceCa,
  onOpenReport,
  onSelectTransaction
}) => {
  const { loanRecords, setIsLoanTrackerOpen, theme } = useApp();
  const isDark = theme === 'dark';

  const [activeWealthSection, setActiveWealthSection] = useState<'investments' | 'tax' | 'loans' | 'chat'>(initialSubTab);

  return (
    <div className="space-y-6 pb-20 animate-fadeIn max-w-6xl mx-auto">
      {/* Top Section Navigation Header */}
      <div className="bg-white dark:bg-[#21152D] rounded-3xl border border-[#E8E1F2] dark:border-[#3D2854] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#5F259F] text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h1 className="text-base sm:text-lg font-black text-[#172033] dark:text-white">
              Wealth & Financial Services Hub
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Digital Gold, Direct SIPs, P2P Udhaar Ledger, and TaxSaathi AI Chartered Accountant.
          </p>
        </div>

        {/* 4 Primary Sub-Navigation Tabs */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-purple-950/40 border border-slate-200 dark:border-purple-900/30 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveWealthSection('investments')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
              activeWealthSection === 'investments'
                ? 'bg-[#5F259F] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Investments & Gold</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveWealthSection('tax')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
              activeWealthSection === 'tax'
                ? 'bg-[#5F259F] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-[#16A36A]" />
            <span>TaxSaathi AI CA</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveWealthSection('loans');
              setIsLoanTrackerOpen(true);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
              activeWealthSection === 'loans'
                ? 'bg-[#5F259F] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>P2P Udhaar ({loanRecords.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveWealthSection('chat')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
              activeWealthSection === 'chat'
                ? 'bg-[#5F259F] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ask CA Vikram</span>
          </button>
        </div>
      </div>

      {/* Render Active Section */}
      {activeWealthSection === 'investments' && (
        <InvestmentsTab />
      )}

      {activeWealthSection === 'tax' && (
        <TaxDashboardTab
          onNavigateTab={() => setActiveWealthSection('chat')}
          onOpenVoiceCa={onOpenVoiceCa}
          onSelectTransaction={onSelectTransaction}
        />
      )}

      {activeWealthSection === 'chat' && (
        <TaxAiChatTab
          onNavigateTab={() => setActiveWealthSection('tax')}
          onOpenReport={onOpenReport}
        />
      )}

      {activeWealthSection === 'loans' && (
        <div className="bg-white dark:bg-[#21152D] rounded-3xl border border-[#E8E1F2] dark:border-[#3D2854] p-8 shadow-xs text-center space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-[#5F259F] text-white flex items-center justify-center mx-auto shadow-md shadow-[#5F259F]/30">
            <Calculator className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-[#172033] dark:text-white">
              Peer-to-Peer Loans & Interest Calculator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Track money given or borrowed, calculate Simple and Compound Interest, and send WhatsApp payment reminders.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsLoanTrackerOpen(true)}
            className="px-6 py-2.5 rounded-2xl bg-[#5F259F] hover:bg-[#4E1E82] text-white font-extrabold text-xs shadow-md shadow-[#5F259F]/20 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            <span>Open P2P Khaata & Calculator</span>
          </button>
        </div>
      )}
    </div>
  );
};
