import api from './api';
import { User } from '../app/context/AppContext';

export const authService = {
  async register(name: string, email: string, phone: string, password: string): Promise<{ user: User; token: string }> {
    const response = await api.post('/register', {
      name,
      email,
      phone,
      password,
    });
    return response.data;
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await api.post('/login', {
      email,
      password,
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/user');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/user/profile', data);
    return response.data.user;
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/user/password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },
};
