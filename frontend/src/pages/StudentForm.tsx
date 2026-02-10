import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createStudent,
  getStudent,
  updateStudent,
  getClasses,
} from "../services/api";
import type { Class } from "../types";

function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [classId, setClassId] = useState<number | "">("");
  const [classes, setClasses] = useState<Class[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getClasses().then(setClasses);
    if (id) {
      getStudent(Number(id)).then((s) => {
        setName(s.name);
        setEmail(s.email);
        setPhone(s.phone || "");
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
        email,
        phone: phone || null,
        class_id: classId === "" ? null : Number(classId),
      };
      if (isEdit) {
        await updateStudent(Number(id), data);
      } else {
        await createStudent(data);
      }
      navigate("/students");
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>{isEdit ? "Edit Student" : "Add Student"}</h1>
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
            <label>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Class</label>
            <select
              value={classId}
              onChange={(e) =>
                setClassId(e.target.value === "" ? "" : Number(e.target.value))
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
              onClick={() => navigate("/students")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;
