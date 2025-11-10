import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProjectById } from '../features/projectsSlice'
import { fetchSprints, createSprint, deleteSprint, startSprint, completeSprint } from '../features/sprintsSlice'
import { CreateSprintDto, Sprint } from '../types'
import Modal from '../components/Modal'

export default function SprintsPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { selectedProject } = useAppSelector((state) => state.projects)
  const { sprints, loading } = useAppSelector((state) => state.sprints)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState<CreateSprintDto>({
    name: '',
    goal: '',
    endDate: '',
    projectId: id || '',
  })
  const [startSprintModal, setStartSprintModal] = useState<Sprint | null>(null)
  const [completeSprintModal, setCompleteSprintModal] = useState<Sprint | null>(null)
  const [deleteSprintModal, setDeleteSprintModal] = useState<Sprint | null>(null)

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id))
      dispatch(fetchSprints(id))
    }
  }, [id, dispatch])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await dispatch(createSprint({
      ...formData,
      projectId: id!,
      endDate: formData.endDate || undefined,
    }))
    setShowCreateForm(false)
    setFormData({ name: '', goal: '', endDate: '', projectId: id || '' })
  }

  const confirmDelete = async () => {
    if (deleteSprintModal) {
      await dispatch(deleteSprint(deleteSprintModal.id))
      setDeleteSprintModal(null)
    }
  }

  const confirmStart = async () => {
    if (startSprintModal) {
      await dispatch(startSprint(startSprintModal.id))
      setStartSprintModal(null)
    }
  }

  const confirmComplete = async () => {
    if (completeSprintModal) {
      await dispatch(completeSprint(completeSprintModal.id))
      setCompleteSprintModal(null)
    }
  }

  const formatDate = (date?: string) => {
    if (!date) return 'Not set'
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sprints</h1>
          <p className="text-gray-600 mt-1">Manage sprints for {selectedProject?.name}</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
        >
          {showCreateForm ? 'Cancel' : '+ New Sprint'}
        </button>
      </div>

      <Modal
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        title="Create New Sprint"
        size="md"
      >
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

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Sprint
                </button>
              </div>
            </form>
      </Modal>

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
                      onClick={() => setStartSprintModal(sprint)}
                      className="btn btn-success btn-sm"
                    >
                      Start
                    </button>
                  )}
                  {sprint.isActive && !sprint.isCompleted && (
                    <button
                      onClick={() => setCompleteSprintModal(sprint)}
                      className="btn btn-warning btn-sm"
                    >
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteSprintModal(sprint)}
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

      {/* Start Sprint Modal */}
      {startSprintModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Start Sprint</h3>
            <p className="py-4">
              Are you sure you want to start <span className="font-semibold">{startSprintModal.name}</span>?
            </p>
            <p className="text-sm text-base-content/60 mb-4">
              This will mark the sprint as active and set the start date to now.
            </p>
            <div className="modal-action">
              <button onClick={() => setStartSprintModal(null)} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={confirmStart} className="btn btn-success">
                Start Sprint
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setStartSprintModal(null)}></div>
        </div>
      )}

      {/* Complete Sprint Modal */}
      {completeSprintModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Complete Sprint</h3>
            <p className="py-4">
              Are you sure you want to complete <span className="font-semibold">{completeSprintModal.name}</span>?
            </p>
            <p className="text-sm text-base-content/60 mb-4">
              This will mark the sprint as completed. This action cannot be undone.
            </p>
            <div className="modal-action">
              <button onClick={() => setCompleteSprintModal(null)} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={confirmComplete} className="btn btn-warning">
                Complete Sprint
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setCompleteSprintModal(null)}></div>
        </div>
      )}

      {/* Delete Sprint Modal */}
      {deleteSprintModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Delete Sprint</h3>
            <p className="py-4">
              Are you sure you want to delete <span className="font-semibold">{deleteSprintModal.name}</span>?
            </p>
            <p className="text-sm text-error mb-4">
              This action cannot be undone. All work items in this sprint will remain but will no longer be assigned to it.
            </p>
            <div className="modal-action">
              <button onClick={() => setDeleteSprintModal(null)} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-error">
                Delete
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeleteSprintModal(null)}></div>
        </div>
      )}
    </div>
  )
}
