import { AlertItem } from '../types';
import { demoAlertsData } from '../../../core/demo/demo-data';

export const getAlertsMock = async (activePatientId?: string): Promise<AlertItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const patientId = activePatientId || 'pat-sj-1029';
      resolve([...(demoAlertsData[patientId] || [])]);
    }, 500);
  });
};
