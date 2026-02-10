import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createClass, getClass, updateClass } from "../services/api";

function ClassForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      getClass(Number(id)).then((c) => {
        setName(c.name);
        setSection(c.section || "");
        setRoomNumber(c.room_number || "");
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = {
        name,
        section: section || null,
        room_number: roomNumber || null,
      };
      if (isEdit) {
        await updateClass(Number(id), data);
      } else {
        await createClass(data);
      }
      navigate("/classes");
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>{isEdit ? "Edit Class" : "Add Class"}</h1>
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
            <label>Section</label>
            <input
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Room Number</label>
            <input
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEdit ? "Update" : "Create"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/classes")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClassForm;
