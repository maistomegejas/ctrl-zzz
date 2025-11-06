import { api } from './api'
import { LoginDto, RegisterDto, AuthResponse } from '../types'

export const authService = {
  login: (data: LoginDto) => api.post<AuthResponse>('/auth/login', data),

  register: (data: RegisterDto) => api.post<AuthResponse>('/auth/register', data),

  refresh: (refreshToken: string) =>
    api.post<AuthResponse>('/auth/refresh', { refreshToken }),
}
