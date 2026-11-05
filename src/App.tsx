import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderNav } from './components/HeaderNav';
import { PaymentHome } from './components/techpay/PaymentHome';
import { PaymentHistoryTab } from './components/techpay/PaymentHistoryTab';
import { BudgetVaultTab } from './components/techpay/BudgetVaultTab';
import { InvestmentsTab } from './components/techpay/InvestmentsTab';
import { AutoPayTab } from './components/techpay/AutoPayTab';
import { MakePaymentModal } from './components/techpay/MakePaymentModal';

import { TaxDashboardTab } from './components/tax/TaxDashboardTab';
import { TaxAiChatTab } from './components/tax/TaxAiChatTab';
import { TaxPlanningTab } from './components/tax/TaxPlanningTab';
import { TaxCalendarTab } from './components/tax/TaxCalendarTab';
import { AuditHealthTab } from './components/tax/AuditHealthTab';
import { DocumentIntelligenceTab } from './components/tax/DocumentIntelligenceTab';

import { VoiceCaModal } from './components/VoiceCaModal';
import { PaymentDetailModal } from './components/PaymentDetailModal';
import { ReportExportModal } from './components/ReportExportModal';

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
  FileText
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeFace, setActiveFace, anomalies } = useApp();

  const [techpaySubtab, setTechpaySubtab] = useState<string>('home');
  const [taxSubtab, setTaxSubtab] = useState<string>('dashboard');

  const [isMakePaymentOpen, setIsMakePaymentOpen] = useState(false);
  const [makePaymentDefault, setMakePaymentDefault] = useState<any>(null);
  const [isVoiceCaOpen, setIsVoiceCaOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  const unresolvedAnomalies = anomalies.filter(a => !a.resolved).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <HeaderNav
        onOpenVoiceCa={() => setIsVoiceCaOpen(true)}
        onOpenMakePayment={() => {
          setMakePaymentDefault(null);
          setIsMakePaymentOpen(true);
        }}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Subtab Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 sm:space-x-4 overflow-x-auto no-scrollbar py-2">
            {activeFace === 'TECHPAY' ? (
              <>
                <button
                  onClick={() => setTechpaySubtab('home')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    techpaySubtab === 'home'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Payments & Balance</span>
                </button>

                <button
                  onClick={() => setTechpaySubtab('vault')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    techpaySubtab === 'vault'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Fixed Budget & Locked Vault</span>
                </button>

                <button
                  onClick={() => setTechpaySubtab('history')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    techpaySubtab === 'history'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Location & Spends History</span>
                </button>

                <button
                  onClick={() => setTechpaySubtab('investments')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    techpaySubtab === 'investments'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  <span>24K Gold & SIPs</span>
                </button>

                <button
                  onClick={() => setTechpaySubtab('autopay')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    techpaySubtab === 'autopay'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Receipt className="w-4 h-4" />
                  <span>AutoPay Mandates</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setTaxSubtab('dashboard')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    taxSubtab === 'dashboard'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                  <span>Tax Dashboard & Regimes</span>
                </button>

                <button
                  onClick={() => setTaxSubtab('chat')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    taxSubtab === 'chat'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>AI CA Vikram (Chat & Voice)</span>
                </button>

                <button
                  onClick={() => setTaxSubtab('planning')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    taxSubtab === 'planning'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Tax Saving Simulator</span>
                </button>

                <button
                  onClick={() => setTaxSubtab('calendar')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    taxSubtab === 'calendar'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Tax Calendar & Deadlines</span>
                </button>

                <button
                  onClick={() => setTaxSubtab('audit')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    taxSubtab === 'audit'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Audit & Health ({unresolvedAnomalies})</span>
                </button>

                <button
                  onClick={() => setTaxSubtab('docs')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    taxSubtab === 'docs'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Document Intel (Form 16/AIS)</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* FACE 1: TECHPAY (DOMINANT FACE) */}
        {activeFace === 'TECHPAY' && (
          <>
            {techpaySubtab === 'home' && (
              <PaymentHome
                onOpenMakePayment={(rec) => {
                  setMakePaymentDefault(rec || null);
                  setIsMakePaymentOpen(true);
                }}
                onNavigateSubtab={(sub) => setTechpaySubtab(sub)}
                onSelectTransaction={(id) => setSelectedTxId(id)}
              />
            )}

            {techpaySubtab === 'history' && (
              <PaymentHistoryTab
                onSelectTransaction={(id) => setSelectedTxId(id)}
              />
            )}

            {techpaySubtab === 'vault' && (
              <BudgetVaultTab
                onOpenMakePayment={(rec) => {
                  setMakePaymentDefault(rec || null);
                  setIsMakePaymentOpen(true);
                }}
              />
            )}

            {techpaySubtab === 'investments' && (
              <InvestmentsTab />
            )}

            {techpaySubtab === 'autopay' && (
              <AutoPayTab />
            )}
          </>
        )}

        {/* FACE 2: TAXSAATHI (SECOND FACE) */}
        {activeFace === 'TAXSAATHI' && (
          <>
            {taxSubtab === 'dashboard' && (
              <TaxDashboardTab
                onNavigateTab={(tab) => setTaxSubtab(tab)}
                onOpenVoiceCa={() => setIsVoiceCaOpen(true)}
                onSelectTransaction={(id) => setSelectedTxId(id)}
              />
            )}

            {taxSubtab === 'chat' && (
              <TaxAiChatTab
                onNavigateTab={(tab) => setTaxSubtab(tab)}
                onOpenReport={() => setIsReportOpen(true)}
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
          </>
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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">TECHPAY</span>
            <span>+ TaxSaathi</span>
            <span>• Next-Gen Payments & AI CA Platform</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Smart UPI • Real-World Geo History • Fixed Budget Lock Vault • Verified Indian Tax Engine
          </div>
        </div>
      </footer>
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
