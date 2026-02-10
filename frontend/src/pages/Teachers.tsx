import { useEffect, useState } from 'react'
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from '../api'
import type { Teacher } from '../types'

function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Teacher | null>(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', department: '' })

  const fetchTeachers = () => {
    getTeachers(search || undefined).then(r => setTeachers(r.data)).catch(() => {})
  }

  useEffect(() => { fetchTeachers() }, [search])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', email: '', phone: '', department: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (t: Teacher) => {
    setEditing(t)
    setForm({
      name: t.name,
      email: t.email,
      phone: t.phone || '',
      department: t.department || '',
    })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const data = {
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      department: form.department || null,
    }
    try {
      if (editing) {
        await updateTeacher(editing.id, data)
      } else {
        await createTeacher(data)
      }
      setShowModal(false)
      fetchTeachers()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return
    try {
      await deleteTeacher(id)
      fetchTeachers()
    } catch {
      setError('Failed to delete teacher')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Teachers</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search teachers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={openCreate}>+ Add Teacher</button>
        </div>
      </div>

      <div className="table-container">
        {teachers.length === 0 ? (
          <div className="empty-state">
            <div className="icon">&#x1F468;&#x200D;&#x1F3EB;</div>
            <p>No teachers found</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.email}</td>
                  <td>{t.phone || '—'}</td>
                  <td>{t.department ? <span className="badge badge-green">{t.department}</span> : '—'}</td>
                  <td className="actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(t)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>Delete</button>
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
            <h2>{editing ? 'Edit Teacher' : 'Add Teacher'}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
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

export default Teachers
