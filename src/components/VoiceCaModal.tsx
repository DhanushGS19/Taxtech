import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AIPersonalCAEngine } from '../engine/aiCaEngine';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Scale,
  Languages
} from 'lucide-react';

interface VoiceCaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceCaModal: React.FC<VoiceCaModalProps> = ({ isOpen, onClose }) => {
  const {
    activeProfile,
    transactions,
    taxComparison,
    anomalies,
    commitments,
    monthlyIncome,
    financialYear,
    language,
    setLanguage
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [caResponse, setCaResponse] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      stopAll();
    } else {
      const greeting = language === 'HINGLISH'
        ? `Namaste ${activeProfile.name}! Main hoon aapka Personal AI CA Vikram Saathi. Poochiye apne payments, EMI budget ya tax ke bare me koi bhi sawal.`
        : `Hello ${activeProfile.name}! I am your Personal AI CA inside TechPay. Ask me anything out loud about your spending limits, locked commitments, or income tax.`;
      setCaResponse(greeting);
    }
  }, [isOpen]);

  const stopAll = () => {
    setIsListening(false);
    setIsSpeaking(false);
    AIPersonalCAEngine.stopSpeaking();
  };

  const handleStartListening = () => {
    stopAll();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not available in your browser. Please use Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'HINGLISH' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);
      setTranscript('Listening to your voice... Speak now.');

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setTranscript(`"${spoken}"`);
        setIsListening(false);
        processVoiceQuery(spoken);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setTranscript('Could not capture audio. Please tap mic again.');
      };

      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const processVoiceQuery = (query: string) => {
    const result = AIPersonalCAEngine.answerQuestion(query, {
      profile: activeProfile,
      transactions,
      taxCalculation: taxComparison,
      anomalies,
      commitments,
      monthlyIncome,
      financialYear,
      language
    });

    setCaResponse(result.response);
    setIsSpeaking(true);
    AIPersonalCAEngine.speakText(result.response, () => setIsSpeaking(false));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden text-center space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Voice CA Vikram Saathi</div>
              <div className="text-[10px] text-slate-400">Speech Assistant</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'EN' ? 'HINGLISH' : 'EN')}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1"
            >
              <Languages className="w-3 h-3 text-emerald-400" />
              <span>{language === 'EN' ? 'English' : 'Hinglish'}</span>
            </button>
            <button
              onClick={() => {
                stopAll();
                onClose();
              }}
              className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mic Orb */}
        <div className="py-4 flex flex-col items-center justify-center">
          <button
            onClick={isListening ? stopAll : handleStartListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 ${
              isListening
                ? 'bg-rose-500 text-white shadow-rose-500/40 animate-pulse'
                : isSpeaking
                ? 'bg-teal-500 text-slate-950 shadow-teal-500/40 animate-bounce'
                : 'bg-emerald-500 text-slate-950 shadow-emerald-500/30 hover:bg-emerald-400'
            }`}
          >
            {isListening ? (
              <MicOff className="w-10 h-10" />
            ) : isSpeaking ? (
              <Volume2 className="w-10 h-10" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </button>

          <div className="mt-4 text-xs font-bold text-slate-300">
            {isListening ? (
              <span className="text-rose-400">Listening... Speak now</span>
            ) : isSpeaking ? (
              <span className="text-teal-400">CA Vikram is speaking...</span>
            ) : (
              <span className="text-slate-400">Tap microphone to speak to your CA</span>
            )}
          </div>
        </div>

        {/* Transcript & Response Area */}
        <div className="space-y-3 text-left">
          {transcript && (
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">You asked:</span>
              <p className="italic font-medium">{transcript}</p>
            </div>
          )}

          {caResponse && (
            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-slate-100 space-y-2 max-h-48 overflow-y-auto">
              <div className="flex items-center justify-between text-emerald-400 font-bold text-[11px]">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>CA Advice</span>
                </span>
                {isSpeaking && (
                  <button
                    onClick={() => {
                      AIPersonalCAEngine.stopSpeaking();
                      setIsSpeaking(false);
                    }}
                    className="text-[10px] text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <VolumeX className="w-3 h-3" /> Stop Voice
                  </button>
                )}
              </div>
              <p className="whitespace-pre-line leading-relaxed text-slate-200">
                {caResponse}
              </p>
            </div>
          )}
        </div>

        {/* Quick Voice Chips */}
        <div className="pt-2 border-t border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-bold">
            Or tap to hear:
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            <button
              onClick={() => processVoiceQuery('Can I afford to spend money today?')}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Can I spend today?
            </button>
            <button
              onClick={() => processVoiceQuery('How much tax do I need to pay?')}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              How much tax do I owe?
            </button>
            <button
              onClick={() => processVoiceQuery('Which regime is better for me?')}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Old vs New Regime
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
