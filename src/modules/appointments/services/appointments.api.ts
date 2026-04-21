import { API_URL, getBaseHeaders } from '../../../core/config/api.config';
import { AppointmentItem } from '../types';

export const getAppointmentsApi = async (patientId: string, token?: string): Promise<AppointmentItem[]> => {
  if (!patientId) {
    throw new Error('Patient ID is required');
  }

  const response = await fetch(`${API_URL}/appointments/patient-mobile/${patientId}`, {
    method: 'GET',
    headers: getBaseHeaders(token),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error fetching appointments: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data || [];
};

export const updateAppointmentStatusApi = async (
  appointmentId: string,
  status: 'confirmada' | 'cancelada',
  token?: string
): Promise<any> => {
  const response = await fetch(`${API_URL}/appointments/${appointmentId}/status`, {
    method: 'PATCH',
    headers: {
      ...getBaseHeaders(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error updating appointment status: ${response.statusText}`);
  }

  return await response.json();
};
