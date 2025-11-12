import { api } from './api'
import { Document, CreateDocumentDto, UpdateDocumentDto } from '../types'

export const documentService = {
  getAll: (projectId: string) =>
    api.get<Document[]>('/documents', { params: { projectId } }),

  getById: (id: string) =>
    api.get<Document>(`/documents/${id}`),

  create: (data: CreateDocumentDto) =>
    api.post<Document>('/documents', data),

  update: (id: string, data: UpdateDocumentDto) =>
    api.put<Document>(`/documents/${id}`, data),

  delete: (id: string) =>
    api.delete(`/documents/${id}`),
}
