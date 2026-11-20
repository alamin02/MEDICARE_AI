import React, { useState } from 'react';
import {
  Hospital as HospIcon,
  MapPin,
  Phone,
  Bed,
  CheckCircle,
  Filter,
  Navigation,
  ShieldAlert
} from 'lucide-react';
import { HOSPITALS } from '../../services/syntheticData';
import { DemoBadge } from '../common/DemoBadge';
import { Hospital } from '../../types';

export const HospitalMap: React.FC<{
  onSelectHospital?: (hospital: Hospital) => void;
}> = ({ onSelectHospital }) => {
  const [filterType, setFilterType] = useState<'ALL' | 'GOVERNMENT' | 'PRIVATE'>('ALL');
  const [emergencyOnly, setEmergencyOnly] = useState<boolean>(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital>(HOSPITALS[0]);
  const [searchCity, setSearchCity] = useState<string>('');

  const filteredHospitals = HOSPITALS.filter((h) => {
    if (filterType !== 'ALL' && h.type !== filterType) return false;
    if (emergencyOnly && !h.emergency_available) return false;
    if (searchCity && !h.city.toLowerCase().includes(searchCity.toLowerCase()) && !h.name.toLowerCase().includes(searchCity.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
      {/* Controls Bar */}
      <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-navy">Verified Hospital & Trauma Network</h3>
            <DemoBadge label="DEMO HOSPITALS" />
          </div>
          <p className="text-xs text-slate-500">
            Locate 24/7 trauma centers, government facilities, and specialized clinics
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded text-xs font-semibold transition ${
                filterType === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-navy'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('GOVERNMENT')}
              className={`px-3 py-1 rounded text-xs font-semibold transition ${
                filterType === 'GOVERNMENT' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-navy'
              }`}
            >
              Government
            </button>
            <button
              onClick={() => setFilterType('PRIVATE')}
              className={`px-3 py-1 rounded text-xs font-semibold transition ${
                filterType === 'PRIVATE' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-navy'
              }`}
            >
              Private
            </button>
          </div>

          <button
            onClick={() => setEmergencyOnly(!emergencyOnly)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition flex items-center gap-1 ${
              emergencyOnly
                ? 'bg-red-50 border-red-300 text-red-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
            24/7 Emergency Only
          </button>
        </div>
      </div>

      {/* Grid: Map visualization + Hospital Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
        {/* Interactive Map Visualizer */}
        <div className="lg:col-span-7 bg-[#E8EEF5] relative p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 overflow-hidden">
          {/* Stylized Synthetic Map SVG */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94A3B8" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <circle cx="35%" cy="45%" r="120" fill="#CBD5E1" opacity="0.3" />
              <path d="M 20 80 Q 200 120 400 350 T 700 400" fill="none" stroke="#3B82F6" strokeWidth="3" opacity="0.4" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>Interactive OpenStreetMap Preview (Demo Coordinates)</span>
            </div>
            <DemoBadge label="SIMULATED MAP" />
          </div>

          {/* Interactive Pins on Map */}
          <div className="relative z-10 my-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredHospitals.slice(0, 6).map((hosp) => (
              <button
                key={hosp.id}
                onClick={() => {
                  setSelectedHospital(hosp);
                  if (onSelectHospital) onSelectHospital(hosp);
                }}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedHospital.id === hosp.id
                    ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-105'
                    : 'bg-white/95 text-slate-800 border-slate-200 hover:bg-white shadow-sm'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                  <MapPin className={`w-3.5 h-3.5 ${selectedHospital.id === hosp.id ? 'text-white' : 'text-blue-600'}`} />
                  <span className="truncate">{hosp.name.replace(' (DEMO)', '')}</span>
                </div>
                <div className={`text-[10px] mt-1 ${selectedHospital.id === hosp.id ? 'text-blue-100' : 'text-slate-500'}`}>
                  {hosp.city} • {hosp.type}
                </div>
              </button>
            ))}
          </div>

          {/* Selected Hospital Highlight Card */}
          <div className="relative z-10 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {selectedHospital.type} FACILITY
                </span>
                <h4 className="text-sm font-bold text-navy">{selectedHospital.name}</h4>
                <p className="text-xs text-slate-500">{selectedHospital.address}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                {selectedHospital.emergency_available ? '24/7 Emergency' : 'Standard Hours'}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1 font-semibold text-blue-700">
                <Bed className="w-3.5 h-3.5" />
                {selectedHospital.icu_beds_available} ICU Beds Available
              </span>
              <a
                href={`tel:${selectedHospital.contact_number}`}
                className="flex items-center gap-1 font-semibold text-slate-800 hover:text-blue-600"
              >
                <Phone className="w-3.5 h-3.5" />
                {selectedHospital.contact_number}
              </a>
            </div>
          </div>
        </div>

        {/* Hospital Directory List */}
        <div className="lg:col-span-5 p-4 overflow-y-auto max-h-[500px] space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Available Medical Centers ({filteredHospitals.length})
          </div>

          {filteredHospitals.map((hosp) => (
            <div
              key={hosp.id}
              onClick={() => {
                setSelectedHospital(hosp);
                if (onSelectHospital) onSelectHospital(hosp);
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                selectedHospital.id === hosp.id
                  ? 'border-blue-500 bg-blue-50/60 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-navy">{hosp.name}</h4>
                  <p className="text-[11px] text-slate-500">{hosp.address}</p>
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    hosp.type === 'GOVERNMENT'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {hosp.type}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {hosp.departments.slice(0, 3).map((dept, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded"
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
