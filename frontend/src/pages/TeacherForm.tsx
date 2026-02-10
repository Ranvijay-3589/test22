import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTeacher, getTeacher, updateTeacher } from "../services/api";

function TeacherForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      getTeacher(Number(id)).then((t) => {
        setName(t.name);
        setEmail(t.email);
        setPhone(t.phone || "");
        setDepartment(t.department || "");
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
        department: department || null,
      };
      if (isEdit) {
        await updateTeacher(Number(id), data);
      } else {
        await createTeacher(data);
      }
      navigate("/teachers");
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>{isEdit ? "Edit Teacher" : "Add Teacher"}</h1>
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
            <label>Department</label>
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEdit ? "Update" : "Create"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/teachers")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TeacherForm;
