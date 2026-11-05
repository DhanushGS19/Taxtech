import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AutoPayMandate } from '../../types/tax';
import {
  Receipt,
  Plus,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const AutoPayTab: React.FC = () => {
  const { autoPayMandates, toggleAutoPay, addAutoPay } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMerchant, setNewMerchant] = useState('');
  const [newUpiId, setNewUpiId] = useState('');
  const [newAmount, setNewAmount] = useState('1000');
  const [newCategory, setNewCategory] = useState<'INVESTMENT' | 'UTILITY' | 'ENTERTAINMENT' | 'LOAN'>('UTILITY');
  const [newDate, setNewDate] = useState('2024-11-25');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMandate: AutoPayMandate = {
      id: `auto-${Date.now()}`,
      title: newTitle,
      merchant: newMerchant || newTitle,
      upiId: newUpiId || 'merchant@upi',
      amount: parseFloat(newAmount) || 0,
      frequency: 'MONTHLY',
      nextDebitDate: newDate,
      status: 'ACTIVE',
      category: newCategory,
      taxDeductible: newCategory === 'INVESTMENT' || newCategory === 'LOAN',
      taxSection: newCategory === 'INVESTMENT' ? 'Sec 80C' : undefined
    };

    addAutoPay(newMandate);
    setIsAddOpen(false);
    setNewTitle('');
    setNewMerchant('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-600" />
            <span>AutoPay & Recurring Mandates</span>
          </h2>
          <p className="text-xs text-slate-500">
            Set up and manage automated monthly debits for SIPs, utility bills, and subscriptions with NPCI e-Mandate protection.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New AutoPay Mandate</span>
        </button>
      </div>

      {/* AutoPay Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {autoPayMandates.map(m => {
          const isActive = m.status === 'ACTIVE';
          return (
            <div
              key={m.id}
              className={`p-6 rounded-3xl border transition-all ${
                isActive
                  ? 'bg-white border-slate-200 shadow-sm hover:border-indigo-300'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {m.status}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                      {m.frequency}
                    </span>
                    {m.taxDeductible && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        Tax Saver {m.taxSection}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-2">{m.title}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">{m.merchant}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{m.upiId}</div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-slate-900">
                    ₹{m.amount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400">per month</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Next debit: <strong>{m.nextDebitDate}</strong></span>
                </div>

                <button
                  onClick={() => toggleAutoPay(m.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                    isActive
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Pause className="w-3 h-3" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Resume</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add AutoPay Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Set Up New UPI AutoPay Mandate</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Mandate Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Spotify Family, Tata Sky DTH, SIP"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Merchant UPI ID *</label>
                <input
                  type="text"
                  required
                  value={newUpiId}
                  onChange={(e) => setNewUpiId(e.target.value)}
                  placeholder="spotify.autopay@icici"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Monthly Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Next Debit Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md mt-2"
              >
                Authorize NPCI e-Mandate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
