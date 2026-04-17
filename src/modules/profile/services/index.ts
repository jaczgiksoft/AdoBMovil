import { USE_MOCKS } from '../../../config/env';
import { getProfileMock, getLinkedPatientsMock } from './profile.mock';
import { getProfileApi, getLinkedPatientsApi } from './profile.api';

export const profileService = {
  getProfile: USE_MOCKS ? getProfileMock : getProfileApi,
  getLinkedPatients: USE_MOCKS ? getLinkedPatientsMock : getLinkedPatientsApi,
};
