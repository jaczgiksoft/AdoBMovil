import { PatientProfile } from '../types';
import { demoPatientsData, demoTutorRelationships } from '../../../core/demo/demo-data';

export const getProfileMock = async (activePatientId?: string): Promise<PatientProfile> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const patientId = activePatientId || 'pat-sj-1029';
      const profile = demoPatientsData[patientId];
      if (profile) resolve({ ...profile });
      else reject(new Error('Profile not found'));
    }, 500);
  });
};

export const getLinkedPatientsMock = async (authUserId: string): Promise<PatientProfile[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const linkedIds = demoTutorRelationships[authUserId] || [];
      const patients = linkedIds.map(id => demoPatientsData[id]).filter(Boolean);
      resolve(patients);
    }, 500);
  });
};
