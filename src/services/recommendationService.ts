import api from './api';
import { Recommendation } from '../app/context/AppContext';

const toRecommendation = (item: any): Recommendation => ({
  id: item.id.toString(),
  category: item.category,
  type: item.type,
  title: item.title,
  link: item.link,
  tags: Array.isArray(item.tags) ? item.tags : (item.tags ? [String(item.tags)] : []),
});

export const recommendationService = {
  async getAll(): Promise<Recommendation[]> {
    const response = await api.get('/recommendations');

    const data = response.data?.data ?? response.data;
    if (!Array.isArray(data)) return [];
    return data.map(toRecommendation);
  },

  // Admin functions
  async create(recommendation: Omit<Recommendation, 'id'>): Promise<Recommendation> {
    const response = await api.post('/admin/recommendations', recommendation);

    const item = response.data?.recommendation ?? response.data?.data ?? response.data;
    return toRecommendation(item);
  },

  async update(id: string, recommendation: Partial<Recommendation>): Promise<Recommendation> {
    const response = await api.put(`/admin/recommendations/${id}`, recommendation);

    const item = response.data?.recommendation ?? response.data?.data ?? response.data;
    return toRecommendation(item);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/admin/recommendations/${id}`);
  },
};
