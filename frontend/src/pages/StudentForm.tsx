import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createStudent, getStudent, updateStudent, getClasses } from '../services/api';
import { SchoolClass } from '../types';

function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', class_id: '' });
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getClasses().then((r) => setClasses(r.data));
    if (isEdit) {
      getStudent(Number(id)).then((r) => {
        const d = r.data;
        setForm({ first_name: d.first_name, last_name: d.last_name, email: d.email, class_id: d.class_id?.toString() ?? '' });
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      class_id: form.class_id ? Number(form.class_id) : null,
    };
    try {
      if (isEdit) {
        await updateStudent(Number(id), payload);
      } else {
        await createStudent(payload);
      }
      navigate('/students');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred');
    }
  };

  return (
    <>
      <h1>{isEdit ? 'Edit Student' : 'Add Student'}</h1>
      {error && <div className="error-msg">{error}</div>}
      <form className="entity-form" onSubmit={handleSubmit}>
        <label>First Name</label>
        <input required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
        <label>Last Name</label>
        <input required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
        <label>Email</label>
        <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label>Class</label>
        <select value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })}>
          <option value="">-- None --</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Create'}</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/students')}>Cancel</button>
        </div>
      </form>
    </>
  );
}

export default StudentForm;
