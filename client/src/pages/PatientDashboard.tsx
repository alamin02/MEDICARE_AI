import React, { useState } from 'react';
import {
  Activity,
  User,
  Calendar,
  Camera,
  HeartPulse,
  Hospital as HospIcon,
  Stethoscope,
  Video,
  FileText,
  ShieldCheck,
  Bell,
  Clock,
  Plus,
  AlertTriangle,
  ChevronRight,
  LogOut,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DemoBadge } from '../components/common/DemoBadge';
import { AIChatModal } from '../components/chat/AIChatModal';
import { InjuryUploadModal } from '../components/medical/InjuryUploadModal';
import { FirstAidTriage } from '../components/medical/FirstAidTriage';
import { HospitalMap } from '../components/medical/HospitalMap';
import { AppointmentBookingModal } from '../components/medical/AppointmentBookingModal';
import { TelehealthRoom } from '../components/medical/TelehealthRoom';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_INJURY_ANALYSES,
  INITIAL_RECORDS,
  INITIAL_NOTIFICATIONS,
  DOCTORS,
  SPECIALTIES
} from '../services/syntheticData';
import { Appointment, DoctorProfile, InjuryAnalysis } from '../types';

export const PatientDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'appointments' | 'injury' | 'firstaid' | 'hospitals' | 'doctors' | 'records' | 'telehealth' | 'profile'
  >('overview');

  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [injuryAnalyses, setInjuryAnalyses] = useState<InjuryAnalysis[]>(INITIAL_INJURY_ANALYSES);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isInjuryModalOpen, setIsInjuryModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState('ALL');

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'CANCELLED' } : apt))
    );
  };

  const handleBookingSuccess = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  const handleInjuryScanSuccess = (newAnalysis: InjuryAnalysis) => {
    setInjuryAnalyses((prev) => [newAnalysis, ...prev]);
  };

  const filteredDoctors = DOCTORS.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      doc.hospital_name.toLowerCase().includes(doctorSearch.toLowerCase());
    const matchesSpec =
      selectedSpecialtyFilter === 'ALL' ||
      doc.specialty.toLowerCase() === selectedSpecialtyFilter.toLowerCase();
    return matchesSearch && matchesSpec;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-800">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0D1B2A] text-white p-5 flex flex-col justify-between border-r border-navy-800">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                MedICARE <span className="text-blue-500">AI</span>
              </span>
              <div className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider">
                Patient Portal
              </div>
            </div>
          </div>

          <DemoBadge label="PATIENT WORKSPACE" className="w-full justify-center" />

          {/* User Profile Snippet */}
          <div className="p-3 bg-navy-900 rounded-xl border border-navy-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600/30 border border-blue-500 flex items-center justify-center text-blue-400 font-bold">
              {user?.name?.[0] || 'P'}
            </div>
            <div className="truncate text-xs">
              <div className="font-bold text-white truncate">{user?.name || 'Rahim Chowdhury (Demo)'}</div>
              <div className="text-[10px] text-slate-400 truncate">{user?.email || 'patient.demo@example.com'}</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'appointments'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <span className="flex items-center gap-3">
                <Calendar className="w-4 h-4" />
                <span>Appointments</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-navy-800 text-[10px]">
                {appointments.filter((a) => a.status === 'CONFIRMED').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('injury')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'injury'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>AI Injury Scans</span>
            </button>

            <button
              onClick={() => setActiveTab('firstaid')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'firstaid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>Emergency First Aid</span>
            </button>

            <button
              onClick={() => setActiveTab('hospitals')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'hospitals'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <HospIcon className="w-4 h-4" />
              <span>Find Hospitals</span>
            </button>

            <button
              onClick={() => setActiveTab('doctors')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'doctors'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Find Doctors</span>
            </button>

            <button
              onClick={() => setActiveTab('records')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'records'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Medical Records</span>
            </button>

            <button
              onClick={() => setActiveTab('telehealth')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'telehealth'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Telehealth Room</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Health Profile</span>
            </button>
          </nav>
        </div>

        {/* Bottom CTA / Logout */}
        <div className="pt-6 border-t border-navy-800 space-y-3">
          <button
            onClick={() => setIsChatModalOpen(true)}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask AI Assistant</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-navy-900 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-h-screen">
        {/* Top greeting bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              Welcome back, {user?.name?.split(' ')?.[0] || 'Rahim'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Your personal multimodal healthcare and consultation portal
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsInjuryModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 flex items-center gap-1.5 shadow-sm transition"
            >
              <Camera className="w-4 h-4" />
              <span>New Injury Scan</span>
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className="px-4 py-2 bg-white border border-slate-200 text-navy text-xs font-bold rounded-xl hover:bg-slate-50 flex items-center gap-1.5 shadow-sm transition"
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Upcoming Consultations
                </span>
                <div className="text-2xl font-extrabold text-navy mt-1">
                  {appointments.filter((a) => a.status === 'CONFIRMED').length}
                </div>
                <div className="text-xs text-blue-600 font-medium mt-1">Next: Nov 25 at 05:30 PM</div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  AI Injury Scans
                </span>
                <div className="text-2xl font-extrabold text-navy mt-1">
                  {injuryAnalyses.length}
                </div>
                <div className="text-xs text-teal-600 font-medium mt-1">Latest: Forearm cut (Low)</div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Medical Records
                </span>
                <div className="text-2xl font-extrabold text-navy mt-1">
                  {INITIAL_RECORDS.length}
                </div>
                <div className="text-xs text-purple-600 font-medium mt-1">CBC, ECG & Burn Prescription</div>
              </div>

              <div className="p-5 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200 shadow-soft">
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                  Emergency Escalation
                </span>
                <div className="text-2xl font-extrabold text-red-700 mt-1">999 / 911</div>
                <div className="text-xs text-red-600 font-medium mt-1">24/7 National Emergency</div>
              </div>
            </div>

            {/* Upcoming Appointments Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-navy flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Scheduled Consultations</span>
                </h3>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  View All ({appointments.length})
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Doctor & Specialty</th>
                      <th className="py-3 px-4">Hospital</th>
                      <th className="py-3 px-4">Date & Slot</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.slice(0, 3).map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-navy">
                          {apt.doctor_name}
                          <div className="text-[11px] text-blue-600 font-normal">{apt.specialty}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{apt.hospital_name}</td>
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          {apt.date} • {apt.time_slot}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              apt.status === 'CONFIRMED'
                                ? 'bg-green-100 text-green-800'
                                : apt.status === 'PENDING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {apt.status === 'CONFIRMED' && (
                            <button
                              onClick={() => setActiveTab('telehealth')}
                              className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-semibold mr-2"
                            >
                              Join Call
                            </button>
                          )}
                          {apt.status !== 'CANCELLED' && (
                            <button
                              onClick={() => handleCancelAppointment(apt.id)}
                              className="text-xs text-red-600 hover:underline font-semibold"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent AI Injury Scans */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-navy flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <span>Recent AI Injury Scans</span>
                </h3>
                <button
                  onClick={() => setIsInjuryModalOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  + Upload New Photo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {injuryAnalyses.map((inj) => (
                  <div
                    key={inj.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-bold text-navy">{inj.image_name}</div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                        {inj.severity_level}
                      </span>
                    </div>
                    <p className="text-slate-600">{inj.findings[0]}</p>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Rec: <strong>{inj.recommended_specialty}</strong></span>
                      <span>{new Date(inj.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-navy">Appointment History & Schedule</h3>
                <p className="text-xs text-slate-500">
                  Track upcoming and past clinical visits with zero double-booking
                </p>
              </div>
              <button
                onClick={() => setActiveTab('doctors')}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-sm transition"
              >
                + Book New Appointment
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Doctor</th>
                    <th className="py-3 px-4">Specialty & Facility</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Reported Symptoms</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-navy">{apt.doctor_name}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {apt.specialty} • {apt.hospital_name}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {apt.date} • {apt.time_slot}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{apt.symptoms}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            apt.status === 'CONFIRMED'
                              ? 'bg-green-100 text-green-800'
                              : apt.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {apt.status === 'CONFIRMED' && (
                          <button
                            onClick={() => setActiveTab('telehealth')}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-semibold mr-2"
                          >
                            Telehealth
                          </button>
                        )}
                        {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleCancelAppointment(apt.id)}
                            className="text-xs text-red-600 hover:underline font-semibold"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: INJURY SCANS */}
        {activeTab === 'injury' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-navy">Multimodal AI Injury Analysis Vault</h3>
                <p className="text-xs text-slate-500">
                  Photographic inspection for superficial trauma, safe first-aid, and specialty matching
                </p>
              </div>
              <button
                onClick={() => setIsInjuryModalOpen(true)}
                className="px-4 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-sm transition"
              >
                <Camera className="w-4 h-4" />
                <span>Upload New Injury Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {injuryAnalyses.map((inj) => (
                <div
                  key={inj.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="text-sm font-bold text-navy">{inj.image_name}</h4>
                      <span className="text-[11px] text-slate-400">
                        {new Date(inj.created_at).toLocaleString()}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                      Severity: {inj.severity_level}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-slate-700 uppercase text-[10px]">Findings:</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      {inj.findings.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-red-50 rounded-xl border border-red-200 space-y-1 text-xs text-red-900">
                    <span className="font-bold uppercase text-[10px] text-red-700">Danger Warnings:</span>
                    <p>{inj.danger_signs[0]}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Specialist: <strong className="text-navy">{inj.recommended_specialty}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setActiveTab('doctors');
                        setSelectedSpecialtyFilter(inj.recommended_specialty.split(' ')[0]);
                      }}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Find Doctors →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FIRST AID */}
        {activeTab === 'firstaid' && (
          <div className="animate-in fade-in">
            <FirstAidTriage />
          </div>
        )}

        {/* TAB 5: HOSPITALS */}
        {activeTab === 'hospitals' && (
          <div className="animate-in fade-in">
            <HospitalMap />
          </div>
        )}

        {/* TAB 6: DOCTORS */}
        {activeTab === 'doctors' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-navy">Discover Registered Specialists</h3>
                  <p className="text-xs text-slate-500">
                    Verified clinical appointments with real-time slot selection
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search doctor or specialty..."
                      value={doctorSearch}
                      onChange={(e) => setDoctorSearch(e.target.value)}
                      className="pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Specialty Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
                <button
                  onClick={() => setSelectedSpecialtyFilter('ALL')}
                  className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition ${
                    selectedSpecialtyFilter === 'ALL'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Specialties
                </button>
                {SPECIALTIES.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => setSelectedSpecialtyFilter(spec.name)}
                    className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition ${
                      selectedSpecialtyFilter === spec.name
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {spec.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doc) => (
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
                    <p className="text-[11px] text-slate-500">{doc.hospital_name}</p>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{doc.bio}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Fee</span>
                      <div className="text-xs font-bold text-green-700">৳{doc.consultation_fee} (Demo)</div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedDoctor(doc);
                        setIsBookingOpen(true);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition"
                    >
                      Book Visit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: RECORDS */}
        {activeTab === 'records' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-navy">Health Records & Laboratory Reports</h3>
                <p className="text-xs text-slate-500">
                  Encrypted patient documentation and clinician review logs
                </p>
              </div>
              <DemoBadge label="PATIENT ISOLATED" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {INITIAL_RECORDS.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-navy">{rec.title}</h4>
                      <span className="text-[11px] text-slate-400">{rec.date} • {rec.hospital_name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      {rec.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {rec.summary}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Clinician: <strong>{rec.doctor_name}</strong></span>
                    <button className="text-blue-600 font-semibold hover:underline">
                      View Document
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: TELEHEALTH */}
        {activeTab === 'telehealth' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-navy">Encrypted Telehealth Consultation</h3>
                <p className="text-xs text-slate-500">
                  Virtual clinic room with two-way camera, audio, and clinical prescription notes
                </p>
              </div>
              <DemoBadge label="LIVE SIMULATION" />
            </div>

            <TelehealthRoom onEndCall={() => setActiveTab('overview')} />
          </div>
        )}

        {/* TAB 9: PROFILE & CONSENT */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-soft max-w-3xl space-y-6 animate-in fade-in">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-navy">Personal Health Profile & Privacy</h3>
              <p className="text-xs text-slate-500">
                Manage your physiological baseline and data sharing consent
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  disabled
                  value={user?.name || 'Rahim Chowdhury (Demo)'}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                <input
                  type="text"
                  disabled
                  value="A+ (Positive)"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Emergency Contact</label>
                <input
                  type="text"
                  disabled
                  value="+880 1819-999888 (Demo)"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Known Allergies</label>
                <input
                  type="text"
                  disabled
                  value="Penicillin, Peanuts"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Privacy & Data Retention Settings
              </h4>
              <div className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                <span className="text-xs text-slate-700">
                  Allow verified attending clinicians to review uploaded injury scans during consultations
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                <span className="text-xs text-slate-700">
                  Anonymize image data for synthetic AI benchmark validation
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AIChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} />
      <InjuryUploadModal
        isOpen={isInjuryModalOpen}
        onClose={() => setIsInjuryModalOpen(false)}
        onAnalysisComplete={handleInjuryScanSuccess}
        onBookSpecialist={(spec) => {
          setIsInjuryModalOpen(false);
          setActiveTab('doctors');
          setSelectedSpecialtyFilter(spec.split(' ')[0]);
        }}
      />
      <AppointmentBookingModal
        doctor={selectedDoctor}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
};
