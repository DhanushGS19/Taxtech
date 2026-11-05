import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  MapPin,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Navigation,
  QrCode,
  Smartphone,
  Building2,
  Send,
  ArrowRightLeft,
  Calendar,
  Layers,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';

interface PaymentsTabProps {
  onOpenMakePayment: (defaultRecipient?: any) => void;
  onSelectTransaction: (txId: string) => void;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({
  onOpenMakePayment,
  onSelectTransaction
}) => {
  const { transactions, formatPrivateAmount } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'SENT' | 'RECEIVED' | 'BILLS' | 'BANK'>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'LIST' | 'LOCATION_MAP'>('LIST');

  // Compute monthly summary
  let totalSent = 0;
  let totalReceived = 0;
  transactions.forEach(tx => {
    if (tx.isDuplicate) return;
    if (tx.type === 'CREDIT') totalReceived += tx.amount;
    else totalSent += tx.amount;
  });

  // Unique cities from locations
  const cities = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach(t => {
      if (t.location?.city) set.add(t.location.city);
    });
    return Array.from(set);
  }, [transactions]);

  // Filter transactions
  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      // Search
      const q = searchQuery.toLowerCase();
      const matchSearch =
        tx.description.toLowerCase().includes(q) ||
        tx.recipientName.toLowerCase().includes(q) ||
        tx.location?.shopName.toLowerCase().includes(q) ||
        tx.location?.street.toLowerCase().includes(q) ||
        tx.location?.city.toLowerCase().includes(q);

      if (!matchSearch) return false;

      // City
      if (selectedCity !== 'ALL' && tx.location?.city !== selectedCity) return false;

      // Filter Pill
      if (selectedFilter === 'SENT') return tx.type === 'DEBIT';
      if (selectedFilter === 'RECEIVED') return tx.type === 'CREDIT';
      if (selectedFilter === 'BILLS') return ['UTILITY', 'RENT', 'HEALTH'].includes(tx.category || '');
      if (selectedFilter === 'BANK') return tx.paymentMethod === 'NET_BANKING' || tx.recipientUpiId.includes('bank');

      return true;
    });
  }, [transactions, searchQuery, selectedCity, selectedFilter]);

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* 1. TOP PAYMENT LAUNCHER BAR (Most Prominent Feature) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              UPI Payments & Money Transfers
            </h2>
            <p className="text-xs text-slate-500">
              Instant 24x7 UPI 2.0 transfers with Google Places merchant verification
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0EAF8] text-[#5F259F] text-xs font-bold border border-[#5F259F]/20 self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16A36A]" />
            <span>NPCI Certified Gateway</span>
          </div>
        </div>

        {/* 5 Quick Action Buttons in Royal Purple */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <button
            onClick={() => onOpenMakePayment()}
            className="p-3.5 rounded-2xl bg-gradient-to-tr from-[#38146B] to-[#5F259F] text-white shadow-md hover:shadow-lg transition-all text-center flex flex-col items-center justify-center group active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div className="font-extrabold text-xs">Scan Any QR</div>
            <div className="text-[10px] text-purple-200">Camera / Gallery</div>
          </button>

          <button
            onClick={() => onOpenMakePayment({ name: 'Mobile Contact', upiId: 'contact@okhdfcbank' })}
            className="p-3.5 rounded-2xl bg-[#F7F6FA] hover:bg-white border border-slate-200 hover:border-[#5F259F] transition-all text-center flex flex-col items-center justify-center group active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F0EAF8] text-[#5F259F] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-slate-900">To Mobile</div>
            <div className="text-[10px] text-slate-500">Phone Contacts</div>
          </button>

          <button
            onClick={() => onOpenMakePayment({ name: 'Bank Transfer', upiId: 'bank.transfer@hdfcbank' })}
            className="p-3.5 rounded-2xl bg-[#F7F6FA] hover:bg-white border border-slate-200 hover:border-[#5F259F] transition-all text-center flex flex-col items-center justify-center group active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F0EAF8] text-[#5F259F] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-slate-900">To Bank A/c</div>
            <div className="text-[10px] text-slate-500">A/c & IFSC Code</div>
          </button>

          <button
            onClick={() => onOpenMakePayment()}
            className="p-3.5 rounded-2xl bg-[#F7F6FA] hover:bg-white border border-slate-200 hover:border-[#5F259F] transition-all text-center flex flex-col items-center justify-center group active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F0EAF8] text-[#5F259F] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Send className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-slate-900">To UPI ID</div>
            <div className="text-[10px] text-slate-500">VPA Transfer</div>
          </button>

          <button
            onClick={() => onOpenMakePayment({ name: 'Self Savings Transfer', upiId: 'self@icici' })}
            className="p-3.5 rounded-2xl bg-[#F7F6FA] hover:bg-white border border-slate-200 hover:border-[#5F259F] transition-all text-center flex flex-col items-center justify-center group active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F0EAF8] text-[#5F259F] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-slate-900">Self Transfer</div>
            <div className="text-[10px] text-slate-500">Between Accounts</div>
          </button>
        </div>
      </div>

      {/* 2. MONTHLY SUMMARY KPI TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Money Sent</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{formatPrivateAmount(totalSent)}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Payments & Debits</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Money Received</span>
            <div className="text-2xl font-black text-[#16A36A] mt-1">{formatPrivateAmount(totalReceived)}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Salary & Inward Credits</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A36A] flex items-center justify-center">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Net Monthly Balance</span>
            <div className="text-2xl font-black text-[#38146B] mt-1">{formatPrivateAmount(totalReceived - totalSent)}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Net Inflow Margin</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#F0EAF8] text-[#5F259F] flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. TRANSACTION HISTORY & LOCATION INTELLIGENCE */}
      <div className="space-y-4">
        {/* Header with List / Map View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>Transaction & Location History</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F0EAF8] text-[#5F259F] font-bold">
                {filtered.length} Records
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Search by shop name, street, merchant, or location with tax tags
            </p>
          </div>

          <div className="p-1 bg-slate-200/80 rounded-2xl flex items-center shadow-inner self-start sm:self-auto">
            <button
              onClick={() => setViewMode('LIST')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'LIST'
                  ? 'bg-white text-[#38146B] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('LOCATION_MAP')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'LOCATION_MAP'
                  ? 'bg-[#5F259F] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Location Map View</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by shop name, street, merchant name, or location..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5F259F]/20 focus:border-[#5F259F]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
              >
                <option value="ALL">All Cities & Regions</option>
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 5 Transaction Type Filter Pills (PhonePe Standard) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-xs font-bold">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedFilter === 'ALL'
                  ? 'bg-[#5F259F] text-white shadow-sm'
                  : 'bg-[#F7F6FA] text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Transactions
            </button>
            <button
              onClick={() => setSelectedFilter('SENT')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedFilter === 'SENT'
                  ? 'bg-[#5F259F] text-white shadow-sm'
                  : 'bg-[#F7F6FA] text-slate-600 hover:bg-slate-200'
              }`}
            >
              Money Sent (Debits)
            </button>
            <button
              onClick={() => setSelectedFilter('RECEIVED')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedFilter === 'RECEIVED'
                  ? 'bg-[#5F259F] text-white shadow-sm'
                  : 'bg-[#F7F6FA] text-slate-600 hover:bg-slate-200'
              }`}
            >
              Money Received (Credits)
            </button>
            <button
              onClick={() => setSelectedFilter('BILLS')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedFilter === 'BILLS'
                  ? 'bg-[#5F259F] text-white shadow-sm'
                  : 'bg-[#F7F6FA] text-slate-600 hover:bg-slate-200'
              }`}
            >
              Bill Payments
            </button>
            <button
              onClick={() => setSelectedFilter('BANK')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedFilter === 'BANK'
                  ? 'bg-[#5F259F] text-white shadow-sm'
                  : 'bg-[#F7F6FA] text-slate-600 hover:bg-slate-200'
              }`}
            >
              Bank Transfers
            </button>
          </div>
        </div>

        {/* VIEW 1: INTERACTIVE LOCATION MAP VIEW */}
        {viewMode === 'LOCATION_MAP' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[#38146B] via-[#5F259F] to-[#7A38BE] text-white p-6 rounded-3xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-extrabold">Google Places Real-World Location Intelligence</h4>
                  <p className="text-xs text-purple-200 mt-0.5">
                    Every UPI merchant is geo-tagged with exact street address, GPS coordinates, and Indian tax categorization.
                  </p>
                </div>
                <Navigation className="w-8 h-8 text-purple-300 hidden sm:block" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(tx => (
                <div
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx.id)}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#5F259F] transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#F0EAF8] text-[#5F259F] flex items-center justify-center font-bold text-sm shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{tx.location.shopName}</h4>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {tx.location.street}, {tx.location.city}
                        </div>
                        {tx.location.landmark && (
                          <div className="text-[10px] text-slate-400">Landmark: {tx.location.landmark}</div>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`text-sm font-black ${tx.type === 'CREDIT' ? 'text-[#16A36A]' : 'text-slate-900'}`}>
                        {tx.type === 'CREDIT' ? '+' : '-'}{formatPrivateAmount(tx.amount)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{tx.date}</div>
                    </div>
                  </div>

                  {/* Simulated Mini Map Banner with Coordinates */}
                  <div className="p-2.5 rounded-xl bg-[#F7F6FA] border border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#16A36A]"></span>
                      <span>GPS: {tx.location.latitude.toFixed(4)}° N, {tx.location.longitude.toFixed(4)}° E</span>
                    </div>
                    <span className="text-[#5F259F] font-bold">{tx.location.city}</span>
                  </div>

                  {/* Indian Tax Treatment */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 text-[11px]">Tax Implication:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                      {tx.classification.deductionSection || tx.classification.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: STANDARD TRANSACTION LIST (PhonePe Style) */}
        {viewMode === 'LIST' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {filtered.map(tx => {
                const isCredit = tx.type === 'CREDIT';
                return (
                  <div
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx.id)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#F7F6FA] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        isCredit ? 'bg-emerald-50 text-[#16A36A]' : 'bg-[#F0EAF8] text-[#5F259F]'
                      }`}>
                        {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {tx.recipientName || tx.description}
                        </div>

                        {/* Location Badge */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-[#5F259F] shrink-0" />
                          <span className="font-medium text-slate-700 truncate">{tx.location.shopName}</span>
                          <span className="text-slate-400">• {tx.location.city}</span>
                          <span className="text-slate-400 font-mono">• {tx.time}</span>
                        </div>

                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                          Ref: {tx.upiRefId}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`text-xs sm:text-sm font-black ${isCredit ? 'text-[#16A36A]' : 'text-slate-900'}`}>
                        {isCredit ? '+' : '-'}{formatPrivateAmount(tx.amount)}
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          tx.classification.status === 'TAX_DEDUCTIBLE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tx.classification.status === 'TAXABLE'
                            ? 'bg-rose-100 text-rose-800'
                            : tx.classification.status === 'PARTIALLY_TAXABLE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {tx.classification.deductionSection || tx.classification.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

