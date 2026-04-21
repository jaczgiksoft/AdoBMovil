export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'pendiente' | 'confirmada' | 'cancelada';

export interface AppointmentItem {
  id: string;
  date: string;
  dentistName: string;
  reason: string;
  status: AppointmentStatus;
}
