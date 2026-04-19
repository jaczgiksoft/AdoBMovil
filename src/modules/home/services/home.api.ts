import { API_URL, getBaseHeaders } from '../../../core/config/api.config';
import { PatientHomeSummary } from '../types';

export const getHomeSummaryApi = async (patientId: string, token?: string): Promise<PatientHomeSummary> => {
  if (!patientId) {
    throw new Error('Patient ID is required');
  }

  const response = await fetch(`${API_URL}/patients/${patientId}/home-summary`, {
    method: 'GET',
    headers: getBaseHeaders(token),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error fetching home summary: ${response.statusText}`);
  }

  return await response.json();
};
