import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const TaxCalendarTab: React.FC = () => {
  const { calendarEvents, toggleCalendarEvent, financialYear } = useApp();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-emerald-600" />
          <span>Statutory Tax Calendar (FY {financialYear})</span>
        </h2>
        <p className="text-xs text-slate-500">
          Advance Tax schedule, ITR deadlines, and penalty protection under Section 234A/B/C/F.
        </p>
      </div>

      {/* Advance Tax 4-Quarter Visualizer */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Advance Tax Installments (Section 208 / 211)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
            <div className="font-bold text-emerald-950 flex justify-between">
              <span>15th June</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.2 rounded">15% Paid</span>
            </div>
            <p className="text-[11px] text-emerald-800 mt-1">1st Installment</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
            <div className="font-bold text-emerald-950 flex justify-between">
              <span>15th September</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.2 rounded">45% Paid</span>
            </div>
            <p className="text-[11px] text-emerald-800 mt-1">2nd Installment</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs">
            <div className="font-bold text-blue-950 flex justify-between">
              <span>15th December</span>
              <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.2 rounded">75% Due</span>
            </div>
            <p className="text-[11px] text-blue-800 mt-1">3rd Installment (Approaching)</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
            <div className="font-bold text-amber-950 flex justify-between">
              <span>15th March</span>
              <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.2 rounded">100% Due</span>
            </div>
            <p className="text-[11px] text-amber-800 mt-1">Final 100% Settlement</p>
          </div>
        </div>
      </div>

      {/* Calendar Items */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {calendarEvents.map(ev => (
          <div
            key={ev.id}
            onClick={() => toggleCalendarEvent(ev.id)}
            className={`p-5 flex items-start gap-4 hover:bg-slate-50 cursor-pointer transition-colors ${
              ev.completed ? 'opacity-60 bg-slate-50/50' : ''
            }`}
          >
            <button
              type="button"
              className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                ev.completed ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
              }`}
            >
              {ev.completed && <CheckCircle2 className="w-4 h-4" />}
            </button>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className={`text-sm font-bold ${ev.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                  {ev.title}
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  {ev.category}
                </span>
                {ev.urgent && !ev.completed && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 animate-pulse">
                    Action Required
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600">{ev.description}</p>

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Clock className="w-3.5 h-3.5" /> Due: {ev.dueDate}
                </span>
                <span>Applicable to: {ev.applicableTo}</span>
              </div>

              {ev.penaltyWarning && (
                <div className="mt-1.5 p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Penalty if missed: {ev.penaltyWarning}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
