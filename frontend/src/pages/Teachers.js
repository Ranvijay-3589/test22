import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState('');

  const fetchTeachers = () => {
    const params = search ? { search } : {};
    api.get('/teachers/', { params }).then(res => setTeachers(res.data)).catch(() => {});
  };

  useEffect(() => { fetchTeachers(); }, [search]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this teacher?')) {
      api.delete(`/teachers/${id}`).then(() => fetchTeachers());
    }
  };

  return (
    <div>
      <h1>Teachers</h1>
      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search teachers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Link to="/teachers/new" className="btn btn-primary">Add Teacher</Link>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.name}</td>
                <td>{t.email}</td>
                <td>{t.phone || '-'}</td>
                <td className="actions">
                  <Link to={`/teachers/${t.id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: '#999' }}>No teachers found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Teachers;
