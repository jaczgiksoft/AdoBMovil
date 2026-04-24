import { API_URL, getBaseHeaders } from '../../../core/config/api.config';
import { PatientElastic } from '../types';

export const getMyElasticsApi = async (patientId: string, token: string): Promise<PatientElastic[]> => {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  const response = await fetch(`${API_URL}/patient-elastics/patient/${patientId}`, {
    method: 'GET',
    headers: getBaseHeaders(token),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error fetching elastics: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data || [];
};
