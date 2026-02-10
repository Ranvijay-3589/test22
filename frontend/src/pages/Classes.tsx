import { useEffect, useState } from 'react'
import { getClasses, createClass, updateClass, deleteClass } from '../api'
import type { SchoolClass } from '../types'

function Classes() {
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<SchoolClass | null>(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', section: '', room_number: '' })

  const fetchClasses = () => {
    getClasses(search || undefined).then(r => setClasses(r.data)).catch(() => {})
  }

  useEffect(() => { fetchClasses() }, [search])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', section: '', room_number: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (c: SchoolClass) => {
    setEditing(c)
    setForm({
      name: c.name,
      section: c.section,
      room_number: c.room_number || '',
    })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const data = {
      name: form.name,
      section: form.section,
      room_number: form.room_number || null,
    }
    try {
      if (editing) {
        await updateClass(editing.id, data)
      } else {
        await createClass(data)
      }
      setShowModal(false)
      fetchClasses()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this class?')) return
    try {
      await deleteClass(id)
      fetchClasses()
    } catch {
      setError('Failed to delete class')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Classes</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search classes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={openCreate}>+ Add Class</button>
        </div>
      </div>

      <div className="table-container">
        {classes.length === 0 ? (
          <div className="empty-state">
            <div className="icon">&#x1F3DB;</div>
            <p>No classes found</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Section</th>
                <th>Room Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map(c => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td><span className="badge badge-yellow">{c.section}</span></td>
                  <td>{c.room_number || '—'}</td>
                  <td className="actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Class' : 'Add Class'}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Section *</label>
                <input required value={form.section} onChange={e => setForm({...form, section: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Room Number</label>
                <input value={form.room_number} onChange={e => setForm({...form, room_number: e.target.value})} />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Classes
