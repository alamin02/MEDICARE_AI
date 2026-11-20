import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  User,
  Stethoscope,
  ShieldAlert,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DemoBadge } from '../components/common/DemoBadge';
import { UserRole } from '../types';
import { DEMO_CREDENTIALS } from '../services/syntheticData';

export const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('PATIENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'PATIENT') {
      setEmail(DEMO_CREDENTIALS.patient.email);
      setPassword(DEMO_CREDENTIALS.patient.password);
    } else if (role === 'DOCTOR') {
      setEmail(DEMO_CREDENTIALS.doctor.email);
      setPassword(DEMO_CREDENTIALS.doctor.password);
    } else {
      setEmail(DEMO_CREDENTIALS.admin.email);
      setPassword(DEMO_CREDENTIALS.admin.password);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    demoLogin(role);
    if (role === 'DOCTOR') navigate('/doctor');
    else if (role === 'ADMIN') navigate('/admin');
    else navigate('/patient');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuickDemoLogin(selectedRole);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-4 animate-bounce">
          <Activity className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          MedICARE <span className="text-blue-500">AI</span> Portals
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          Intelligent Healthcare. Accessible Everywhere.
        </p>
        <div className="mt-3">
          <DemoBadge label="DEMO ACCESS PORTAL" />
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white text-slate-900 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-200">
          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => handleRoleSelect('PATIENT')}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition flex flex-col items-center gap-1 ${
                selectedRole === 'PATIENT'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-navy'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Patient</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('DOCTOR')}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition flex flex-col items-center gap-1 ${
                selectedRole === 'DOCTOR'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-navy'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctor</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('ADMIN')}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition flex flex-col items-center gap-1 ${
                selectedRole === 'ADMIN'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-navy'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>

          {/* Quick Demo Instant Launch */}
          <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              One-Click Instant Demo Launch
            </span>
            <button
              onClick={() => handleQuickDemoLogin(selectedRole)}
              className="mt-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enter as Demo {selectedRole}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold">Or enter manually</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Demo Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name.demo@example.com"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 border border-transparent rounded-xl text-xs font-bold text-white bg-navy hover:bg-navy-800 transition"
            >
              Sign In to {selectedRole} Workspace
            </button>
          </form>

          {/* Preset Credentials Box */}
          <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="font-semibold text-slate-700">Preset Demo Credentials:</div>
            <div>• Patient: <code className="text-blue-600">patient.demo@example.com</code> / DemoPatient123!</div>
            <div>• Doctor: <code className="text-blue-600">doctor.demo@example.com</code> / DemoDoctor123!</div>
            <div>• Admin: <code className="text-blue-600">admin.demo@example.com</code> / DemoAdmin123!</div>
          </div>
        </div>
      </div>
    </div>
  );
};
