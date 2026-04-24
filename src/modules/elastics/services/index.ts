import { getMyElasticsApi } from './elastics.api';
import { useAuthStore } from '../../../store/useAuthStore';

export const elasticsService = {
  getElastics: async (patientId: string) => {
    const token = useAuthStore.getState().token;
    if (!token || !patientId) return [];
    return getMyElasticsApi(patientId, token);
  },
};
