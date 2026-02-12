import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');

  const fetchSubjects = () => {
    const params = search ? { search } : {};
    api.get('/subjects/', { params }).then(res => setSubjects(res.data)).catch(() => {});
  };

  useEffect(() => { fetchSubjects(); }, [search]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this subject?')) {
      api.delete(`/subjects/${id}`).then(() => fetchSubjects());
    }
  };

  return (
    <div>
      <h1>Subjects</h1>
      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search subjects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Link to="/subjects/new" className="btn btn-primary">Add Subject</Link>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td className="actions">
                  <Link to={`/subjects/${s.id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {subjects.length === 0 && (
              <tr><td colSpan="3" style={{ textAlign: 'center', color: '#999' }}>No subjects found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Subjects;
