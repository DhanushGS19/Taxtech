import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Copy,
  BookOpen,
  ArrowRight,
  Info
} from 'lucide-react';

interface AuditHealthTabProps {
  onSelectTransaction: (txId: string) => void;
}

export const AuditHealthTab: React.FC<AuditHealthTabProps> = ({ onSelectTransaction }) => {
  const { anomalies, resolveAnomaly, healthScore, resolveDuplicate } = useApp();

  const unresolved = anomalies.filter(a => !a.resolved);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-[#172033]">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5F259F]/10 text-[#5F259F] text-xs font-bold border border-[#5F259F]/20 mb-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Statutory Audit Engine</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#172033]">
          Tax Compliance Health & Anomaly Audit
        </h1>
        <p className="text-xs text-[#718096]">
          Monitors high-value transactions, cash deposit limits, Section 56(2)(x) relative gifts, and duplicate records.
        </p>
      </div>

      {/* Tax Health Score Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-[#5F259F]/10 border border-[#5F259F]/20 flex flex-col items-center justify-center shrink-0">
              <span className="text-2xl font-black text-[#5F259F]">{healthScore.score}</span>
              <span className="text-[10px] text-[#718096] font-bold uppercase">Grade {healthScore.grade}</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-[#172033]">Compliance Readiness Score</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#16A36A]/10 text-[#16A36A]">
                  {healthScore.grade === 'A+' || healthScore.grade === 'A' ? 'Excellent' : 'Action Recommended'}
                </span>
              </div>
              <p className="text-xs text-[#718096] max-w-md">
                Resolving flagged items ensures your ITR return passes CPC automated processing without Section 143(1) notices.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs shrink-0">
            <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0]">
              <div className="text-[#718096] text-[10px]">Records Completeness</div>
              <div className="font-bold text-[#172033] mt-0.5">{healthScore.breakdown.recordCompleteness}/25</div>
            </div>
            <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0]">
              <div className="text-[#718096] text-[10px]">Anomaly Resolution</div>
              <div className="font-bold text-[#172033] mt-0.5">{healthScore.breakdown.anomalyResolution}/25</div>
            </div>
            <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0]">
              <div className="text-[#718096] text-[10px]">Deductions Optimized</div>
              <div className="font-bold text-[#172033] mt-0.5">{healthScore.breakdown.deductionOptimization}/25</div>
            </div>
            <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0]">
              <div className="text-[#718096] text-[10px]">Filing Readiness</div>
              <div className="font-bold text-[#172033] mt-0.5">{healthScore.breakdown.complianceFilingReady}/25</div>
            </div>
          </div>
        </div>

        {healthScore.recommendations.length > 0 && (
          <div className="pt-4 border-t border-[#E2E8F0] space-y-1.5">
            <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider block">
              Health Recommendations:
            </span>
            {healthScore.recommendations.map((rec, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-[#172033]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A] shrink-0" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flagged Anomalies */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-[#172033] flex items-center gap-2">
          <span>Flagged Risk Items</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
            {unresolved.length} Active
          </span>
        </h3>

        {unresolved.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#16A36A] mx-auto" />
            <h4 className="text-sm font-bold text-[#172033]">All Clear! No Flagged Audit Risks</h4>
            <p className="text-xs text-[#718096]">Your transactions comply with SFT reporting thresholds.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {unresolved.map(anom => (
              <div
                key={anom.id}
                className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      anom.severity === 'HIGH'
                        ? 'bg-rose-100 text-rose-800'
                        : anom.severity === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {anom.severity} RISK
                    </span>
                    <h4 className="text-xs font-extrabold text-[#172033]">{anom.title}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#718096]">
                    {anom.category.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-[#718096] leading-relaxed">
                  {anom.description}
                </p>

                {anom.taxSection && (
                  <div className="p-3 bg-[#F8F9FC] rounded-xl text-[11px] text-[#718096] flex items-center gap-2 border border-[#E2E8F0]">
                    <BookOpen className="w-3.5 h-3.5 text-[#5F259F] shrink-0" />
                    <span>Statutory Reference: {anom.taxSection}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E2E8F0]">
                  <span className="text-[11px] text-[#718096]">
                    Recommended Action: <strong>{anom.recommendation}</strong>
                  </span>
                  <div className="flex gap-2">
                    {anom.transactionId && (
                      <button
                        onClick={() => onSelectTransaction(anom.transactionId!)}
                        className="px-3 py-1.5 rounded-xl bg-[#F8F9FC] hover:bg-slate-100 text-[#172033] text-xs font-bold border border-[#E2E8F0] transition-colors"
                      >
                        View Transaction
                      </button>
                    )}
                    <button
                      onClick={() => resolveAnomaly(anom.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#5F259F] hover:bg-[#35145F] text-white text-xs font-bold transition-all"
                    >
                      Mark as Verified
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
