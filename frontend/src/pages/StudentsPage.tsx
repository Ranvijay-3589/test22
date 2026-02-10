import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStudents, deleteStudent, getClasses } from '../services/api';
import { Student, SchoolClass } from '../types';

function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [search, setSearch] = useState('');

  const load = () => {
    getStudents(search || undefined).then((r) => setStudents(r.data));
  };

  useEffect(() => {
    load();
    getClasses().then((r) => setClasses(r.data));
  }, []);

  useEffect(() => { load(); }, [search]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this student?')) return;
    await deleteStudent(id);
    load();
  };

  const className = (classId: number | null) =>
    classes.find((c) => c.id === classId)?.name ?? '-';

  return (
    <>
      <h1>Students</h1>
      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/students/new" className="btn btn-primary">Add Student</Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Class</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.first_name}</td>
              <td>{s.last_name}</td>
              <td>{s.email}</td>
              <td>{className(s.class_id)}</td>
              <td className="actions">
                <Link to={`/students/${s.id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                <button onClick={() => handleDelete(s.id)} className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No students found</td></tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default StudentsPage;
