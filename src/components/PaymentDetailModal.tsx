import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  MapPin,
  ShieldCheck,
  Sparkles,
  BookOpen,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Trash2,
  Copy,
  Receipt
} from 'lucide-react';

interface PaymentDetailModalProps {
  transactionId: string | null;
  onClose: () => void;
}

export const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({
  transactionId,
  onClose
}) => {
  const { transactions, deleteTransaction } = useApp();

  const tx = transactions.find(t => t.id === transactionId);
  if (!tx) return null;

  const isCredit = tx.type === 'CREDIT';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold ${
              isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
            }`}>
              {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Payment & Tax Receipt</h3>
              <p className="text-[11px] text-slate-500 font-mono">{tx.upiRefId}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Amount Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isCredit ? 'Amount Received' : 'Amount Paid'}
            </span>
            <div className={`text-3xl font-black mt-1 ${isCredit ? 'text-emerald-600' : 'text-slate-900'}`}>
              {isCredit ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
            </div>
            <div className="text-xs font-bold text-slate-700 mt-1">{tx.recipientName || tx.description}</div>
            <div className="text-[11px] text-slate-400 font-mono">{tx.date} at {tx.time}</div>
          </div>

          {/* REAL WORLD LOCATION HISTORY */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>Location History</span>
              </span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded text-indigo-800 font-bold border border-indigo-200">
                GPS Verified
              </span>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-slate-900 text-sm">{tx.location.shopName}</div>
              <div className="text-xs text-slate-600">{tx.location.street}, {tx.location.city}, {tx.location.state}</div>
              {tx.location.landmark && (
                <div className="text-[11px] text-slate-500">Landmark: {tx.location.landmark}</div>
              )}
            </div>

            <div className="pt-2 border-t border-indigo-100 flex items-center justify-between text-[11px] font-mono text-slate-600">
              <span>Coordinates: {tx.location.latitude.toFixed(4)}° N, {tx.location.longitude.toFixed(4)}° E</span>
              <span className="text-indigo-600 font-bold">{tx.location.category}</span>
            </div>
          </div>

          {/* FIXED BUDGET STATUS */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-slate-600 font-semibold">Budget Category:</span>
            <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
              tx.isFixedCommitment
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-slate-200 text-slate-800'
            }`}>
              {tx.isFixedCommitment ? '🔒 Locked Fixed Commitment Vault' : 'Flexible Discretionary Spend'}
            </span>
          </div>

          {/* AI CA TAX INTELLIGENCE */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-emerald-950 text-xs">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI CA Tax Implication</span>
              </span>
              <span className="font-bold px-2 py-0.5 rounded text-[10px] bg-emerald-200 text-emerald-900">
                {tx.classification.deductionSection || tx.classification.status}
              </span>
            </div>

            <p className="text-emerald-950 leading-relaxed text-xs">
              {tx.classification.aiExplanation}
            </p>

            <div className="pt-2 border-t border-emerald-200/80 text-[10px] text-emerald-800 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>Legal Basis: {tx.classification.legalBasis}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button
            onClick={() => {
              deleteTransaction(tx.id);
              onClose();
            }}
            className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
