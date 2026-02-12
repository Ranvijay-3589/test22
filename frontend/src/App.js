import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentForm from './pages/StudentForm';
import Teachers from './pages/Teachers';
import TeacherForm from './pages/TeacherForm';
import Classes from './pages/Classes';
import ClassForm from './pages/ClassForm';
import Subjects from './pages/Subjects';
import SubjectForm from './pages/SubjectForm';

function App() {
  return (
    <div>
      <nav>
        <NavLink to="/" className="brand">School Management</NavLink>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/students">Students</NavLink>
        <NavLink to="/teachers">Teachers</NavLink>
        <NavLink to="/classes">Classes</NavLink>
        <NavLink to="/subjects">Subjects</NavLink>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/new" element={<StudentForm />} />
          <Route path="/students/:id/edit" element={<StudentForm />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teachers/new" element={<TeacherForm />} />
          <Route path="/teachers/:id/edit" element={<TeacherForm />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/classes/new" element={<ClassForm />} />
          <Route path="/classes/:id/edit" element={<ClassForm />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/subjects/new" element={<SubjectForm />} />
          <Route path="/subjects/:id/edit" element={<SubjectForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
