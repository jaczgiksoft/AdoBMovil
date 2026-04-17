import { USE_MOCKS } from '../../../config/env';
import { getHomeSummaryMock } from './home.mock';
import { getHomeSummaryApi } from './home.api';

export const homeService = {
  getHomeSummary: USE_MOCKS ? getHomeSummaryMock : getHomeSummaryApi,
};
