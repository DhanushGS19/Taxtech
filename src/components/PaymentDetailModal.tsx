import React, { useState } from 'react';
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
  Receipt,
  Download,
  CheckCircle2,
  Building2,
  CreditCard,
  Check
} from 'lucide-react';

interface PaymentDetailModalProps {
  transactionId: string | null;
  onClose: () => void;
  onRepeatPayment?: (data: any) => void;
}

export const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({
  transactionId,
  onClose,
  onRepeatPayment
}) => {
  const { transactions, deleteTransaction } = useApp();
  const [copiedId, setCopiedId] = useState(false);

  const tx = transactions.find(t => t.id === transactionId);
  if (!tx) return null;

  const isCredit = tx.type === 'CREDIT';

  const handleCopyId = () => {
    navigator.clipboard?.writeText(tx.upiRefId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleDownloadReceipt = () => {
    const text = `================================================
          TECHPAY OFFICIAL PAYMENT RECEIPT
================================================
Transaction ID  : ${tx.upiRefId}
UTR / Ref No    : ${tx.id.replace('tx-', 'UTR')}
Status          : SUCCESSFUL (NPCI Switch)
Date & Time     : ${tx.date} at ${tx.time}
Type            : ${isCredit ? 'CREDIT / INCOMING' : 'DEBIT / OUTGOING'}
Amount          : INR ${tx.amount.toLocaleString('en-IN')}

PARTIES:
Sender / Debited: ${tx.account || 'HDFC Bank •••• 4892'} (${tx.senderUpiId || 'user@techpay'})
Recipient       : ${tx.recipientName} (${tx.recipientUpiId})

VERIFIED LOCATION INTELLIGENCE:
Merchant Name   : ${tx.location.shopName}
Address         : ${tx.location.street}, ${tx.location.city}, ${tx.location.state}
Landmark        : ${tx.location.landmark || 'N/A'}
GPS Coordinates : ${tx.location.latitude.toFixed(4)}° N, ${tx.location.longitude.toFixed(4)}° E

TAX CLASSIFICATION:
Status          : ${tx.classification.status}
Eligible Section: ${tx.classification.deductionSection || 'N/A'}
Legal Basis     : ${tx.classification.legalBasis}
AI Explanation  : ${tx.classification.aiExplanation}
================================================
Generated via TechPay UPI 2.0 & Personal AI CA Platform
`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TechPay_Receipt_${tx.upiRefId}.txt`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${
              isCredit ? 'bg-emerald-100 text-emerald-800' : 'bg-[#F0EAF8] text-[#5F259F]'
            }`}>
              {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Transaction Details</h3>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                <span>{tx.upiRefId}</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  title="Copy Transaction ID"
                  className="hover:text-slate-800"
                >
                  {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
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
          {/* Main Hero Card */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Payment Successful • NPCI Settled</span>
            </div>
            <div className={`text-3xl font-black mt-2 ${isCredit ? 'text-[#16A36A]' : 'text-slate-900'}`}>
              {isCredit ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
            </div>
            <div className="text-sm font-bold text-slate-800">{tx.recipientName || tx.description}</div>
            <div className="text-[11px] text-slate-500 font-mono">{tx.date} at {tx.time}</div>
          </div>

          {/* Payment Method Details */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-xs">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#5F259F]" />
              <span>Payment Method & Accounts</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-slate-400 block">Debited From:</span>
                <span className="font-bold text-slate-900">{tx.account || 'HDFC Bank •••• 4892'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Recipient UPI ID:</span>
                <span className="font-mono font-bold text-slate-900 truncate block">{tx.recipientUpiId}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Mode:</span>
                <span className="font-semibold text-slate-800">{tx.paymentMethod}</span>
              </div>
              <div>
                <span className="text-slate-400 block">UTR Reference:</span>
                <span className="font-mono text-slate-800">{tx.id.replace('tx-', '4310')}</span>
              </div>
            </div>
          </div>

          {/* Real-World Google Places Location History */}
          <div className="p-4 rounded-2xl bg-[#F0EAF8] border border-[#5F259F]/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#5F259F] flex items-center gap-1.5 text-xs">
                <MapPin className="w-4 h-4 text-[#5F259F]" />
                <span>Verified Merchant & Location</span>
              </span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-[#5F259F] font-bold border border-[#5F259F]/20">
                GPS Verified
              </span>
            </div>

            <div className="space-y-0.5">
              <div className="font-extrabold text-slate-900 text-sm">{tx.location.shopName}</div>
              <div className="text-xs text-slate-600">{tx.location.street}, {tx.location.city}, {tx.location.state}</div>
              {tx.location.landmark && (
                <div className="text-[11px] text-slate-500">Landmark: {tx.location.landmark}</div>
              )}
            </div>

            <div className="pt-2 border-t border-[#5F259F]/10 flex items-center justify-between text-[11px] font-mono text-slate-600">
              <span>{tx.location.latitude.toFixed(4)}° N, {tx.location.longitude.toFixed(4)}° E</span>
              <span className="text-[#5F259F] font-bold">{tx.location.category}</span>
            </div>
          </div>

          {/* AI CA Tax Intelligence */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-emerald-950 text-xs">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI CA Tax Implication</span>
              </span>
              <span className="font-bold px-2 py-0.5 rounded-full text-[10px] bg-emerald-200 text-emerald-900">
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

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 gap-2">
          <button
            onClick={() => {
              deleteTransaction(tx.id);
              onClose();
            }}
            className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadReceipt}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Receipt</span>
            </button>

            {onRepeatPayment && !isCredit && (
              <button
                onClick={() => {
                  onClose();
                  onRepeatPayment({
                    name: tx.recipientName,
                    upiId: tx.recipientUpiId,
                    amount: tx.amount,
                    category: tx.category,
                    location: tx.location
                  });
                }}
                className="px-4 py-2 rounded-xl bg-[#5F259F] hover:bg-[#38146B] text-white font-extrabold text-xs shadow-xs"
              >
                Pay Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
