import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  MapPin,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Tag,
  Clock,
  Layers
} from 'lucide-react';

interface PaymentHistoryTabProps {
  onSelectTransaction: (txId: string) => void;
}

export const PaymentHistoryTab: React.FC<PaymentHistoryTabProps> = ({
  onSelectTransaction
}) => {
  const { transactions } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'LIST' | 'LOCATION_MAP'>('LIST');

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
      const q = searchQuery.toLowerCase();
      const matchSearch =
        tx.description.toLowerCase().includes(q) ||
        tx.recipientName.toLowerCase().includes(q) ||
        tx.location?.shopName.toLowerCase().includes(q) ||
        tx.location?.street.toLowerCase().includes(q) ||
        tx.location?.city.toLowerCase().includes(q);

      if (!matchSearch) return false;
      if (selectedCity !== 'ALL' && tx.location?.city !== selectedCity) return false;

      return true;
    });
  }, [transactions, searchQuery, selectedCity]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>Payment & Location History</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
              {transactions.length} payments
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-world geo-tagged location history for every payment with automated Indian tax implications.
          </p>
        </div>

        {/* List vs Location Map View Toggle */}
        <div className="p-1 bg-slate-100 rounded-2xl flex items-center shadow-inner self-start sm:self-auto">
          <button
            onClick={() => setViewMode('LIST')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'LIST'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('LOCATION_MAP')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'LOCATION_MAP'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Location Map View</span>
          </button>
        </div>
      </div>

      {/* Search & City Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by shop name, street, merchant, or location..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
            >
              <option value="ALL">All Locations / Cities</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* VIEW 1: LOCATION MAP / GEO PIN VIEW */}
      {viewMode === 'LOCATION_MAP' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-5 rounded-3xl shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                <Navigation className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Geo-Tagged Payment Map Pins</h3>
                <p className="text-xs text-slate-300">
                  Every merchant visit and location where payments were processed
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold hidden sm:inline">
              Active GPS Accuracy: ±5m
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(tx => (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx.id)}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
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
                    <div className={`text-sm font-black ${tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{tx.date}</div>
                  </div>
                </div>

                {/* Simulated Mini Map Banner with Coordinates */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>GPS: {tx.location.latitude.toFixed(4)}° N, {tx.location.longitude.toFixed(4)}° E</span>
                  </div>
                  <span className="text-indigo-600 font-bold">{tx.location.city}</span>
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

      {/* VIEW 2: STANDARD TRANSACTION LIST */}
      {viewMode === 'LIST' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filtered.map(tx => {
              const isCredit = tx.type === 'CREDIT';
              return (
                <div
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx.id)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {tx.recipientName || tx.description}
                      </div>

                      {/* Location Badge */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span className="font-medium text-slate-700 truncate">{tx.location.shopName}</span>
                        <span className="text-slate-400">• {tx.location.city}</span>
                        <span className="text-slate-400 font-mono">• {tx.time}</span>
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                        {tx.upiRefId}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`text-xs sm:text-sm font-black ${isCredit ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {isCredit ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
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
  );
};
