import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

function ClassForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', section: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      api.get(`/classes/${id}`).then(res => setForm(res.data)).catch(() => setError('Class not found'));
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const request = id ? api.put(`/classes/${id}`, form) : api.post('/classes/', form);
    request
      .then(() => navigate('/classes'))
      .catch(err => setError(err.response?.data?.detail || 'An error occurred'));
  };

  return (
    <div>
      <h1>{id ? 'Edit' : 'Add'} Class</h1>
      <div className="card">
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Section</label>
            <input value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} required />
          </div>
          <div className="actions">
            <button type="submit" className="btn btn-primary">{id ? 'Update' : 'Create'}</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/classes')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClassForm;
