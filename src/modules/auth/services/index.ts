import { USE_MOCKS } from '../../../config/env';
import { loginMock } from './auth.mock';
import { loginApi } from './auth.api';

export const authService = {
  login: USE_MOCKS ? loginMock : loginApi,
};
