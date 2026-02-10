import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createTeacher, getTeacher, updateTeacher } from '../services/api';

function TeacherForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', department: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      getTeacher(Number(id)).then((r) => {
        const d = r.data;
        setForm({ first_name: d.first_name, last_name: d.last_name, email: d.email, department: d.department ?? '' });
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
      department: form.department || null,
    };
    try {
      if (isEdit) {
        await updateTeacher(Number(id), payload);
      } else {
        await createTeacher(payload);
      }
      navigate('/teachers');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred');
    }
  };

  return (
    <>
      <h1>{isEdit ? 'Edit Teacher' : 'Add Teacher'}</h1>
      {error && <div className="error-msg">{error}</div>}
      <form className="entity-form" onSubmit={handleSubmit}>
        <label>First Name</label>
        <input required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
        <label>Last Name</label>
        <input required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
        <label>Email</label>
        <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label>Department</label>
        <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Create'}</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/teachers')}>Cancel</button>
        </div>
      </form>
    </>
  );
}

export default TeacherForm;
