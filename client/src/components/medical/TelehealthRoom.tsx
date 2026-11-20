import React, { useState } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  FileText,
  User,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { DemoBadge } from '../common/DemoBadge';

export const TelehealthRoom: React.FC<{
  doctorName?: string;
  patientName?: string;
  onEndCall?: () => void;
}> = ({
  doctorName = 'Dr. Nusrat Jahan (Demo)',
  patientName = 'Rahim Chowdhury (Demo)',
  onEndCall
}) => {
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [callEnded, setCallEnded] = useState(false);
  const [notes, setNotes] = useState('Patient reported recovery after first-aid thermal burn protocol. Wound edges clean, no purulent drainage.');

  return (
    <div className="bg-[#0D1B2A] text-white rounded-2xl overflow-hidden shadow-elevated border border-navy-800 flex flex-col h-[580px]">
      {/* Top Session Bar */}
      <div className="bg-navy-900 px-6 py-3 border-b border-navy-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <div>
            <h4 className="text-sm font-bold flex items-center gap-2">
              <span>Encrypted Telehealth Consultation</span>
              <DemoBadge label="DEMO WEBRTC" />
            </h4>
            <p className="text-xs text-slate-400">
              Doctor: {doctorName} • Patient: {patientName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-teal-400 bg-teal-950/60 border border-teal-800 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Peer-to-Peer Encrypted</span>
        </div>
      </div>

      {/* Main Video Grid */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-navy-950">
        {/* Doctor Video Tile */}
        <div className="relative rounded-2xl bg-navy-900 border border-navy-800 flex flex-col items-center justify-center overflow-hidden group">
          <div className="w-24 h-24 rounded-full bg-blue-600/20 border-2 border-blue-500 flex items-center justify-center text-blue-400 mb-2">
            <User className="w-12 h-12" />
          </div>
          <span className="text-sm font-semibold">{doctorName}</span>
          <span className="text-xs text-slate-400">Attending Clinician (Active)</span>

          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] text-white">
            1080p HD • 60 FPS (Simulated)
          </div>
        </div>

        {/* Patient Video Tile */}
        <div className="relative rounded-2xl bg-navy-900 border border-navy-800 flex flex-col items-center justify-center overflow-hidden">
          {videoEnabled ? (
            <>
              <div className="w-24 h-24 rounded-full bg-teal-600/20 border-2 border-teal-500 flex items-center justify-center text-teal-400 mb-2">
                <User className="w-12 h-12" />
              </div>
              <span className="text-sm font-semibold">{patientName}</span>
              <span className="text-xs text-slate-400">Patient (Self)</span>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500">
              <VideoOff className="w-12 h-12 mb-2" />
              <span className="text-xs">Camera is muted</span>
            </div>
          )}

          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {!micEnabled && (
              <span className="p-1 bg-red-600 rounded text-white text-[10px]">
                <MicOff className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="bg-navy-900 p-4 border-t border-navy-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMicEnabled(!micEnabled)}
            className={`p-3 rounded-xl transition ${
              micEnabled ? 'bg-navy-800 hover:bg-navy-700 text-white' : 'bg-red-600 text-white'
            }`}
            title={micEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setVideoEnabled(!videoEnabled)}
            className={`p-3 rounded-xl transition ${
              videoEnabled ? 'bg-navy-800 hover:bg-navy-700 text-white' : 'bg-red-600 text-white'
            }`}
            title={videoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCallEnded(true);
              if (onEndCall) onEndCall();
            }}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Consultation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
