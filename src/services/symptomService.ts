import api from './api';
import { Symptom } from '../app/context/AppContext';

export const symptomService = {
  async getAll(): Promise<Symptom[]> {
    const response = await api.get('/symptoms');
    return response.data.map((item: any) => ({
      id: item.id.toString(),
      code: item.code,
      text: item.text,
      weight: item.weight,
      category: item.category,
    }));
  },

  // Admin functions
  async create(symptom: Omit<Symptom, 'id'>): Promise<Symptom> {
    const response = await api.post('/admin/symptoms', symptom);
    const item = response.data.symptom;
    return {
      id: item.id.toString(),
      code: item.code,
      text: item.text,
      weight: item.weight,
      category: item.category,
    };
  },

  async update(id: string, symptom: Partial<Symptom>): Promise<Symptom> {
    const response = await api.put(`/admin/symptoms/${id}`, symptom);
    const item = response.data.symptom;
    return {
      id: item.id.toString(),
      code: item.code,
      text: item.text,
      weight: item.weight,
      category: item.category,
    };
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/admin/symptoms/${id}`);
  },
};
