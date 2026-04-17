export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface AppointmentItem {
  id: string;
  date: string;
  dentistName: string;
  reason: string;
  status: AppointmentStatus;
}
