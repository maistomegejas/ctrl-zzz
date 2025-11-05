import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProjectById } from '../features/projectsSlice'
import { fetchWorkItems, createWorkItem, deleteWorkItem } from '../features/workItemsSlice'
import { CreateWorkItemDto, WorkItemType, Priority, WorkItemStatus } from '../types'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { selectedProject } = useAppSelector((state) => state.projects)
  const { workItems, loading } = useAppSelector((state) => state.workItems)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState<CreateWorkItemDto>({
    title: '',
    description: '',
    type: WorkItemType.Task,
    priority: Priority.Medium,
    storyPoints: undefined,
    projectId: id || '',
    assigneeId: undefined,
    parentId: undefined,
  })

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id))
      dispatch(fetchWorkItems(id))
    }
  }, [id, dispatch])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await dispatch(createWorkItem({ ...formData, projectId: id! }))
    setShowCreateForm(false)
    setFormData({
      title: '',
      description: '',
      type: WorkItemType.Task,
      priority: Priority.Medium,
      storyPoints: undefined,
      projectId: id || '',
      assigneeId: undefined,
      parentId: undefined,
    })
  }

  const handleDelete = async (workItemId: string) => {
    if (confirm('Are you sure you want to delete this work item?')) {
      await dispatch(deleteWorkItem(workItemId))
    }
  }

  const getStatusLabel = (status: WorkItemStatus) => {
    return ['To Do', 'In Progress', 'In Review', 'Done', 'Blocked'][status]
  }

  const getPriorityLabel = (priority: Priority) => {
    return ['Low', 'Medium', 'High', 'Critical', 'Blocker'][priority]
  }

  const getTypeLabel = (type: WorkItemType) => {
    return ['Epic', 'Story', 'Task', 'Bug', 'Subtask'][type]
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/projects')}
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          backgroundColor: '#ddd',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        ← Back to Projects
      </button>

      {selectedProject && (
        <div style={{ marginBottom: '30px' }}>
          <h1>{selectedProject.name}</h1>
          <p style={{ color: '#666' }}>
            <strong>{selectedProject.key}</strong>
          </p>
          {selectedProject.description && <p>{selectedProject.description}</p>}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Work Items</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {showCreateForm ? 'Cancel' : '+ New Work Item'}
        </button>
      </div>

      {showCreateForm && (
        <div style={{
          backgroundColor: '#f9f9f9',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}>
          <h3>Create Work Item</h3>
          <form onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '80px' }}
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: Number(e.target.value) as WorkItemType })}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value={WorkItemType.Epic}>Epic</option>
              <option value={WorkItemType.Story}>Story</option>
              <option value={WorkItemType.Task}>Task</option>
              <option value={WorkItemType.Bug}>Bug</option>
              <option value={WorkItemType.Subtask}>Subtask</option>
            </select>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) as Priority })}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value={Priority.Low}>Low</option>
              <option value={Priority.Medium}>Medium</option>
              <option value={Priority.High}>High</option>
              <option value={Priority.Critical}>Critical</option>
              <option value={Priority.Blocker}>Blocker</option>
            </select>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Create Work Item
            </button>
          </form>
        </div>
      )}

      {loading && <p>Loading work items...</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {workItems.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, marginBottom: '5px' }}>{item.title}</h4>
              {item.description && <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>{item.description}</p>}
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px', fontSize: '12px' }}>
                <span style={{ padding: '2px 8px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                  {getTypeLabel(item.type)}
                </span>
                <span style={{ padding: '2px 8px', backgroundColor: '#f3e5f5', borderRadius: '4px' }}>
                  {getPriorityLabel(item.priority)}
                </span>
                <span style={{ padding: '2px 8px', backgroundColor: '#fff3e0', borderRadius: '4px' }}>
                  {getStatusLabel(item.status)}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              style={{
                padding: '5px 10px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {workItems.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
          No work items yet. Create your first work item!
        </p>
      )}
    </div>
  )
}
