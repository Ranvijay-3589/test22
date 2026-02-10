import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClasses, deleteClass } from "../services/api";
import type { Class } from "../types";

function ClassList() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [search, setSearch] = useState("");

  const load = (q?: string) => getClasses(q).then(setClasses);

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(search || undefined);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this class?")) return;
    await deleteClass(id);
    load(search || undefined);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Classes</h1>
        <Link to="/classes/new" className="btn btn-primary">
          + Add Class
        </Link>
      </div>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          placeholder="Search classes..."
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
                <th>Section</th>
                <th>Room</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.section || "—"}</td>
                  <td>{c.room_number || "—"}</td>
                  <td className="actions">
                    <Link
                      to={`/classes/${c.id}/edit`}
                      className="btn btn-secondary btn-sm"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {classes.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "#999" }}>
                    No classes found
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

export default ClassList;
