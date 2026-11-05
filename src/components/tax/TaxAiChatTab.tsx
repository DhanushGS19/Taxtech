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
  ArrowRight
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
    setActiveFace
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
      alert('Speech recognition is not supported in this browser. Please use Chrome/Edge.');
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
    'Can I afford to spend money today?',
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

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
            <Scale className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">CA Vikram Saathi</h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded font-bold">
                AI Chartered Accountant
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Guiding {activeProfile.name} on UPI Spends, Locked Budgets & Indian Taxes
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
            className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'EN' ? 'English' : 'Hinglish'}</span>
          </button>

          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        {chatMessages.map(msg => {
          const isCa = msg.sender === 'CA_SAATHI';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${isCa ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isCa ? 'bg-slate-900 text-emerald-400' : 'bg-indigo-600 text-white'
              }`}>
                {isCa ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div className={`space-y-2 ${isCa ? 'text-left' : 'text-right'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    isCa
                      ? 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-sm'
                      : 'bg-indigo-600 text-white rounded-tr-sm'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {isCa && msg.citations && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <BookOpen className="w-3 h-3" />
                      <span>Citations: {msg.citations.join(', ')}</span>
                    </div>
                  )}

                  {isCa && (
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{msg.timestamp}</span>
                      <button
                        onClick={() => speak(msg.text)}
                        className="text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
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
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1"
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

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-slate-400 uppercase">Ask CA:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] whitespace-nowrap"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-slate-200">
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
            className={`p-2.5 rounded-xl ${isRecording ? 'bg-rose-500 text-white animate-bounce' : 'bg-slate-100 text-slate-700'}`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              language === 'HINGLISH'
                ? "Poochiye: 'Kya main aaj spend kar sakta hoon?' ya 'Mera kitna tax banta hai?'"
                : "Ask anything: 'Can I afford to spend today?' or 'How much tax do I owe?'"
            }
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
