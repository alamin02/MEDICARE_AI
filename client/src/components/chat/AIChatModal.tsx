import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  AlertTriangle,
  Globe,
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';
import { DemoBadge } from '../common/DemoBadge';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isEmergency?: boolean;
}

const EMERGENCY_KEYWORDS = [
  'chest pain',
  'heart attack',
  'cannot breathe',
  'difficulty breathing',
  'unconscious',
  'severe bleeding',
  'choking',
  'stroke',
  'সিভিয়ার ব্লিডিং',
  'বুকে ব্যথা',
  'শ্বাসকষ্ট'
];

export const AIChatModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am MedICARE AI Assistant. You can describe your symptoms or ask first-aid questions in English or বাংলা. How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [isRecording, setIsRecording] = useState(false);
  const [voicePlayback, setVoicePlayback] = useState(false);
  const [emergencyAlert, setEmergencyAlert] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Check emergency keywords
    const lower = query.toLowerCase();
    const hasEmergency = EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw));

    if (hasEmergency) {
      setEmergencyAlert(true);
    }

    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      if (hasEmergency) {
        reply = language === 'bn'
          ? '⚠️ সতর্কতা: আপনার বর্ণিত লক্ষণগুলো গুরুতর জরুরি চিকিৎসার নির্দেশক হতে পারে। অনুগ্রহ করে অবিলম্বে ৯৯৯ (বাংলাদেশ) বা ৯১১ নম্বরে যোগাযোগ করুন অথবা নিকটস্থ হাসপাতালের জরুরি বিভাগে যান।'
          : '⚠️ CRITICAL ALERT: Your symptoms may indicate an acute medical emergency. Please immediately call emergency services (999 in BD / 911) or proceed to the nearest hospital emergency department.';
      } else if (lower.includes('burn') || lower.includes('পোড়া')) {
        reply = language === 'bn'
          ? 'পোড়া ক্ষতের ক্ষেত্রে: অবিলম্বে ক্ষতস্থানটি কমপক্ষে ১০-২০ মিনিট মৃদু ঠান্ডা চলমান পানির নিচে রাখুন। বরফ, মাখন বা টুথপেস্ট ব্যবহার করবেন না। পরিষ্কার জীবাণুমুক্ত ব্যান্ডেজ দিয়ে আলতো করে ঢেকে রাখুন।'
          : 'For thermal burns: Immediately run cool (not icy) tap water over the burn for 10-20 minutes. Do not apply ice, butter, or toothpaste. Cover loosely with sterile dressing. If blisters form, do not burst them.';
      } else if (lower.includes('headache') || lower.includes('মাথা ব্যথা')) {
        reply = language === 'bn'
          ? 'মাথাব্যথার ক্ষেত্রে পর্যাপ্ত পানি পান করুন, বিশ্রাম নিন এবং অতিরিক্ত স্ক্রিন টাইম এড়িয়ে চলুন। তবে যদি মাথাব্যথা হঠাৎ তীব্র হয়, দৃষ্টিশক্তি ঝাপসা হয়ে যায় বা ঘাড় শক্ত হয়ে যায়, তবে অবিলম্বে চিকিৎসকের পরামর্শ নিন।'
          : 'For mild tension headaches, ensure proper hydration, rest in a quiet dim room, and minimize screen exposure. Seek immediate medical evaluation if accompanied by sudden "thunderclap" onset, high fever, neck stiffness, or neurological changes.';
      } else {
        reply = language === 'bn'
          ? 'আপনার লক্ষণগুলো পর্যবেক্ষণ করা হচ্ছে। এটি সাধারণ স্বাস্থ্য নির্দেশিকা। সুনির্দিষ্ট রোগ নির্ণয় বা ঔষধের জন্য একজন নিবন্ধিত চিকিৎসকের সাথে পরামর্শ করার পরামর্শ দেওয়া হচ্ছে।'
          : 'Based on our reviewed clinical guidelines, these symptoms warrant careful monitoring and rest. If symptoms persist beyond 24-48 hours or worsen, please schedule a consultation with a registered healthcare provider through our Doctor Directory.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEmergency: hasEmergency
        }
      ]);
      setIsTyping(false);
    }, 900);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // simulate speech recognition
      handleSend(language === 'bn' ? 'আমার কিছুটা শ্বাসকষ্ট ও মাথা ঘুরছে' : 'I am experiencing mild dizziness and shortness of breath');
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        handleSend(language === 'bn' ? 'হাতের পোড়া ক্ষতের জন্য কি করব?' : 'What is the immediate first aid for a kitchen burn on the hand?');
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col h-[640px] max-h-[90vh] overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0D1B2A] text-white px-5 py-4 flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">MedICARE AI Symptom Assistant</h3>
                <DemoBadge label="DEMO RAG" />
              </div>
              <p className="text-xs text-slate-400">Grounded Medical Retrieval • Bilingual (EN / বাংলা)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-navy-800 hover:bg-navy-700 text-teal-400 border border-teal-500/30 flex items-center gap-1 transition"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5" />
              {language === 'en' ? 'বাংলায় দেখুন' : 'Switch to EN'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Emergency Alert Banner if triggered */}
        {emergencyAlert && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2.5 flex items-center justify-between text-xs text-red-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 animate-bounce" />
              <span>
                <strong>Emergency Warning Detected:</strong> Immediate clinician review recommended.
              </span>
            </div>
            <a
              href="tel:999"
              className="px-2.5 py-1 bg-red-600 text-white font-bold rounded hover:bg-red-700 text-xs transition"
            >
              Call 999
            </a>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                    : msg.isEmergency
                    ? 'bg-red-50 text-red-950 border border-red-300 rounded-bl-none shadow-sm'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1 text-[11px] opacity-75">
                  <span className="font-semibold">
                    {msg.sender === 'user' ? 'You' : 'MedICARE AI'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2 text-xs text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                <span>Searching verified clinical guidelines...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs text-slate-600">
          <span className="font-semibold text-slate-400 text-[11px] uppercase whitespace-nowrap">
            Try:
          </span>
          <button
            onClick={() => handleSend(language === 'bn' ? 'আমার হাত কেটে রক্তক্ষরণ হচ্ছে' : 'First aid for severe kitchen cut')}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 whitespace-nowrap transition"
          >
            {language === 'bn' ? 'হাত কাটার ফার্স্ট-এইড' : 'Cut First-Aid'}
          </button>
          <button
            onClick={() => handleSend(language === 'bn' ? 'গরম পানিতে হাত পুড়ে গেছে' : 'Boiling water thermal burn care')}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 whitespace-nowrap transition"
          >
            {language === 'bn' ? 'পোড়া ক্ষতের নিয়ম' : 'Thermal Burn'}
          </button>
          <button
            onClick={() => handleSend(language === 'bn' ? 'তীব্র বুকে ব্যথা এবং শ্বাসকষ্ট' : 'Severe chest pain with sweating')}
            className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 whitespace-nowrap transition"
          >
            {language === 'bn' ? 'বুকে ব্যথা (জরুরি)' : 'Chest Pain (Emergency)'}
          </button>
        </div>

        {/* Input Bar */}
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
              onClick={toggleRecording}
              className={`p-2.5 rounded-xl border transition ${
                isRecording
                  ? 'bg-red-500 text-white border-red-600 animate-pulse'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
              }`}
              title={isRecording ? 'Listening (Click to stop)' : 'Voice Input (Bengali / English)'}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'আপনার লক্ষণ বা স্বাস্থ্য সম্পর্কিত প্রশ্ন লিখুন...'
                  : 'Describe your symptoms or ask first-aid guidance...'
              }
              className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
              title="Send Message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              Reviewed knowledge retrieval • Never gives definitive prescriptions
            </span>
            <span>English & বাংলা Voice Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};
