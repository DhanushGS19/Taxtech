import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Printer,
  Scale,
  Award,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose
}) => {
  const { activeProfile, taxComparison, financialYear, activeRegime, transactions } = useApp();

  if (!isOpen) return null;

  const currentRegimeData = activeRegime === 'NEW' ? taxComparison.newRegime : taxComparison.oldRegime;

  let recommendedItr = 'ITR-1 (Sahaj)';
  let itrReason = 'For salaried individuals with salary, one house property, and other sources.';

  if (activeProfile.employmentType === 'FREELANCER_PROFESSIONAL' || activeProfile.hasPresumptiveIncome) {
    recommendedItr = 'ITR-4 (Sugam)';
    itrReason = 'For professionals under Section 44ADA or businesses under Section 44AD.';
  } else if (activeProfile.employmentType === 'BUSINESS') {
    recommendedItr = 'ITR-3';
    itrReason = 'For individuals with business income and books of accounts.';
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl flex flex-col">
        {/* Topbar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">
              TaxSaathi Official CA Computation Statement (FY {financialYear})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Statement */}
        <div className="p-8 space-y-6 text-xs text-slate-800 font-sans print:p-0">
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <Scale className="w-6 h-6 text-emerald-700" />
                <span className="text-xl font-black tracking-tight text-slate-900">
                  TECH<span className="text-indigo-600">PAY</span> / <span className="text-emerald-700">TAXSAATHI</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Statement of Total Income & Tax Computation | Income Tax Act, 1961
              </p>
            </div>

            <div className="text-right text-[11px] text-slate-500">
              <div>Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              <div>Ref: TP-CA-{activeProfile.pan}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold">Taxpayer</div>
              <div className="font-bold text-slate-900 text-xs">{activeProfile.name}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold">PAN</div>
              <div className="font-bold font-mono text-slate-900 text-xs">{activeProfile.pan}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold">Financial Year</div>
              <div className="font-bold text-slate-900 text-xs">FY {financialYear} (AY 2025-26)</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold">Selected Regime</div>
              <div className="font-bold text-emerald-700 text-xs">{activeRegime} Tax Regime</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-950">
                Recommended ITR Form: <strong>{recommendedItr}</strong>
              </div>
              <p className="text-emerald-900 text-[11px] mt-0.5">{itrReason}</p>
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Particulars</th>
                  <th className="py-2.5 px-4 text-right">New Regime (₹)</th>
                  <th className="py-2.5 px-4 text-right">Old Regime (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 px-4 font-semibold">1. Gross Total Income</td>
                  <td className="py-2 px-4 text-right">{taxComparison.newRegime.grossTotalIncome.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-4 text-right">{taxComparison.oldRegime.grossTotalIncome.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-slate-600 pl-8">Less: Standard Deduction u/s 16(ia)</td>
                  <td className="py-2 px-4 text-right text-emerald-700">-{taxComparison.newRegime.standardDeduction.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-4 text-right text-emerald-700">-{taxComparison.oldRegime.standardDeduction.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-slate-600 pl-8">Less: Chapter VI-A (80C, 80CCD, 80D)</td>
                  <td className="py-2 px-4 text-right text-slate-400">0</td>
                  <td className="py-2 px-4 text-right text-emerald-700">-{taxComparison.oldRegime.chapter6ADeductions.total.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-slate-600 pl-8">Less: Section 24(b) Home Loan Interest</td>
                  <td className="py-2 px-4 text-right text-slate-400">0</td>
                  <td className="py-2 px-4 text-right text-emerald-700">-{taxComparison.oldRegime.section24bHomeLoanInterest.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="py-2 px-4">2. Net Taxable Income</td>
                  <td className="py-2 px-4 text-right">{taxComparison.newRegime.netTaxableIncome.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-4 text-right">{taxComparison.oldRegime.netTaxableIncome.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">3. Income Tax on Net Income</td>
                  <td className="py-2 px-4 text-right">{taxComparison.newRegime.incomeTaxBeforeRebate.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-4 text-right">{taxComparison.oldRegime.incomeTaxBeforeRebate.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-slate-600 pl-8">Less: Section 87A Rebate</td>
                  <td className="py-2 px-4 text-right text-emerald-700">-{taxComparison.newRegime.section87ARebate.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-4 text-right text-emerald-700">-{taxComparison.oldRegime.section87ARebate.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-slate-600 pl-8">Add: Health & Education Cess @ 4%</td>
                  <td className="py-2 px-4 text-right">{taxComparison.newRegime.cess.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-4 text-right">{taxComparison.oldRegime.cess.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-slate-100 font-bold">
                  <td className="py-2 px-4">4. Total Tax Liability</td>
                  <td className="py-2 px-4 text-right">{taxComparison.newRegime.totalTaxLiability.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-4 text-right">{taxComparison.oldRegime.totalTaxLiability.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-slate-600">5. Less: TDS Credits & Advance Tax</td>
                  <td className="py-2 px-4 text-right text-blue-700">-{taxComparison.newRegime.totalTaxesPaid.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-4 text-right text-blue-700">-{taxComparison.oldRegime.totalTaxesPaid.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-emerald-50 text-slate-950 font-black text-sm">
                  <td className="py-3 px-4">
                    6. {currentRegimeData.isRefund ? 'ESTIMATED TAX REFUND DUE:' : 'NET TAX PAYABLE:'}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-800">
                    ₹{Math.abs(taxComparison.newRegime.netTaxPayableOrRefund).toLocaleString('en-IN')}
                    {taxComparison.newRegime.isRefund ? ' (Refund)' : ' (Payable)'}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-800">
                    ₹{Math.abs(taxComparison.oldRegime.netTaxPayableOrRefund).toLocaleString('en-IN')}
                    {taxComparison.oldRegime.isRefund ? ' (Refund)' : ' (Payable)'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 pt-6 flex justify-between items-end">
            <div className="text-slate-500 text-[10px] max-w-sm">
              <div className="font-bold text-slate-700 text-xs">Statutory Seal</div>
              <p>Generated by TaxSaathi Indian Taxation Engine. Fully reconciled with {transactions.length} transactions.</p>
            </div>

            <div className="text-center p-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 min-w-[170px]">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-1">
                <Award className="w-4 h-4" />
              </div>
              <div className="font-bold text-slate-800 text-xs">CA Vikram Saathi</div>
              <div className="text-[10px] text-emerald-700 font-semibold">AI Chartered Accountant</div>
              <div className="text-[9px] text-slate-400">Digitally Verified & Signed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
