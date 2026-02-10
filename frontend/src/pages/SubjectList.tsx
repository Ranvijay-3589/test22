import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSubjects, deleteSubject } from "../services/api";
import type { Subject } from "../types";

function SubjectList() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");

  const load = (q?: string) => getSubjects(q).then(setSubjects);

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(search || undefined);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this subject?")) return;
    await deleteSubject(id);
    load(search || undefined);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Subjects</h1>
        <Link to="/subjects/new" className="btn btn-primary">
          + Add Subject
        </Link>
      </div>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          placeholder="Search subjects..."
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
                <th>Code</th>
                <th>Teacher</th>
                <th>Class</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.code}</td>
                  <td>{s.teacher_name || "—"}</td>
                  <td>{s.class_name || "—"}</td>
                  <td className="actions">
                    <Link
                      to={`/subjects/${s.id}/edit`}
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
              {subjects.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#999" }}>
                    No subjects found
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

export default SubjectList;
