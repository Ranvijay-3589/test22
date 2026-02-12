import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClasses, deleteClass } from '../services/api';
import { SchoolClass } from '../types';

function ClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [search, setSearch] = useState('');

  const load = () => {
    getClasses(search || undefined).then((r) => setClasses(r.data));
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { load(); }, [search]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this class?')) return;
    await deleteClass(id);
    load();
  };

  return (
    <>
      <h1>Classes</h1>
      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search classes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/classes/new" className="btn btn-primary">Add Class</Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Grade Level</th><th>Section</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.grade_level}</td>
              <td>{c.section ?? '-'}</td>
              <td className="actions">
                <Link to={`/classes/${c.id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                <button onClick={() => handleDelete(c.id)} className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
          {classes.length === 0 && (
            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>No classes found</td></tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default ClassesPage;
