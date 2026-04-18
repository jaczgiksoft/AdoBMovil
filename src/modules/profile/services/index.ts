import { USE_MOCKS } from '../../../config/env';
import { getProfileMock, getLinkedPatientsMock } from './profile.mock';
import { getProfileApi, getLinkedPatientsApi, getMyProfileApi, addHobbyApi, deleteHobbyApi } from './profile.api';

export const profileService = {
  getProfile: USE_MOCKS ? getProfileMock : getProfileApi,
  getLinkedPatients: USE_MOCKS ? getLinkedPatientsMock : getLinkedPatientsApi,
  getMyProfile: USE_MOCKS ? getProfileMock : getMyProfileApi,
  addHobby: USE_MOCKS ? (async () => ({ id: Math.random(), name: 'Mock' })) : addHobbyApi,
  deleteHobby: USE_MOCKS ? (async () => { }) : deleteHobbyApi,
};
