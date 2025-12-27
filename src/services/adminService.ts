import api from './api';
import { User, DiagnosisResult } from '../app/context/AppContext';

export const adminService = {
  async getAllUsers(): Promise<User[]> {
    const response = await api.get('/admin/users');
    return response.data.map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
      email: item.email,
      phone: item.phone || '',
      role: item.role,
    }));
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const payload: any = {};
    if (data.name) payload.name = data.name;
    if (data.email) payload.email = data.email;
    if (data.phone) payload.phone = data.phone;
    if (data.role) payload.role = data.role;

    const response = await api.put(`/admin/users/${id}`, payload);
    const item = response.data.user;
    return {
      id: item.id.toString(),
      name: item.name,
      email: item.email,
      phone: item.phone || '',
      role: item.role,
    };
  },

  async getAllDiagnosis(): Promise<DiagnosisResult[]> {
    const response = await api.get('/admin/diagnosis');
    return response.data.map((item: any) => ({
      id: item.id.toString(),
      userId: item.user_id.toString(),
      date: item.diagnosis_date,
      categories: {
        sleepAndPhysical: item.category_sleep_physical,
        emotional: item.category_emotional,
        motivation: item.category_motivation,
        anxiety: item.category_anxiety,
        selfConfidence: item.category_self_confidence,
      },
      dominantCategory: item.dominant_category,
      overallRisk: item.overall_risk,
      recommendations: item.recommendations,
    }));
  },
};
