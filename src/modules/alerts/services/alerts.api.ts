import { AlertItem } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getAlertsApi = async (token?: string): Promise<AlertItem[]> => {
  const response = await fetch(`${API_URL}/patient-alerts/my-alerts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
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
