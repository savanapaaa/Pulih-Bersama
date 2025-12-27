import api from './api';
import { Article } from '../app/context/AppContext';

export const articleService = {
  async getAll(): Promise<Article[]> {
    const response = await api.get('/articles');
    return response.data.map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      summary: item.summary,
      content: item.content,
      image: item.image || '',
      category: item.category,
      date: item.published_date,
    }));
  },

  async getById(id: string): Promise<Article> {
    const response = await api.get(`/articles/${id}`);
    const item = response.data;
    return {
      id: item.id.toString(),
      title: item.title,
      summary: item.summary,
      content: item.content,
      image: item.image || '',
      category: item.category,
      date: item.published_date,
    };
  },

  // Admin functions
  async create(article: Omit<Article, 'id'>): Promise<Article> {
    const response = await api.post('/admin/articles', {
      title: article.title,
      summary: article.summary,
      content: article.content,
      image: article.image,
      category: article.category,
      published_date: article.date,
    });
    const item = response.data.article;
    return {
      id: item.id.toString(),
      title: item.title,
      summary: item.summary,
      content: item.content,
      image: item.image || '',
      category: item.category,
      date: item.published_date,
    };
  },

  async update(id: string, article: Partial<Article>): Promise<Article> {
    const payload: any = {};
    if (article.title) payload.title = article.title;
    if (article.summary) payload.summary = article.summary;
    if (article.content) payload.content = article.content;
    if (article.image) payload.image = article.image;
    if (article.category) payload.category = article.category;
    if (article.date) payload.published_date = article.date;

    const response = await api.put(`/admin/articles/${id}`, payload);
    const item = response.data.article;
    return {
      id: item.id.toString(),
      title: item.title,
      summary: item.summary,
      content: item.content,
      image: item.image || '',
      category: item.category,
      date: item.published_date,
    };
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/admin/articles/${id}`);
  },
};
