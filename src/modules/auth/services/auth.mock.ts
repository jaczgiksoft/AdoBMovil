import { AuthResponse } from '../types';
import { demoUsers, demoSelfRelationships, demoTutorRelationships } from '../../../core/demo/demo-data';

const DEMO_PASSWORD = 'Admin123';

export const loginMock = async (email?: string, password?: string): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email) {
        return reject(new Error('Please select a demo account.'));
      }
      if (!password) {
        return reject(new Error('Please enter your password.'));
      }
      if (password !== DEMO_PASSWORD) {
        return reject(new Error('Incorrect password. Please try again.'));
      }

      // Resolve the user by email
      const found = Object.entries(demoUsers).find(([_, u]) => u.email === email);
      if (!found) {
        return reject(new Error('This account is not available in the demo.'));
      }

      const [, user] = found;
      let activePatientId: string | undefined;

      if (user.role === 'patient') {
        activePatientId = demoSelfRelationships[user.id];
      } else if (user.role === 'tutor') {
        const linked = demoTutorRelationships[user.id];
        if (linked && linked.length > 0) {
          activePatientId = linked[0];
        }
      }

      resolve({
        user,
        token: `mock-jwt-token-${user.id}`,
        activePatientId,
      });
    }, 800);
  });
};

