import { PatientHomeSummary } from '../types';
import { demoPatientsData, demoAppointmentsData, demoAlertsData, demoTreatmentData } from '../../../core/demo/demo-data';

export const getHomeSummaryMock = async (activePatientId?: string): Promise<PatientHomeSummary> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const patientId = activePatientId || 'pat-sj-1029';
      
      const patient = demoPatientsData[patientId];
      const appointments = demoAppointmentsData[patientId] || [];
      const alerts = demoAlertsData[patientId] || [];
      const treatment = demoTreatmentData[patientId];
      
      if (!patient || !treatment) {
        return reject(new Error('Patient home data not found'));
      }

      const activeAlerts = alerts.filter(a => !a.read).length;
      const nextApt = appointments.find(a => a.status === 'scheduled');
      
      resolve({
        patientId: patient.id,
        patientFirstName: patient.firstName,
        nextAppointmentDate: nextApt?.date,
        nextAppointmentReason: nextApt?.reason,
        activeAlertsCount: activeAlerts,
        treatmentStatus: treatment.phases.find(p => p.status === 'in-progress')?.name || 'Active',
        treatmentProgress: treatment.overallProgress,
      });
    }, 500);
  });
};
