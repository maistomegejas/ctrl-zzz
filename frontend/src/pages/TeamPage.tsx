import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProjectById } from '../features/projectsSlice'
import { fetchWorkItems } from '../features/workItemsSlice'

export default function TeamPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { selectedProject } = useAppSelector((state) => state.projects)
  const { workItems } = useAppSelector((state) => state.workItems)
  const { users } = useAppSelector((state) => state.users)
  const [showAddMember, setShowAddMember] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id))
      dispatch(fetchWorkItems(id))
    }
  }, [id, dispatch])

  // Calculate team workload
  const teamMembers = users.map(user => {
    const userIssues = workItems.filter(item => item.assigneeId === user.id && item.projectId === id)
    const storyPoints = userIssues.reduce((sum, item) => sum + (item.storyPoints || 0), 0)
    const completedIssues = userIssues.filter(item => item.status === 3).length // Done = 3
    const inProgressIssues = userIssues.filter(item => item.status === 1).length // InProgress = 1

    return {
      ...user,
      issueCount: userIssues.length,
      storyPoints,
      completedIssues,
      inProgressIssues
    }
  })

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Team</h1>
          <button
            onClick={() => setShowAddMember(!showAddMember)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
          >
            + Add Member
          </button>
        </div>
        <p className="text-gray-600">
          Manage team members and view workload for {selectedProject?.name}
        </p>
      </div>

      {/* Add Member Form */}
      {showAddMember && (
        <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Add Team Member</h3>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Enter user email..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
              Add
            </button>
            <button
              onClick={() => setShowAddMember(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            User must be registered in the system to be added to the project.
          </p>
        </div>
      )}

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-blue-600 mb-1">{teamMembers.length}</div>
          <div className="text-sm text-gray-600">Team Members</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-green-600 mb-1">
            {teamMembers.reduce((sum, m) => sum + m.completedIssues, 0)}
          </div>
          <div className="text-sm text-gray-600">Completed Issues</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-yellow-600 mb-1">
            {teamMembers.reduce((sum, m) => sum + m.inProgressIssues, 0)}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {teamMembers.reduce((sum, m) => sum + m.storyPoints, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Story Points</div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Issues
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In Progress
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Story Points
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{member.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center justify-center w-12 h-8 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
                      {member.issueCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center justify-center w-12 h-8 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                      {member.inProgressIssues}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center justify-center w-12 h-8 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                      {member.completedIssues}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center justify-center w-12 h-8 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
                      {member.storyPoints}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {teamMembers.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No team members yet</h3>
            <p className="text-gray-600">Add members to start collaborating on this project.</p>
          </div>
        )}
      </div>
    </div>
  )
}
