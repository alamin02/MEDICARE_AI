import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Bot,
  Camera,
  HeartPulse,
  Hospital as HospIcon,
  Stethoscope,
  Mic,
  Video,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Clock,
  Globe,
  Award,
  Users
} from 'lucide-react';
import { AnnouncementBar } from '../components/common/AnnouncementBar';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { DemoBadge } from '../components/common/DemoBadge';
import { AIChatModal } from '../components/chat/AIChatModal';
import { InjuryUploadModal } from '../components/medical/InjuryUploadModal';
import { FirstAidTriage } from '../components/medical/FirstAidTriage';
import { HospitalMap } from '../components/medical/HospitalMap';
import { AppointmentBookingModal } from '../components/medical/AppointmentBookingModal';
import { DOCTORS, SPECIALTIES } from '../services/syntheticData';
import { DoctorProfile } from '../types';

export const LandingPage: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInjuryUploadOpen, setIsInjuryUploadOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleBookDoctor = (doc: DoctorProfile) => {
    setSelectedDoctor(doc);
    setIsBookingOpen(true);
  };

  const faqs = [
    {
      q: 'Does MedICARE AI give definitive medical diagnoses?',
      a: 'No. MedICARE AI is an assistive technology that provides educational symptom insights and reviewed first-aid protocols. It does not replace clinical judgment or provide autonomous prescriptions.'
    },
    {
      q: 'How does the multimodal AI injury analysis work?',
      a: 'Users can upload photographs of superficial cuts, burns, or bruises. The vision AI inspects visible features, displays uncertainty, flags danger signs, and recommends immediate safe first aid plus appropriate medical specialties.'
    },
    {
      q: 'Is Bengali (বাংলা) language supported for voice and chat?',
      a: 'Yes! MedICARE AI provides bilingual interaction in both English and Bengali (বাংলা), supporting text queries and spoken audio interaction for accessibility.'
    },
    {
      q: 'Are the doctors and hospitals shown in the demo real?',
      a: 'All records in this demo environment are synthetic (DEMO / SYNTHETIC) to ensure patient privacy and responsible healthcare AI demonstration. Real provider integrations will connect to certified health authorities.'
    },
    {
      q: 'What should I do during a life-threatening medical emergency?',
      a: 'In any life-threatening situation (such as severe chest pain, inability to breathe, massive bleeding, or loss of consciousness), do not wait for AI analysis. Immediately call 999 (in Bangladesh) or 911.'
    },
    {
      q: 'Can doctors review and approve appointment requests?',
      a: 'Yes. The platform provides a dedicated Doctor Workspace where verified clinicians can accept, reschedule, or review patient consultation requests with double-booking prevention.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* 3. Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-blue-50/60 via-white to-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-xs font-bold tracking-wide border border-blue-200">
                <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                <span>Next-Generation Multimodal Healthcare Assistant</span>
                <DemoBadge label="DEMO PLATFORM" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0D1B2A] tracking-tight leading-[1.15]">
                Your Personal AI Healthcare{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  Companion.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                From understanding injuries to finding the right doctor, MedICARE AI helps connect patients with accessible healthcare services through grounded multimodal AI.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <Link
                  to="/login"
                  className="px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-elevated shadow-blue-500/25 flex items-center gap-2 transition"
                >
                  <span>Launch Demo Portals</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setIsInjuryUploadOpen(true)}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-navy bg-white hover:bg-slate-50 border border-slate-300 shadow-sm flex items-center gap-2 transition"
                >
                  <Camera className="w-4 h-4 text-blue-600" />
                  <span>Scan Injury Photo</span>
                </button>

                <a
                  href="#hospitals"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition"
                >
                  Find Hospitals
                </a>
              </div>

              {/* Quick Feature Badges */}
              <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Bilingual English & বাংলা Voice
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Multimodal RAG Retrieval
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Strict Emergency Safety Guardrails
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. AI Healthcare Introduction */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Healthcare Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mt-1">
                A Unified Multimodal Health Architecture
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Built to solve the critical gap between early symptom uncertainty and timely professional medical intervention.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-navy">Multimodal Vision Triage</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upload photos of cuts, burns, or bruises. Receive instant structured findings, warning signals, and safe first-aid protocols.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition space-y-3">
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-navy">Evidence-Based RAG</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every AI response queries clinically reviewed medical documents in English and Bengali. Unsupported prescriptions are strictly barred.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-navy">Verified Provider Network</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Discover 24/7 trauma hospitals, filter by ICU bed availability, and book verified doctor appointments without double-booking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. How MedICARE AI Works */}
        <section id="how-it-works" className="py-20 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Step-by-Step Workflow
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mt-1">
                How MedICARE AI Works
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Four simple steps from early symptom detection to clinical follow-up.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-soft space-y-3 relative">
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center">
                  01
                </div>
                <h4 className="text-sm font-bold text-navy">Upload or Describe</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Take a photo of an injury or type your symptoms via voice or text in English or Bengali.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-soft space-y-3 relative">
                <div className="w-9 h-9 rounded-lg bg-teal-600 text-white font-extrabold text-sm flex items-center justify-center">
                  02
                </div>
                <h4 className="text-sm font-bold text-navy">Multimodal RAG Analysis</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our AI vision model and knowledge retrieval pipeline assess visual patterns against medical guidelines.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-soft space-y-3 relative">
                <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center">
                  03
                </div>
                <h4 className="text-sm font-bold text-navy">First-Aid & Danger Flags</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Get immediate step-by-step first-aid steps, danger sign indicators, and emergency escalation warnings.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-soft space-y-3 relative">
                <div className="w-9 h-9 rounded-lg bg-navy text-white font-extrabold text-sm flex items-center justify-center">
                  04
                </div>
                <h4 className="text-sm font-bold text-navy">Connect With Specialists</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Locate nearby trauma hospitals or schedule an appointment with a verified specialist doctor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. AI Injury Image Analysis Showcase */}
        <section id="injury-analysis" className="py-20 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Multimodal Computer Vision</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
                  Instant AI Injury Photo Assessment
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upload photos of superficial wounds, burns, and bruises. The vision model evaluates tissue margins, flags critical danger signs, and prepares a structured first-aid triage summary.
                </p>
                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Safe immediate first-aid guidance for cuts, burns, and sprains</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Calculates uncertainty; never claims a photo confirms a fracture</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Explicit DEMO status when operating in simulated environment</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => setIsInjuryUploadOpen(true)}
                    className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Try Injury Photo Scanner</span>
                  </button>
                  <DemoBadge label="SIMULATED VISION" />
                </div>
              </div>

              {/* Visual Card Mockup */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-elevated space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-navy flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    Sample Injury Analysis Preview
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800">
                    Severity: LOW
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Visible Findings:</span>
                  <p className="text-slate-800">
                    • Superficial dermis laceration on left forearm with localized marginal erythema.
                  </p>
                  <p className="text-slate-800">
                    • Intact capillary refill; no deep arterial hemorrhage observed.
                  </p>
                </div>
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 space-y-1 text-xs text-teal-900">
                  <span className="text-[10px] font-bold uppercase text-teal-700">Immediate First Aid:</span>
                  <p>1. Cool running water for 5 minutes. 2. Apply gentle pressure with sterile gauze.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Emergency First-Aid Assistance Showcase */}
        <section id="first-aid" className="py-20 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Life-Saving Procedures
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mt-1">
                Emergency First-Aid Assistant
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Medically reviewed step-by-step guidance in English and বাংলা for burns, bleeding, choking, and fractures.
              </p>
            </div>

            {/* Embedded interactive FirstAidTriage component */}
            <FirstAidTriage />
          </div>
        </section>

        {/* 8. Nearby Hospital Discovery */}
        <section id="hospitals" className="py-20 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Hospital Discovery
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mt-1">
                Locate 24/7 Trauma Centers & Clinics
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Filter by Government vs. Private, active ICU beds, and specialized departments.
              </p>
            </div>

            {/* Embedded interactive HospitalMap component */}
            <HospitalMap />
          </div>
        </section>

        {/* 9. Doctor Discovery Preview */}
        <section className="py-20 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Verified Clinicians
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mt-1">
                Discover Registered Specialists
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Select your specialty, view doctor qualifications, and reserve clinical appointment slots.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DOCTORS.slice(0, 6).map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between space-y-4 hover:border-blue-300 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-navy flex items-center gap-1.5">
                          <span>{doc.name}</span>
                          {doc.is_verified && (
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                              Verified
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-blue-600 font-semibold">{doc.specialty}</p>
                      </div>
                      <span className="text-xs font-bold text-amber-500">★ {doc.rating}</span>
                    </div>

                    <p className="text-[11px] text-slate-500">{doc.qualifications}</p>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{doc.bio}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Fee</span>
                      <div className="text-xs font-bold text-green-700">৳{doc.consultation_fee} (Demo)</div>
                    </div>
                    <button
                      onClick={() => handleBookDoctor(doc)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition"
                    >
                      Book Visit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. AI Voice Assistant */}
        <section id="voice-assistant" className="py-20 bg-gradient-to-br from-[#0D1B2A] to-navy-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
                  <Mic className="w-3.5 h-3.5 text-teal-400" />
                  <span>Speech-to-Text & Spoken Audio</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Bilingual Voice AI in English and বাংলা
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Healthcare should have no literacy or language barriers. MedICARE AI supports natural voice input and audio playback in both Bengali and English for rapid emergency queries.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Launch Voice Assistant</span>
                  </button>
                  <DemoBadge label="BENGALI TTS/STT" />
                </div>
              </div>

              <div className="lg:col-span-6 p-6 rounded-3xl bg-navy-800/80 border border-navy-700 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-navy-700">
                  <span className="flex items-center gap-1.5 font-semibold text-teal-400">
                    <Globe className="w-4 h-4" />
                    Live Bilingual Voice Sample
                  </span>
                  <span>Audio Waveform Simulated</span>
                </div>
                <div className="p-4 bg-navy-950 rounded-2xl border border-navy-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="font-bold text-teal-400">User (Voice):</span>
                    <span>"আমার আঙ্গুল কেটে গেছে এবং রক্ত পড়ছে, আমি কি করব?"</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-blue-300">
                    <span className="font-bold text-blue-400">AI (Voice):</span>
                    <span>"পরিষ্কার কাপড় দিয়ে ক্ষতের ওপর ৫-১০ মিনিট চেপে রাখুন..."</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11. Telehealth Consultation Preview */}
        <section className="py-20 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <Video className="w-3.5 h-3.5" />
              <span>Virtual Health Consultation</span>
            </div>
            <h2 className="text-3xl font-extrabold text-navy">
              Virtual Doctor Consultations from Home
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Connect with certified medical specialists via encrypted WebRTC telehealth rooms with shared notes and digital prescription workflows.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                to="/login"
                className="px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition"
              >
                Experience Telehealth in Patient Portal
              </Link>
            </div>
          </div>
        </section>

        {/* 12. Features and Benefits */}
        <section className="py-20 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Core Advantages
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mt-1">
                Built for Safety, Speed, and Compliance
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-soft space-y-3">
                <ShieldAlert className="w-8 h-8 text-blue-600" />
                <h4 className="text-sm font-bold text-navy">No Fabricated Prescriptions</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Strict boundaries prevent AI from prescribing prescription-only pharmaceuticals.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-soft space-y-3">
                <Clock className="w-8 h-8 text-teal-600" />
                <h4 className="text-sm font-bold text-navy">Rapid Emergency Routing</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Instant escalation for acute chest pain, trauma, or airway obstruction conditions.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-soft space-y-3">
                <Award className="w-8 h-8 text-purple-600" />
                <h4 className="text-sm font-bold text-navy">Clinician Review Pipeline</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Doctor workspace enables registered physicians to verify patient AI scans.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-soft space-y-3">
                <Globe className="w-8 h-8 text-indigo-600" />
                <h4 className="text-sm font-bold text-navy">Bilingual Inclusion</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Native Bengali and English voice accessibility ensures care reaches rural communities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 13. FAQ Accordion */}
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Common Inquiries
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mt-1">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left bg-slate-50 hover:bg-slate-100 flex items-center justify-between gap-4 font-bold text-sm text-navy"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 sm:p-5 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 14. Contact Form */}
        <section className="py-20 bg-[#F8FAFC]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-elevated space-y-6">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Connect With Our Team
                </span>
                <h3 className="text-2xl font-bold text-navy">Healthcare Support & Feedback</h3>
                <p className="text-xs text-slate-500">
                  Have questions about our medical RAG pipeline or healthcare partnership? Send us a message.
                </p>
              </div>

              {contactSubmitted ? (
                <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                  <h4 className="text-sm font-bold text-green-900">Message Received!</h4>
                  <p className="text-xs text-green-700">
                    Thank you for reaching out. Our healthcare ops team will respond to your demo inquiry shortly.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Dr. / Mr. / Ms."
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Topic</label>
                    <select className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500">
                      <option>Clinical Partnership & Hospital Integration</option>
                      <option>AI Medical Safety & Guideline Review</option>
                      <option>Technical Bug / Hackathon Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                    <textarea
                      rows={3}
                      placeholder="Share your question or feedback..."
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-sm"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Floating AI Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-blue-600 text-white shadow-2xl hover:bg-blue-700 hover:scale-105 transition flex items-center gap-2 group"
        title="Open 24/7 AI Medical Assistant"
      >
        <Bot className="w-6 h-6 animate-pulse" />
        <span className="hidden sm:inline text-xs font-bold">Ask MedICARE AI</span>
      </button>

      {/* Modals */}
      <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <InjuryUploadModal
        isOpen={isInjuryUploadOpen}
        onClose={() => setIsInjuryUploadOpen(false)}
        onBookSpecialist={(spec) => {
          setIsInjuryUploadOpen(false);
          const found = DOCTORS.find((d) => d.specialty.toLowerCase().includes(spec.toLowerCase())) || DOCTORS[0];
          handleBookDoctor(found);
        }}
      />
      <AppointmentBookingModal
        doctor={selectedDoctor}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={() => {}}
      />

      {/* 15. Footer */}
      <Footer />
    </div>
  );
};
