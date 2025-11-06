import { api } from './api'
import { WorkItem, CreateWorkItemDto, UpdateWorkItemDto, WorkItemStatus } from '../types'

export const workItemService = {
  getAll: (params?: {
    projectId?: string
    status?: WorkItemStatus
    assigneeId?: string
  }) => api.get<WorkItem[]>('/workitems', { params }),

  getById: (id: string) => api.get<WorkItem>(`/workitems/${id}`),

  create: (data: CreateWorkItemDto) =>
    api.post<WorkItem>('/workitems', data),

  update: (id: string, data: UpdateWorkItemDto) =>
    api.put<WorkItem>(`/workitems/${id}`, data),

  delete: (id: string) => api.delete(`/workitems/${id}`),
}
