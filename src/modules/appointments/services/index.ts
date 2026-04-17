import { USE_MOCKS } from '../../../config/env';
import { getAppointmentsMock } from './appointments.mock';
import { getAppointmentsApi } from './appointments.api';

export const appointmentsService = {
  getAppointments: USE_MOCKS ? getAppointmentsMock : getAppointmentsApi,
};
