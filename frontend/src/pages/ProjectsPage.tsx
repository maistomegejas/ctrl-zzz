import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProjects, createProject, deleteProject } from '../features/projectsSlice'
import { CreateProjectDto } from '../types'

export default function ProjectsPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { projects, loading, error } = useAppSelector((state) => state.projects)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState<CreateProjectDto>({
    name: '',
    key: '',
    description: '',
    ownerId: '', // Will need to get this from a user selector later
  })

  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await dispatch(createProject(formData))
    setShowCreateForm(false)
    setFormData({ name: '', key: '', description: '', ownerId: '' })
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await dispatch(deleteProject(id))
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Projects</h1>
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
          {showCreateForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {showCreateForm && (
        <div style={{
          backgroundColor: '#f9f9f9',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}>
          <h3>Create New Project</h3>
          <form onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Project Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <input
              type="text"
              placeholder="Project Key (e.g., PROJ)"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value.toUpperCase() })}
              required
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '80px' }}
            />
            <input
              type="text"
              placeholder="Owner User ID (paste from Swagger)"
              value={formData.ownerId}
              onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
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
              Create Project
            </button>
          </form>
        </div>
      )}

      {loading && <p>Loading projects...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
            }}
          >
            <div onClick={() => navigate(`/projects/${project.id}`)}>
              <h3>{project.name}</h3>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                <strong>{project.key}</strong>
              </p>
              {project.description && (
                <p style={{ color: '#888', fontSize: '14px' }}>{project.description}</p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(project.id)
              }}
              style={{
                marginTop: '10px',
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

      {projects.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
          No projects yet. Create your first project!
        </p>
      )}
    </div>
  )
}
