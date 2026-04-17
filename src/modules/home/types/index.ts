export interface PatientHomeSummary {
  patientId: string;
  patientFirstName: string;
  nextAppointmentDate?: string;
  nextAppointmentReason?: string;
  activeAlertsCount: number;
  treatmentStatus: string;
  treatmentProgress: number;
}
