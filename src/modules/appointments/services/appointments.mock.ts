import { AppointmentItem } from '../types';
import { demoAppointmentsData } from '../../../core/demo/demo-data';

export const getAppointmentsMock = async (activePatientId?: string): Promise<AppointmentItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const patientId = activePatientId || 'pat-sj-1029';
      resolve([...(demoAppointmentsData[patientId] || [])]);
    }, 500);
  });
};
