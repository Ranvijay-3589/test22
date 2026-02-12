import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', class_id: '' });
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/classes/').then(res => setClasses(res.data)).catch(() => {});
    if (id) {
      api.get(`/students/${id}`).then(res => {
        setForm({ ...res.data, class_id: res.data.class_id || '' });
      }).catch(() => setError('Student not found'));
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const data = { ...form, class_id: form.class_id || null };
    const request = id ? api.put(`/students/${id}`, data) : api.post('/students/', data);
    request
      .then(() => navigate('/students'))
      .catch(err => setError(err.response?.data?.detail || 'An error occurred'));
  };

  return (
    <div>
      <h1>{id ? 'Edit' : 'Add'} Student</h1>
      <div className="card">
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
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
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/students')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;
