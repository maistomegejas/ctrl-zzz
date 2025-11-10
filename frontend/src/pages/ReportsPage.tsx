import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProjectById } from '../features/projectsSlice'
import { fetchWorkItems } from '../features/workItemsSlice'
import { fetchSprints } from '../features/sprintsSlice'
import { WorkItemStatus, WorkItemType, Priority } from '../types'

export default function ReportsPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { selectedProject } = useAppSelector((state) => state.projects)
  const { workItems } = useAppSelector((state) => state.workItems)
  const { sprints } = useAppSelector((state) => state.sprints)
  const [selectedReport, setSelectedReport] = useState<'overview' | 'velocity' | 'burndown' | 'time'>('overview')

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id))
      dispatch(fetchWorkItems(id))
      dispatch(fetchSprints(id))
    }
  }, [id, dispatch])

  const projectWorkItems = workItems.filter(item => item.projectId === id)

  // Calculate statistics
  const statusCounts = {
    todo: projectWorkItems.filter(item => item.status === WorkItemStatus.ToDo).length,
    inProgress: projectWorkItems.filter(item => item.status === WorkItemStatus.InProgress).length,
    inReview: projectWorkItems.filter(item => item.status === WorkItemStatus.InReview).length,
    done: projectWorkItems.filter(item => item.status === WorkItemStatus.Done).length,
    blocked: projectWorkItems.filter(item => item.status === WorkItemStatus.Blocked).length
  }

  const typeCounts = {
    epic: projectWorkItems.filter(item => item.type === WorkItemType.Epic).length,
    story: projectWorkItems.filter(item => item.type === WorkItemType.Story).length,
    task: projectWorkItems.filter(item => item.type === WorkItemType.Task).length,
    bug: projectWorkItems.filter(item => item.type === WorkItemType.Bug).length,
    subtask: projectWorkItems.filter(item => item.type === WorkItemType.Subtask).length
  }

  const priorityCounts = {
    blocker: projectWorkItems.filter(item => item.priority === Priority.Blocker).length,
    critical: projectWorkItems.filter(item => item.priority === Priority.Critical).length,
    high: projectWorkItems.filter(item => item.priority === Priority.High).length,
    medium: projectWorkItems.filter(item => item.priority === Priority.Medium).length,
    low: projectWorkItems.filter(item => item.priority === Priority.Low).length
  }

  const completedSprints = sprints.filter(s => s.isCompleted)
  const sprintVelocity = completedSprints.map(sprint => {
    const sprintItems = projectWorkItems.filter(item => item.sprintId === sprint.id && item.status === WorkItemStatus.Done)
    const storyPoints = sprintItems.reduce((sum, item) => sum + (item.storyPoints || 0), 0)
    return { sprint: sprint.name, velocity: storyPoints }
  })

  const avgVelocity = sprintVelocity.length > 0
    ? Math.round(sprintVelocity.reduce((sum, s) => sum + s.velocity, 0) / sprintVelocity.length)
    : 0

  // Time tracking
  const totalEstimated = projectWorkItems.reduce((sum, item) => sum + (item.originalEstimateMinutes || 0), 0)
  const totalLogged = projectWorkItems.reduce((sum, item) => sum + (item.timeLoggedMinutes || 0), 0)
  const totalRemaining = projectWorkItems.reduce((sum, item) => sum + (item.remainingEstimateMinutes || 0), 0)

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const BarChart = ({ data, colors, maxValue }: { data: { label: string; value: number }[]; colors: string[]; maxValue: number }) => (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.label}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700 font-medium">{item.label}</span>
            <span className="text-gray-600">{item.value}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${colors[index]}`}
              style={{ width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">
          View insights and metrics for {selectedProject?.name}
        </p>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'velocity', label: 'Velocity', icon: '⚡' },
          { id: 'burndown', label: 'Burndown', icon: '📉' },
          { id: 'time', label: 'Time Tracking', icon: '⏱️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedReport(tab.id as any)}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedReport === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Report */}
      {selectedReport === 'overview' && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-3xl font-bold text-blue-600 mb-1">{projectWorkItems.length}</div>
              <div className="text-sm text-gray-600">Total Issues</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-3xl font-bold text-green-600 mb-1">{statusCounts.done}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-3xl font-bold text-yellow-600 mb-1">{statusCounts.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-3xl font-bold text-red-600 mb-1">{statusCounts.blocked}</div>
              <div className="text-sm text-gray-600">Blocked</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Status Distribution */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-6">Issues by Status</h3>
              <BarChart
                data={[
                  { label: 'To Do', value: statusCounts.todo },
                  { label: 'In Progress', value: statusCounts.inProgress },
                  { label: 'In Review', value: statusCounts.inReview },
                  { label: 'Done', value: statusCounts.done },
                  { label: 'Blocked', value: statusCounts.blocked }
                ]}
                colors={['bg-gray-400', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500', 'bg-red-500']}
                maxValue={Math.max(...Object.values(statusCounts))}
              />
            </div>

            {/* Type Distribution */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-6">Issues by Type</h3>
              <BarChart
                data={[
                  { label: 'Epic', value: typeCounts.epic },
                  { label: 'Story', value: typeCounts.story },
                  { label: 'Task', value: typeCounts.task },
                  { label: 'Bug', value: typeCounts.bug },
                  { label: 'Subtask', value: typeCounts.subtask }
                ]}
                colors={['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-gray-500']}
                maxValue={Math.max(...Object.values(typeCounts))}
              />
            </div>

            {/* Priority Distribution */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-6">Issues by Priority</h3>
              <BarChart
                data={[
                  { label: 'Blocker', value: priorityCounts.blocker },
                  { label: 'Critical', value: priorityCounts.critical },
                  { label: 'High', value: priorityCounts.high },
                  { label: 'Medium', value: priorityCounts.medium },
                  { label: 'Low', value: priorityCounts.low }
                ]}
                colors={['bg-red-600', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']}
                maxValue={Math.max(...Object.values(priorityCounts))}
              />
            </div>

            {/* Sprint Summary */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-6">Sprint Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Total Sprints</span>
                  <span className="text-2xl font-bold text-gray-900">{sprints.length}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Completed Sprints</span>
                  <span className="text-2xl font-bold text-green-600">{completedSprints.length}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Avg Velocity</span>
                  <span className="text-2xl font-bold text-blue-600">{avgVelocity} SP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Velocity Report */}
      {selectedReport === 'velocity' && (
        <div className="bg-white p-8 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-6">Sprint Velocity</h3>
          {sprintVelocity.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg mb-6">
                <span className="text-gray-700 font-medium">Average Velocity</span>
                <span className="text-3xl font-bold text-blue-600">{avgVelocity} SP</span>
              </div>
              <BarChart
                data={sprintVelocity.map(s => ({ label: s.sprint, value: s.velocity }))}
                colors={sprintVelocity.map(() => 'bg-blue-500')}
                maxValue={Math.max(...sprintVelocity.map(s => s.velocity))}
              />
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No completed sprints yet. Complete sprints to see velocity data.
            </div>
          )}
        </div>
      )}

      {/* Burndown Chart */}
      {selectedReport === 'burndown' && (
        <div className="bg-white p-8 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-6">Sprint Burndown</h3>
          <div className="text-center py-12 text-gray-500">
            Burndown chart coming soon. Select an active sprint to view burndown data.
          </div>
        </div>
      )}

      {/* Time Tracking */}
      {selectedReport === 'time' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">{formatTime(totalEstimated)}</div>
              <div className="text-sm text-gray-600">Original Estimate</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-green-600 mb-1">{formatTime(totalLogged)}</div>
              <div className="text-sm text-gray-600">Time Logged</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-orange-600 mb-1">{formatTime(totalRemaining)}</div>
              <div className="text-sm text-gray-600">Remaining Estimate</div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-6">Time Progress</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">Time Logged vs Estimated</span>
                  <span className="text-gray-600">
                    {totalEstimated > 0 ? Math.round((totalLogged / totalEstimated) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="h-4 rounded-full bg-green-500"
                    style={{ width: `${totalEstimated > 0 ? Math.min((totalLogged / totalEstimated) * 100, 100) : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">Remaining Time</span>
                  <span className="text-gray-600">
                    {totalEstimated > 0 ? Math.round((totalRemaining / totalEstimated) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="h-4 rounded-full bg-orange-500"
                    style={{ width: `${totalEstimated > 0 ? Math.min((totalRemaining / totalEstimated) * 100, 100) : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
