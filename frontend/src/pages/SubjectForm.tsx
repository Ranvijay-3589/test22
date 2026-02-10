import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createSubject, getSubject, updateSubject, getTeachers, getClasses } from '../services/api';
import { Teacher, SchoolClass } from '../types';

function SubjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ name: '', code: '', teacher_id: '', class_id: '' });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getTeachers().then((r) => setTeachers(r.data));
    getClasses().then((r) => setClasses(r.data));
    if (isEdit) {
      getSubject(Number(id)).then((r) => {
        const d = r.data;
        setForm({
          name: d.name,
          code: d.code,
          teacher_id: d.teacher_id?.toString() ?? '',
          class_id: d.class_id?.toString() ?? '',
        });
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const payload = {
      name: form.name,
      code: form.code,
      teacher_id: form.teacher_id ? Number(form.teacher_id) : null,
      class_id: form.class_id ? Number(form.class_id) : null,
    };
    try {
      if (isEdit) {
        await updateSubject(Number(id), payload);
      } else {
        await createSubject(payload);
      }
      navigate('/subjects');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred');
    }
  };

  return (
    <>
      <h1>{isEdit ? 'Edit Subject' : 'Add Subject'}</h1>
      {error && <div className="error-msg">{error}</div>}
      <form className="entity-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label>Code</label>
        <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        <label>Teacher</label>
        <select value={form.teacher_id} onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}>
          <option value="">-- None --</option>
          {teachers.map((t) => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
        </select>
        <label>Class</label>
        <select value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })}>
          <option value="">-- None --</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Create'}</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/subjects')}>Cancel</button>
        </div>
      </form>
    </>
  );
}

export default SubjectForm;
