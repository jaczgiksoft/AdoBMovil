import { API_URL, getBaseHeaders } from '../../../core/config/api.config';
import { AlertItem } from '../types';

export const getAlertsApi = async (patientId: string, token?: string): Promise<AlertItem[]> => {
  const response = await fetch(`${API_URL}/patient-alerts/patient-mobile/${patientId}`, {
    method: 'GET',
    headers: getBaseHeaders(token),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error fetching alerts: ${response.statusText}`);
  }

  const alerts = await response.json();
  
  return alerts.map((alert: any) => ({
    id: alert.id.toString(),
    title: alert.title,
    message: alert.description || '', // Map description to message
    severity: alert.is_admin_alert ? 'urgent' : 'info', // Map is_admin_alert to severity
    date: alert.created_at || new Date().toISOString(),
    read: true, // Default to true as discussed
  }));
};
