import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createSubject,
  getSubject,
  updateSubject,
  getTeachers,
  getClasses,
} from "../services/api";
import type { Teacher, Class } from "../types";

function SubjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [teacherId, setTeacherId] = useState<number | "">("");
  const [classId, setClassId] = useState<number | "">("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getTeachers().then(setTeachers);
    getClasses().then(setClasses);
    if (id) {
      getSubject(Number(id)).then((s) => {
        setName(s.name);
        setCode(s.code);
        setTeacherId(s.teacher_id || "");
        setClassId(s.class_id || "");
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = {
        name,
        code,
        teacher_id: teacherId === "" ? null : Number(teacherId),
        class_id: classId === "" ? null : Number(classId),
      };
      if (isEdit) {
        await updateSubject(Number(id), data);
      } else {
        await createSubject(data);
      }
      navigate("/subjects");
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>{isEdit ? "Edit Subject" : "Add Subject"}</h1>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Code *</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Teacher</label>
            <select
              value={teacherId}
              onChange={(e) =>
                setTeacherId(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            >
              <option value="">— None —</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Class</label>
            <select
              value={classId}
              onChange={(e) =>
                setClassId(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            >
              <option value="">— None —</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEdit ? "Update" : "Create"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/subjects")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubjectForm;
