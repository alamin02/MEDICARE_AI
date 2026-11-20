import React, { useState } from 'react';
import {
  Activity,
  User,
  Users,
  ShieldCheck,
  ShieldAlert,
  Hospital as HospIcon,
  Stethoscope,
  Calendar,
  AlertTriangle,
  FileText,
  BarChart3,
  CheckCircle,
  XCircle,
  LogOut,
  Sparkles,
  Settings,
  Lock,
  Plus
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { DemoBadge } from '../components/common/DemoBadge';
import { DOCTORS, HOSPITALS, INITIAL_APPOINTMENTS } from '../services/syntheticData';
import { DoctorProfile, Hospital } from '../types';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'doctors' | 'hospitals' | 'appointments' | 'emergencies' | 'audit' | 'settings'
  >('overview');

  const [doctorsList, setDoctorsList] = useState<DoctorProfile[]>(DOCTORS);
  const [hospitalsList, setHospitalsList] = useState<Hospital[]>(HOSPITALS);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);

  // Toggle doctor verification
  const handleToggleVerification = (docId: string) => {
    setDoctorsList((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, is_verified: !d.is_verified } : d))
    );
  };

  // Analytics data for Recharts
  const consultationTrendData = [
    { month: 'Jun', consultations: 42, emergencies: 6 },
    { month: 'Jul', consultations: 68, emergencies: 9 },
    { month: 'Aug', consultations: 89, emergencies: 14 },
    { month: 'Sep', consultations: 124, emergencies: 18 },
    { month: 'Oct', consultations: 165, emergencies: 22 },
    { month: 'Nov', consultations: 210, emergencies: 31 }
  ];

  const specialtyDistribution = [
    { name: 'Cardiology', value: 35, color: '#2563EB' },
    { name: 'Orthopedics', value: 28, color: '#14B8A6' },
    { name: 'General Medicine', value: 25, color: '#6366F1' },
    { name: 'Dermatology', value: 18, color: '#F59E0B' },
    { name: 'Emergency', value: 22, color: '#EF4444' }
  ];

  const auditLogs = [
    {
      id: 'log-1',
      action: 'DOCTOR_VERIFIED',
      actor: 'Healthcare Ops Admin (Demo)',
      target: 'Dr. Nusrat Jahan (BMDC-DEMO-48291)',
      timestamp: '2026-11-20 14:15:22',
      status: 'SUCCESS'
    },
    {
      id: 'log-2',
      action: 'CONSENT_GRANTED',
      actor: 'Rahim Chowdhury (patient-demo-1)',
      target: 'Injury Analysis Vault #inj-1',
      timestamp: '2026-11-18 16:20:00',
      status: 'SUCCESS'
    },
    {
      id: 'log-3',
      action: 'EMERGENCY_ESCALATION',
      actor: 'MedICARE AI Triage Engine',
      target: 'Acute Hemorrhage Protocol #fa-2',
      timestamp: '2026-11-17 11:05:44',
      status: 'FLAGGED'
    },
    {
      id: 'log-4',
      action: 'APPOINTMENT_DOUBLE_BOOKING_PREVENTED',
      actor: 'Database Transaction Lock',
      target: 'Dr. Tariqul Islam Slot 06:00 PM',
      timestamp: '2026-11-16 09:30:10',
      status: 'BLOCKED'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-800">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0D1B2A] text-white p-5 flex flex-col justify-between border-r border-navy-800">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                MedICARE <span className="text-purple-400">AI</span>
              </span>
              <div className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider">
                Admin Console
              </div>
            </div>
          </div>

          <DemoBadge label="HEALTHCARE ADMIN" className="w-full justify-center" />

          {/* Nav Links */}
          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'overview'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Platform Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('doctors')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'doctors'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <span className="flex items-center gap-3">
                <Stethoscope className="w-4 h-4" />
                <span>Doctor Approvals</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-purple-900 text-purple-300 text-[10px]">
                {doctorsList.filter((d) => !d.is_verified).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('hospitals')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'hospitals'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <HospIcon className="w-4 h-4" />
              <span>Hospitals Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'appointments'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Appointments Monitor</span>
            </button>

            <button
              onClick={() => setActiveTab('emergencies')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'emergencies'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Emergency Requests</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'audit'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Audit & Consent Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'settings'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Platform Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom CTA / Logout */}
        <div className="pt-6 border-t border-navy-800">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-navy-900 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              Platform Administration & Healthcare Governance
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time clinician licensing, hospital trauma status, and AI safety audit controls
            </p>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Patients (Synthetic)
                </span>
                <div className="text-2xl font-extrabold text-navy mt-1">30 Demo Users</div>
                <div className="text-xs text-green-600 font-semibold mt-1">100% anonymized seed</div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Registered Doctors
                </span>
                <div className="text-2xl font-extrabold text-blue-600 mt-1">{doctorsList.length} Clinicians</div>
                <div className="text-xs text-slate-500 mt-1">
                  {doctorsList.filter((d) => d.is_verified).length} verified
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Network Hospitals
                </span>
                <div className="text-2xl font-extrabold text-purple-600 mt-1">{hospitalsList.length} Facilities</div>
                <div className="text-xs text-slate-500 mt-1">8 Trauma-capable</div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Emergency Escalations
                </span>
                <div className="text-2xl font-extrabold text-red-600 mt-1">31 Calls</div>
                <div className="text-xs text-red-600 font-semibold mt-1">Instant 999 routing</div>
              </div>
            </div>

            {/* Recharts Analytics Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
                <h3 className="text-sm font-bold text-navy">
                  Monthly Consultation Growth & Emergency Triage Volume
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={consultationTrendData}>
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                      <YAxis stroke="#94A3B8" fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="consultations" fill="#2563EB" radius={[4, 4, 0, 0]} name="Consultations" />
                      <Bar dataKey="emergencies" fill="#EF4444" radius={[4, 4, 0, 0]} name="Emergency Escalations" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
                <h3 className="text-sm font-bold text-navy">Consultations by Specialty</h3>
                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={specialtyDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {specialtyDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DOCTOR APPROVALS */}
        {activeTab === 'doctors' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-navy">Clinician Credentialing & Verification</h3>
                <p className="text-xs text-slate-500">
                  Mandatory admin review before doctors can display the verified badge or accept consultations
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Doctor Name</th>
                    <th className="py-3 px-4">Specialty</th>
                    <th className="py-3 px-4">BMDC License</th>
                    <th className="py-3 px-4">Hospital Affiliation</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doctorsList.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-navy">{doc.name}</td>
                      <td className="py-3 px-4 text-blue-700 font-semibold">{doc.specialty}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{doc.license_number}</td>
                      <td className="py-3 px-4 text-slate-600">{doc.hospital_name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            doc.is_verified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {doc.is_verified ? 'VERIFIED' : 'PENDING APPROVAL'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleVerification(doc.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            doc.is_verified
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                              : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                          }`}
                        >
                          {doc.is_verified ? 'Revoke Badge' : 'Approve & Verify'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: HOSPITALS */}
        {activeTab === 'hospitals' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-navy">Hospital Trauma & ICU Management</h3>
                <p className="text-xs text-slate-500">
                  Real-time bed availability and emergency readiness parameters
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Hospital Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">ICU Beds Available</th>
                    <th className="py-3 px-4">Emergency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hospitalsList.map((hosp) => (
                    <tr key={hosp.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-navy">{hosp.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            hosp.type === 'GOVERNMENT'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {hosp.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{hosp.city}</td>
                      <td className="py-3 px-4 font-bold text-blue-700">{hosp.icu_beds_available} Beds</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            hosp.emergency_available
                              ? 'bg-green-100 text-green-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {hosp.emergency_available ? '24/7 Active' : 'Limited'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-navy">Global Consultation Monitor</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Attending Doctor</th>
                    <th className="py-3 px-4">Specialty & Facility</th>
                    <th className="py-3 px-4">Date & Slot</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {INITIAL_APPOINTMENTS.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-navy">{apt.patient_name}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{apt.doctor_name}</td>
                      <td className="py-3 px-4 text-slate-600">{apt.specialty}</td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{apt.date} • {apt.time_slot}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            apt.status === 'CONFIRMED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: EMERGENCIES */}
        {activeTab === 'emergencies' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>Real-Time Emergency Triage Escalations</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Live audit of keywords and visual patterns triggering emergency escalation protocols
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start justify-between text-xs">
                <div>
                  <div className="font-bold text-red-900">Acute Chest Pain & Dyspnea Keyword Trigger</div>
                  <p className="text-red-700 mt-0.5">
                    User IP simulated in Dhaka. Immediate 999 hotline banner displayed. Time to banner: 12ms.
                  </p>
                </div>
                <span className="text-[10px] text-red-800 font-mono">10 min ago</span>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start justify-between text-xs">
                <div>
                  <div className="font-bold text-amber-900">Thermal Burn Over 10% Surface Area Detected</div>
                  <p className="text-amber-700 mt-0.5">
                    User directed to Dhaka Central Medical Burn & Trauma Unit.
                  </p>
                </div>
                <span className="text-[10px] text-amber-800 font-mono">1 hour ago</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-navy">Security & Compliance Audit Trail</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Event Type</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Target Resource</th>
                    <th className="py-3 px-4">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-500">{log.timestamp}</td>
                      <td className="py-3 px-4 font-bold text-navy">{log.action}</td>
                      <td className="py-3 px-4 text-slate-700">{log.actor}</td>
                      <td className="py-3 px-4 text-slate-600">{log.target}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'SUCCESS'
                              ? 'bg-green-100 text-green-800'
                              : log.status === 'FLAGGED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft max-w-2xl p-6 space-y-6 animate-in fade-in">
            <h3 className="text-base font-bold text-navy">Platform & Governance Settings</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-800">Platform Maintenance Mode</div>
                  <div className="text-[11px] text-slate-500">Temporarily restrict appointments to emergency triage only</div>
                </div>
                <button
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    maintenanceMode ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {maintenanceMode ? 'ACTIVE' : 'DISABLED'}
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800">AI Medical RAG Model Selection</div>
                <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs">
                  <option>Multimodal Clinical Vision + Grounded RAG (Production)</option>
                  <option>Synthetic Benchmark Fallback Mode (Demo)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
