import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');

  const fetchStudents = () => {
    const params = search ? { search } : {};
    api.get('/students/', { params }).then(res => setStudents(res.data)).catch(() => {});
  };

  useEffect(() => { fetchStudents(); }, [search]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this student?')) {
      api.delete(`/students/${id}`).then(() => fetchStudents());
    }
  };

  return (
    <div>
      <h1>Students</h1>
      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search students..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Link to="/students/new" className="btn btn-primary">Add Student</Link>
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
            {students.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.phone || '-'}</td>
                <td className="actions">
                  <Link to={`/students/${s.id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: '#999' }}>No students found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Students;
