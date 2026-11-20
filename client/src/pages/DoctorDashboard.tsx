import React, { useState } from 'react';
import {
  Activity,
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Video,
  ShieldCheck,
  Stethoscope,
  LogOut,
  Sparkles,
  Phone,
  Search,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DemoBadge } from '../components/common/DemoBadge';
import { TelehealthRoom } from '../components/medical/TelehealthRoom';
import { INITIAL_APPOINTMENTS, DOCTORS } from '../services/syntheticData';
import { Appointment, DoctorProfile } from '../types';

export const DoctorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'appointments' | 'patients' | 'telehealth' | 'prescriptions' | 'schedule' | 'profile'
  >('overview');

  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile>(DOCTORS[0]);
  const [availabilityStatus, setAvailabilityStatus] = useState<'AVAILABLE' | 'UNAVAILABLE'>('AVAILABLE');

  // Prescription drafting state
  const [prescriptions, setPrescriptions] = useState<
    { id: string; patient: string; medication: string; instructions: string; date: string }[]
  >([
    {
      id: 'rx-1',
      patient: 'Rahim Chowdhury (Demo)',
      medication: 'Silver Sulfadiazine 1% Cream',
      instructions: 'Apply thin layer twice daily for 7 days on clean dressing.',
      date: '2026-11-15'
    }
  ]);
  const [rxPatient, setRxPatient] = useState('Rahim Chowdhury (Demo)');
  const [rxMed, setRxMed] = useState('');
  const [rxInstr, setRxInstr] = useState('');
  const [rxSuccess, setRxSuccess] = useState(false);

  const handleAcceptAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'CONFIRMED' } : a))
    );
  };

  const handleRejectAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'REJECTED' } : a))
    );
  };

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxMed.trim()) return;

    const newRx = {
      id: `rx-${Date.now()}`,
      patient: rxPatient,
      medication: rxMed,
      instructions: rxInstr,
      date: new Date().toISOString().split('T')[0]
    };

    setPrescriptions((prev) => [newRx, ...prev]);
    setRxMed('');
    setRxInstr('');
    setRxSuccess(true);
    setTimeout(() => setRxSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-800">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0D1B2A] text-white p-5 flex flex-col justify-between border-r border-navy-800">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Stethoscope className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                MedICARE <span className="text-blue-500">AI</span>
              </span>
              <div className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider">
                Doctor Workspace
              </div>
            </div>
          </div>

          <DemoBadge label="CLINICIAN WORKSPACE" className="w-full justify-center" />

          {/* Profile Card */}
          <div className="p-3 bg-navy-900 rounded-xl border border-navy-800 space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{doctorProfile.name}</span>
              {doctorProfile.is_verified && (
                <span title="Admin Verified Clinician">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                </span>
              )}
            </div>
            <div className="text-[11px] text-teal-400 font-semibold">{doctorProfile.specialty}</div>
            <div className="text-[10px] text-slate-400">{doctorProfile.hospital_name}</div>
          </div>

          {/* Nav Links */}
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
                <span>Appointment Requests</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px]">
                {appointments.filter((a) => a.status === 'PENDING').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('patients')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'patients'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Assigned Patients</span>
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
              <span>Telehealth Suite</span>
            </button>

            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'prescriptions'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Digital Prescriptions</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'schedule'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Schedule & Availability</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Credentials & License</span>
            </button>
          </nav>
        </div>

        {/* Bottom CTA / Logout */}
        <div className="pt-6 border-t border-navy-800 space-y-3">
          <div className="p-2.5 bg-navy-900 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-400">Status:</span>
            <button
              onClick={() =>
                setAvailabilityStatus(availabilityStatus === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE')
              }
              className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                availabilityStatus === 'AVAILABLE'
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-red-500/20 text-red-300'
              }`}
            >
              {availabilityStatus}
            </button>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-navy-900 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              Clinician Dashboard — {doctorProfile.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              BMDC Verified • License #{doctorProfile.license_number} • {doctorProfile.specialty}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('telehealth')}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 flex items-center gap-1.5 shadow-sm transition"
            >
              <Video className="w-4 h-4" />
              <span>Start Telehealth Room</span>
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Pending Consultation Requests
                </span>
                <div className="text-2xl font-extrabold text-amber-600 mt-1">
                  {appointments.filter((a) => a.status === 'PENDING').length}
                </div>
                <div className="text-xs text-slate-500 mt-1">Action required</div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Confirmed Schedule
                </span>
                <div className="text-2xl font-extrabold text-blue-600 mt-1">
                  {appointments.filter((a) => a.status === 'CONFIRMED').length}
                </div>
                <div className="text-xs text-slate-500 mt-1">Upcoming clinical slots</div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Patient Reviews & Rating
                </span>
                <div className="text-2xl font-extrabold text-navy mt-1">
                  ★ {doctorProfile.rating} <span className="text-xs font-normal text-slate-400">({doctorProfile.reviews_count})</span>
                </div>
                <div className="text-xs text-green-600 mt-1">98% positive feedback</div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Hospital Affiliation
                </span>
                <div className="text-sm font-bold text-navy mt-1 truncate">
                  {doctorProfile.hospital_name}
                </div>
                <div className="text-xs text-blue-600 mt-1">Official Clinical Attending</div>
              </div>
            </div>

            {/* Pending Requests Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-navy flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span>Pending Patient Consultation Requests</span>
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {appointments.filter((a) => a.status === 'PENDING').length} awaiting response
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Patient</th>
                      <th className="py-3 px-4">Requested Date & Slot</th>
                      <th className="py-3 px-4">Reported Symptoms</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments
                      .filter((a) => a.status === 'PENDING')
                      .map((apt) => (
                        <tr key={apt.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-navy">{apt.patient_name}</td>
                          <td className="py-3 px-4 text-slate-700 font-medium">
                            {apt.date} • {apt.time_slot}
                          </td>
                          <td className="py-3 px-4 text-slate-600 max-w-sm">{apt.symptoms}</td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleAcceptAppointment(apt.id)}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-xs"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectAppointment(apt.id)}
                              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-bold text-xs"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    {appointments.filter((a) => a.status === 'PENDING').length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-slate-400">
                          No pending requests at this time. All caught up!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-navy">All Consultations Schedule</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Date & Slot</th>
                    <th className="py-3 px-4">Symptoms</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-navy">{apt.patient_name}</td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {apt.date} • {apt.time_slot}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-sm truncate">{apt.symptoms}</td>
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
                        {apt.status === 'PENDING' && (
                          <div className="space-x-2">
                            <button
                              onClick={() => handleAcceptAppointment(apt.id)}
                              className="px-2.5 py-1 bg-green-600 text-white rounded text-xs font-bold"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectAppointment(apt.id)}
                              className="px-2.5 py-1 bg-red-100 text-red-700 rounded text-xs font-bold"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {apt.status === 'CONFIRMED' && (
                          <button
                            onClick={() => setActiveTab('telehealth')}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold"
                          >
                            Open Telehealth
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

        {/* TAB 3: PATIENTS */}
        {activeTab === 'patients' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-navy">Assigned Patient Records (Consent Granted)</h3>
            <p className="text-xs text-slate-500">
              Only authorized patient histories with explicit active consent are accessible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-navy text-sm">Rahim Chowdhury (Demo)</h4>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
                    Blood: A+
                  </span>
                </div>
                <p className="text-slate-600">Allergies: Penicillin, Peanuts</p>
                <p className="text-slate-600">Recent consultation: Nov 15 (Superficial Burn Triage)</p>
                <div className="pt-2 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={() => setActiveTab('prescriptions')}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Draft Prescription →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TELEHEALTH */}
        {activeTab === 'telehealth' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-navy">Clinician Telehealth Room</h3>
                <p className="text-xs text-slate-500">
                  Secure two-way video link, real-time consultation documentation, and digital prescription
                </p>
              </div>
              <DemoBadge label="DOCTOR ACTIVE" />
            </div>

            <TelehealthRoom doctorName={doctorProfile.name} onEndCall={() => setActiveTab('overview')} />
          </div>
        )}

        {/* TAB 5: PRESCRIPTIONS */}
        {activeTab === 'prescriptions' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
            {/* Form */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
              <h3 className="text-base font-bold text-navy">Issue Digital Prescription</h3>

              {rxSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs font-semibold">
                  Prescription saved and dispatched to patient records!
                </div>
              )}

              <form onSubmit={handleAddPrescription} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Patient</label>
                  <input
                    type="text"
                    value={rxPatient}
                    onChange={(e) => setRxPatient(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Medication Name & Strength</label>
                  <input
                    type="text"
                    placeholder="E.g., Paracetamol 500mg or Silver Sulfadiazine 1%"
                    value={rxMed}
                    onChange={(e) => setRxMed(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dosage & Instructions</label>
                  <textarea
                    rows={3}
                    placeholder="E.g., 1 tablet three times daily after meals for 5 days."
                    value={rxInstr}
                    onChange={(e) => setRxInstr(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition"
                >
                  Sign & Issue Prescription
                </button>
              </form>
            </div>

            {/* Issued List */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
              <h3 className="text-base font-bold text-navy">Prescription Log</h3>

              <div className="space-y-3">
                {prescriptions.map((p) => (
                  <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-navy">{p.patient}</h4>
                      <span className="text-[10px] text-slate-400">{p.date}</span>
                    </div>
                    <div className="text-blue-700 font-semibold">{p.medication}</div>
                    <p className="text-slate-600">{p.instructions}</p>
                    <div className="text-[10px] text-teal-600 font-bold pt-1">
                      Signed by: {doctorProfile.name} ({doctorProfile.license_number})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft max-w-2xl space-y-6 animate-in fade-in">
            <h3 className="text-base font-bold text-navy">Clinical Consultation Hours</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700">Accepting New Patient Consultations:</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 font-bold rounded-lg">
                  {availabilityStatus}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Active Clinic Days</label>
                <div className="flex flex-wrap gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <span
                      key={day}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        doctorProfile.available_days.includes(day)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Standard Daily Hours</label>
                <input
                  type="text"
                  disabled
                  value={doctorProfile.available_hours}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft max-w-2xl space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-navy">Clinician Credentials</h3>
                <p className="text-xs text-slate-500">Official medical council verification and hospital registry</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Badge Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Physician Name</label>
                <input
                  type="text"
                  disabled
                  value={doctorProfile.name}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Medical Registration License</label>
                <input
                  type="text"
                  disabled
                  value={doctorProfile.license_number}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-blue-700 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Qualifications</label>
                <input
                  type="text"
                  disabled
                  value={doctorProfile.qualifications}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Specialty</label>
                <input
                  type="text"
                  disabled
                  value={doctorProfile.specialty}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
