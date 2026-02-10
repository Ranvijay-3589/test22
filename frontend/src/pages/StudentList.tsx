import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStudents, deleteStudent } from "../services/api";
import type { Student } from "../types";

function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");

  const load = (q?: string) => getStudents(q).then(setStudents);

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(search || undefined);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this student?")) return;
    await deleteStudent(id);
    load(search || undefined);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Students</h1>
        <Link to="/students/new" className="btn btn-primary">
          + Add Student
        </Link>
      </div>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          placeholder="Search students..."
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
                <th>Class</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone || "—"}</td>
                  <td>{s.class_name || "—"}</td>
                  <td className="actions">
                    <Link
                      to={`/students/${s.id}/edit`}
                      className="btn btn-secondary btn-sm"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(s.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#999" }}>
                    No students found
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

export default StudentList;
