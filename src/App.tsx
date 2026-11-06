import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderNav } from './components/HeaderNav';
import { PaymentHome } from './components/techpay/PaymentHome';
import { PaymentHistoryTab } from './components/techpay/PaymentHistoryTab';
import { BudgetVaultTab } from './components/techpay/BudgetVaultTab';
import { InvestmentsTab } from './components/techpay/InvestmentsTab';
import { AutoPayTab } from './components/techpay/AutoPayTab';
import { MakePaymentModal } from './components/techpay/MakePaymentModal';
import { CheckBalanceModal } from './components/techpay/CheckBalanceModal';
import { PaymentsTab } from './components/techpay/PaymentsTab';
import { ExpensesAnalyticsTab } from './components/techpay/ExpensesAnalyticsTab';
import { FamilyProfilesTab } from './components/techpay/FamilyProfilesTab';
import { ProfileSecurityTab } from './components/techpay/ProfileSecurityTab';
import { ScanPayScreen } from './components/techpay/ScanPayScreen';

import { TaxDashboardTab } from './components/tax/TaxDashboardTab';
import { TaxAiChatTab } from './components/tax/TaxAiChatTab';
import { TaxPlanningTab } from './components/tax/TaxPlanningTab';
import { TaxCalendarTab } from './components/tax/TaxCalendarTab';
import { AuditHealthTab } from './components/tax/AuditHealthTab';
import { DocumentIntelligenceTab } from './components/tax/DocumentIntelligenceTab';

import { VoiceCaModal } from './components/VoiceCaModal';
import { PaymentDetailModal } from './components/PaymentDetailModal';
import { ReportExportModal } from './components/ReportExportModal';
import { LoanInterestTrackerModal } from './components/techpay/LoanInterestTrackerModal';

import {
  Zap,
  CreditCard,
  Lock,
  Receipt,
  Coins,
  MapPin,
  Scale,
  MessageSquare,
  Sparkles,
  Calendar,
  AlertTriangle,
  FileText,
  PieChart,
  Users,
  Home,
  User,
  ChevronRight,
  QrCode
} from 'lucide-react';

export type MainSectionType = 
  | 'home'
  | 'history'
  | 'scan'
  | 'wealth'
  | 'profile'
  | 'payments'
  | 'expenses'
  | 'budgets'
  | 'tax'
  | 'ai-assistant'
  | 'family';

const MainLayout: React.FC = () => {
  const {
    activeFace,
    setActiveFace,
    anomalies,
    isCheckBalanceOpen,
    setIsCheckBalanceOpen,
    isLoanTrackerOpen,
    setIsLoanTrackerOpen
  } = useApp();

  const [mainSection, setMainSection] = useState<MainSectionType>('home');
  const [paymentSubtab, setPaymentSubtab] = useState<'history' | 'autopay'>('history');
  const [taxSubtab, setTaxSubtab] = useState<'dashboard' | 'planning' | 'calendar' | 'audit' | 'docs'>('dashboard');

  const [isMakePaymentOpen, setIsMakePaymentOpen] = useState(false);
  const [makePaymentDefault, setMakePaymentDefault] = useState<any>(null);
  const [isVoiceCaOpen, setIsVoiceCaOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  const unresolvedAnomalies = anomalies.filter(a => !a.resolved).length;

  return (
    <div className="min-h-screen bg-[#F6F3FA] dark:bg-[#180E24] text-[#172033] dark:text-slate-100 flex flex-col font-sans transition-colors">
      <HeaderNav
        activeSection={mainSection}
        setActiveSection={(sec) => setMainSection(sec as MainSectionType)}
        onOpenVoiceCa={() => setIsVoiceCaOpen(true)}
        onOpenMakePayment={() => {
          setMakePaymentDefault(null);
          setIsMakePaymentOpen(true);
        }}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-10">
        {/* SECTION 1: HOME DASHBOARD */}
        {mainSection === 'home' && (
          <PaymentHome
            onOpenMakePayment={(rec) => {
              setMakePaymentDefault(rec || null);
              setIsMakePaymentOpen(true);
            }}
            onNavigateSection={(sec: string) => {
              if (sec === 'history' || sec === 'payments') setMainSection('history');
              else if (sec === 'scan') setMainSection('scan');
              else if (sec === 'vault' || sec === 'budgets') setMainSection('budgets');
              else if (sec === 'investments' || sec === 'wealth') setMainSection('wealth');
              else if (sec === 'autopay') {
                setMainSection('history');
                setPaymentSubtab('autopay');
              } else if (sec === 'expenses') setMainSection('expenses');
              else if (sec === 'tax') setMainSection('tax');
              else if (sec === 'profile') setMainSection('profile');
              else if (sec === 'family') setMainSection('family');
              else setMainSection(sec as MainSectionType);
            }}
            onSelectTransaction={(id) => setSelectedTxId(id)}
          />
        )}

        {/* SECTION 2: HISTORY (PHONEPE-STYLE TRANSACTION & LOCATION HISTORY) */}
        {(mainSection === 'history' || mainSection === 'payments') && (
          <PaymentHistoryTab
            onSelectTransaction={(id) => setSelectedTxId(id)}
            onOpenMakePayment={(rec) => {
              setMakePaymentDefault(rec || null);
              setIsMakePaymentOpen(true);
            }}
          />
        )}

        {/* SECTION 2B: DEDICATED SCAN & PAY QR SCREEN */}
        {mainSection === 'scan' && (
          <ScanPayScreen
            onBackToHome={() => setMainSection('home')}
            onOpenHistory={() => setMainSection('history')}
          />
        )}

        {/* SECTION 3: EXPENSES & ANALYTICS */}
        {mainSection === 'expenses' && (
          <ExpensesAnalyticsTab />
        )}

        {/* SECTION 4: BUDGETS & LOCKED COMMITMENT VAULT */}
        {mainSection === 'budgets' && (
          <BudgetVaultTab
            onOpenMakePayment={(rec) => {
              setMakePaymentDefault(rec || null);
              setIsMakePaymentOpen(true);
            }}
          />
        )}

        {/* SECTION 5: WEALTH BUILDER (GOLD, SIPS & COMPOUND INTEREST) */}
        {mainSection === 'wealth' && (
          <InvestmentsTab />
        )}

        {/* SECTION 5B: PROFILE & SECURITY (SECTION 12) */}
        {mainSection === 'profile' && (
          <ProfileSecurityTab
            onNavigateSection={(sec) => setMainSection(sec as MainSectionType)}
            onOpenCheckBalance={() => setIsCheckBalanceOpen(true)}
          />
        )}

        {/* SECTION 6: TAXSAATHI (PERSONAL AI CA STATUTORY HUB) */}
        {mainSection === 'tax' && (
          <div className="space-y-6">
            {/* Tax Context Subtabs */}
            <div className="bg-white p-1.5 rounded-2xl border border-[#E2E8F0] shadow-xs flex space-x-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setTaxSubtab('dashboard')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  taxSubtab === 'dashboard'
                    ? 'bg-[#5F259F] text-white shadow-xs'
                    : 'text-[#718096] hover:text-[#172033] hover:bg-[#F8F9FC]'
                }`}
              >
                <Scale className="w-3.5 h-3.5 inline mr-1" />
                <span>Statutory Dashboard & Regimes</span>
              </button>
              <button
                onClick={() => setTaxSubtab('planning')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  taxSubtab === 'planning'
                    ? 'bg-[#5F259F] text-white shadow-xs'
                    : 'text-[#718096] hover:text-[#172033] hover:bg-[#F8F9FC]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                <span>Tax Saving Simulator</span>
              </button>
              <button
                onClick={() => setTaxSubtab('calendar')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  taxSubtab === 'calendar'
                    ? 'bg-[#5F259F] text-white shadow-xs'
                    : 'text-[#718096] hover:text-[#172033] hover:bg-[#F8F9FC]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 inline mr-1" />
                <span>Tax Calendar & Deadlines</span>
              </button>
              <button
                onClick={() => setTaxSubtab('audit')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  taxSubtab === 'audit'
                    ? 'bg-[#5F259F] text-white shadow-xs'
                    : 'text-[#718096] hover:text-[#172033] hover:bg-[#F8F9FC]'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                <span>Audit & Health ({unresolvedAnomalies})</span>
              </button>
              <button
                onClick={() => setTaxSubtab('docs')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  taxSubtab === 'docs'
                    ? 'bg-[#5F259F] text-white shadow-xs'
                    : 'text-[#718096] hover:text-[#172033] hover:bg-[#F8F9FC]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 inline mr-1" />
                <span>Document Intel (Form 16/AIS)</span>
              </button>
            </div>

            {taxSubtab === 'dashboard' && (
              <TaxDashboardTab
                onNavigateTab={(tab) => setTaxSubtab(tab as any)}
                onOpenVoiceCa={() => setIsVoiceCaOpen(true)}
                onSelectTransaction={(id) => setSelectedTxId(id)}
              />
            )}

            {taxSubtab === 'planning' && (
              <TaxPlanningTab />
            )}

            {taxSubtab === 'calendar' && (
              <TaxCalendarTab />
            )}

            {taxSubtab === 'audit' && (
              <AuditHealthTab
                onSelectTransaction={(id) => setSelectedTxId(id)}
              />
            )}

            {taxSubtab === 'docs' && (
              <DocumentIntelligenceTab />
            )}
          </div>
        )}

        {/* SECTION 7: AI CA ASSISTANT (CONVERSATIONAL & VOICE) */}
        {mainSection === 'ai-assistant' && (
          <TaxAiChatTab
            onNavigateTab={(tab) => {
              setMainSection('tax');
              setTaxSubtab(tab as any);
            }}
            onOpenReport={() => setIsReportOpen(true)}
          />
        )}

        {/* SECTION 8: FAMILY PROFILES (FAMILY BUDGET MODE) */}
        {mainSection === 'family' && (
          <FamilyProfilesTab />
        )}
      </main>

      {/* Modals */}
      {isMakePaymentOpen && (
        <MakePaymentModal
          isOpen={isMakePaymentOpen}
          onClose={() => setIsMakePaymentOpen(false)}
          defaultData={makePaymentDefault}
        />
      )}

      {isVoiceCaOpen && (
        <VoiceCaModal
          isOpen={isVoiceCaOpen}
          onClose={() => setIsVoiceCaOpen(false)}
        />
      )}

      {selectedTxId && (
        <PaymentDetailModal
          transactionId={selectedTxId}
          onClose={() => setSelectedTxId(null)}
        />
      )}

      {isReportOpen && (
        <ReportExportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
        />
      )}

      {/* PhonePe / Google Pay Style 4-Digit UPI PIN Check Balance Modal */}
      <CheckBalanceModal
        isOpen={isCheckBalanceOpen}
        onClose={() => setIsCheckBalanceOpen(false)}
      />

      {/* P2P Borrow & Lend Ledger & Interest Calculator Modal */}
      <LoanInterestTrackerModal
        isOpen={isLoanTrackerOpen}
        onClose={() => setIsLoanTrackerOpen(false)}
        onOpenMakePayment={(rec) => {
          setMakePaymentDefault(rec || null);
          setIsMakePaymentOpen(true);
        }}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-[#21152D] border-t border-[#E8E1F2] dark:border-[#3D2854] py-6 text-center text-xs text-slate-500 dark:text-purple-200/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#172033] dark:text-white">TECHPAY</span>
            <span>+ TaxSaathi</span>
            <span>• Next-Gen Payments & AI CA Platform</span>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-400">
            Smart UPI • Real-World Geo History • Fixed Budget Lock Vault • Verified Indian Tax Engine
          </div>
        </div>
      </footer>

      {/* SECTION 5: FIXED BOTTOM NAVIGATION (MOBILE ONLY: block md:hidden) */}
      <nav
        aria-label="Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#21152D]/95 backdrop-blur-md border-t border-[#E8E1F2] dark:border-[#3D2854] shadow-[0_-4px_24px_rgba(95,37,159,0.08)] py-1.5 px-3 sm:px-6 block md:hidden transition-colors"
      >
        <div className="max-w-md sm:max-w-lg mx-auto flex items-center justify-between">
          {/* 1. Home */}
          <button
            type="button"
            onClick={() => setMainSection('home')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-150 ${
              mainSection === 'home'
                ? 'text-[#5F259F] dark:text-purple-300 font-black'
                : 'text-slate-500 dark:text-purple-200/70 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                mainSection === 'home'
                  ? 'bg-[#F0EAF8] dark:bg-purple-900/60 text-[#5F259F] dark:text-purple-300 shadow-xs'
                  : 'text-slate-500 dark:text-purple-200/70'
              }`}
            >
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">Home</span>
          </button>

          {/* 2. History */}
          <button
            type="button"
            onClick={() => setMainSection('history')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-150 ${
              mainSection === 'history' || mainSection === 'payments'
                ? 'text-[#5F259F] dark:text-purple-300 font-black'
                : 'text-slate-500 dark:text-purple-200/70 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                mainSection === 'history' || mainSection === 'payments'
                  ? 'bg-[#F0EAF8] dark:bg-purple-900/60 text-[#5F259F] dark:text-purple-300 shadow-xs'
                  : 'text-slate-500 dark:text-purple-200/70'
              }`}
            >
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">History</span>
          </button>

          {/* 3. SCAN (Centre Visually Prominent Elevated Button) */}
          <button
            type="button"
            onClick={() => setMainSection('scan')}
            className="flex flex-col items-center justify-center -mt-6 group focus:outline-none"
          >
            <div
              className={`w-14 h-14 rounded-full bg-gradient-to-tr from-[#38146B] to-[#5F259F] text-white flex items-center justify-center shadow-lg shadow-[#5F259F]/40 border-4 border-white dark:border-[#21152D] group-hover:scale-105 active:scale-95 transition-all ${
                mainSection === 'scan' ? 'ring-2 ring-[#5F259F]' : ''
              }`}
            >
              <QrCode className="w-7 h-7" />
            </div>
            <span className={`text-[11px] font-black mt-1 ${
              mainSection === 'scan' ? 'text-[#5F259F] dark:text-purple-300' : 'text-slate-600 dark:text-purple-200/80'
            }`}>
              Scan
            </span>
          </button>

          {/* 4. Wealth */}
          <button
            type="button"
            onClick={() => setMainSection('wealth')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-150 ${
              mainSection === 'wealth'
                ? 'text-[#5F259F] dark:text-purple-300 font-black'
                : 'text-slate-500 dark:text-purple-200/70 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                mainSection === 'wealth'
                  ? 'bg-[#F0EAF8] dark:bg-purple-900/60 text-[#5F259F] dark:text-purple-300 shadow-xs'
                  : 'text-slate-500 dark:text-purple-200/70'
              }`}
            >
              <Coins className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">Wealth</span>
          </button>

          {/* 5. Profile */}
          <button
            type="button"
            onClick={() => setMainSection('profile')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-150 ${
              mainSection === 'profile'
                ? 'text-[#5F259F] dark:text-purple-300 font-black'
                : 'text-slate-500 dark:text-purple-200/70 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                mainSection === 'profile'
                  ? 'bg-[#F0EAF8] dark:bg-purple-900/60 text-[#5F259F] dark:text-purple-300 shadow-xs'
                  : 'text-slate-500 dark:text-purple-200/70'
              }`}
            >
              <User className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

