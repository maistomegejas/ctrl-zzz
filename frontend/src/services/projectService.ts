import { api } from './api'
import { Project, CreateProjectDto } from '../types'

export const projectService = {
  getAll: () => api.get<Project[]>('/projects'),

  getById: (id: string) => api.get<Project>(`/projects/${id}`),

  create: (data: CreateProjectDto) => api.post<Project>('/projects', data),

  update: (id: string, data: Partial<Project>) =>
    api.put<Project>(`/projects/${id}`, data),

  delete: (id: string) => api.delete(`/projects/${id}`),
}
