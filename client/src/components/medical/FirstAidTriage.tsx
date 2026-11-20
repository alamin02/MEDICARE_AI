import React, { useState } from 'react';
import {
  Flame,
  Droplet,
  AlertTriangle,
  Bone,
  Search,
  Globe,
  PhoneCall,
  CheckCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { FIRST_AID_GUIDES } from '../../services/syntheticData';
import { DemoBadge } from '../common/DemoBadge';

export const FirstAidTriage: React.FC = () => {
  const [selectedGuideId, setSelectedGuideId] = useState<string>('fa-1');
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [searchTerm, setSearchTerm] = useState('');

  const currentGuide =
    FIRST_AID_GUIDES.find((g) => g.id === selectedGuideId) || FIRST_AID_GUIDES[0];

  const filteredGuides = FIRST_AID_GUIDES.filter((g) => {
    const term = searchTerm.toLowerCase();
    return (
      g.title_en.toLowerCase().includes(term) ||
      g.title_bn.includes(term) ||
      g.condition.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0D1B2A] to-navy-800 text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold">Emergency & First-Aid Protocol</h3>
            <DemoBadge label="CLINICALLY REVIEWED" />
          </div>
          <p className="text-xs text-slate-300">
            Rapid bilingual triage procedures for acute injuries and trauma
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="px-3 py-1.5 rounded-lg bg-navy-900 border border-teal-500/30 text-teal-300 text-xs font-semibold hover:bg-navy-800 flex items-center gap-1.5 transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'বাংলা সংস্করণ' : 'English Version'}</span>
          </button>
          <a
            href="tel:999"
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>999 Emergency</span>
          </a>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conditions List / Selector */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={language === 'bn' ? 'আঘাত বা জরুরি অবস্থা খুঁজুন...' : 'Search injury or condition...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            {filteredGuides.map((guide) => (
              <button
                key={guide.id}
                onClick={() => setSelectedGuideId(guide.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                  selectedGuideId === guide.id
                    ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">
                    {language === 'bn' ? guide.title_bn : guide.title_en}
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {guide.condition.replace('_', ' ')}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    guide.severity === 'CRITICAL'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {guide.severity}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Protocol View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Action Protocol
              </span>
              <h4 className="text-lg font-bold text-navy">
                {language === 'bn' ? currentGuide.title_bn : currentGuide.title_en}
              </h4>
            </div>
            {currentGuide.is_emergency && (
              <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                Acute Emergency
              </span>
            )}
          </div>

          {/* Warning Banner */}
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">
                {language === 'bn' ? 'সতর্কতা: ' : 'Emergency Warning Signs: '}
              </strong>
              <span>
                {language === 'bn'
                  ? currentGuide.warnings_bn.join(' ')
                  : currentGuide.warnings_en.join(' ')}
              </span>
            </div>
          </div>

          {/* Step-by-Step Guidance */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {language === 'bn' ? 'ধাপ অনুযায়ী করণীয়:' : 'Step-by-Step Immediate Steps:'}
            </h5>
            {(language === 'bn' ? currentGuide.steps_bn : currentGuide.steps_en).map((step, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 text-xs leading-relaxed text-slate-800"
              >
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p>{step}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Reviewed by MedICARE Clinical Guidelines Working Group
            </span>
            <span>Do not administer unprescribed medications</span>
          </div>
        </div>
      </div>
    </div>
  );
};
