import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

function SubjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', teacher_id: '', class_id: '' });
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/teachers/').then(res => setTeachers(res.data)).catch(() => {});
    api.get('/classes/').then(res => setClasses(res.data)).catch(() => {});
    if (id) {
      api.get(`/subjects/${id}`).then(res => {
        setForm({
          ...res.data,
          teacher_id: res.data.teacher_id || '',
          class_id: res.data.class_id || '',
        });
      }).catch(() => setError('Subject not found'));
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const data = {
      ...form,
      teacher_id: form.teacher_id || null,
      class_id: form.class_id || null,
    };
    const request = id ? api.put(`/subjects/${id}`, data) : api.post('/subjects/', data);
    request
      .then(() => navigate('/subjects'))
      .catch(err => setError(err.response?.data?.detail || 'An error occurred'));
  };

  return (
    <div>
      <h1>{id ? 'Edit' : 'Add'} Subject</h1>
      <div className="card">
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Teacher</label>
            <select value={form.teacher_id} onChange={e => setForm({ ...form, teacher_id: e.target.value ? parseInt(e.target.value) : '' })}>
              <option value="">-- None --</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Class</label>
            <select value={form.class_id} onChange={e => setForm({ ...form, class_id: e.target.value ? parseInt(e.target.value) : '' })}>
              <option value="">-- None --</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
            </select>
          </div>
          <div className="actions">
            <button type="submit" className="btn btn-primary">{id ? 'Update' : 'Create'}</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/subjects')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubjectForm;
