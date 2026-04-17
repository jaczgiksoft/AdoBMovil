import { USE_MOCKS } from '../../../config/env';
import { getAlertsMock } from './alerts.mock';
import { getAlertsApi } from './alerts.api';

export const alertsService = {
  getAlerts: USE_MOCKS ? getAlertsMock : getAlertsApi,
};
