import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPage';
import StudentForm from './pages/StudentForm';
import TeachersPage from './pages/TeachersPage';
import TeacherForm from './pages/TeacherForm';
import ClassesPage from './pages/ClassesPage';
import ClassForm from './pages/ClassForm';
import SubjectsPage from './pages/SubjectsPage';
import SubjectForm from './pages/SubjectForm';

function App() {
  return (
    <>
      <nav>
        <NavLink to="/" className="brand">School Management</NavLink>
        <NavLink to="/students">Students</NavLink>
        <NavLink to="/teachers">Teachers</NavLink>
        <NavLink to="/classes">Classes</NavLink>
        <NavLink to="/subjects">Subjects</NavLink>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/students/new" element={<StudentForm />} />
          <Route path="/students/:id/edit" element={<StudentForm />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/teachers/new" element={<TeacherForm />} />
          <Route path="/teachers/:id/edit" element={<TeacherForm />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/classes/new" element={<ClassForm />} />
          <Route path="/classes/:id/edit" element={<ClassForm />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subjects/new" element={<SubjectForm />} />
          <Route path="/subjects/:id/edit" element={<SubjectForm />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
