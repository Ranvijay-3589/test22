import { useEffect, useState } from 'react'
import { getStudents, getTeachers, getClasses, getSubjects } from '../api'

function Dashboard() {
  const [counts, setCounts] = useState({ students: 0, teachers: 0, classes: 0, subjects: 0 })

  useEffect(() => {
    Promise.all([getStudents(), getTeachers(), getClasses(), getSubjects()])
      .then(([s, t, c, sub]) => {
        setCounts({
          students: s.data.length,
          teachers: t.data.length,
          classes: c.data.length,
          subjects: sub.data.length,
        })
      })
      .catch(() => {})
  }, [])

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon students">&#x1F393;</div>
          <div className="stat-info">
            <h3>{counts.students}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon teachers">&#x1F468;&#x200D;&#x1F3EB;</div>
          <div className="stat-info">
            <h3>{counts.teachers}</h3>
            <p>Total Teachers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon classes">&#x1F3DB;</div>
          <div className="stat-info">
            <h3>{counts.classes}</h3>
            <p>Total Classes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon subjects">&#x1F4DA;</div>
          <div className="stat-info">
            <h3>{counts.subjects}</h3>
            <p>Total Subjects</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
