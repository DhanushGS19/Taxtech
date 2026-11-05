import React, { useState } from 'react';
import { X, Send, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface RequestMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestMoneyModal: React.FC<RequestMoneyModalProps> = ({ isOpen, onClose }) => {
  const [payerId, setPayerId] = useState('');
  const [amount, setAmount] = useState('1200');
  const [note, setNote] = useState('Dinner split & cab fare');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payerId.trim() || !amount) return;
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setPayerId('');
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-sm w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#5F259F] text-white flex items-center justify-center shadow-sm">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Request Money via UPI</h3>
              <p className="text-[10px] text-slate-500">Collect payment from any contact or VPA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form or Success */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Payment Request Sent!</h4>
            <p className="text-xs text-slate-600">
              A collect notification for <strong>₹{amount}</strong> has been delivered to <strong>{payerId}</strong> via NPCI UPI Collect switch.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div>
              <label className="block text-slate-600 font-bold mb-1">Request From (Mobile No or UPI ID) *</label>
              <input
                type="text"
                required
                value={payerId}
                onChange={(e) => setPayerId(e.target.value)}
                placeholder="e.g. 9876543210 or priya@okhdfcbank"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-[#5F259F]"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Amount (₹) *</label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="₹ Amount"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-lg font-black focus:outline-none focus:border-[#5F259F]"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Note / Purpose</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Dinner bill, Office gift contribution"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#5F259F]"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Recipient will receive a UPI collect push notification with 24-hr expiry.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#5F259F] hover:bg-[#38146B] text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Send UPI Collect Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

