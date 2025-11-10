import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchWorkItems } from '../features/workItemsSlice'
import { fetchSprints } from '../features/sprintsSlice'
import { fetchUsers } from '../features/usersSlice'
import { fetchProjectById } from '../features/projectsSlice'
import { WorkItemStatus, WorkItemType } from '../types'

export default function ProjectDashboard() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { workItems } = useAppSelector((state) => state.workItems)
  const { sprints } = useAppSelector((state) => state.sprints)
  const { users } = useAppSelector((state) => state.users)
  const { selectedProject } = useAppSelector((state) => state.projects)

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id))
      dispatch(fetchWorkItems(id))
      dispatch(fetchSprints(id))
    }
    if (users.length === 0) {
      dispatch(fetchUsers())
    }
  }, [id, dispatch, users.length])

  // Calculate metrics
  const totalIssues = workItems.length
  const inProgress = workItems.filter(item => item.status === WorkItemStatus.InProgress).length
  const done = workItems.filter(item => item.status === WorkItemStatus.Done).length
  const blocked = workItems.filter(item => item.status === WorkItemStatus.Blocked).length

  // Current sprint
  const activeSprint = sprints.find(s => s.isActive)
  const sprintIssues = workItems.filter(item => item.sprintId === activeSprint?.id)
  const sprintDone = sprintIssues.filter(item => item.status === WorkItemStatus.Done).length
  const sprintProgress = sprintIssues.length > 0 ? (sprintDone / sprintIssues.length) * 100 : 0

  // Team workload
  const teamWorkload = users.map(user => {
    const userIssues = workItems.filter(item => item.assigneeId === user.id)
    const storyPoints = userIssues.reduce((sum, item) => sum + (item.storyPoints || 0), 0)
    return {
      ...user,
      issueCount: userIssues.length,
      storyPoints,
    }
  }).filter(u => u.issueCount > 0)

  // Recent activity (mock for now - we'll add real activity log later)
  const recentActivity = [
    ...workItems.slice(0, 5).map(item => ({
      id: item.id,
      message: `Issue ${item.title} was updated`,
      timestamp: item.updatedAt || item.createdAt,
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const getTypeLabel = (type: WorkItemType) => {
    return ['Epic', 'Story', 'Task', 'Bug', 'Subtask'][type]
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview and metrics for {selectedProject?.name || 'this project'}</p>
      </div>

      {/* Metric Cards */}
      <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-3xl font-bold text-gray-900">{totalIssues}</div>
          <div className="text-sm text-gray-500 mt-1">Total Issues</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-3xl font-bold text-blue-600">{inProgress}</div>
          <div className="text-sm text-gray-500 mt-1">In Progress</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-3xl font-bold text-green-600">{done}</div>
          <div className="text-sm text-gray-500 mt-1">Completed</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-3xl font-bold text-red-600">{blocked}</div>
          <div className="text-sm text-gray-500 mt-1">Blocked</div>
        </div>
      </div>

      {/* Current Sprint */}
      {activeSprint && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Current Sprint: {activeSprint.name}</h2>
              {activeSprint.goal && (
                <p className="text-sm text-gray-500 mt-1">{activeSprint.goal}</p>
              )}
            </div>
            <button
              onClick={() => navigate(`/projects/${id}/sprints`)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All Sprints →
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{sprintDone} of {sprintIssues.length} issues completed</span>
              <span className="text-gray-900 font-medium">{Math.round(sprintProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${sprintProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Members */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Team</h2>
            <button
              onClick={() => navigate(`/projects/${id}/team`)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {teamWorkload.slice(0, 5).map(member => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate(`/projects/${id}/team`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{member.issueCount} issues</div>
                  <div className="text-xs text-gray-500">{member.storyPoints} SP</div>
                </div>
              </div>
            ))}
            {teamWorkload.length === 0 && (
              <p className="text-center text-gray-500 py-8">No team members assigned to issues yet</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-gray-700">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <p className="text-center text-gray-500 py-8">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/projects/${id}/issues`)}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors border border-blue-200"
          >
            + New Issue
          </button>
          <button
            onClick={() => navigate(`/projects/${id}/sprints`)}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors border border-blue-200"
          >
            + New Sprint
          </button>
          <button
            onClick={() => navigate(`/projects/${id}/board`)}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors border border-blue-200"
          >
            View Board
          </button>
          <button
            onClick={() => navigate(`/projects/${id}/reports`)}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors border border-blue-200"
          >
            View Reports
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}
