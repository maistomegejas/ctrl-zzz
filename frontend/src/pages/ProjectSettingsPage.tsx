import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { projectService } from '../services/projectService'
import { ProjectMember, User } from '../types'
import { userService } from '../services/userService'
import ConfirmModal from '../components/ConfirmModal'

export default function ProjectSettingsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { permissions } = useAppSelector((state) => state.auth)

  const [members, setMembers] = useState<ProjectMember[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [removeConfirm, setRemoveConfirm] = useState<{ show: boolean; memberId: string | null; userId: string | null }>({
    show: false,
    memberId: null,
    userId: null,
  })

  const hasPermission = (permission: string) => {
    return permissions.includes(permission)
  }

  const canManageMembers = hasPermission('Projects.ManageMembers')

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    if (!id) return

    try {
      setLoading(true)
      const [membersResponse, usersResponse] = await Promise.all([
        projectService.getMembers(id),
        userService.getAll(),
      ])
      setMembers(membersResponse.data)
      setAllUsers(usersResponse.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async () => {
    if (!selectedUserId || !id) return

    try {
      await projectService.addMember(id, selectedUserId)
      setSelectedUserId('')
      await loadData()
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add member')
    }
  }

  const handleRemoveClick = (memberId: string, userId: string) => {
    setRemoveConfirm({ show: true, memberId, userId })
  }

  const handleRemoveConfirm = async () => {
    if (!removeConfirm.userId || !id) return

    try {
      await projectService.removeMember(id, removeConfirm.userId)
      await loadData()
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to remove member')
    } finally {
      setRemoveConfirm({ show: false, memberId: null, userId: null })
    }
  }

  const handleRemoveCancel = () => {
    setRemoveConfirm({ show: false, memberId: null, userId: null })
  }

  const availableUsers = allUsers.filter(
    (user) => !members.some((member) => member.userId === user.id)
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Project Settings</h1>
        <p className="text-gray-600 mt-1">Manage project members</p>
      </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <span className="text-sm text-red-800">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Project Members ({members.length})</h2>

          {canManageMembers && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Add Member</h3>
              <div className="flex gap-3">
                <select
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <option value="">Select a user...</option>
                  {availableUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddMember}
                  disabled={!selectedUserId}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  Add Member
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {members.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No members yet</p>
            ) : (
              members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {member.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{member.userName}</div>
                      <div className="text-sm text-gray-500">{member.userEmail}</div>
                    </div>
                  </div>
                  {canManageMembers && (
                    <button
                      onClick={() => handleRemoveClick(member.id, member.userId)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      <ConfirmModal
        isOpen={removeConfirm.show}
        title="Remove Member"
        message="Are you sure you want to remove this member from the project?"
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleRemoveConfirm}
        onCancel={handleRemoveCancel}
      />
    </div>
  )
}
