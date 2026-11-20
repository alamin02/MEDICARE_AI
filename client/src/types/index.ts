export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  is_demo: boolean;
  created_at: string;
}

export interface PatientProfile {
  id: string;
  user_id: string;
  date_of_birth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  blood_group: string;
  emergency_contact: string;
  allergies: string[];
  chronic_conditions: string[];
  is_demo: boolean;
}

export interface DoctorProfile {
  id: string;
  user_id: string;
  name: string;
  specialty: string;
  license_number: string;
  qualifications: string;
  experience_years: number;
  consultation_fee: number;
  hospital_id?: string;
  hospital_name: string;
  is_verified: boolean;
  bio: string;
  rating: number;
  reviews_count: number;
  availability_status: 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN';
  available_days: string[];
  available_hours: string;
  is_demo: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  type: 'GOVERNMENT' | 'PRIVATE';
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  contact_number: string;
  emergency_available: boolean;
  icu_beds_available: number;
  departments: string[];
  rating: number;
  is_demo: boolean;
}

export interface Specialty {
  id: string;
  name: string;
  description: string;
  icon: string;
  doctor_count: number;
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  specialty: string;
  hospital_name: string;
  date: string;
  time_slot: string;
  status: AppointmentStatus;
  symptoms?: string;
  notes?: string;
  is_demo: boolean;
  created_at: string;
}

export interface InjuryAnalysis {
  id: string;
  patient_id: string;
  image_url: string;
  image_name: string;
  findings: string[];
  danger_signs: string[];
  first_aid_steps: string[];
  recommended_specialty: string;
  severity_level: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence_note: string;
  created_at: string;
  is_demo: boolean;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  title: string;
  category: 'LAB_REPORT' | 'PRESCRIPTION' | 'DISCHARGE_SUMMARY' | 'VACCINATION';
  file_url: string;
  date: string;
  doctor_name: string;
  hospital_name: string;
  summary: string;
  is_demo: boolean;
}

export interface Prescription {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  date: string;
  diagnosis: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  notes: string;
  is_demo: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'APPOINTMENT' | 'EMERGENCY' | 'SYSTEM' | 'MESSAGE';
  read: boolean;
  created_at: string;
  is_demo: boolean;
}

export interface FirstAidGuide {
  id: string;
  condition: string;
  title_en: string;
  title_bn: string;
  severity: 'CRITICAL' | 'MODERATE' | 'MILD';
  steps_en: string[];
  steps_bn: string[];
  warnings_en: string[];
  warnings_bn: string[];
  is_emergency: boolean;
}

export interface TelehealthSession {
  id: string;
  appointment_id: string;
  patient_name: string;
  doctor_name: string;
  status: 'WAITING' | 'ACTIVE' | 'COMPLETED';
  meeting_url: string;
  created_at: string;
  is_demo: boolean;
}
