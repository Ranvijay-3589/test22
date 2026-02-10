import { useEffect, useState } from "react";
import { getStudents, getTeachers, getClasses, getSubjects } from "../services/api";

function Dashboard() {
  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    subjects: 0,
  });

  useEffect(() => {
    Promise.all([
      getStudents().then((d) => d.length),
      getTeachers().then((d) => d.length),
      getClasses().then((d) => d.length),
      getSubjects().then((d) => d.length),
    ]).then(([students, teachers, classes, subjects]) =>
      setCounts({ students, teachers, classes, subjects })
    );
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>
      <div className="dashboard-welcome">
        <p>Welcome to the School Management System.</p>
      </div>
      <div className="stats-row">
        <div className="stat-card">
          <div className="label">Students</div>
          <div className="value">{counts.students}</div>
        </div>
        <div className="stat-card">
          <div className="label">Teachers</div>
          <div className="value">{counts.teachers}</div>
        </div>
        <div className="stat-card">
          <div className="label">Classes</div>
          <div className="value">{counts.classes}</div>
        </div>
        <div className="stat-card">
          <div className="label">Subjects</div>
          <div className="value">{counts.subjects}</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
