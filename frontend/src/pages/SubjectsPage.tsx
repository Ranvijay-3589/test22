import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSubjects, deleteSubject, getTeachers, getClasses } from '../services/api';
import { Subject, Teacher, SchoolClass } from '../types';

function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [search, setSearch] = useState('');

  const load = () => {
    getSubjects(search || undefined).then((r) => setSubjects(r.data));
  };

  useEffect(() => {
    load();
    getTeachers().then((r) => setTeachers(r.data));
    getClasses().then((r) => setClasses(r.data));
  }, []);

  useEffect(() => { load(); }, [search]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this subject?')) return;
    await deleteSubject(id);
    load();
  };

  const teacherName = (tid: number | null) => {
    const t = teachers.find((t) => t.id === tid);
    return t ? `${t.first_name} ${t.last_name}` : '-';
  };

  const className = (cid: number | null) =>
    classes.find((c) => c.id === cid)?.name ?? '-';

  return (
    <>
      <h1>Subjects</h1>
      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search subjects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/subjects/new" className="btn btn-primary">Add Subject</Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Code</th><th>Teacher</th><th>Class</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.code}</td>
              <td>{teacherName(s.teacher_id)}</td>
              <td>{className(s.class_id)}</td>
              <td className="actions">
                <Link to={`/subjects/${s.id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                <button onClick={() => handleDelete(s.id)} className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
          {subjects.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No subjects found</td></tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default SubjectsPage;
