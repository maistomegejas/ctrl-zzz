import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProjectById } from '../features/projectsSlice'
import { fetchSprints, createSprint, deleteSprint, startSprint, completeSprint } from '../features/sprintsSlice'
import { CreateSprintDto } from '../types'

export default function SprintsPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { selectedProject } = useAppSelector((state) => state.projects)
  const { sprints, loading } = useAppSelector((state) => state.sprints)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState<CreateSprintDto>({
    name: '',
    goal: '',
    endDate: '',
    projectId: projectId || '',
  })

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId))
      dispatch(fetchSprints(projectId))
    }
  }, [projectId, dispatch])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await dispatch(createSprint({
      ...formData,
      projectId: projectId!,
      endDate: formData.endDate || undefined,
    }))
    setShowCreateForm(false)
    setFormData({ name: '', goal: '', endDate: '', projectId: projectId || '' })
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sprint?')) {
      await dispatch(deleteSprint(id))
    }
  }

  const handleStart = async (id: string) => {
    if (confirm('Start this sprint?')) {
      await dispatch(startSprint(id))
    }
  }

  const handleComplete = async (id: string) => {
    if (confirm('Complete this sprint?')) {
      await dispatch(completeSprint(id))
    }
  }

  const formatDate = (date?: string) => {
    if (!date) return 'Not set'
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(`/projects/${projectId}`)} className="btn btn-ghost mb-6">
        ← Back to Project
      </button>

      {selectedProject && (
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-bold">Sprints</h1>
            <div className="badge badge-lg badge-secondary">{selectedProject.key}</div>
          </div>
          <p className="text-base-content/70">{selectedProject.name}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sprint Management</h2>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn btn-primary">
          {showCreateForm ? 'Cancel' : '+ New Sprint'}
        </button>
      </div>

      {showCreateForm && (
        <div className="card bg-base-200 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="card-title">Create Sprint</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Sprint Name</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sprint 1"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Sprint Goal</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="What is the goal of this sprint? (optional)"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">End Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
                <label className="label">
                  <span className="label-text-alt">Optional - Set when the sprint should end</span>
                </label>
              </div>

              <div className="card-actions justify-end">
                <button type="submit" className="btn btn-primary">
                  Create Sprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      <div className="space-y-4">
        {sprints.map((sprint) => (
          <div key={sprint.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="card-title">{sprint.name}</h3>
                    {sprint.isActive && (
                      <div className="badge badge-success">Active</div>
                    )}
                    {sprint.isCompleted && (
                      <div className="badge badge-ghost">Completed</div>
                    )}
                    {!sprint.isActive && !sprint.isCompleted && (
                      <div className="badge badge-info">Planned</div>
                    )}
                  </div>

                  {sprint.goal && (
                    <p className="text-sm text-base-content/70 mb-3">{sprint.goal}</p>
                  )}

                  <div className="flex gap-4 text-sm text-base-content/60">
                    <div>
                      <span className="font-semibold">Start:</span> {formatDate(sprint.startDate)}
                    </div>
                    <div>
                      <span className="font-semibold">End:</span> {formatDate(sprint.endDate)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!sprint.isActive && !sprint.isCompleted && (
                    <button
                      onClick={() => handleStart(sprint.id)}
                      className="btn btn-success btn-sm"
                    >
                      Start
                    </button>
                  )}
                  {sprint.isActive && !sprint.isCompleted && (
                    <button
                      onClick={() => handleComplete(sprint.id)}
                      className="btn btn-warning btn-sm"
                    >
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(sprint.id)}
                    className="btn btn-error btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sprints.length === 0 && !loading && (
        <div className="text-center py-16">
          <p className="text-lg text-base-content/60">No sprints yet. Create your first sprint!</p>
        </div>
      )}
    </div>
  )
}
