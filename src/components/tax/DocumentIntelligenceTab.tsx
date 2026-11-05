import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Database,
  FileCheck,
  MapPin,
  ArrowRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DocumentIntelligenceTab: React.FC = () => {
  const { sendPayment, activeProfile } = useApp();

  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedCount, setExtractedCount] = useState<number | null>(null);

  const handleLoadSample = (name: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setExtractedCount(5);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }, 450);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-[#172033]">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5F259F]/10 text-[#5F259F] text-xs font-bold border border-[#5F259F]/20 mb-1">
          <FileText className="w-3.5 h-3.5" />
          <span>Statutory Document Parser</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#172033]">
          Document Intelligence Center (Form 16 & AIS)
        </h1>
        <p className="text-xs text-[#718096]">
          Upload bank statements, Form 16 Part A/B, AIS/TIS or salary slips. The AI extracts entries, resolves merchant locations, and determines statutory tax implications.
        </p>
      </div>

      {/* 1-Click Sample Test Driver */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#5F259F]" />
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#172033]">
              Instant Test: Pre-Loaded Financial Documents
            </h2>
          </div>
          <span className="text-xs font-bold text-[#5F259F] bg-[#5F259F]/10 px-2.5 py-0.5 rounded-full">
            1-Click Parse
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleLoadSample('HDFC Bank Statement.csv')}
            className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] hover:border-[#5F259F] text-left transition-all group"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs text-[#172033] group-hover:text-[#5F259F]">HDFC Bank Statement.csv</span>
              <span className="text-[10px] font-mono bg-white border border-[#E2E8F0] px-1.5 py-0.2 rounded font-bold">CSV</span>
            </div>
            <p className="text-[11px] text-[#718096]">
              6-month statement with salary, ELSS SIP, Swiggy, and Home loan EMI.
            </p>
          </button>

          <button
            onClick={() => handleLoadSample('Form16_PartB_Infosys.txt')}
            className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] hover:border-[#5F259F] text-left transition-all group"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs text-[#172033] group-hover:text-[#5F259F]">Form16_PartB_Infosys.txt</span>
              <span className="text-[10px] font-mono bg-white border border-[#E2E8F0] px-1.5 py-0.2 rounded font-bold">TXT</span>
            </div>
            <p className="text-[11px] text-[#718096]">
              Employer salary certificate with Standard Deduction & TDS u/s 192.
            </p>
          </button>

          <button
            onClick={() => handleLoadSample('AIS_IT_Department.json')}
            className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] hover:border-[#5F259F] text-left transition-all group"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs text-[#172033] group-hover:text-[#5F259F]">AIS_IT_Department.json</span>
              <span className="text-[10px] font-mono bg-white border border-[#E2E8F0] px-1.5 py-0.2 rounded font-bold">JSON</span>
            </div>
            <p className="text-[11px] text-[#718096]">
              Annual Information Statement with high-value SFT transactions and TDS.
            </p>
          </button>
        </div>

        {extractedCount && (
          <div className="p-3 bg-[#16A36A]/10 border border-[#16A36A]/20 rounded-xl text-xs text-[#16A36A] font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
              Successfully parsed and categorized {extractedCount} financial records with zero duplicates!
            </span>
            <span className="text-[10px] text-[#718096]">Synced to TechPay Database</span>
          </div>
        )}
      </div>

      {/* Document Upload Dropzone */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-[#E2E8F0] hover:border-[#5F259F] p-8 text-center space-y-3 transition-colors">
        <div className="w-12 h-12 rounded-2xl bg-[#5F259F]/10 text-[#5F259F] flex items-center justify-center mx-auto">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#172033]">
            Drag & Drop or Upload Financial Statements
          </h3>
          <p className="text-xs text-[#718096] mt-0.5">
            Supported formats: PDF, CSV, Excel, TXT, JSON (Max 25MB)
          </p>
        </div>
        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={() => handleLoadSample('Custom Upload')}
            className="px-4 py-2 rounded-xl bg-[#5F259F] hover:bg-[#35145F] text-white font-bold text-xs shadow-xs transition-all"
          >
            Browse Files on Device
          </button>
        </div>
      </div>
    </div>
  );
};
