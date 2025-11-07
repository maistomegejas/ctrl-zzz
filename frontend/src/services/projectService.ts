import { api } from './api'
import { Project, CreateProjectDto, ProjectMember } from '../types'

export const projectService = {
  getAll: () => api.get<Project[]>('/projects'),

  getById: (id: string) => api.get<Project>(`/projects/${id}`),

  create: (data: CreateProjectDto) => api.post<Project>('/projects', data),

  update: (id: string, data: Partial<Project>) =>
    api.put<Project>(`/projects/${id}`, data),

  delete: (id: string) => api.delete(`/projects/${id}`),

  // Member management
  getMembers: (projectId: string) => api.get<ProjectMember[]>(`/projects/${projectId}/members`),

  addMember: (projectId: string, userId: string) =>
    api.post(`/projects/${projectId}/members/${userId}`),

  removeMember: (projectId: string, userId: string) =>
    api.delete(`/projects/${projectId}/members/${userId}`),
}
