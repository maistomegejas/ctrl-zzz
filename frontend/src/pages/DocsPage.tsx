import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Modal from '../components/Modal'
import { documentService } from '../services/documentService'
import { Document } from '../types'

export default function DocsPage() {
  const { id } = useParams<{ id: string }>()

  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editCategory, setEditCategory] = useState('')

  const [newDoc, setNewDoc] = useState({
    title: '',
    content: '',
    category: 'General'
  })

  // Load documents from backend
  useEffect(() => {
    const loadDocuments = async () => {
      if (!id) return

      setLoading(true)
      try {
        const response = await documentService.getAll(id)
        setDocs(response.data)
        if (response.data.length > 0 && !selectedDoc) {
          setSelectedDoc(response.data[0])
        }
      } catch (error) {
        console.error('Failed to load documents:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDocuments()
  }, [id])

  const categories = Array.from(new Set(docs.map(d => d.category)))

  const filteredDocs = docs.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = () => {
    if (selectedDoc) {
      setEditTitle(selectedDoc.title)
      setEditContent(selectedDoc.content)
      setEditCategory(selectedDoc.category)
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    if (!selectedDoc) return

    try {
      const response = await documentService.update(selectedDoc.id, {
        title: editTitle,
        content: editContent,
        category: editCategory
      })
      const updated = docs.map(doc =>
        doc.id === selectedDoc.id ? response.data : doc
      )
      setDocs(updated)
      setSelectedDoc(response.data)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update document:', error)
    }
  }

  const handleCreate = async () => {
    if (!id) return

    try {
      const response = await documentService.create({
        ...newDoc,
        projectId: id
      })
      setDocs([...docs, response.data])
      setSelectedDoc(response.data)
      setShowCreateModal(false)
      setNewDoc({ title: '', content: '', category: 'General' })
    } catch (error) {
      console.error('Failed to create document:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedDoc) return

    if (!window.confirm('Delete this document?')) return

    try {
      await documentService.delete(selectedDoc.id)
      const remaining = docs.filter(d => d.id !== selectedDoc.id)
      setDocs(remaining)
      setSelectedDoc(remaining[0] || null)
    } catch (error) {
      console.error('Failed to delete document:', error)
    }
  }

  return (
    <div className="flex h-full">
      {/* Sidebar - Docs List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Search and Create */}
        <div className="p-4 border-b border-gray-200">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
          >
            + New Document
          </button>
        </div>

        {/* Docs List by Category */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <>
              {categories.map(category => {
                const categoryDocs = filteredDocs.filter(d => d.category === category)
                if (categoryDocs.length === 0) return null

                return (
                  <div key={category} className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {category}
                    </h3>
                    <div className="space-y-1">
                      {categoryDocs.map(doc => (
                        <button
                          key={doc.id}
                          onClick={() => {
                            setSelectedDoc(doc)
                            setIsEditing(false)
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                            selectedDoc?.id === doc.id
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="text-sm truncate">{doc.title}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}

              {filteredDocs.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No documents found
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedDoc ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-2xl font-bold border-b-2 border-blue-600 focus:outline-none"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">{selectedDoc.title}</h1>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Last updated {new Date(selectedDoc.updatedAt || selectedDoc.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 font-medium"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="General">General</option>
                        <option value="Setup">Setup</option>
                        <option value="Development">Development</option>
                        <option value="Design">Design</option>
                        <option value="Testing">Testing</option>
                        <option value="Deployment">Deployment</option>
                      </select>
                    </div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-[600px] px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="Write your documentation here (Markdown supported)..."
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 p-8 prose prose-blue max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                      {selectedDoc.content}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No document selected</h3>
              <p className="text-gray-600">Select a document from the sidebar or create a new one.</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Document"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={newDoc.title}
              onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Document title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={newDoc.category}
              onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="General">General</option>
              <option value="Setup">Setup</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Testing">Testing</option>
              <option value="Deployment">Deployment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={newDoc.content}
              onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Write your documentation here (Markdown supported)..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!newDoc.title || !newDoc.content}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
