import React from 'react';
import { X, Bell, CheckCircle2, AlertTriangle, Zap, ArrowDownLeft, ShieldCheck, Clock } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection?: (section: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigateSection
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      title: 'Electricity Bill Due in 3 Days',
      desc: 'BESCOM bill of ₹1,450 is due on 8th Nov. Pay now via UPI to avoid late fees.',
      time: '10 mins ago',
      type: 'BILL',
      action: 'Pay Now',
      actionSection: 'payments',
      icon: Zap,
      color: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'notif-2',
      title: 'Salary Credited',
      desc: '₹1,50,000 credited to HDFC Bank A/c •••• 4892 from Infosys Technologies Ltd.',
      time: '2 hours ago',
      type: 'CREDIT',
      action: 'View History',
      actionSection: 'history',
      icon: ArrowDownLeft,
      color: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'notif-3',
      title: 'Budget Vault Guardrail Active',
      desc: 'Home Loan EMI of ₹38,000 is safely locked and reserved from accidental spending.',
      time: 'Yesterday',
      type: 'VAULT',
      action: 'Open Vault',
      actionSection: 'budgets',
      icon: ShieldCheck,
      color: 'bg-purple-100 text-[#5F259F]'
    },
    {
      id: 'notif-4',
      title: 'Section 80C Tax Saver Reminder',
      desc: 'Invest ₹60,000 more in ELSS Mutual Funds or PPF before March 31 to claim full ₹1.5L tax deduction.',
      time: '2 days ago',
      type: 'TAX',
      action: 'Calculate Tax',
      actionSection: 'tax',
      icon: AlertTriangle,
      color: 'bg-blue-100 text-blue-800'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center shadow-md shadow-[#5F259F]/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Notifications & Alerts</h3>
              <p className="text-[11px] text-slate-500">Live bill reminders, credits & tax updates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {notifications.map(n => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/60 transition-all space-y-2 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{n.desc}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100/80 text-[10px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {n.time}
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      if (onNavigateSection && n.actionSection) {
                        onNavigateSection(n.actionSection);
                      }
                    }}
                    className="text-[#5F259F] font-bold hover:underline"
                  >
                    {n.action} →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
};

