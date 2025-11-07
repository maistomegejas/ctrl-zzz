import { useState, useEffect } from 'react';
import { adminService, User, Role, Permission, UserWithRoles } from '../services/adminService';

type TabType = 'users' | 'roles' | 'permissions';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadUsers();
    loadRoles();
    loadPermissions();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      setUsers(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await adminService.getAllRoles();
      setRoles(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load roles');
    }
  };

  const loadPermissions = async () => {
    try {
      const response = await adminService.getAllPermissions();
      setPermissions(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load permissions');
    }
  };

  const loadUserDetails = async (userId: string) => {
    try {
      setLoading(true);
      const response = await adminService.getUserById(userId);
      setSelectedUser(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const loadRolePermissions = async (roleId: string) => {
    try {
      setLoading(true);
      const response = await adminService.getRolePermissions(roleId);
      setRolePermissions(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load role permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      await adminService.assignRoleToUser(userId, roleId);
      await loadUserDetails(userId);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to assign role');
    }
  };

  const handleRemoveRole = async (userId: string, roleId: string) => {
    try {
      await adminService.removeRoleFromUser(userId, roleId);
      await loadUserDetails(userId);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to remove role');
    }
  };

  const handleAssignPermission = async (roleId: string, permissionId: string) => {
    try {
      await adminService.assignPermissionToRole(roleId, permissionId);
      await loadRolePermissions(roleId);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to assign permission');
    }
  };

  const handleRemovePermission = async (roleId: string, permissionId: string) => {
    try {
      await adminService.removePermissionFromRole(roleId, permissionId);
      await loadRolePermissions(roleId);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to remove permission');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <button
          className={`tab ${activeTab === 'users' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`tab ${activeTab === 'roles' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          Roles
        </button>
        <button
          className={`tab ${activeTab === 'permissions' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('permissions')}
        >
          Permissions
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users List */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">All Users</h2>
              {loading && <span className="loading loading-spinner"></span>}
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => loadUserDetails(user.id)}
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* User Details & Role Assignment */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">User Details</h2>
              {selectedUser ? (
                <div>
                  <div className="mb-4">
                    <p><strong>Name:</strong> {selectedUser.name}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                  </div>

                  <h3 className="font-bold mb-2">Current Roles:</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedUser.roles.map((role) => (
                      <div key={role.id} className="badge badge-primary gap-2">
                        {role.name}
                        <button
                          className="btn btn-xs btn-circle btn-ghost"
                          onClick={() => handleRemoveRole(selectedUser.id, role.id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {selectedUser.roles.length === 0 && (
                      <p className="text-gray-500">No roles assigned</p>
                    )}
                  </div>

                  <h3 className="font-bold mb-2">Assign Role:</h3>
                  <div className="flex flex-wrap gap-2">
                    {roles
                      .filter((role) => !selectedUser.roles.some((ur) => ur.id === role.id))
                      .map((role) => (
                        <button
                          key={role.id}
                          className="btn btn-sm btn-outline"
                          onClick={() => handleAssignRole(selectedUser.id, role.id)}
                        >
                          + {role.name}
                        </button>
                      ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Select a user to manage their roles</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Roles List */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">All Roles</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => (
                      <tr key={role.id}>
                        <td>{role.name}</td>
                        <td>{role.description}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              setSelectedRole(role);
                              loadRolePermissions(role.id);
                            }}
                          >
                            Manage Permissions
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Role Permissions */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Role Permissions</h2>
              {selectedRole ? (
                <div>
                  <div className="mb-4">
                    <p><strong>Role:</strong> {selectedRole.name}</p>
                    <p className="text-sm text-gray-500">{selectedRole.description}</p>
                  </div>

                  <h3 className="font-bold mb-2">Current Permissions:</h3>
                  <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                    {rolePermissions.map((perm) => (
                      <div key={perm.id} className="flex items-center justify-between p-2 bg-base-200 rounded">
                        <div>
                          <p className="font-semibold">{perm.name}</p>
                          <p className="text-xs text-gray-500">{perm.description}</p>
                        </div>
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => handleRemovePermission(selectedRole.id, perm.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {rolePermissions.length === 0 && (
                      <p className="text-gray-500">No permissions assigned</p>
                    )}
                  </div>

                  <h3 className="font-bold mb-2">Add Permission:</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {permissions
                      .filter((perm) => !rolePermissions.some((rp) => rp.id === perm.id))
                      .map((perm) => (
                        <div key={perm.id} className="flex items-center justify-between p-2 bg-base-200 rounded">
                          <div>
                            <p className="font-semibold">{perm.name}</p>
                            <p className="text-xs text-gray-500">{perm.description}</p>
                          </div>
                          <button
                            className="btn btn-xs btn-success"
                            onClick={() => handleAssignPermission(selectedRole.id, perm.id)}
                          >
                            Add
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Select a role to manage its permissions</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">All Permissions</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Resource</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((perm) => (
                    <tr key={perm.id}>
                      <td className="font-semibold">{perm.name}</td>
                      <td>{perm.description}</td>
                      <td>
                        <span className="badge badge-info">{perm.resource}</span>
                      </td>
                      <td>
                        <span className="badge badge-success">{perm.action}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
