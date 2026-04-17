import { AppointmentItem } from '../../modules/appointments/types';
import { AlertItem } from '../../modules/alerts/types';
import { PatientProfile } from '../../modules/profile/types';
import { TreatmentSummary } from '../../modules/treatment/types';
import { PatientUser } from '../../modules/auth/types';

// ==========================================
// CENTRAL DEMO DATA SOURCE
// ==========================================
// This file acts as the single source of truth for the Phase 3 mock data.
// It allows all modules to share a consistent patient narrative without
// coupling to real backend endpoints yet.

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(10, 0, 0, 0);

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

// --- Demo Users (Authentication Layer) ---
export const demoUsers: Record<string, PatientUser> = {
  'sarah_adult': {
    id: 'user-auth-sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    role: 'patient',
    isFirstAccess: false,
  },
  'michael_tutor': {
    id: 'user-auth-michael',
    name: 'Michael Davis',
    email: 'michael.d@example.com',
    role: 'tutor',
    isFirstAccess: false, // he's a tutor for Emily
  },
  'emily_first_access': {
    id: 'user-auth-emily',
    name: 'Emily Davis',
    email: 'emily.first@example.com',
    role: 'patient',
    isFirstAccess: true,
  }
};

// --- Patient Profiles (Domain Layer) ---
export const demoPatientsData: Record<string, PatientProfile> = {
  'pat-sj-1029': {
    id: 'pat-sj-1029',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    fullName: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 019-2837',
    dateOfBirth: '1992-06-15',
    birthDate: '1992-06-15',
    age: 33,
    gender: 'female',
    address: '123 Meadow Lane, Seattle, WA',
    hobbies: ['Running', 'Photography', 'Reading'],
  },
  'pat-ed-2024': { // Emily Davis
    id: 'pat-ed-2024',
    firstName: 'Emily',
    lastName: 'Davis',
    fullName: 'Emily Davis',
    email: 'emily.d@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '2010-08-22',
    birthDate: '2010-08-22',
    age: 15,
    gender: 'female',
    address: '456 Oak Avenue, Bellevue, WA',
    hobbies: ['Drawing', 'Video Games'],
  },
  'pat-td-2025': { // Tommy Davis
    id: 'pat-td-2025',
    firstName: 'Tommy',
    lastName: 'Davis',
    fullName: 'Tommy Davis',
    email: 'tommy.d@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '2018-03-12',
    birthDate: '2018-03-12',
    age: 8,
    gender: 'male',
    address: '456 Oak Avenue, Bellevue, WA',
    hobbies: ['Football', 'Lego'],
  },
  'pat-om-2026': { // Oscar Miller
    id: 'pat-om-2026',
    firstName: 'Oscar',
    lastName: 'Miller',
    fullName: 'Oscar Miller',
    email: 'oscar.m@example.com',
    phone: '+1 (555) 987-6543',
    dateOfBirth: '2012-11-05',
    birthDate: '2012-11-05',
    age: 13,
    gender: 'male',
    address: '789 Pine Street, Kirkland, WA',
    hobbies: ['Piano', 'Cycling'],
  }
};

// --- Role Relationships ---
export const demoTutorRelationships: Record<string, string[]> = {
  // authUserId -> array of patientIds
  'user-auth-michael': ['pat-ed-2024', 'pat-td-2025', 'pat-om-2026'],
};

// Which patient ID corresponds to a basic adult patient user?
export const demoSelfRelationships: Record<string, string> = {
  'user-auth-sarah': 'pat-sj-1029',
  'user-auth-emily': 'pat-ed-2024',
};

// --- Domain Data by Patient ID ---
export const demoAppointmentsData: Record<string, AppointmentItem[]> = {
  'pat-sj-1029': [
    {
      id: 'apt-042',
      date: tomorrow.toISOString(),
      dentistName: 'Dr. Emerson',
      reason: 'Aligner Tracking & Adjustment',
      status: 'scheduled',
    },
    {
      id: 'apt-041',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      dentistName: 'Dr. Emerson',
      reason: 'Phase 2 Delivery',
      status: 'completed',
    }
  ],
  'pat-ed-2024': [], // Emily has no appointments yet
  'pat-td-2025': [
    {
      id: 'apt-td-1',
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      dentistName: 'Dr. Miller',
      reason: 'Regular Cleaning & Fluoride',
      status: 'scheduled',
    }
  ],
  'pat-om-2026': [
    {
      id: 'apt-om-1',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      dentistName: 'Dr. Emerson',
      reason: 'Braces Adjustment Follow-up',
      status: 'scheduled',
    }
  ]
};

export const demoAlertsData: Record<string, AlertItem[]> = {
  'pat-sj-1029': [
    {
      id: 'alt-091',
      title: 'Appointment Tomorrow',
      message: 'You have your aligner tracking appointment with Dr. Emerson tomorrow at 10:00 AM.',
      severity: 'warning',
      date: yesterday.toISOString(),
      read: false,
    },
    {
      id: 'alt-090',
      title: 'New 3D Scans Available',
      message: 'Your updated progress scans are now available in your treatment history.',
      severity: 'info',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    }
  ],
  'pat-ed-2024': [
    {
      id: 'alt-100',
      title: 'Welcome to Bwise Dental',
      message: 'Please review your onboarding steps to get started with your treatment.',
      severity: 'info',
      date: new Date().toISOString(),
      read: false,
    }
  ],
  'pat-td-2025': [
    {
      id: 'alt-td-1',
      title: 'Great Job!',
      message: 'Tommy did a great job at his last visit. Keep up the good brushing routine!',
      severity: 'info',
      date: yesterday.toISOString(),
      read: false,
    }
  ],
  'pat-om-2026': [
    {
      id: 'alt-om-1',
      title: 'Wear Time Alert',
      message: 'Oscar might need a reminder to wear his aligners for at least 22 hours today.',
      severity: 'warning',
      date: new Date().toISOString(),
      read: false,
    },
    {
      id: 'alt-om-2',
      title: 'Scan Uploaded',
      message: 'The latest intraoral scans for Oscar are ready for review.',
      severity: 'info',
      date: yesterday.toISOString(),
      read: true,
    }
  ]
};

export const demoTreatmentData: Record<string, TreatmentSummary> = {
  'pat-sj-1029': {
    id: 'treat-sj-1',
    title: 'Invisalign Comprehensive',
    overallProgress: 45,
    phases: [
      { id: 'p1', name: 'Initial Scan & Setup', status: 'completed' },
      { id: 'p2', name: 'Aligners 1-12 (Current)', status: 'in-progress' },
      { id: 'p3', name: 'Aligners 13-24', status: 'pending' },
      { id: 'p4', name: 'Refinement & Retainers', status: 'pending' },
    ],
  },
  'pat-ed-2024': {
    id: 'treat-ed-1',
    title: 'Phase 1 Orthodontics',
    overallProgress: 0,
    phases: [
      { id: 'p-ed-1', name: 'Initial Scan & Setup', status: 'in-progress' },
      { id: 'p-ed-2', name: 'Expansion Appliance', status: 'pending' },
    ],
  },
  'pat-td-2025': {
    id: 'treat-td-1',
    title: 'Pediatric Preventative Plan',
    overallProgress: 100,
    phases: [
      { id: 'p-td-1', name: 'Initial Screening', status: 'completed' },
      { id: 'p-td-2', name: 'Sealants Application', status: 'completed' },
      { id: 'p-td-3', name: 'Routine Monitoring', status: 'completed' },
    ],
  },
  'pat-om-2026': {
    id: 'treat-om-1',
    title: 'Braces Phase 1',
    overallProgress: 20,
    phases: [
      { id: 'p-om-1', name: 'Diagnostic Records', status: 'completed' },
      { id: 'p-om-2', name: 'Bracket Placement', status: 'completed' },
      { id: 'p-om-3', name: 'Leveling & Alignment', status: 'in-progress' },
      { id: 'p-om-4', name: 'Bite Correction', status: 'pending' },
    ],
  }
};

// ===============================================
// LEGACY COMPATIBILITY LAYER
// ===============================================
// DO NOT USE THIS FOR NEW DEVELOPMENT.
// These expose the first adult patient (Sarah) to keep unmodified modules from crashing.
export const demoData = {
  patient: demoPatientsData['pat-sj-1029'],
  appointments: demoAppointmentsData['pat-sj-1029'],
  alerts: demoAlertsData['pat-sj-1029'],
  treatment: demoTreatmentData['pat-sj-1029'],
};
