import { useEffect, useState } from 'react'
import { getSubjects, createSubject, updateSubject, deleteSubject, getTeachers, getClasses } from '../api'
import type { Subject, Teacher, SchoolClass } from '../types'

function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Subject | null>(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', code: '', teacher_id: '', class_id: '' })

  const fetchSubjects = () => {
    getSubjects(search || undefined).then(r => setSubjects(r.data)).catch(() => {})
  }

  useEffect(() => { fetchSubjects() }, [search])
  useEffect(() => {
    getTeachers().then(r => setTeachers(r.data)).catch(() => {})
    getClasses().then(r => setClasses(r.data)).catch(() => {})
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', code: '', teacher_id: '', class_id: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (s: Subject) => {
    setEditing(s)
    setForm({
      name: s.name,
      code: s.code,
      teacher_id: s.teacher_id ? String(s.teacher_id) : '',
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
      code: form.code,
      teacher_id: form.teacher_id ? Number(form.teacher_id) : null,
      class_id: form.class_id ? Number(form.class_id) : null,
    }
    try {
      if (editing) {
        await updateSubject(editing.id, data)
      } else {
        await createSubject(data)
      }
      setShowModal(false)
      fetchSubjects()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subject?')) return
    try {
      await deleteSubject(id)
      fetchSubjects()
    } catch {
      setError('Failed to delete subject')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Subjects</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search subjects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={openCreate}>+ Add Subject</button>
        </div>
      </div>

      <div className="table-container">
        {subjects.length === 0 ? (
          <div className="empty-state">
            <div className="icon">&#x1F4DA;</div>
            <p>No subjects found</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Teacher</th>
                <th>Class</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td><span className="badge badge-yellow">{s.code}</span></td>
                  <td>{s.teacher_name ? <span className="badge badge-green">{s.teacher_name}</span> : '—'}</td>
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
            <h2>{editing ? 'Edit Subject' : 'Add Subject'}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Code *</label>
                <input required value={form.code} onChange={e => setForm({...form, code: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Teacher</label>
                <select value={form.teacher_id} onChange={e => setForm({...form, teacher_id: e.target.value})}>
                  <option value="">— No teacher —</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
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

export default Subjects
