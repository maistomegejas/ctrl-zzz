import { api } from './api'
import { User, CreateUserDto } from '../types'

export const userService = {
  getAll: () => api.get<User[]>('/users'),

  getById: (id: string) => api.get<User>(`/users/${id}`),

  create: (data: CreateUserDto) => api.post<User>('/users', data),

  update: (id: string, data: Partial<User>) =>
    api.put<User>(`/users/${id}`, data),

  delete: (id: string) => api.delete(`/users/${id}`),
}
