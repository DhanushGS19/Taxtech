import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Copy,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface AuditHealthTabProps {
  onSelectTransaction: (txId: string) => void;
}

export const AuditHealthTab: React.FC<AuditHealthTabProps> = ({ onSelectTransaction }) => {
  const { anomalies, resolveAnomaly, healthScore, resolveDuplicate } = useApp();

  const unresolved = anomalies.filter(a => !a.resolved);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-emerald-600" />
          <span>Tax Health Score & Compliance Audit</span>
        </h2>
        <p className="text-xs text-slate-500">
          Proactively monitors cash deposit thresholds, Section 56(2)(x) gifts, and duplicate records.
        </p>
      </div>

      {/* Tax Health Score Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center text-white">
                <span className="text-3xl font-black text-emerald-400">{healthScore.score}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Grade {healthScore.grade}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Compliance Readiness</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {healthScore.grade === 'A+' || healthScore.grade === 'A' ? 'Excellent' : 'Action Recommended'}
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-md">
                Resolving flagged items ensures your ITR return passes CPC automated processing without Section 143(1) notices.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs shrink-0">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-slate-400 text-[10px]">Records Completeness</div>
              <div className="font-bold text-slate-800 mt-0.5">{healthScore.breakdown.recordCompleteness}/25</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-slate-400 text-[10px]">Anomaly Resolution</div>
              <div className="font-bold text-slate-800 mt-0.5">{healthScore.breakdown.anomalyResolution}/25</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-slate-400 text-[10px]">Deductions Optimized</div>
              <div className="font-bold text-slate-800 mt-0.5">{healthScore.breakdown.deductionOptimization}/25</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-slate-400 text-[10px]">Filing Readiness</div>
              <div className="font-bold text-slate-800 mt-0.5">{healthScore.breakdown.complianceFilingReady}/25</div>
            </div>
          </div>
        </div>

        {healthScore.recommendations.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Health Recommendations:
            </span>
            {healthScore.recommendations.map((rec, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flagged Anomalies */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>Flagged Risk Items</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
            {unresolved.length} active
          </span>
        </h3>

        {unresolved.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-2">
            <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-950">No Anomalies Detected!</h4>
            <p className="text-xs text-emerald-800">All payment records conform to Indian tax limits.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {unresolved.map(anom => (
              <div
                key={anom.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-rose-50 text-rose-600 shrink-0 mt-0.5">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">{anom.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                          {anom.severity} RISK
                        </span>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono">
                          {anom.taxSection}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{anom.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => resolveAnomaly(anom.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold whitespace-nowrap"
                  >
                    Mark Verified
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CA Guidance:</span>
                  </div>
                  <p>{anom.recommendation}</p>
                </div>

                {anom.transactionId && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      onClick={() => onSelectTransaction(anom.transactionId!)}
                      className="text-indigo-600 hover:underline font-semibold"
                    >
                      View Transaction & Location Details →
                    </button>
                    {anom.category === 'DUPLICATE' && (
                      <button
                        onClick={() => resolveDuplicate(anom.transactionId!)}
                        className="text-rose-600 hover:underline font-semibold"
                      >
                        Delete Duplicate Entry
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
