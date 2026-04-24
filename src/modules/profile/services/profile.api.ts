import { API_URL, getBaseHeaders } from '../../../core/config/api.config';
import { PatientProfile } from '../types';

export const getMyProfileApi = async (token: string, patientId?: string): Promise<PatientProfile> => {
  const url = patientId ? `${API_URL}/auth/me-patient?patientId=${patientId}` : `${API_URL}/auth/me-patient`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getBaseHeaders(token),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error fetching profile');
  }

  const result = await response.json();
  return result.data;
};

export const addHobbyApi = async (name: string, token: string, patientId?: string): Promise<{ id: number; name: string }> => {
  const response = await fetch(`${API_URL}/auth/me-patient/hobbies`, {
    method: 'POST',
    headers: getBaseHeaders(token),
    body: JSON.stringify({ name, patientId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error adding hobby');
  }

  const result = await response.json();
  return result.data;
};

export const deleteHobbyApi = async (id: number, token: string, patientId?: string): Promise<void> => {
  const url = patientId ? `${API_URL}/auth/me-patient/hobbies/${id}?patientId=${patientId}` : `${API_URL}/auth/me-patient/hobbies/${id}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: getBaseHeaders(token),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error deleting hobby');
  }
};

export const getProfileApi = async (activePatientId?: string): Promise<PatientProfile> => {
  // Keeping this for compatibility if used elsewhere, but moving to getMyProfileApi for current task
  throw new Error('Use getMyProfileApi instead');
};

export const getLinkedPatientsApi = async (authUserId: string): Promise<PatientProfile[]> => {
  throw new Error('API not implemented yet');
};
