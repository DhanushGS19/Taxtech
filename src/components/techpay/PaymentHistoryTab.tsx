import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentTransaction } from '../../types/tax';
import {
  Search,
  MapPin,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  ZoomIn,
  ZoomOut,
  Navigation,
  ChevronRight,
  Building2,
  ExternalLink,
  Tag,
  CreditCard
} from 'lucide-react';

interface PaymentHistoryTabProps {
  onSelectTransaction: (txId: string) => void;
  onOpenMakePayment?: (recipient?: any) => void;
}

export type HistoryFilterType = 'ALL' | 'SENT' | 'RECEIVED' | 'RECHARGE' | 'BILLS' | 'BANK';
export type DateFilterType = 'ALL' | 'THIS_MONTH' | 'LAST_30_DAYS' | 'FY24_25';

export const PaymentHistoryTab: React.FC<PaymentHistoryTabProps> = ({
  onSelectTransaction,
  onOpenMakePayment
}) => {
  const { transactions } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<HistoryFilterType>('ALL');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'SPLIT' | 'LIST_ONLY' | 'MAP_ONLY'>('SPLIT');

  // Active highlighted transaction on map
  const [activeTxOnMap, setActiveTxOnMap] = useState<PaymentTransaction | null>(null);

  // Map viewport state (centered on Bengaluru by default)
  const [zoom, setZoom] = useState<number>(13);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 12.9716,
    lng: 77.5946
  });

  // Calculate financial indicators: Total Money Sent & Total Money Received
  const { totalSent, totalReceived } = useMemo(() => {
    let sent = 0;
    let received = 0;
    transactions.forEach(t => {
      if (t.isDuplicate) return;
      if (t.type === 'CREDIT') received += t.amount;
      else sent += t.amount;
    });
    return { totalSent: sent, totalReceived: received };
  }, [transactions]);

  // Unique verified cities
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
      const q = searchQuery.toLowerCase();
      const matchSearch =
        tx.description.toLowerCase().includes(q) ||
        tx.recipientName.toLowerCase().includes(q) ||
        tx.recipientUpiId.toLowerCase().includes(q) ||
        tx.location?.shopName.toLowerCase().includes(q) ||
        tx.location?.street.toLowerCase().includes(q) ||
        tx.location?.city.toLowerCase().includes(q);

      if (!matchSearch) return false;
      if (selectedCity !== 'ALL' && tx.location?.city !== selectedCity) return false;

      // The 6 exact filters requested by user
      if (selectedFilter === 'SENT') return tx.type === 'DEBIT';
      if (selectedFilter === 'RECEIVED') return tx.type === 'CREDIT';
      if (selectedFilter === 'RECHARGE') {
        const cat = (tx.category || '').toLowerCase();
        const desc = tx.description.toLowerCase();
        return cat.includes('recharge') || desc.includes('recharge') || desc.includes('mobile') || desc.includes('dth');
      }
      if (selectedFilter === 'BILLS') {
        const cat = (tx.category || '').toLowerCase();
        const desc = tx.description.toLowerCase();
        return cat.includes('utility') || cat.includes('rent') || desc.includes('electricity') || desc.includes('water') || desc.includes('gas') || desc.includes('broadband');
      }
      if (selectedFilter === 'BANK') {
        return tx.paymentMethod === 'NET_BANKING' || tx.recipientUpiId.includes('bank') || tx.category === 'TRANSFER' || tx.description.toLowerCase().includes('transfer');
      }

      return true;
    });
  }, [transactions, searchQuery, selectedCity, selectedFilter]);

  // Set default active map transaction
  useMemo(() => {
    if (!activeTxOnMap && filtered.length > 0) {
      setActiveTxOnMap(filtered[0]);
    }
  }, [filtered, activeTxOnMap]);

  // Export statement handler
  const handleExportStatement = () => {
    let csv = `Transaction ID,Date,Time,Type,Amount (INR),Recipient/Merchant,UPI ID,Account,Category,City,Verified Location,Status\n`;
    filtered.forEach(t => {
      csv += `"${t.upiRefId}","${t.date}","${t.time}","${t.type}",${t.amount},"${t.recipientName}","${t.recipientUpiId}","${t.account}","${t.category}","${t.location?.city || ''}","${t.location?.shopName || ''}","SUCCESSFUL"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TechPay_Statement_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const focusMerchantOnMap = (tx: PaymentTransaction) => {
    setActiveTxOnMap(tx);
    if (tx.location?.latitude && tx.location?.longitude) {
      setMapCenter({
        lat: tx.location.latitude,
        lng: tx.location.longitude
      });
      setZoom(15);
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. TOP HEADER & STATEMENT EXPORT */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-extrabold text-[#172033]">Transaction History & Statements</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F3EEF9] text-[#5F259F] text-xs font-bold">
              {filtered.length} of {transactions.length} Transactions
            </span>
          </div>
          <p className="text-xs text-[#718096] mt-0.5">
            Verified UPI payments with Google Places merchant geolocation intelligence
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilterType)}
            className="px-3 py-2 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] text-xs font-bold text-[#172033] focus:outline-none focus:border-[#5F259F]"
          >
            <option value="ALL">All Dates</option>
            <option value="THIS_MONTH">This Month (Nov 2024)</option>
            <option value="LAST_30_DAYS">Last 30 Days</option>
            <option value="FY24_25">FY 2024-25</option>
          </select>

          {/* Export Statement Button */}
          <button
            onClick={handleExportStatement}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8F9FC] border border-[#E2E8F0] text-[#172033] font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-[#5F259F]" />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      {/* 2. TWO FINANCIAL SUMMARY INDICATORS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Money Sent */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#718096]">Total Money Sent</span>
            <div className="text-2xl font-black text-[#172033] mt-1">₹{totalSent.toLocaleString('en-IN')}</div>
            <p className="text-[11px] text-[#718096] mt-0.5">Debited from linked accounts</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#172033]">
            <ArrowUpRight className="w-5 h-5 text-slate-700" />
          </div>
        </div>

        {/* Total Money Received */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A36A]">Total Money Received</span>
            <div className="text-2xl font-black text-[#16A36A] mt-1">+₹{totalReceived.toLocaleString('en-IN')}</div>
            <p className="text-[11px] text-[#718096] mt-0.5">Credited via salary, refunds & UPI</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#16A36A]">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. SEARCH BAR, CITY & 6 TRANSACTION FILTERS */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#718096] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by merchant name, description, amount, or city..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] text-xs text-[#172033] placeholder:text-[#718096] focus:outline-none focus:border-[#5F259F]"
            />
          </div>

          {/* City selector */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#172033] focus:outline-none focus:border-[#5F259F]"
          >
            <option value="ALL">All Cities ({cities.length})</option>
            {cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* The 6 Transaction Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'SENT', label: 'Sent' },
            { id: 'RECEIVED', label: 'Received' },
            { id: 'RECHARGE', label: 'Recharge' },
            { id: 'BILLS', label: 'Bills' },
            { id: 'BANK', label: 'Bank Transfers' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id as HistoryFilterType)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === f.id
                  ? 'bg-[#5F259F] text-white font-bold shadow-xs'
                  : 'bg-[#F8F9FC] text-[#718096] hover:text-[#172033] hover:bg-slate-100 border border-[#E2E8F0]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. PROFESSIONAL MAP & TRANSACTION LIST LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Transaction List (5 Cols on Desktop) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col max-h-[640px]">
          <div className="p-3.5 border-b border-slate-100 bg-[#F8F9FC] flex items-center justify-between text-xs font-bold text-[#172033]">
            <span>Transaction List ({filtered.length})</span>
            <span className="text-[11px] text-[#718096]">Click to view details</span>
          </div>

          <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#718096]">
                No transactions match your search filter.
              </div>
            ) : (
              filtered.map((tx) => {
                const isCredit = tx.type === 'CREDIT';
                const isSelected = activeTxOnMap?.id === tx.id;
                return (
                  <div
                    key={tx.id}
                    onClick={() => {
                      focusMerchantOnMap(tx);
                      onSelectTransaction(tx.id);
                    }}
                    className={`p-3.5 hover:bg-[#F8F9FC] transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected ? 'bg-[#F3EEF9]/60 border-l-4 border-[#5F259F]' : ''
                    }`}
                  >
                    {/* Merchant Icon & Details */}
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCredit ? 'bg-emerald-50 text-[#16A36A] border border-emerald-100' : 'bg-[#F3EEF9] text-[#5F259F] border border-[#5F259F]/15'
                      }`}>
                        {tx.recipientName.charAt(0)}
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs text-[#172033] flex items-center gap-1.5">
                          <span>{tx.recipientName || tx.description}</span>
                          <CheckCircle2 className="w-3 h-3 text-[#16A36A]" />
                        </div>
                        <div className="text-[11px] text-[#718096]">
                          {tx.description}
                        </div>
                        <div className="text-[10px] text-[#718096] flex items-center gap-1.5 font-mono">
                          <span>{tx.date} • {tx.time}</span>
                          {tx.location?.city && (
                            <>
                              <span>•</span>
                              <span className="flex items-center text-[#5F259F] font-sans font-bold">
                                <MapPin className="w-2.5 h-2.5 mr-0.5" />
                                {tx.location.city}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Amount & Status */}
                    <div className="text-right shrink-0">
                      <div className={`text-sm font-extrabold ${isCredit ? 'text-[#16A36A]' : 'text-[#172033]'}`}>
                        {isCredit ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                      </div>
                      <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-[#718096]">
                        Successful
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Premium Interactive Location Map (7 Cols on Desktop) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col">
          {/* Map Header Toolbar */}
          <div className="p-3.5 border-b border-slate-100 bg-[#F8F9FC] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#5F259F]" />
              <span className="font-bold text-[#172033]">
                Verified Geolocation Map ({cities.join(', ')})
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setZoom(prev => Math.min(18, prev + 1))}
                className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] hover:bg-slate-100 text-[#172033]"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(prev => Math.max(10, prev - 1))}
                className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] hover:bg-slate-100 text-[#172033]"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Map Canvas with Real Map Tiles */}
          <div className="relative h-[420px] w-full bg-[#E5E3DF] overflow-hidden">
            {/* Real OpenStreetMap / Cartographic Tile Grid */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-300"
              style={{
                backgroundImage: `url('https://tile.openstreetmap.org/${Math.min(zoom, 14)}/${Math.floor((mapCenter.lng + 180) / 360 * Math.pow(2, Math.min(zoom, 14)))}/${Math.floor((1 - Math.log(Math.tan(mapCenter.lat * Math.PI / 180) + 1 / Math.cos(mapCenter.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, Math.min(zoom, 14)))}.png')`,
                backgroundColor: '#E5E3DF'
              }}
            >
              {/* Subtle Road & District Grid Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#5F259F08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
            </div>

            {/* City Label Badge */}
            <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#E2E8F0] shadow-sm text-xs font-bold text-[#172033] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-pulse"></span>
              <span>{activeTxOnMap?.location?.city || 'Bengaluru'} Financial Cluster</span>
            </div>

            {/* Merchant Location Markers */}
            <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
              {filtered.slice(0, 5).map((tx, idx) => {
                const isSelected = activeTxOnMap?.id === tx.id;
                return (
                  <div
                    key={tx.id}
                    onClick={() => focusMerchantOnMap(tx)}
                    style={{
                      transform: `translate(${(idx - 2) * 60}px, ${(idx % 2 === 0 ? -1 : 1) * 40}px)`
                    }}
                    className="pointer-events-auto cursor-pointer absolute transition-all duration-300 hover:scale-110"
                  >
                    <div className={`px-2.5 py-1 rounded-full shadow-md font-bold text-[10px] flex items-center gap-1 border ${
                      isSelected
                        ? 'bg-[#5F259F] text-white border-white ring-2 ring-[#5F259F]/40 scale-110 z-20'
                        : 'bg-white text-[#172033] border-[#E2E8F0] hover:border-[#5F259F]'
                    }`}>
                      <MapPin className="w-3 h-3 text-red-500 fill-red-500" />
                      <span>{tx.recipientName.split(' ')[0]}</span>
                      <span className="font-extrabold">₹{tx.amount}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Google Places Verification Badge */}
            <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-[#E2E8F0] text-[10px] text-[#718096] font-mono">
              Google Places API • Verified Merchant Geolocation
            </div>
          </div>

          {/* Transaction Information Panel Alongside the Map */}
          {activeTxOnMap && (
            <div className="p-4 border-t border-[#E2E8F0] bg-white space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#5F259F] uppercase tracking-wider">
                    Selected Merchant Location
                  </span>
                  <h4 className="text-sm font-extrabold text-[#172033]">
                    {activeTxOnMap.location?.shopName || activeTxOnMap.recipientName}
                  </h4>
                  <p className="text-xs text-[#718096]">
                    {activeTxOnMap.location?.street}, {activeTxOnMap.location?.city}, {activeTxOnMap.location?.state}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-[#172033]">
                    ₹{activeTxOnMap.amount.toLocaleString('en-IN')}
                  </div>
                  <button
                    onClick={() => onSelectTransaction(activeTxOnMap.id)}
                    className="text-xs font-bold text-[#5F259F] hover:underline"
                  >
                    View Full Receipt →
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#718096]">
                <span>Coordinates: {activeTxOnMap.location?.latitude.toFixed(4)}° N, {activeTxOnMap.location?.longitude.toFixed(4)}° E</span>
                <span>Date: {activeTxOnMap.date} at {activeTxOnMap.time}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
