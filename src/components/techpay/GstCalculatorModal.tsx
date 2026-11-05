import React, { useState } from 'react';
import { X, Calculator, Copy, Check, Scale } from 'lucide-react';

interface GstCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GstCalculatorModal: React.FC<GstCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState<string>('10000');
  const [gstRate, setGstRate] = useState<number>(18);
  const [calcType, setCalcType] = useState<'EXCLUSIVE' | 'INCLUSIVE'>('EXCLUSIVE'); // Exclusive = Add GST, Inclusive = Remove GST
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;

  let baseAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (calcType === 'EXCLUSIVE') {
    baseAmount = numAmount;
    gstAmount = (numAmount * gstRate) / 100;
    totalAmount = baseAmount + gstAmount;
  } else {
    totalAmount = numAmount;
    baseAmount = (numAmount * 100) / (100 + gstRate);
    gstAmount = totalAmount - baseAmount;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  const igst = gstAmount;

  const handleCopy = () => {
    const text = `GST Invoice Breakdown (${gstRate}% GST):
Base Amount: ₹${baseAmount.toFixed(2)}
CGST (${gstRate / 2}%): ₹${cgst.toFixed(2)}
SGST (${gstRate / 2}%): ₹${sgst.toFixed(2)}
Total GST: ₹${gstAmount.toFixed(2)}
Gross Total: ₹${totalAmount.toFixed(2)}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#5F259F] text-white flex items-center justify-center shadow-sm">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Goods & Services Tax (GST) Calculator</h3>
              <p className="text-[10px] text-slate-500">CBIC standard CGST, SGST & IGST breakdown</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Calc Type Toggle */}
          <div className="p-1 bg-slate-100 rounded-2xl flex items-center shadow-inner">
            <button
              onClick={() => setCalcType('EXCLUSIVE')}
              className={`flex-1 py-1.5 rounded-xl font-bold transition-all ${
                calcType === 'EXCLUSIVE'
                  ? 'bg-white text-[#5F259F] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Add GST (Exclusive)
            </button>
            <button
              onClick={() => setCalcType('INCLUSIVE')}
              className={`flex-1 py-1.5 rounded-xl font-bold transition-all ${
                calcType === 'INCLUSIVE'
                  ? 'bg-white text-[#5F259F] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Remove GST (Inclusive)
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">
              {calcType === 'EXCLUSIVE' ? 'Base Amount (₹)' : 'Total Invoiced Amount (₹)'}
            </label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-lg font-black focus:outline-none focus:border-[#5F259F]"
            />
          </div>

          {/* GST Slabs */}
          <div>
            <label className="block text-slate-600 font-bold mb-1.5">Select GST Slab Rate</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 12, 18, 28].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setGstRate(rate)}
                  className={`py-2 rounded-xl font-bold text-xs transition-all ${
                    gstRate === rate
                      ? 'bg-[#5F259F] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          {/* Result Card */}
          <div className="p-4 rounded-2xl bg-[#F0EAF8] border border-[#5F259F]/20 space-y-2.5">
            <div className="flex justify-between items-center text-slate-700 font-medium">
              <span>Actual Net Base Price:</span>
              <span className="font-bold text-slate-900">₹{baseAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between items-center text-slate-700 font-medium">
              <span>Total GST ({gstRate}%):</span>
              <span className="font-bold text-[#5F259F]">+ ₹{gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>

            {/* Split */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#5F259F]/10 text-[11px] text-slate-600">
              <div className="bg-white/80 p-2 rounded-xl">
                <div>CGST ({gstRate / 2}%):</div>
                <div className="font-bold text-slate-900">₹{cgst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
              </div>
              <div className="bg-white/80 p-2 rounded-xl">
                <div>SGST ({gstRate / 2}%):</div>
                <div className="font-bold text-slate-900">₹{sgst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#5F259F]/20 flex justify-between items-center">
              <span className="font-bold text-slate-800">Final Gross Total:</span>
              <span className="text-xl font-black text-[#5F259F]">₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Breakdown Copied!' : 'Copy Tax Invoice Breakdown'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

