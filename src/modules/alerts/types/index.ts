export type AlertSeverity = 'info' | 'warning' | 'urgent';

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  date: string;
  read: boolean;
}
