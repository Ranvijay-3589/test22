import { useEffect, useState } from 'react'
import { getStudents, createStudent, updateStudent, deleteStudent, getClasses } from '../api'
import type { Student, SchoolClass } from '../types'

function Students() {
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', class_id: '' })

  const fetchStudents = () => {
    getStudents(search || undefined).then(r => setStudents(r.data)).catch(() => {})
  }

  useEffect(() => { fetchStudents() }, [search])
  useEffect(() => { getClasses().then(r => setClasses(r.data)).catch(() => {}) }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', email: '', phone: '', class_id: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (s: Student) => {
    setEditing(s)
    setForm({
      name: s.name,
      email: s.email,
      phone: s.phone || '',
      class_id: s.class_id ? String(s.class_id) : '',
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
      class_id: form.class_id ? Number(form.class_id) : null,
    }
    try {
      if (editing) {
        await updateStudent(editing.id, data)
      } else {
        await createStudent(data)
      }
      setShowModal(false)
      fetchStudents()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student?')) return
    try {
      await deleteStudent(id)
      fetchStudents()
    } catch {
      setError('Failed to delete student')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Students</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={openCreate}>+ Add Student</button>
        </div>
      </div>

      <div className="table-container">
        {students.length === 0 ? (
          <div className="empty-state">
            <div className="icon">&#x1F393;</div>
            <p>No students found</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Class</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone || '—'}</td>
                  <td>{s.class_name ? <span className="badge badge-blue">{s.class_name}</span> : '—'}</td>
                  <td className="actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
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
            <h2>{editing ? 'Edit Student' : 'Add Student'}</h2>
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
                <label>Class</label>
                <select value={form.class_id} onChange={e => setForm({...form, class_id: e.target.value})}>
                  <option value="">— No class —</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.section})</option>)}
                </select>
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

export default Students
