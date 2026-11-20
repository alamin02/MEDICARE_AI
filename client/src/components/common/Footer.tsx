import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, Heart, Phone, Mail, Globe } from 'lucide-react';
import { DemoBadge } from './DemoBadge';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0D1B2A] text-slate-300 pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                MedICARE <span className="text-blue-500">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Intelligent Healthcare. Accessible Everywhere. A multimodal AI assistant connecting users to symptom understanding, injury analysis, first-aid, and verified medical discovery.
            </p>
            <div className="pt-2">
              <DemoBadge label="SYNTHETIC DEMO SYSTEM" />
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              AI Capabilities
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#injury-analysis" className="hover:text-blue-400 transition">
                  Multimodal Injury Scan
                </a>
              </li>
              <li>
                <a href="#first-aid" className="hover:text-blue-400 transition">
                  Emergency First-Aid
                </a>
              </li>
              <li>
                <a href="#voice-assistant" className="hover:text-blue-400 transition">
                  Bangla & English Voice AI
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-blue-400 transition">
                  Medical RAG Knowledge
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition">
                  Telehealth Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Dashboards */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Platform Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/patient" className="hover:text-blue-400 transition">
                  Patient Portal
                </Link>
              </li>
              <li>
                <Link to="/doctor" className="hover:text-blue-400 transition">
                  Doctor Workspace
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-blue-400 transition">
                  Healthcare Admin
                </Link>
              </li>
              <li>
                <a href="#hospitals" className="hover:text-blue-400 transition">
                  Hospital Directory
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition">
                  Demo Account Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency & Contacts */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Emergency Hotlines
            </h4>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60">
                <div className="text-xs text-red-300 font-medium">National Emergency</div>
                <div className="text-base font-bold text-red-400">999 (BD) / 911 (US)</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/60">
                <div className="text-xs text-blue-300 font-medium">Health Hotline</div>
                <div className="text-base font-bold text-blue-400">16263 (Demo Hotline)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="pt-8 border-t border-navy-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 MedICARE AI Team. Built for hackathon demonstration. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Not for autonomous clinical diagnosis
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              English & বাংলা Supported
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
