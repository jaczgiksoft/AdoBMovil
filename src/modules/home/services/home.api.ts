import { PatientHomeSummary } from '../types';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getHomeSummaryApi = async (patientId: string, token?: string): Promise<PatientHomeSummary> => {
  if (!patientId) {
    throw new Error('Patient ID is required');
  }

  const response = await fetch(`${API_URL}/patients/${patientId}/home-summary`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error fetching home summary: ${response.statusText}`);
  }

  return await response.json();
};
