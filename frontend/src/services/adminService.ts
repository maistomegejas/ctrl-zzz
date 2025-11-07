import { api } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface UserWithRoles extends User {
  roles: Role[];
}

export const adminService = {
  // User management
  getAllUsers: () => api.get<User[]>('/admin/users'),

  getUserById: (userId: string) => api.get<UserWithRoles>(`/admin/users/${userId}`),

  assignRoleToUser: (userId: string, roleId: string) =>
    api.post(`/admin/users/${userId}/roles/${roleId}`),

  removeRoleFromUser: (userId: string, roleId: string) =>
    api.delete(`/admin/users/${userId}/roles/${roleId}`),

  // Role management
  getAllRoles: () => api.get<Role[]>('/admin/roles'),

  getRolePermissions: (roleId: string) =>
    api.get<Permission[]>(`/admin/roles/${roleId}/permissions`),

  // Permission management
  getAllPermissions: () => api.get<Permission[]>('/admin/permissions'),

  assignPermissionToRole: (roleId: string, permissionId: string) =>
    api.post(`/admin/roles/${roleId}/permissions/${permissionId}`),

  removePermissionFromRole: (roleId: string, permissionId: string) =>
    api.delete(`/admin/roles/${roleId}/permissions/${permissionId}`),
};
