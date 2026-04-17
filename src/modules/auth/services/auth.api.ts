import { AuthResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const loginApi = async (username?: string, password?: string): Promise<AuthResponse> => {
  if (!username) {
    throw new Error('Please enter a username.');
  }
  if (!password) {
    throw new Error('Please enter your password.');
  }

  const response = await fetch(`${API_URL}/auth/login-patient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Login failed.');
  }

  // The API returns roles, we need to map the first patient to activePatientId later if needed.
  // We'll create a default minimal User matching PatientUser structure. 
  // You might want to adjust based on exact DB returned info.
  const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
  
  return {
    user: {
      id: decodedToken.id,
      name: decodedToken.username,
      email: decodedToken.username,
      role: 'patient',
      avatarUrl: '/assets/avatars/default.png',
      isFirstAccess: false // Assume false unless backend returns it explicitly
    },
    token: data.token,
    activePatientId: String(decodedToken.id),
  };
};
