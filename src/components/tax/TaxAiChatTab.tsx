import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Scale,
  RotateCcw,
  Languages,
  BookOpen,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  CreditCard,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface TaxAiChatTabProps {
  onNavigateTab: (tab: string) => void;
  onOpenReport: () => void;
}

export const TaxAiChatTab: React.FC<TaxAiChatTabProps> = ({
  onNavigateTab,
  onOpenReport
}) => {
  const {
    chatMessages,
    sendChatMessage,
    clearChat,
    activeProfile,
    language,
    setLanguage,
    isSpeaking,
    speak,
    stopSpeaking,
    setActiveFace,
    safeDiscretionaryBudget,
    currentDiscretionarySpent,
    unpaidLockedAmount,
    taxComparison,
    formatPrivateAmount
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (text?: string) => {
    const q = text || inputQuery;
    if (!q.trim()) return;
    sendChatMessage(q);
    setInputQuery('');
  };

  const handleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'HINGLISH' ? 'hi-IN' : 'en-IN';
      setIsRecording(true);

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setInputQuery(spoken);
        setIsRecording(false);
        handleSend(spoken);
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  const quickPrompts = [
    'Can I afford to spend ₹5,000 today?',
    'How much tax do I need to pay?',
    'Which regime is better for me?',
    'Do I need to file an ITR?',
    'How can I legally reduce tax?'
  ];

  const handleAction = (actionType: string, payload?: any) => {
    if (actionType === 'NAVIGATE_BUDGET') {
      setActiveFace('TECHPAY');
      onNavigateTab('vault');
    } else if (actionType === 'NAVIGATE_PAYMENTS') {
      setActiveFace('TECHPAY');
      onNavigateTab('history');
    } else if (actionType === 'OPEN_REPORT') {
      onOpenReport();
    } else if (actionType === 'ASK_QUERY') {
      handleSend(payload);
    }
  };

  const remainingDailySpend = Math.max(0, safeDiscretionaryBudget - currentDiscretionarySpent);

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-12 animate-fadeIn text-[#172033]">
      {/* FINANCIAL INSIGHTS CARDS (TOP STRIP) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Spending Analysis Insight */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#5F259F]/10 text-[#5F259F] flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-[#718096] uppercase tracking-wider">Safe Daily Allowance</span>
            </div>
            <div className="text-sm font-black text-[#172033]">
              {formatPrivateAmount(remainingDailySpend)}
            </div>
            <p className="text-[10px] text-[#16A36A]">Safe to spend this month</p>
          </div>
        </div>

        {/* Budget Recommendations Insight */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#E9A23B]/10 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#718096] uppercase tracking-wider block">Upcoming Fixed Bills</span>
            <div className="text-sm font-black text-[#172033]">
              {formatPrivateAmount(unpaidLockedAmount)}
            </div>
            <p className="text-[10px] text-[#718096]">Reserved in Budget Vault</p>
          </div>
        </div>

        {/* Tax Recommendation Insight */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#16A36A]/10 text-[#16A36A] flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#718096] uppercase tracking-wider block">Regime Recommendation</span>
            <div className="text-sm font-black text-[#16A36A]">
              {taxComparison.recommendedRegime} Regime
            </div>
            <p className="text-[10px] text-[#718096]">Saves ₹{taxComparison.taxSavings.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* MAIN CHAT CONTAINER */}
      <div className="flex flex-col h-[calc(100vh-17rem)] min-h-[480px] bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {/* Chat Header */}
        <div className="px-5 py-3.5 bg-white border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5F259F] text-white flex items-center justify-center font-bold shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-[#172033]">CA Vikram Saathi</h2>
                <span className="text-[10px] bg-[#16A36A]/10 text-[#16A36A] px-2 py-0.5 rounded-full font-bold">
                  Online • AI Chartered Accountant
                </span>
              </div>
              <p className="text-[11px] text-[#718096]">
                Advising {activeProfile.name} on UPI Spends, Locked Budgets & Section 115BAC
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="px-2.5 py-1 rounded-lg bg-rose-500 text-white text-xs font-bold flex items-center gap-1 animate-pulse"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Mute</span>
              </button>
            )}

            <button
              onClick={() => setLanguage(language === 'EN' ? 'HINGLISH' : 'EN')}
              className="px-3 py-1.5 rounded-xl bg-[#F8F9FC] hover:bg-slate-100 text-[#172033] text-xs font-bold border border-[#E2E8F0] flex items-center gap-1.5 transition-colors"
            >
              <Languages className="w-3.5 h-3.5 text-[#5F259F]" />
              <span>{language === 'EN' ? 'English' : 'Hinglish'}</span>
            </button>

            <button
              onClick={clearChat}
              title="Clear Conversation"
              className="p-2 rounded-xl bg-[#F8F9FC] hover:bg-slate-100 text-[#718096] hover:text-[#172033] border border-[#E2E8F0] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F8F9FC]">
          {chatMessages.map(msg => {
            const isCa = msg.sender === 'CA_SAATHI';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${isCa ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isCa ? 'bg-[#5F259F] text-white shadow-xs' : 'bg-[#172033] text-white'
                }`}>
                  {isCa ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`space-y-1.5 ${isCa ? 'text-left' : 'text-right'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      isCa
                        ? 'bg-white text-[#172033] border border-[#E2E8F0] rounded-tl-sm'
                        : 'bg-[#5F259F] text-white rounded-tr-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line font-medium">{msg.text}</div>

                    {isCa && msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-[#E2E8F0] flex items-center gap-1.5 text-[10px] text-[#718096] font-mono">
                        <BookOpen className="w-3 h-3 text-[#5F259F]" />
                        <span>Statutory Citations: {msg.citations.join(', ')}</span>
                      </div>
                    )}

                    {isCa && (
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-[#718096] text-[10px]">{msg.timestamp}</span>
                        <button
                          onClick={() => speak(msg.text)}
                          className="text-[#5F259F] hover:underline flex items-center gap-1 font-bold text-[11px]"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Listen</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Suggested actions */}
                  {isCa && msg.suggestedActions && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      {msg.suggestedActions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAction(act.actionType, act.payload)}
                          className="px-3 py-1 rounded-xl bg-white hover:bg-[#5F259F]/10 text-[#5F259F] border border-[#E2E8F0] text-[11px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Strip */}
        <div className="px-4 py-2 bg-white border-t border-[#E2E8F0] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-[#718096] uppercase shrink-0">Suggested:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-3 py-1 rounded-full bg-[#F8F9FC] hover:bg-[#5F259F]/10 text-[#172033] hover:text-[#5F259F] text-xs font-semibold whitespace-nowrap border border-[#E2E8F0] transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-3 bg-white border-t border-[#E2E8F0]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleVoiceInput}
              title="Voice Input"
              className={`p-2.5 rounded-xl border transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                  : 'bg-[#F8F9FC] text-[#718096] hover:text-[#172033] border-[#E2E8F0]'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                language === 'HINGLISH'
                  ? "Poochiye: 'Kya main aaj ₹5,000 spend kar sakta hoon?' ya 'Mera kitna tax banta hai?'"
                  : "Ask anything: 'Can I afford to spend ₹5,000 today?' or 'How much tax do I owe?'"
              }
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#5F259F]"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#5F259F] hover:bg-[#35145F] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
