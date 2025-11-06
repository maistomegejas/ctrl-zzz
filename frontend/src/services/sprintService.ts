import { api } from './api'
import { Sprint, CreateSprintDto, UpdateSprintDto } from '../types'

export const sprintService = {
  getAll: (projectId: string) =>
    api.get<Sprint[]>(`/sprints?projectId=${projectId}`),

  getById: (id: string) =>
    api.get<Sprint>(`/sprints/${id}`),

  create: (data: CreateSprintDto) =>
    api.post<Sprint>('/sprints', data),

  update: (id: string, data: UpdateSprintDto) =>
    api.put<Sprint>(`/sprints/${id}`, data),

  delete: (id: string) =>
    api.delete(`/sprints/${id}`),

  start: (id: string) =>
    api.post<Sprint>(`/sprints/${id}/start`),

  complete: (id: string) =>
    api.post<Sprint>(`/sprints/${id}/complete`),
}
