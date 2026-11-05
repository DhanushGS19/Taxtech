import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Info
} from 'lucide-react';

export const TaxCalendarTab: React.FC = () => {
  const { calendarEvents, toggleCalendarEvent, financialYear } = useApp();

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-[#172033]">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5F259F]/10 text-[#5F259F] text-xs font-bold border border-[#5F259F]/20 mb-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Statutory Tax Timeline</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#172033]">
          Statutory Tax Calendar & Compliance Schedule (FY {financialYear})
        </h1>
        <p className="text-xs text-[#718096]">
          Advance Tax quarterly schedules, ITR filing deadlines, and penalty protection under Section 234A/B/C/F.
        </p>
      </div>

      {/* Advance Tax 4-Quarter Visualizer */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-[#172033]">
              Advance Tax Installments (Section 208 / 211)
            </h2>
            <p className="text-xs text-[#718096]">
              Mandatory for individuals with estimated net tax liability exceeding ₹10,000.
            </p>
          </div>
          <span className="text-xs font-bold text-[#5F259F] bg-[#5F259F]/10 px-3 py-1 rounded-full">
            4-Quarter Schedule
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] text-xs">
            <div className="font-bold text-[#172033] flex justify-between items-center">
              <span>15th June</span>
              <span className="text-[10px] bg-[#16A36A]/10 text-[#16A36A] px-2 py-0.5 rounded-full font-bold">15% Paid</span>
            </div>
            <p className="text-[11px] text-[#718096] mt-1.5">1st Installment (Settled)</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] text-xs">
            <div className="font-bold text-[#172033] flex justify-between items-center">
              <span>15th September</span>
              <span className="text-[10px] bg-[#16A36A]/10 text-[#16A36A] px-2 py-0.5 rounded-full font-bold">45% Paid</span>
            </div>
            <p className="text-[11px] text-[#718096] mt-1.5">2nd Installment (Settled)</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/50 border border-[#5F259F]/30 text-xs">
            <div className="font-bold text-[#5F259F] flex justify-between items-center">
              <span>15th December</span>
              <span className="text-[10px] bg-[#5F259F] text-white px-2 py-0.5 rounded-full font-bold">75% Due</span>
            </div>
            <p className="text-[11px] text-[#718096] mt-1.5">3rd Installment (Approaching)</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] text-xs">
            <div className="font-bold text-[#172033] flex justify-between items-center">
              <span>15th March</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">100% Due</span>
            </div>
            <p className="text-[11px] text-[#718096] mt-1.5">Final 100% Cumulative Settlement</p>
          </div>
        </div>
      </div>

      {/* Calendar Items */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs divide-y divide-[#E2E8F0] overflow-hidden">
        {calendarEvents.map(ev => (
          <div
            key={ev.id}
            onClick={() => toggleCalendarEvent(ev.id)}
            className={`p-4 sm:p-5 flex items-start gap-3.5 hover:bg-[#F8F9FC] cursor-pointer transition-colors ${
              ev.completed ? 'opacity-60 bg-[#F8F9FC]/60' : ''
            }`}
          >
            <button
              type="button"
              className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                ev.completed ? 'bg-[#16A36A] text-white' : 'border border-[#E2E8F0] bg-white'
              }`}
            >
              {ev.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
            </button>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className={`text-sm font-bold ${ev.completed ? 'line-through text-[#718096]' : 'text-[#172033]'}`}>
                  {ev.title}
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5F259F]/10 text-[#5F259F]">
                  {ev.category}
                </span>
                {ev.urgent && !ev.completed && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 animate-pulse">
                    Action Required
                  </span>
                )}
              </div>

              <p className="text-xs text-[#718096]">
                {ev.description}
              </p>

              <div className="flex items-center gap-4 text-[11px] text-[#718096] pt-1">
                <span className="flex items-center gap-1 font-bold text-[#172033]">
                  <Clock className="w-3 h-3 text-[#5F259F]" />
                  <span>Due: {ev.dueDate}</span>
                </span>
                {ev.penaltyWarning && (
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    {ev.penaltyWarning}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
