import { PatientProfile } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getMyProfileApi = async (token: string): Promise<PatientProfile> => {
  const response = await fetch(`${API_URL}/auth/me-patient`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error fetching profile');
  }

  const result = await response.json();
  return result.data;
};

export const addHobbyApi = async (name: string, token: string): Promise<{ id: number; name: string }> => {
  const response = await fetch(`${API_URL}/auth/me-patient/hobbies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error adding hobby');
  }

  const result = await response.json();
  return result.data;
};

export const deleteHobbyApi = async (id: number, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/me-patient/hobbies/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
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
