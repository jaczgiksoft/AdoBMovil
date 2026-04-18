export interface PatientProfile {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  birthDate?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  hobbies?: (string | { id: number; name: string })[];
}
