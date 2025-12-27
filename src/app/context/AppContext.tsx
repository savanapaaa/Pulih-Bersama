import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../../services/authService';
import { diagnosisService } from '../../services/diagnosisService';
import { articleService } from '../../services/articleService';
import { symptomService } from '../../services/symptomService';
import { recommendationService } from '../../services/recommendationService';
import { adminService } from '../../services/adminService';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
}

export interface DiagnosisResult {
  id: string;
  userId: string;
  date: string;
  categories: {
    sleepAndPhysical: 'Ringan' | 'Sedang' | 'Tinggi';
    emotional: 'Ringan' | 'Sedang' | 'Tinggi';
    motivation: 'Ringan' | 'Sedang' | 'Tinggi';
    anxiety: 'Ringan' | 'Sedang' | 'Tinggi';
    selfConfidence: 'Ringan' | 'Sedang' | 'Tinggi';
  };
  cfScores?: {
    sleepAndPhysical: number;
    emotional: number;
    motivation: number;
    anxiety: number;
    selfConfidence: number;
  };
  dominantCategory: string;
  overallRisk: 'Ringan' | 'Sedang' | 'Tinggi';
  recommendations: string[];
  raw_answers?: any;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  date: string;
}

export interface Symptom {
  id: string;
  code: string;
  text: string;
  weight: number;
  category: string;
}

export interface Recommendation {
  id: string;
  category: string;
  type: 'Article' | 'Video';
  title: string;
  link: string;
  tags: string[];
}

interface AppContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  
  diagnosisResults: DiagnosisResult[];
  saveDiagnosisResult: (result: DiagnosisResult) => Promise<void>;
  loadDiagnosisResults: () => Promise<void>;
  
  articles: Article[];
  loadArticles: () => Promise<void>;
  addArticle: (article: Omit<Article, 'id'>) => Promise<void>;
  updateArticle: (id: string, article: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  
  symptoms: Symptom[];
  loadSymptoms: () => Promise<void>;
  addSymptom: (symptom: Omit<Symptom, 'id'>) => Promise<void>;
  updateSymptom: (id: string, symptom: Partial<Symptom>) => Promise<void>;
  deleteSymptom: (id: string) => Promise<void>;
  
  recommendations: Recommendation[];
  loadRecommendations: () => Promise<void>;
  addRecommendation: (recommendation: Omit<Recommendation, 'id'>) => Promise<void>;
  updateRecommendation: (id: string, recommendation: Partial<Recommendation>) => Promise<void>;
  deleteRecommendation: (id: string) => Promise<void>;
  
  users: User[];
  loadUsers: () => Promise<void>;
  updateUserRole: (id: string, role: 'user' | 'admin') => Promise<void>;
  
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const token = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('current_user');
      if (!token || !savedUser) return null;
      const parsed = JSON.parse(savedUser);
      return {
        id: String(parsed?.id ?? ''),
        name: String(parsed?.name ?? ''),
        email: String(parsed?.email ?? ''),
        phone: String(parsed?.phone ?? ''),
        role: parsed?.role === 'admin' ? 'admin' : 'user',
      };
    } catch {
      return null;
    }
  });
  const [users, setUsers] = useState<User[]>([]);
  const [diagnosisResults, setDiagnosisResults] = useState<DiagnosisResult[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const normalizeUser = (input: any): User => {
    return {
      id: String(input?.id ?? ''),
      name: String(input?.name ?? ''),
      email: String(input?.email ?? ''),
      phone: String(input?.phone ?? ''),
      role: input?.role === 'admin' ? 'admin' : 'user',
    };
  };

  // Load initial data on mount (and normalize saved user if any)
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('current_user');

    if (token && savedUser) {
      try {
        const user = normalizeUser(JSON.parse(savedUser));
        setCurrentUser(user);
        localStorage.setItem('current_user', JSON.stringify(user));

        // Load initial data
        loadArticles();
        loadSymptoms();
        loadRecommendations();
        loadDiagnosisResults();

        if (user.role === 'admin') {
          loadUsers();
        }
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        setCurrentUser(null);
        setDiagnosisResults([]);
        setUsers([]);

        // Load public data
        loadArticles();
        loadSymptoms();
        loadRecommendations();
      }
    } else {
      // Load public data
      loadArticles();
      loadSymptoms();
      loadRecommendations();
    }
  }, []);

  // Auth functions
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(email, password);
      const user = normalizeUser(response.user);
      setCurrentUser(user);
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('current_user', JSON.stringify(user));
      
      // Load user-specific data
      loadDiagnosisResults();
      loadArticles();
      loadSymptoms();
      loadRecommendations();
      
      if (user.role === 'admin') {
        loadUsers();
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setCurrentUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      setDiagnosisResults([]);
      setUsers([]);
    }
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.register(name, email, phone, password);
      const user = normalizeUser(response.user);
      setCurrentUser(user);
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('current_user', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updated = await authService.updateProfile(data);
      const user = normalizeUser(updated);
      setCurrentUser(user);
      localStorage.setItem('current_user', JSON.stringify(user));
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await authService.updatePassword(currentPassword, newPassword);
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  };

  // Diagnosis functions
  const loadDiagnosisResults = async () => {
    try {
      const results = await diagnosisService.getAll();
      setDiagnosisResults(results);
    } catch (error) {
      console.error('Load diagnosis error:', error);
    }
  };

  const saveDiagnosisResult = async (result: DiagnosisResult) => {
    try {
      const saved = await diagnosisService.create(result);
      setDiagnosisResults([...diagnosisResults, saved]);
    } catch (error) {
      console.error('Save diagnosis error:', error);
      throw error;
    }
  };

  // Article functions
  const loadArticles = async () => {
    try {
      const data = await articleService.getAll();
      setArticles(data);
    } catch (error) {
      console.error('Load articles error:', error);
    }
  };

  const addArticle = async (article: Omit<Article, 'id'>) => {
    try {
      const newArticle = await articleService.create(article);
      setArticles([...articles, newArticle]);
    } catch (error) {
      console.error('Add article error:', error);
      throw error;
    }
  };

  const updateArticle = async (id: string, article: Partial<Article>) => {
    try {
      const updated = await articleService.update(id, article);
      setArticles(articles.map(a => a.id === id ? updated : a));
    } catch (error) {
      console.error('Update article error:', error);
      throw error;
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      await articleService.delete(id);
      setArticles(articles.filter(a => a.id !== id));
    } catch (error) {
      console.error('Delete article error:', error);
      throw error;
    }
  };

  // Symptom functions
  const loadSymptoms = async () => {
    try {
      const data = await symptomService.getAll();
      setSymptoms(data);
    } catch (error) {
      console.error('Load symptoms error:', error);
    }
  };

  const addSymptom = async (symptom: Omit<Symptom, 'id'>) => {
    try {
      const newSymptom = await symptomService.create(symptom);
      setSymptoms([...symptoms, newSymptom]);
    } catch (error) {
      console.error('Add symptom error:', error);
      throw error;
    }
  };

  const updateSymptom = async (id: string, symptom: Partial<Symptom>) => {
    try {
      const updated = await symptomService.update(id, symptom);
      setSymptoms(symptoms.map(s => s.id === id ? updated : s));
    } catch (error) {
      console.error('Update symptom error:', error);
      throw error;
    }
  };

  const deleteSymptom = async (id: string) => {
    try {
      await symptomService.delete(id);
      setSymptoms(symptoms.filter(s => s.id !== id));
    } catch (error) {
      console.error('Delete symptom error:', error);
      throw error;
    }
  };

  // Recommendation functions
  const loadRecommendations = async () => {
    try {
      const data = await recommendationService.getAll();
      setRecommendations(data);
    } catch (error) {
      console.error('Load recommendations error:', error);
    }
  };

  const addRecommendation = async (recommendation: Omit<Recommendation, 'id'>) => {
    try {
      const newRecommendation = await recommendationService.create(recommendation);
      setRecommendations([...recommendations, newRecommendation]);
    } catch (error) {
      console.error('Add recommendation error:', error);
      throw error;
    }
  };

  const updateRecommendation = async (id: string, recommendation: Partial<Recommendation>) => {
    try {
      const updated = await recommendationService.update(id, recommendation);
      setRecommendations(recommendations.map(r => r.id === id ? updated : r));
    } catch (error) {
      console.error('Update recommendation error:', error);
      throw error;
    }
  };

  const deleteRecommendation = async (id: string) => {
    try {
      await recommendationService.delete(id);
      setRecommendations(recommendations.filter(r => r.id !== id));
    } catch (error) {
      console.error('Delete recommendation error:', error);
      throw error;
    }
  };

  // Admin functions
  const loadUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Load users error:', error);
    }
  };

  const updateUserRole = async (id: string, role: 'user' | 'admin') => {
    try {
      const updated = await adminService.updateUser(id, { role });
      setUsers(users.map(u => u.id === id ? updated : u));
    } catch (error) {
      console.error('Update user role error:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        register,
        updateProfile,
        updatePassword,
        diagnosisResults,
        saveDiagnosisResult,
        loadDiagnosisResults,
        articles,
        loadArticles,
        addArticle,
        updateArticle,
        deleteArticle,
        symptoms,
        loadSymptoms,
        addSymptom,
        updateSymptom,
        deleteSymptom,
        recommendations,
        loadRecommendations,
        addRecommendation,
        updateRecommendation,
        deleteRecommendation,
        users,
        loadUsers,
        updateUserRole,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
