import { AppointmentItem } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getAppointmentsApi = async (patientId: string, token?: string): Promise<any[]> => {
  if (!patientId) {
    throw new Error('Patient ID is required');
  }

  const response = await fetch(`${API_URL}/appointments/patient-mobile/${patientId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error fetching appointments: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data || [];
};
