import { API_URL, getBaseHeaders } from '../../../core/config/api.config';
import { AuthResponse } from '../types';

export const loginApi = async (username?: string, password?: string): Promise<AuthResponse> => {
  if (!username) {
    throw new Error('Please enter a username.');
  }
  if (!password) {
    throw new Error('Please enter your password.');
  }

  const response = await fetch(`${API_URL}/auth/login-patient`, {
    method: 'POST',
    headers: getBaseHeaders(),
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
  
  // Si el backend regresa el objeto user, lo usamos y mapeamos campos
  const user = data.user ? {
    id: String(data.user.id),
    name: `${data.user.first_name} ${data.user.last_name}`,
    email: data.user.email,
    phoneNumber: data.user.phone_number,
    role: 'patient' as const,
    avatarUrl: data.user.photo_url || '/assets/avatars/default.png',
    isFirstAccess: data.user.first_login ?? true
  } : {
    id: decodedToken.id,
    name: decodedToken.username,
    email: decodedToken.username,
    role: 'patient' as const,
    avatarUrl: '/assets/avatars/default.png',
    isFirstAccess: true
  };

  return {
    user,
    token: data.token,
    activePatientId: String(decodedToken.id),
    profiles: data.profiles || [],
  };
};
