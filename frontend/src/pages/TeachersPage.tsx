import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTeachers, deleteTeacher } from '../services/api';
import { Teacher } from '../types';

function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState('');

  const load = () => {
    getTeachers(search || undefined).then((r) => setTeachers(r.data));
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { load(); }, [search]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this teacher?')) return;
    await deleteTeacher(id);
    load();
  };

  return (
    <>
      <h1>Teachers</h1>
      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search teachers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/teachers/new" className="btn btn-primary">Add Teacher</Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Department</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.first_name}</td>
              <td>{t.last_name}</td>
              <td>{t.email}</td>
              <td>{t.department ?? '-'}</td>
              <td className="actions">
                <Link to={`/teachers/${t.id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                <button onClick={() => handleDelete(t.id)} className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
          {teachers.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No teachers found</td></tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default TeachersPage;
