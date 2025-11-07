import api from './api';

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
  getAllUsers: () => api.get<User[]>('/api/admin/users'),

  getUserById: (userId: string) => api.get<UserWithRoles>(`/api/admin/users/${userId}`),

  assignRoleToUser: (userId: string, roleId: string) =>
    api.post(`/api/admin/users/${userId}/roles/${roleId}`),

  removeRoleFromUser: (userId: string, roleId: string) =>
    api.delete(`/api/admin/users/${userId}/roles/${roleId}`),

  // Role management
  getAllRoles: () => api.get<Role[]>('/api/admin/roles'),

  getRolePermissions: (roleId: string) =>
    api.get<Permission[]>(`/api/admin/roles/${roleId}/permissions`),

  // Permission management
  getAllPermissions: () => api.get<Permission[]>('/api/admin/permissions'),

  assignPermissionToRole: (roleId: string, permissionId: string) =>
    api.post(`/api/admin/roles/${roleId}/permissions/${permissionId}`),

  removePermissionFromRole: (roleId: string, permissionId: string) =>
    api.delete(`/api/admin/roles/${roleId}/permissions/${permissionId}`),
};
