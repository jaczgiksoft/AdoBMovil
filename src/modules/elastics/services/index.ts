import { getMyElasticsApi } from './elastics.api';
import { useAuthStore } from '../../../store/useAuthStore';

export const elasticsService = {
  getElastics: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return [];
    return getMyElasticsApi(token);
  },
};
