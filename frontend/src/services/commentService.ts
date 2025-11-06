import { api } from './api'
import { Comment, CreateCommentDto } from '../types'

export const commentService = {
  getAll: (workItemId: string) =>
    api.get<Comment[]>('/comments', { params: { workItemId } }),

  create: (data: CreateCommentDto) =>
    api.post<Comment>('/comments', data),

  delete: (id: string) => api.delete(`/comments/${id}`),
}
