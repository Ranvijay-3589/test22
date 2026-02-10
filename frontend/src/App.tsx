import { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import StudentList from "./pages/StudentList";
import StudentForm from "./pages/StudentForm";
import TeacherList from "./pages/TeacherList";
import TeacherForm from "./pages/TeacherForm";
import ClassList from "./pages/ClassList";
import ClassForm from "./pages/ClassForm";
import SubjectList from "./pages/SubjectList";
import SubjectForm from "./pages/SubjectForm";

function App() {
  const { user, loading, logout } = useAuth();
  const [authPage, setAuthPage] = useState<"login" | "signup">("login");

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return authPage === "signup" ? (
      <Signup onSwitchToLogin={() => setAuthPage("login")} />
    ) : (
      <Login onSwitchToSignup={() => setAuthPage("signup")} />
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">School Management</div>
        <nav>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/students">Students</NavLink>
          <NavLink to="/teachers">Teachers</NavLink>
          <NavLink to="/classes">Classes</NavLink>
          <NavLink to="/subjects">Subjects</NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-name">{user.full_name}</span>
            <span className="user-role">{user.role}</span>
          </div>
          <button className="btn btn-sm logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/students/new" element={<StudentForm />} />
          <Route path="/students/:id/edit" element={<StudentForm />} />
          <Route path="/teachers" element={<TeacherList />} />
          <Route path="/teachers/new" element={<TeacherForm />} />
          <Route path="/teachers/:id/edit" element={<TeacherForm />} />
          <Route path="/classes" element={<ClassList />} />
          <Route path="/classes/new" element={<ClassForm />} />
          <Route path="/classes/:id/edit" element={<ClassForm />} />
          <Route path="/subjects" element={<SubjectList />} />
          <Route path="/subjects/new" element={<SubjectForm />} />
          <Route path="/subjects/:id/edit" element={<SubjectForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
