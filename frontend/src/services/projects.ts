import type { Project, PricePoint } from '../types';
import type { ApiProject } from '../types/api';
import { USE_MOCKS } from '../constants';
import { MOCK_PROJECTS, MOCK_PRICE_HISTORIES } from '../mocks/data';
import { adaptProject, adaptProjectToApi } from '../adapters/projectAdapter';
import api from './api';

export const projectsService = {
  async getAll(): Promise<Project[]> {
    if (USE_MOCKS) return MOCK_PROJECTS;
    try {
      const { data } = await api.get<ApiProject[]>('/api/projects');
      return data.map(adaptProject);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw new Error('Unable to load projects');
    }
  },

  async getByTicker(ticker: string): Promise<Project> {
    if (USE_MOCKS) {
      const project = MOCK_PROJECTS.find(p => p.ticker === ticker);
      if (!project) throw new Error(`Projeto ${ticker} não encontrado`);
      return project;
    }
    try {
      const { data } = await api.get<ApiProject>(`/api/projects/${encodeURIComponent(ticker)}`);
      return adaptProject(data);
    } catch (error) {
      console.error(`Failed to fetch project ${ticker}:`, error);
      throw new Error(`Projeto ${ticker} não encontrado`);
    }
  },

  async getPriceHistory(ticker: string): Promise<PricePoint[]> {
    if (USE_MOCKS) {
      return MOCK_PRICE_HISTORIES[ticker] ?? [];
    }
    try {
      const { data } = await api.get<PricePoint[]>(
        `/api/projects/${encodeURIComponent(ticker)}/price-history`,
      );
      return data;
    } catch (error) {
      console.error(`Failed to fetch price history for ${ticker}:`, error);
      return [];
    }
  },

  async create(project: Partial<Project>): Promise<Project> {
    if (USE_MOCKS) throw new Error('Create not available in mock mode');
    try {
      const payload = adaptProjectToApi(project);
      const { data } = await api.post<ApiProject>('/api/projects', payload);
      return adaptProject(data);
    } catch (error) {
      console.error('Failed to create project:', error);
      throw new Error('Unable to create project');
    }
  },
};
