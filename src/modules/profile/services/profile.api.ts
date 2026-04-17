import { PatientProfile } from '../types';

export const getProfileApi = async (activePatientId?: string): Promise<PatientProfile> => {
  // TODO: Implement real API integration
  throw new Error('API not implemented yet');
};

export const getLinkedPatientsApi = async (authUserId: string): Promise<PatientProfile[]> => {
  throw new Error('API not implemented yet');
};
