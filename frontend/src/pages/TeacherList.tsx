import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTeachers, deleteTeacher } from "../services/api";
import type { Teacher } from "../types";

function TeacherList() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");

  const load = (q?: string) => getTeachers(q).then(setTeachers);

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(search || undefined);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this teacher?")) return;
    await deleteTeacher(id);
    load(search || undefined);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Teachers</h1>
        <Link to="/teachers/new" className="btn btn-primary">
          + Add Teacher
        </Link>
      </div>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          placeholder="Search teachers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.email}</td>
                  <td>{t.phone || "—"}</td>
                  <td>{t.department || "—"}</td>
                  <td className="actions">
                    <Link
                      to={`/teachers/${t.id}/edit`}
                      className="btn btn-secondary btn-sm"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(t.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {teachers.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#999" }}>
                    No teachers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TeacherList;
