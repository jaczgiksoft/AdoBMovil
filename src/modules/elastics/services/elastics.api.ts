import { PatientElastic } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getMyElasticsApi = async (token: string): Promise<PatientElastic[]> => {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  const response = await fetch(`${API_URL}/auth/me-patient/elastics`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error fetching elastics: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data || [];
};
