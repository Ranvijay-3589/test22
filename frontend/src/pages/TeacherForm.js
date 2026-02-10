import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

function TeacherForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      api.get(`/teachers/${id}`).then(res => setForm(res.data)).catch(() => setError('Teacher not found'));
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const request = id ? api.put(`/teachers/${id}`, form) : api.post('/teachers/', form);
    request
      .then(() => navigate('/teachers'))
      .catch(err => setError(err.response?.data?.detail || 'An error occurred'));
  };

  return (
    <div>
      <h1>{id ? 'Edit' : 'Add'} Teacher</h1>
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
          <div className="actions">
            <button type="submit" className="btn btn-primary">{id ? 'Update' : 'Create'}</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/teachers')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TeacherForm;
