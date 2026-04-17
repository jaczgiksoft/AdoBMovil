export type DemoUserRole = 'patient' | 'tutor' | 'tutor_patient';

export interface PatientUser {
  id: string;
  name: string;
  email: string;
  role: DemoUserRole;
  avatarUrl?: string;
  isFirstAccess?: boolean;
}

export interface AuthResponse {
  user: PatientUser;
  token: string;
  activePatientId?: string;
}
