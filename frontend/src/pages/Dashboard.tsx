import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStudents, getTeachers, getClasses, getSubjects } from '../services/api';

function Dashboard() {
  const [counts, setCounts] = useState({ students: 0, teachers: 0, classes: 0, subjects: 0 });

  useEffect(() => {
    Promise.all([getStudents(), getTeachers(), getClasses(), getSubjects()]).then(
      ([s, t, c, sub]) => {
        setCounts({
          students: s.data.length,
          teachers: t.data.length,
          classes: c.data.length,
          subjects: sub.data.length,
        });
      }
    );
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Students</h3>
          <div className="count">{counts.students}</div>
          <Link to="/students">View All</Link>
        </div>
        <div className="card">
          <h3>Teachers</h3>
          <div className="count">{counts.teachers}</div>
          <Link to="/teachers">View All</Link>
        </div>
        <div className="card">
          <h3>Classes</h3>
          <div className="count">{counts.classes}</div>
          <Link to="/classes">View All</Link>
        </div>
        <div className="card">
          <h3>Subjects</h3>
          <div className="count">{counts.subjects}</div>
          <Link to="/subjects">View All</Link>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
