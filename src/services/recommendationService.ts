import api from './api';
import { Recommendation } from '../app/context/AppContext';

export const recommendationService = {
  async getAll(): Promise<Recommendation[]> {
    const response = await api.get('/recommendations');
    return response.data.map((item: any) => ({
      id: item.id.toString(),
      category: item.category,
      type: item.type,
      title: item.title,
      link: item.link,
      tags: item.tags,
    }));
  },

  // Admin functions
  async create(recommendation: Omit<Recommendation, 'id'>): Promise<Recommendation> {
    const response = await api.post('/admin/recommendations', recommendation);
    const item = response.data.recommendation;
    return {
      id: item.id.toString(),
      category: item.category,
      type: item.type,
      title: item.title,
      link: item.link,
      tags: item.tags,
    };
  },

  async update(id: string, recommendation: Partial<Recommendation>): Promise<Recommendation> {
    const response = await api.put(`/admin/recommendations/${id}`, recommendation);
    const item = response.data.recommendation;
    return {
      id: item.id.toString(),
      category: item.category,
      type: item.type,
      title: item.title,
      link: item.link,
      tags: item.tags,
    };
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/admin/recommendations/${id}`);
  },
};
