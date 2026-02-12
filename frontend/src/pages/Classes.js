import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Classes() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');

  const fetchClasses = () => {
    const params = search ? { search } : {};
    api.get('/classes/', { params }).then(res => setClasses(res.data)).catch(() => {});
  };

  useEffect(() => { fetchClasses(); }, [search]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this class?')) {
      api.delete(`/classes/${id}`).then(() => fetchClasses());
    }
  };

  return (
    <div>
      <h1>Classes</h1>
      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search classes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Link to="/classes/new" className="btn btn-primary">Add Class</Link>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Section</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.section}</td>
                <td className="actions">
                  <Link to={`/classes/${c.id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {classes.length === 0 && (
              <tr><td colSpan="4" style={{ textAlign: 'center', color: '#999' }}>No classes found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Classes;
