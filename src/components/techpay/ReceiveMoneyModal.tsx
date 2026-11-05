import React, { useState } from 'react';
import { X, QrCode, Copy, Check, Share2, Download, ShieldCheck, Zap } from 'lucide-react';

interface ReceiveMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiveMoneyModal: React.FC<ReceiveMoneyModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [isAmountSet, setIsAmountSet] = useState(false);

  if (!isOpen) return null;

  const upiId = 'rahul.techpay@hdfcbank';
  const qrUrl = customAmount && parseFloat(customAmount) > 0
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=upi://pay?pa=${upiId}%26pn=Rahul%20Sharma%26am=${customAmount}%26cu=INR`
    : `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=upi://pay?pa=${upiId}%26pn=Rahul%20Sharma%26cu=INR`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Pay Rahul Sharma via UPI',
        text: `Pay Rahul Sharma using UPI ID: ${upiId}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      handleCopy();
      alert(`UPI ID ${upiId} copied to clipboard! Share it with the sender.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-sm w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#5F259F] text-white flex items-center justify-center shadow-sm">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Receive Money / My QR</h3>
              <p className="text-[10px] text-slate-500">Scan using any UPI app</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Card */}
        <div className="p-6 text-center space-y-4">
          <div>
            <h4 className="text-base font-extrabold text-slate-900">Rahul Sharma</h4>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0EAF8] text-[#5F259F] text-xs font-mono font-bold mt-1">
              <span>{upiId}</span>
              <button
                onClick={handleCopy}
                title="Copy UPI ID"
                className="hover:text-[#38146B]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Direct credit to HDFC Bank A/c •••• 4892
            </div>
          </div>

          {/* QR Code Container */}
          <div className="relative inline-block p-4 rounded-3xl bg-white border-2 border-slate-200 shadow-md">
            <img
              src={qrUrl}
              alt="UPI QR Code"
              className="w-48 h-48 mx-auto rounded-xl"
              onError={(e) => {
                // Fallback SVG QR pattern if offline
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* TechPay Logo overlay in middle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#5F259F] border-2 border-white text-white flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 fill-white" />
            </div>
          </div>

          {/* Optional Amount Pill */}
          {isAmountSet ? (
            <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
              <span className="text-amber-900 font-bold">Requesting: ₹{customAmount}</span>
              <button
                onClick={() => {
                  setIsAmountSet(false);
                  setCustomAmount('');
                }}
                className="text-amber-700 font-bold text-[11px] hover:underline"
              >
                Clear
              </button>
            </div>
          ) : (
            <div>
              <div className="flex gap-2 justify-center">
                <input
                  type="number"
                  placeholder="Set custom amount (₹)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs w-36 text-center font-bold"
                />
                <button
                  onClick={() => {
                    if (parseFloat(customAmount) > 0) setIsAmountSet(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Set
                </button>
              </div>
            </div>
          )}

          {/* NPCI Accepted Banner */}
          <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Accepts PhonePe, Google Pay, Paytm & BHIM UPI</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={handleShare}
              className="py-2.5 px-3 rounded-2xl bg-[#F0EAF8] hover:bg-[#e4d6f3] text-[#5F259F] font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share QR</span>
            </button>
            <button
              onClick={handleCopy}
              className="py-2.5 px-3 rounded-2xl bg-[#5F259F] hover:bg-[#38146B] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy UPI ID'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

