import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { PatientProfile } from '../../modules/auth/types';

export type Patient = {
  id: string;
  fullName: string;
  age?: number;
  photo?: string | null;
  type?: 'self' | 'represented';
};

interface PatientContextType {
  currentPatient: Patient | null;
  setCurrentPatient: (patient: Patient | null) => void;
  switchPatient: (patientId: string) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPatient, setCurrentPatientState] = useState<Patient | null>(null);
  const { availableProfiles } = useAuthStore();

  // Load from local storage on mount
  useEffect(() => {
    const savedId = localStorage.getItem('bwise-active-patient-id');
    if (savedId && availableProfiles?.length > 0) {
      const profile = availableProfiles.find(p => p.id === savedId);
      if (profile) {
        setCurrentPatientState({
          id: profile.id,
          fullName: profile.name,
          photo: profile.photo,
          type: profile.type
        });
      }
    }
  }, [availableProfiles]);

  const setCurrentPatient = (patient: Patient | null) => {
    setCurrentPatientState(patient);
    if (patient) {
      localStorage.setItem('bwise-active-patient-id', patient.id);
    } else {
      localStorage.removeItem('bwise-active-patient-id');
    }
  };

  const switchPatient = (patientId: string) => {
    if (!availableProfiles) return;
    const profile = availableProfiles.find(p => p.id === patientId);
    if (profile) {
      setCurrentPatient({
        id: profile.id,
        fullName: profile.name,
        photo: profile.photo,
        type: profile.type
      });
    }
  };

  return (
    <PatientContext.Provider value={{ currentPatient, setCurrentPatient, switchPatient }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};
