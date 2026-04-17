import { USE_MOCKS } from '../../../config/env';
import { getTreatmentSummaryMock } from './treatment.mock';
import { getTreatmentSummaryApi } from './treatment.api';

export const treatmentService = {
  getTreatmentSummary: USE_MOCKS ? getTreatmentSummaryMock : getTreatmentSummaryApi,
};
