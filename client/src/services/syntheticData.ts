import {
  User,
  DoctorProfile,
  Hospital,
  Specialty,
  Appointment,
  InjuryAnalysis,
  MedicalRecord,
  Notification,
  FirstAidGuide
} from '../types';

export const DEMO_CREDENTIALS = {
  patient: {
    email: 'patient.demo@example.com',
    password: 'DemoPatient123!',
    role: 'PATIENT' as const,
    name: 'Rahim Chowdhury (Demo)'
  },
  doctor: {
    email: 'doctor.demo@example.com',
    password: 'DemoDoctor123!',
    role: 'DOCTOR' as const,
    name: 'Dr. Nusrat Jahan (Demo)'
  },
  admin: {
    email: 'admin.demo@example.com',
    password: 'DemoAdmin123!',
    role: 'ADMIN' as const,
    name: 'Healthcare Ops Admin (Demo)'
  }
};

export const SPECIALTIES: Specialty[] = [
  { id: 'spec-1', name: 'General Medicine', description: 'Primary primary healthcare, fevers, and systemic illnesses', icon: 'Stethoscope', doctor_count: 5 },
  { id: 'spec-2', name: 'Cardiology', description: 'Heart health, cardiovascular disorders, and hypertension', icon: 'Heart', doctor_count: 3 },
  { id: 'spec-3', name: 'Orthopedics', description: 'Bone fractures, joints, trauma, and musculoskeletal care', icon: 'Bone', doctor_count: 3 },
  { id: 'spec-4', name: 'Pediatrics', description: 'Infant, child, and adolescent healthcare and vaccination', icon: 'Baby', doctor_count: 4 },
  { id: 'spec-5', name: 'Dermatology', description: 'Skin conditions, rashes, burns, and wound recovery', icon: 'ShieldAlert', doctor_count: 3 },
  { id: 'spec-6', name: 'Neurology', description: 'Brain, spinal cord, nerve disorders, and stroke care', icon: 'Brain', doctor_count: 2 },
  { id: 'spec-7', name: 'Gynecology & Obstetrics', description: 'Maternal health, prenatal care, and reproductive health', icon: 'UserCheck', doctor_count: 3 },
  { id: 'spec-8', name: 'Emergency Medicine', description: 'Acute trauma, resuscitation, and emergency triage', icon: 'AlertTriangle', doctor_count: 4 },
  { id: 'spec-9', name: 'Pulmonology', description: 'Respiratory diseases, asthma, and lung health', icon: 'Wind', doctor_count: 2 },
  { id: 'spec-10', name: 'Gastroenterology', description: 'Digestive system, liver, and abdominal disorders', icon: 'Activity', doctor_count: 2 },
  { id: 'spec-11', name: 'ENT (Otolaryngology)', description: 'Ear, nose, throat, and sinus conditions', icon: 'Smile', doctor_count: 2 },
  { id: 'spec-12', name: 'Ophthalmology', description: 'Eye health, vision correction, and ocular trauma', icon: 'Eye', doctor_count: 2 },
];

export const HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'Dhaka Central Medical Hospital (DEMO)',
    type: 'GOVERNMENT',
    address: 'Secretariat Road, Ramna, Dhaka',
    city: 'Dhaka',
    latitude: 23.7260,
    longitude: 90.4043,
    contact_number: '+880 2-9661051 (Demo)',
    emergency_available: true,
    icu_beds_available: 18,
    departments: ['Emergency', 'Cardiology', 'General Medicine', 'Orthopedics', 'Pediatrics'],
    rating: 4.6,
    is_demo: true
  },
  {
    id: 'hosp-2',
    name: 'Apollo Square Healthcare (DEMO)',
    type: 'PRIVATE',
    address: 'Plot 81, Block E, Bashundhara R/A, Dhaka',
    city: 'Dhaka',
    latitude: 23.8151,
    longitude: 90.4255,
    contact_number: '+880 2-8431661 (Demo)',
    emergency_available: true,
    icu_beds_available: 12,
    departments: ['Emergency Trauma', 'Cardiology', 'Neurology', 'Dermatology'],
    rating: 4.8,
    is_demo: true
  },
  {
    id: 'hosp-3',
    name: 'Chittagong Metropolitan Hospital (DEMO)',
    type: 'GOVERNMENT',
    address: 'O.R. Nizam Road, Panchlaish, Chittagong',
    city: 'Chittagong',
    latitude: 22.3569,
    longitude: 91.8225,
    contact_number: '+880 31-654030 (Demo)',
    emergency_available: true,
    icu_beds_available: 9,
    departments: ['General Medicine', 'Surgery', 'Orthopedics', 'Burn Unit'],
    rating: 4.4,
    is_demo: true
  },
  {
    id: 'hosp-4',
    name: 'Green Crescent Specialized Clinic (DEMO)',
    type: 'PRIVATE',
    address: 'Dhanmondi 27, Mirpur Road, Dhaka',
    city: 'Dhaka',
    latitude: 23.7525,
    longitude: 90.3754,
    contact_number: '+880 2-9112233 (Demo)',
    emergency_available: false,
    icu_beds_available: 4,
    departments: ['Pediatrics', 'Gynecology', 'ENT', 'Dermatology'],
    rating: 4.5,
    is_demo: true
  },
  {
    id: 'hosp-5',
    name: 'Sylhet Osmani Healthcare Center (DEMO)',
    type: 'GOVERNMENT',
    address: 'Medical Road, Kajalshah, Sylhet',
    city: 'Sylhet',
    latitude: 24.8998,
    longitude: 91.8687,
    contact_number: '+880 821-713487 (Demo)',
    emergency_available: true,
    icu_beds_available: 14,
    departments: ['Trauma Center', 'Pulmonology', 'Cardiology', 'Pediatrics'],
    rating: 4.3,
    is_demo: true
  },
  {
    id: 'hosp-6',
    name: 'Evercare Northern Diagnostic Hospital (DEMO)',
    type: 'PRIVATE',
    address: 'Sector 7, Uttara Model Town, Dhaka',
    city: 'Dhaka',
    latitude: 23.8680,
    longitude: 90.3980,
    contact_number: '+880 2-58951234 (Demo)',
    emergency_available: true,
    icu_beds_available: 15,
    departments: ['Cardiology', 'Neurology', 'Orthopedics', 'ICU', 'Radiology'],
    rating: 4.9,
    is_demo: true
  },
  {
    id: 'hosp-7',
    name: 'Rajshahi Divisional General Hospital (DEMO)',
    type: 'GOVERNMENT',
    address: 'Laxmipur, Rajshahi',
    city: 'Rajshahi',
    latitude: 24.3636,
    longitude: 88.6241,
    contact_number: '+880 721-772123 (Demo)',
    emergency_available: true,
    icu_beds_available: 7,
    departments: ['General Medicine', 'Orthopedics', 'Pediatrics'],
    rating: 4.2,
    is_demo: true
  },
  {
    id: 'hosp-8',
    name: 'United Care Wellness Hospital (DEMO)',
    type: 'PRIVATE',
    address: 'Gulshan-2, Road 71, Dhaka',
    city: 'Dhaka',
    latitude: 23.7925,
    longitude: 90.4167,
    contact_number: '+880 2-8836000 (Demo)',
    emergency_available: true,
    icu_beds_available: 20,
    departments: ['Cardiology', 'Neurology', 'Emergency', 'Burn & Wound Care'],
    rating: 4.7,
    is_demo: true
  },
  {
    id: 'hosp-9',
    name: 'Khulna City Civic Hospital (DEMO)',
    type: 'GOVERNMENT',
    address: 'Boyra Main Road, Khulna',
    city: 'Khulna',
    latitude: 22.8456,
    longitude: 89.5403,
    contact_number: '+880 41-760123 (Demo)',
    emergency_available: true,
    icu_beds_available: 8,
    departments: ['Emergency Trauma', 'Pediatrics', 'General Surgery'],
    rating: 4.1,
    is_demo: true
  },
  {
    id: 'hosp-10',
    name: 'Barisal Waterfront Medical Institute (DEMO)',
    type: 'GOVERNMENT',
    address: 'Band Road, Barisal',
    city: 'Barisal',
    latitude: 22.7010,
    longitude: 90.3535,
    contact_number: '+880 431-217354 (Demo)',
    emergency_available: true,
    icu_beds_available: 6,
    departments: ['General Medicine', 'Emergency', 'Orthopedics'],
    rating: 4.3,
    is_demo: true
  }
];

export const DOCTORS: DoctorProfile[] = [
  {
    id: 'doc-1',
    user_id: 'user-doc-1',
    name: 'Dr. Nusrat Jahan (Demo)',
    specialty: 'Cardiology',
    license_number: 'BMDC-DEMO-48291',
    qualifications: 'MBBS, FCPS (Cardiology), MD (USA)',
    experience_years: 14,
    consultation_fee: 1200,
    hospital_name: 'Dhaka Central Medical Hospital (DEMO)',
    hospital_id: 'hosp-1',
    is_verified: true,
    bio: 'Specialist in preventative cardiology, coronary interventions, and hypertension control.',
    rating: 4.9,
    reviews_count: 142,
    availability_status: 'AVAILABLE',
    available_days: ['Sun', 'Mon', 'Wed', 'Thu'],
    available_hours: '05:00 PM - 09:00 PM',
    is_demo: true
  },
  {
    id: 'doc-2',
    user_id: 'user-doc-2',
    name: 'Dr. Tariqul Islam (Demo)',
    specialty: 'Orthopedics',
    license_number: 'BMDC-DEMO-32104',
    qualifications: 'MBBS, MS (Orthopedics), AO Trauma Fellow',
    experience_years: 11,
    consultation_fee: 1000,
    hospital_name: 'Apollo Square Healthcare (DEMO)',
    hospital_id: 'hosp-2',
    is_verified: true,
    bio: 'Expert in sports injuries, complex joint trauma, arthroscopy, and fracture stabilization.',
    rating: 4.8,
    reviews_count: 98,
    availability_status: 'AVAILABLE',
    available_days: ['Mon', 'Tue', 'Wed', 'Sat'],
    available_hours: '04:00 PM - 08:30 PM',
    is_demo: true
  },
  {
    id: 'doc-3',
    user_id: 'user-doc-3',
    name: 'Dr. Sabina Yasmin (Demo)',
    specialty: 'Dermatology',
    license_number: 'BMDC-DEMO-55120',
    qualifications: 'MBBS, DDV, FCPS (Dermatology)',
    experience_years: 9,
    consultation_fee: 800,
    hospital_name: 'Green Crescent Specialized Clinic (DEMO)',
    hospital_id: 'hosp-4',
    is_verified: true,
    bio: 'Clinical dermatologist handling burn healing, acute allergic reactions, and eczema management.',
    rating: 4.7,
    reviews_count: 84,
    availability_status: 'AVAILABLE',
    available_days: ['Sun', 'Tue', 'Thu'],
    available_hours: '06:00 PM - 09:00 PM',
    is_demo: true
  },
  {
    id: 'doc-4',
    user_id: 'user-doc-4',
    name: 'Dr. Farhan Ahmed (Demo)',
    specialty: 'Emergency Medicine',
    license_number: 'BMDC-DEMO-61092',
    qualifications: 'MBBS, MRCEM (UK), FRCEM',
    experience_years: 12,
    consultation_fee: 1500,
    hospital_name: 'Evercare Northern Diagnostic Hospital (DEMO)',
    hospital_id: 'hosp-6',
    is_verified: true,
    bio: 'Lead emergency trauma consultant specializing in immediate wound care and critical triage.',
    rating: 4.9,
    reviews_count: 110,
    availability_status: 'AVAILABLE',
    available_days: ['Mon', 'Wed', 'Fri', 'Sat'],
    available_hours: '02:00 PM - 07:00 PM',
    is_demo: true
  },
  {
    id: 'doc-5',
    user_id: 'user-doc-5',
    name: 'Dr. Anisur Rahman (Demo)',
    specialty: 'General Medicine',
    license_number: 'BMDC-DEMO-19842',
    qualifications: 'MBBS, FCPS (Internal Medicine), MRCP (UK)',
    experience_years: 16,
    consultation_fee: 900,
    hospital_name: 'Dhaka Central Medical Hospital (DEMO)',
    hospital_id: 'hosp-1',
    is_verified: true,
    bio: 'Comprehensive internal medicine specialist treating multi-system fever, infections, and diabetes.',
    rating: 4.8,
    reviews_count: 215,
    availability_status: 'AVAILABLE',
    available_days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    available_hours: '10:00 AM - 02:00 PM',
    is_demo: true
  },
  {
    id: 'doc-6',
    user_id: 'user-doc-6',
    name: 'Dr. Mehnaz Parveen (Demo)',
    specialty: 'Pediatrics',
    license_number: 'BMDC-DEMO-44901',
    qualifications: 'MBBS, DCH, FCPS (Pediatrics)',
    experience_years: 8,
    consultation_fee: 700,
    hospital_name: 'Chittagong Metropolitan Hospital (DEMO)',
    hospital_id: 'hosp-3',
    is_verified: true,
    bio: 'Caring pediatrician focused on child infectious disease, pediatric nutrition, and immunizations.',
    rating: 4.9,
    reviews_count: 130,
    availability_status: 'AVAILABLE',
    available_days: ['Sun', 'Tue', 'Wed', 'Sat'],
    available_hours: '04:00 PM - 08:00 PM',
    is_demo: true
  },
  {
    id: 'doc-7',
    user_id: 'user-doc-7',
    name: 'Dr. Shahriar Kabir (Demo)',
    specialty: 'Neurology',
    license_number: 'BMDC-DEMO-73012',
    qualifications: 'MBBS, MD (Neurology), Fellow Stroke Unit',
    experience_years: 13,
    consultation_fee: 1400,
    hospital_name: 'Apollo Square Healthcare (DEMO)',
    hospital_id: 'hosp-2',
    is_verified: false,
    bio: 'Neurologist with focus on migraine, seizure management, neuropathy, and stroke rehabilitation.',
    rating: 4.6,
    reviews_count: 67,
    availability_status: 'UNAVAILABLE',
    available_days: ['Mon', 'Thu'],
    available_hours: '06:00 PM - 09:00 PM',
    is_demo: true
  },
  {
    id: 'doc-8',
    user_id: 'user-doc-8',
    name: 'Dr. Rashedul Hassan (Demo)',
    specialty: 'Pulmonology',
    license_number: 'BMDC-DEMO-81923',
    qualifications: 'MBBS, DTCD, MD (Chest Diseases)',
    experience_years: 10,
    consultation_fee: 1100,
    hospital_name: 'Sylhet Osmani Healthcare Center (DEMO)',
    hospital_id: 'hosp-5',
    is_verified: true,
    bio: 'Chest and respiratory specialist managing asthma, COPD, bronchitis, and sleep apnea.',
    rating: 4.7,
    reviews_count: 89,
    availability_status: 'AVAILABLE',
    available_days: ['Sun', 'Mon', 'Wed'],
    available_hours: '05:00 PM - 08:30 PM',
    is_demo: true
  },
  {
    id: 'doc-9',
    user_id: 'user-doc-9',
    name: 'Dr. Farzana Alam (Demo)',
    specialty: 'Gynecology & Obstetrics',
    license_number: 'BMDC-DEMO-28941',
    qualifications: 'MBBS, FCPS (Obs & Gynae), MS',
    experience_years: 15,
    consultation_fee: 1200,
    hospital_name: 'Green Crescent Specialized Clinic (DEMO)',
    hospital_id: 'hosp-4',
    is_verified: true,
    bio: 'Obstetrician with vast experience in prenatal care, high-risk pregnancies, and hormonal health.',
    rating: 4.9,
    reviews_count: 175,
    availability_status: 'AVAILABLE',
    available_days: ['Sun', 'Mon', 'Wed', 'Thu'],
    available_hours: '03:00 PM - 07:00 PM',
    is_demo: true
  },
  {
    id: 'doc-10',
    user_id: 'user-doc-10',
    name: 'Dr. Mokhlesur Rahman (Demo)',
    specialty: 'Gastroenterology',
    license_number: 'BMDC-DEMO-90234',
    qualifications: 'MBBS, MD (Gastroenterology), FACG',
    experience_years: 14,
    consultation_fee: 1300,
    hospital_name: 'United Care Wellness Hospital (DEMO)',
    hospital_id: 'hosp-8',
    is_verified: true,
    bio: 'Specialist in peptic ulcers, liver disease, endoscopy, and inflammatory bowel syndrome.',
    rating: 4.8,
    reviews_count: 94,
    availability_status: 'AVAILABLE',
    available_days: ['Tue', 'Wed', 'Sat'],
    available_hours: '04:00 PM - 08:00 PM',
    is_demo: true
  },
  {
    id: 'doc-11',
    user_id: 'user-doc-11',
    name: 'Dr. Nazmul Huda (Demo)',
    specialty: 'ENT (Otolaryngology)',
    license_number: 'BMDC-DEMO-34981',
    qualifications: 'MBBS, DLO, MS (ENT)',
    experience_years: 9,
    consultation_fee: 850,
    hospital_name: 'Rajshahi Divisional General Hospital (DEMO)',
    hospital_id: 'hosp-7',
    is_verified: true,
    bio: 'ENT surgeon treating sinus infections, hearing loss, tonsillitis, and vocal cord disorders.',
    rating: 4.6,
    reviews_count: 72,
    availability_status: 'AVAILABLE',
    available_days: ['Mon', 'Wed', 'Thu'],
    available_hours: '05:00 PM - 08:00 PM',
    is_demo: true
  },
  {
    id: 'doc-12',
    user_id: 'user-doc-12',
    name: 'Dr. Shirin Akter (Demo)',
    specialty: 'Ophthalmology',
    license_number: 'BMDC-DEMO-58190',
    qualifications: 'MBBS, FCPS (Ophth), Fellow Cornea',
    experience_years: 11,
    consultation_fee: 950,
    hospital_name: 'Evercare Northern Diagnostic Hospital (DEMO)',
    hospital_id: 'hosp-6',
    is_verified: true,
    bio: 'Eye specialist dealing with ocular trauma, cataract management, glaucoma, and vision screening.',
    rating: 4.7,
    reviews_count: 103,
    availability_status: 'AVAILABLE',
    available_days: ['Sun', 'Tue', 'Thu'],
    available_hours: '04:00 PM - 07:30 PM',
    is_demo: true
  },
  {
    id: 'doc-13',
    user_id: 'user-doc-13',
    name: 'Dr. Kamrul Ahsan (Demo)',
    specialty: 'Cardiology',
    license_number: 'BMDC-DEMO-66231',
    qualifications: 'MBBS, D-Card, MD',
    experience_years: 7,
    consultation_fee: 1000,
    hospital_name: 'Khulna City Civic Hospital (DEMO)',
    hospital_id: 'hosp-9',
    is_verified: false,
    bio: 'Cardiologist evaluating cardiac arrhythmias, lipid management, and echocardiography.',
    rating: 4.5,
    reviews_count: 51,
    availability_status: 'AVAILABLE',
    available_days: ['Mon', 'Tue', 'Sat'],
    available_hours: '05:00 PM - 08:00 PM',
    is_demo: true
  },
  {
    id: 'doc-14',
    user_id: 'user-doc-14',
    name: 'Dr. Tanvir Mahmud (Demo)',
    specialty: 'Orthopedics',
    license_number: 'BMDC-DEMO-77129',
    qualifications: 'MBBS, MS (Ortho), Fellowship Knee Arthroscopy',
    experience_years: 10,
    consultation_fee: 1100,
    hospital_name: 'Barisal Waterfront Medical Institute (DEMO)',
    hospital_id: 'hosp-10',
    is_verified: true,
    bio: 'Orthopedic surgeon handling limb trauma, tendon injuries, and spinal degenerative pain.',
    rating: 4.8,
    reviews_count: 88,
    availability_status: 'AVAILABLE',
    available_days: ['Sun', 'Wed', 'Thu'],
    available_hours: '04:30 PM - 08:00 PM',
    is_demo: true
  },
  {
    id: 'doc-15',
    user_id: 'user-doc-15',
    name: 'Dr. Shamima Nasreen (Demo)',
    specialty: 'Pediatrics',
    license_number: 'BMDC-DEMO-82341',
    qualifications: 'MBBS, MD (Pediatrics)',
    experience_years: 12,
    consultation_fee: 900,
    hospital_name: 'United Care Wellness Hospital (DEMO)',
    hospital_id: 'hosp-8',
    is_verified: true,
    bio: 'Specialist in pediatric growth disorders, respiratory infections, and newborn care.',
    rating: 4.9,
    reviews_count: 140,
    availability_status: 'AVAILABLE',
    available_days: ['Mon', 'Tue', 'Wed', 'Sat'],
    available_hours: '03:00 PM - 07:00 PM',
    is_demo: true
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    patient_id: 'patient-demo-1',
    patient_name: 'Rahim Chowdhury (Demo)',
    doctor_id: 'doc-1',
    doctor_name: 'Dr. Nusrat Jahan (Demo)',
    specialty: 'Cardiology',
    hospital_name: 'Dhaka Central Medical Hospital (DEMO)',
    date: '2026-11-25',
    time_slot: '05:30 PM',
    status: 'CONFIRMED',
    symptoms: 'Mild chest tightness following exertion, blood pressure review',
    notes: 'Please bring recent lipid panel and ECG report.',
    is_demo: true,
    created_at: '2026-11-19T10:30:00Z'
  },
  {
    id: 'apt-102',
    patient_id: 'patient-demo-1',
    patient_name: 'Rahim Chowdhury (Demo)',
    doctor_id: 'doc-2',
    doctor_name: 'Dr. Tariqul Islam (Demo)',
    specialty: 'Orthopedics',
    hospital_name: 'Apollo Square Healthcare (DEMO)',
    date: '2026-11-28',
    time_slot: '06:00 PM',
    status: 'PENDING',
    symptoms: 'Right wrist swelling and tenderness following soccer fall',
    notes: 'Awaiting doctor confirmation.',
    is_demo: true,
    created_at: '2026-11-20T08:15:00Z'
  },
  {
    id: 'apt-103',
    patient_id: 'patient-demo-1',
    patient_name: 'Rahim Chowdhury (Demo)',
    doctor_id: 'doc-3',
    doctor_name: 'Dr. Sabina Yasmin (Demo)',
    specialty: 'Dermatology',
    hospital_name: 'Green Crescent Specialized Clinic (DEMO)',
    date: '2026-11-15',
    time_slot: '07:00 PM',
    status: 'COMPLETED',
    symptoms: 'Superficial kitchen burn on left forearm',
    notes: 'Prescribed silver sulfadiazine cream and non-stick sterile dressing.',
    is_demo: true,
    created_at: '2026-11-14T11:00:00Z'
  },
  {
    id: 'apt-104',
    patient_id: 'patient-demo-2',
    patient_name: 'Fatema Khatun (Demo)',
    doctor_id: 'doc-1',
    doctor_name: 'Dr. Nusrat Jahan (Demo)',
    specialty: 'Cardiology',
    hospital_name: 'Dhaka Central Medical Hospital (DEMO)',
    date: '2026-11-22',
    time_slot: '06:30 PM',
    status: 'CONFIRMED',
    symptoms: 'Post-medication dizziness and palpitations',
    is_demo: true,
    created_at: '2026-11-18T14:20:00Z'
  },
  {
    id: 'apt-105',
    patient_id: 'patient-demo-3',
    patient_name: 'Tanvir Hossain (Demo)',
    doctor_id: 'doc-4',
    doctor_name: 'Dr. Farhan Ahmed (Demo)',
    specialty: 'Emergency Medicine',
    hospital_name: 'Evercare Northern Diagnostic Hospital (DEMO)',
    date: '2026-11-21',
    time_slot: '03:00 PM',
    status: 'CONFIRMED',
    symptoms: 'Laceration on right thumb requiring follow-up inspection',
    is_demo: true,
    created_at: '2026-11-20T09:00:00Z'
  }
];

export const INITIAL_INJURY_ANALYSES: InjuryAnalysis[] = [
  {
    id: 'inj-1',
    patient_id: 'patient-demo-1',
    image_url: '/demo-injuries/forearm_cut.jpg',
    image_name: 'forearm_laceration_demo.png',
    findings: [
      'Visible superficial linear laceration on the left volar forearm',
      'Mild localized erythema around wound margins without active pulsating hemorrhage',
      'No deep tissue or tendon exposure noted in synthetic review'
    ],
    danger_signs: [
      'Monitor for spreading redness, heat, purulent discharge, or escalating throbbing pain',
      'Immediate emergency attention if bleeding does not halt within 10 minutes of direct pressure'
    ],
    first_aid_steps: [
      'Wash hands thoroughly with soap and clean water before touching the injury',
      'Apply gentle, continuous pressure using sterile gauze or a clean cloth for 5 minutes',
      'Rinse the wound gently under cool running water; do not scrub vigorously',
      'Apply thin layer of petroleum jelly or antiseptic ointment and protect with sterile bandage'
    ],
    recommended_specialty: 'General Medicine / Urgent Care',
    severity_level: 'LOW',
    confidence_note: 'DEMO ANALYSIS: Photographed triage does not substitute for certified clinical evaluation.',
    created_at: '2026-11-18T16:20:00Z',
    is_demo: true
  },
  {
    id: 'inj-2',
    patient_id: 'patient-demo-1',
    image_url: '/demo-injuries/ankle_sprain.jpg',
    image_name: 'lateral_ankle_swelling.png',
    findings: [
      'Localized edema and ecchymosis (bruising) along lateral malleolus',
      'Soft tissue swelling consistent with inversion ankle strain',
      'Cannot rule out hairline bony avulsion without radiographic X-ray imaging'
    ],
    danger_signs: [
      'Inability to bear weight for more than four steps immediately following injury',
      'Severe point tenderness directly on bone prominence'
    ],
    first_aid_steps: [
      'Adopt the R.I.C.E protocol: Rest, Ice, Compression, Elevation',
      'Apply ice wrapped in a damp cloth for 15-20 minutes every 2-3 hours',
      'Support joint with an elastic compression bandage without cutting off capillary circulation',
      'Elevate the limb above the level of the heart when resting'
    ],
    recommended_specialty: 'Orthopedics',
    severity_level: 'MEDIUM',
    confidence_note: 'DEMO ANALYSIS: Musculoskeletal trauma requires physical inspection and X-ray imaging.',
    created_at: '2026-11-16T12:05:00Z',
    is_demo: true
  }
];

export const INITIAL_RECORDS: MedicalRecord[] = [
  {
    id: 'rec-1',
    patient_id: 'patient-demo-1',
    title: 'Complete Blood Count (CBC) & Lipid Profile (DEMO)',
    category: 'LAB_REPORT',
    file_url: '#',
    date: '2026-10-12',
    doctor_name: 'Dr. Anisur Rahman (Demo)',
    hospital_name: 'Dhaka Central Medical Hospital (DEMO)',
    summary: 'Hemoglobin 14.2 g/dL (Normal), Total Cholesterol 185 mg/dL, Fasting Blood Sugar 92 mg/dL. All baseline parameters in optimal clinical range.',
    is_demo: true
  },
  {
    id: 'rec-2',
    patient_id: 'patient-demo-1',
    title: 'Resting Electrocardiogram (12-Lead ECG) (DEMO)',
    category: 'LAB_REPORT',
    file_url: '#',
    date: '2026-09-04',
    doctor_name: 'Dr. Nusrat Jahan (Demo)',
    hospital_name: 'Dhaka Central Medical Hospital (DEMO)',
    summary: 'Normal sinus rhythm at 72 bpm. Normal PR and QRS intervals. No ischemic ST-T segment elevation or depression noted.',
    is_demo: true
  },
  {
    id: 'rec-3',
    patient_id: 'patient-demo-1',
    title: 'Dermatological Burn Assessment Prescription (DEMO)',
    category: 'PRESCRIPTION',
    file_url: '#',
    date: '2026-11-15',
    doctor_name: 'Dr. Sabina Yasmin (Demo)',
    hospital_name: 'Green Crescent Specialized Clinic (DEMO)',
    summary: 'Topical Silver Sulfadiazine 1% cream applied twice daily for 7 days. Sterile non-adherent dressing change daily.',
    is_demo: true
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'patient-demo-1',
    title: 'Appointment Confirmed',
    message: 'Your cardiology consultation with Dr. Nusrat Jahan is confirmed for Nov 25 at 05:30 PM.',
    type: 'APPOINTMENT',
    read: false,
    created_at: '2026-11-19T10:35:00Z',
    is_demo: true
  },
  {
    id: 'notif-2',
    user_id: 'patient-demo-1',
    title: 'AI Injury Analysis Ready',
    message: 'Your forearm injury scan results have been prepared with recommended first-aid guidance.',
    type: 'SYSTEM',
    read: true,
    created_at: '2026-11-18T16:22:00Z',
    is_demo: true
  },
  {
    id: 'notif-3',
    user_id: 'patient-demo-1',
    title: 'First-Aid Reminder',
    message: 'Check out the emergency burn and cut first-aid protocols available in English and Bangla.',
    type: 'MESSAGE',
    read: true,
    created_at: '2026-11-15T09:00:00Z',
    is_demo: true
  }
];

export const FIRST_AID_GUIDES: FirstAidGuide[] = [
  {
    id: 'fa-1',
    condition: 'BURNS',
    title_en: 'First & Second Degree Thermal Burns',
    title_bn: 'প্রাথমিক ও দ্বিতীয় মাত্রার পোড়া ক্ষতের প্রাথমিক চিকিৎসা',
    severity: 'MODERATE',
    is_emergency: false,
    steps_en: [
      'Immediately cool the burn under gentle, cold running tap water for at least 10 to 20 minutes.',
      'Do not apply ice, ice water, butter, oil, or toothpaste to the affected area.',
      'Gently remove rings, watches, or restrictive clothing near the burn before swelling begins.',
      'Cover loosely with a clean, sterile, non-fluffy bandage or clean plastic wrap.',
      'Never pop or puncture blisters, as intact skin protects against bacterial infection.'
    ],
    steps_bn: [
      'অবিলম্বে পোড়া স্থানটি কমপক্ষে ১০ থেকে ২০ মিনিট মৃদু ঠান্ডা চলমান পানির নিচে রাখুন।',
      'পোড়া স্থানে বরফ, বরফ পানি, মাখন, তেল বা টুথপেস্ট ব্যবহার করবেন না।',
      'ফোলা শুরু হওয়ার আগেই পোড়া অংশের আশেপাশের আংটি, ঘড়ি বা টাইট কাপড় সাবধানে খুলে ফেলুন।',
      'জীবাণুমুক্ত ব্যান্ডেজ বা পরিষ্কার প্লাস্টিক র‍্যাপ দিয়ে আলতোভাবে ঢেকে দিন।',
      'ফোস্কা কখনো ফাটাবেন না; অক্ষত চামড়া সংক্রমণ প্রতিরোধে সাহায্য করে।'
    ],
    warnings_en: [
      'Seek immediate emergency care (999 / 911) if the burn is larger than the patient palm, on the face, hands, groin, or caused by chemical/electrical agents.'
    ],
    warnings_bn: [
      'যদি পোড়া অংশ হাতের তালুর চেয়ে বড় হয়, মুখে, যৌনাঙ্গে বা রাসায়নিক/বৈদ্যুতিক কারণে হয় তবে অবিলম্বে জরুরি চিকিৎসকের কাছে যান।'
    ]
  },
  {
    id: 'fa-2',
    condition: 'CUTS_AND_BLEEDING',
    title_en: 'Severe Cuts & Active Hemorrhage',
    title_bn: 'তীব্র রক্তক্ষরণ ও গভীর কাটার জরুরি প্রাথমিক চিকিৎসা',
    severity: 'CRITICAL',
    is_emergency: true,
    steps_en: [
      'Apply firm, continuous direct pressure over the bleeding site using sterile gauze or clean cloth.',
      'Maintain firm pressure without lifting the cloth to inspect for at least 5-10 minutes.',
      'If blood soaks through, do not remove the original cloth; place an additional layer on top.',
      'Elevate the injured limb above heart level if no fracture is suspected.',
      'Once bleeding slows, secure dressing with a snug, supportive bandage.'
    ],
    steps_bn: [
      'জীবাণুমুক্ত গজ বা পরিষ্কার কাপড় দিয়ে রক্তক্ষরণের স্থানে সরাসরি ও অবিচ্ছিন্ন চাপ দিন।',
      'রক্তপাত দেখার জন্য বারবার কাপড় তুলবেন না; অন্তত ৫-১০ মিনিট দৃঢ়ভাবে চেপে রাখুন।',
      'কাপড় রক্তে ভিজে গেলে তা সরাবেন না, তার উপরেই আরও এক স্তর পরিষ্কার কাপড় যোগ করুন।',
      'হাড় ভাঙার সন্দেহ না থাকলে ক্ষতস্থান হৃদপিণ্ডের স্তরের উপরে তুলে রাখুন।',
      'রক্তপাত কমলে ব্যান্ডেজ দিয়ে পরিচ্ছন্নভাবে বেঁধে নিন।'
    ],
    warnings_en: [
      'Call emergency services immediately if bleeding spurts, will not halt after 10 minutes of pressure, or if the patient becomes pale, faint, or clammy.'
    ],
    warnings_bn: [
      '১০ মিনিট একটানা চাপ দেওয়ার পরেও রক্তপাত বন্ধ না হলে বা রোগী ফ্যাকাশে হয়ে জ্ঞান হারালে দ্রুত জরুরি বিভাগে নিন।'
    ]
  },
  {
    id: 'fa-3',
    condition: 'CHOKING',
    title_en: 'Airway Obstruction (Choking Adult / Child)',
    title_bn: 'শ্বাসনালীতে খাদ্য বা বস্তু আটকে দম বন্ধ হওয়া (চোকিং)',
    severity: 'CRITICAL',
    is_emergency: true,
    steps_en: [
      'Encourage the person to cough forcefully if they can still speak or breathe.',
      'If unable to cough or speak, lean the person forward and give 5 firm back blows between shoulder blades using the heel of your hand.',
      'If back blows fail, stand behind the person and perform 5 abdominal thrusts (Heimlich maneuver) pulling inward and upward above the navel.',
      'Alternate between 5 back blows and 5 abdominal thrusts until object is expelled.',
      'If the person loses consciousness, lower them safely to the ground and initiate CPR.'
    ],
    steps_bn: [
      'যদি ব্যক্তি কাশতে বা কথা বলতে পারেন, তবে তাকে জোরে জোরে কাশতে উৎসাহিত করুন।',
      'কাশতে না পারলে ব্যক্তিকে সামান্য সামনে ঝুঁকিয়ে হাতের তালু দিয়ে পিঠের মাঝখানে ৫টি দৃঢ় আঘাত করুন।',
      'এতে কাজ না হলে পেটের ওপর দিকে নাভির ঠিক ওপরে ৫টি তীব্র চাপ (হাইমলিক ম্যানুভার) দিন।',
      'বস্তু বের না হওয়া পর্যন্ত পর্যায়ক্রমে ৫টি পিঠে চাপ ও ৫টি পেটে চাপ দিতে থাকুন।',
      'রোগী অচেতন হয়ে পড়লে অবিলম্বে মাটিতে শুইয়ে সিপিআর (CPR) শুরু করুন।'
    ],
    warnings_en: [
      'Do not perform abdominal thrusts on infants under 1 year old; use specialized infant back slaps and chest thrusts.'
    ],
    warnings_bn: [
      'এক বছরের কম বয়সী শিশুদের ক্ষেত্রে পেটে চাপ দেবেন না; বিশেষ শিশু ফার্স্ট-এইড পদ্ধতি অনুসরণ করুন।'
    ]
  },
  {
    id: 'fa-4',
    condition: 'SUSPECTED_FRACTURE',
    title_en: 'Bone Fracture & Severe Joint Trauma',
    title_bn: 'হাড় ভাঙা ও তীব্র সন্ধিবন্ধনী আঘাত',
    severity: 'MODERATE',
    is_emergency: true,
    steps_en: [
      'Do not attempt to push exposed bone back in or force an abnormally angled limb straight.',
      'Immobilize the injured area above and below the injured joint using a padded splint or rolled towel.',
      'Apply an ice pack wrapped in a cloth to reduce swelling; avoid direct skin contact with ice.',
      'Keep the patient calm and treat for shock by keeping them warm and horizontal.',
      'Transport promptly to an orthopedic trauma facility.'
    ],
    steps_bn: [
      'বাঁকা অঙ্গ সোজা করার চেষ্টা করবেন না বা বের হয়ে আসা হাড় ভেতরে ঠেলবেন না।',
      'ক্ষতস্থানের ওপর ও নিচের অংশকে রোল করা তোয়ালে বা স্প্লিন্ট দিয়ে নড়াচড়া বন্ধ (স্থির) রাখুন।',
      'ফোলা কমাতে তোয়ালেতে বরফ পেঁচিয়ে মৃদু কোল্ড প্যাক দিন।',
      'রোগীকে আশ্বস্ত রাখুন এবং উষ্ণ রেখে শকের চিকিৎসা করুন।',
      'যত দ্রুত সম্ভব অর্থোপেডিক ট্রমা সেন্টারে নিয়ে যান।'
    ],
    warnings_en: [
      'Suspected spinal or neck injuries require total stabilization. Never move the patient unless immediate life danger exists.'
    ],
    warnings_bn: [
      'মেরুদণ্ড বা ঘাড়ে আঘাতের সন্দেহ থাকলে রোগীকে নড়াচড়া করাবেন না।'
    ]
  }
];
