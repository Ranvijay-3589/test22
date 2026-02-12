import React, { useState, useEffect } from 'react';
import api from '../api';

function Dashboard() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, classes: 0, subjects: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/students/'),
      api.get('/teachers/'),
      api.get('/classes/'),
      api.get('/subjects/'),
    ]).then(([s, t, c, sub]) => {
      setStats({
        students: s.data.length,
        teachers: t.data.length,
        classes: c.data.length,
        subjects: sub.data.length,
      });
    }).catch(() => {});
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat-card">
          <h3>{stats.students}</h3>
          <p>Students</p>
        </div>
        <div className="stat-card">
          <h3>{stats.teachers}</h3>
          <p>Teachers</p>
        </div>
        <div className="stat-card">
          <h3>{stats.classes}</h3>
          <p>Classes</p>
        </div>
        <div className="stat-card">
          <h3>{stats.subjects}</h3>
          <p>Subjects</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
