import React, { useState } from 'react';
import { X, HelpCircle, MessageSquare, PhoneCall, ShieldCheck, FileQuestion, ChevronRight, CheckCircle2 } from 'lucide-react';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({ isOpen, onClose }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [ticketSent, setTicketSent] = useState(false);
  const [ticketMessage, setTicketMessage] = useState('');

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'Money was debited but the merchant did not receive it. What should I do?',
      a: 'As per NPCI UPI guidelines, money debited during temporary network drops is automatically reversed to your bank account within T+1 working days (usually under 2 hours). You can check your transaction UTR reference.'
    },
    {
      q: 'How does TechPay verify merchant location & tax deductions?',
      a: 'TechPay cross-references merchant registration details and Google Places GPS coordinates to identify business nature and automatically tags transactions eligible for Section 80C, 80D, or business expense deduction.'
    },
    {
      q: 'Is my UPI PIN safe in TechPay?',
      a: 'Yes. TechPay strictly adheres to NPCI security standards. We never store, log, or transmit your 4-digit or 6-digit UPI PINs; authentication occurs directly on your banking switch.'
    },
    {
      q: 'How can I change my primary bank account?',
      a: 'Navigate to the Profile & Security tab, tap on "Linked Bank Accounts", and select "Set as Primary UPI Account" next to your preferred bank.'
    }
  ];

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim()) return;
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setTicketMessage('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center shadow-md shadow-[#5F259F]/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Help & 24x7 Customer Support</h3>
              <p className="text-[11px] text-slate-500">NPCI Certified Resolution Desk</p>
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
        <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Quick Help Channels */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#F0EAF8] border border-[#5F259F]/20 text-[#5F259F] flex items-center gap-3">
              <PhoneCall className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-bold text-xs">Toll-Free Helpline</div>
                <div className="text-[10px] text-slate-600">1800-890-TECH (24x7)</div>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
              <div>
                <div className="font-bold text-xs">Ombudsman Escalation</div>
                <div className="text-[10px] text-slate-600">RBI Sachet Compliant</div>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <FileQuestion className="w-4 h-4 text-[#5F259F]" />
              <span>Frequently Asked Questions</span>
            </h4>
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full text-left p-3 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-90' : ''}`} />
                  </button>
                  {activeFaq === idx && (
                    <div className="p-3 pt-0 text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support Form */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#5F259F]" />
              <span>Raise an Instant Support Ticket</span>
            </h4>
            {ticketSent ? (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl flex items-center gap-2 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ticket #TP-{Math.floor(100000 + Math.random() * 900000)} registered! Our support team will reply within 15 minutes.</span>
              </div>
            ) : (
              <form onSubmit={handleSendTicket} className="space-y-2">
                <textarea
                  rows={2}
                  required
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Describe your issue (e.g. pending transaction, incorrect refund status)..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F259F] bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#5F259F] hover:bg-[#38146B] text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
                >
                  Submit Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

