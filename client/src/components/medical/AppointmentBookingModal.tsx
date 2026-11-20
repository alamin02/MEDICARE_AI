import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  X,
  AlertCircle,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { DoctorProfile, Appointment } from '../../types';
import { DemoBadge } from '../common/DemoBadge';

interface AppointmentBookingModalProps {
  doctor: DoctorProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newAppointment: Appointment) => void;
}

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  doctor,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-25');
  const [selectedSlot, setSelectedSlot] = useState<string>('05:30 PM');
  const [symptoms, setSymptoms] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen || !doctor) return null;

  const timeSlots = [
    '05:00 PM',
    '05:30 PM',
    '06:00 PM',
    '06:30 PM',
    '07:00 PM',
    '07:30 PM',
    '08:00 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);

      const createdApt: Appointment = {
        id: `apt-${Date.now()}`,
        patient_id: 'patient-demo-1',
        patient_name: 'Rahim Chowdhury (Demo)',
        doctor_id: doctor.id,
        doctor_name: doctor.name,
        specialty: doctor.specialty,
        hospital_name: doctor.hospital_name,
        date: selectedDate,
        time_slot: selectedSlot,
        status: 'CONFIRMED',
        symptoms: symptoms || 'Routine follow-up consultation',
        notes: 'Confirmed via MedICARE AI booking engine.',
        is_demo: true,
        created_at: new Date().toISOString()
      };

      onSuccess(createdApt);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1400);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#0D1B2A] text-white px-6 py-4 flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Book Clinical Consultation</h3>
                <DemoBadge label="DEMO SLOT" />
              </div>
              <p className="text-xs text-slate-400">Guaranteed instant reservation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-navy">Consultation Reserved!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your appointment with <strong>{doctor.name}</strong> on{' '}
              <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong> has been confirmed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Doctor info summary */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-navy">{doctor.name}</h4>
                <p className="text-xs text-blue-700 font-medium">{doctor.specialty} • {doctor.hospital_name}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-500 font-semibold">Fee</span>
                <div className="text-sm font-bold text-green-700">৳{doctor.consultation_fee} (Demo)</div>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Select Consultation Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min="2026-11-20"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                required
              />
            </div>

            {/* Slot Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Select Available Slot
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border transition ${
                      selectedSlot === slot
                        ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms summary */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for visit / Reported symptoms (Optional)
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="E.g., Follow up after forearm laceration, checking wound healing and dressing..."
                rows={2}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                Double booking protected via transactional locks
              </span>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-navy"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
              >
                {isSubmitting ? 'Reserving Slot...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
