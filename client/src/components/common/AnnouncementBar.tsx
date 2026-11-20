import React from 'react';
import { ShieldAlert, PhoneCall } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#0D1B2A] text-white text-xs sm:text-sm py-2 px-4 border-b border-navy-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            <strong className="text-amber-400 font-semibold">Medical Safety Notice:</strong> MedICARE AI provides assistive educational information and is not a substitute for certified clinical diagnosis.
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <span>Life-threatening emergency? Call</span>
          <a
            href="tel:999"
            className="inline-flex items-center gap-1 font-bold text-red-400 hover:text-red-300 bg-red-950/60 px-2 py-0.5 rounded border border-red-800 transition"
          >
            <PhoneCall className="w-3 h-3" />
            999 / 911
          </a>
        </div>
      </div>
    </div>
  );
};
