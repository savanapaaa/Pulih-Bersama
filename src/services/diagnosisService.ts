import api from './api';
import { DiagnosisResult } from '../app/context/AppContext';

export const diagnosisService = {
  async getAll(): Promise<DiagnosisResult[]> {
    const response = await api.get('/diagnosis');
    // Backend might return { data: [...] } or just [...]
    const data = response.data.data || response.data;
    
    if (!Array.isArray(data)) {
      console.error('Unexpected diagnosis response format:', response.data);
      return [];
    }
    
    return data.map((item: any) => ({
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
      recommendations: item.recommendations || [],
    }));
  },

  async create(result: Omit<DiagnosisResult, 'id'> & { raw_answers?: any }): Promise<DiagnosisResult> {
    const response = await api.post('/diagnosis', {
      diagnosis_date: result.date,
      categories: {
        sleepAndPhysical: result.categories.sleepAndPhysical,
        emotional: result.categories.emotional,
        motivation: result.categories.motivation,
        anxiety: result.categories.anxiety,
        selfConfidence: result.categories.selfConfidence,
      },
      dominant_category: result.dominantCategory,
      overall_risk: result.overallRisk,
      recommendations: result.recommendations || [],
      raw_answers: result.raw_answers || {},
    });

    const item = response.data.result;
    return {
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
    };
  },

  async getById(id: string): Promise<DiagnosisResult> {
    const response = await api.get(`/diagnosis/${id}`);
    const item = response.data;
    return {
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
    };
  },
};
