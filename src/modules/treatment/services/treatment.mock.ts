import { TreatmentSummary } from '../types';
import { demoTreatmentData } from '../../../core/demo/demo-data';

export const getTreatmentSummaryMock = async (activePatientId?: string): Promise<TreatmentSummary> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const patientId = activePatientId || 'pat-sj-1029';
      const treatment = demoTreatmentData[patientId];
      if (treatment) resolve({ ...treatment });
      else reject(new Error('Treatment not found'));
    }, 500);
  });
};
