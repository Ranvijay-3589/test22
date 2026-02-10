import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createClass, getClass, updateClass } from '../services/api';

function ClassForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ name: '', grade_level: '', section: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      getClass(Number(id)).then((r) => {
        const d = r.data;
        setForm({ name: d.name, grade_level: d.grade_level.toString(), section: d.section ?? '' });
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const payload = {
      name: form.name,
      grade_level: Number(form.grade_level),
      section: form.section || null,
    };
    try {
      if (isEdit) {
        await updateClass(Number(id), payload);
      } else {
        await createClass(payload);
      }
      navigate('/classes');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred');
    }
  };

  return (
    <>
      <h1>{isEdit ? 'Edit Class' : 'Add Class'}</h1>
      {error && <div className="error-msg">{error}</div>}
      <form className="entity-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label>Grade Level</label>
        <input required type="number" min="1" value={form.grade_level} onChange={(e) => setForm({ ...form, grade_level: e.target.value })} />
        <label>Section</label>
        <input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} />
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Create'}</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/classes')}>Cancel</button>
        </div>
      </form>
    </>
  );
}

export default ClassForm;
