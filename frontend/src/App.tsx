import { useState } from 'react'
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Teachers from './pages/Teachers'
import Classes from './pages/Classes'
import Subjects from './pages/Subjects'
import Login from './pages/Login'
import './App.css'

function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'))

  const handleLogin = (accessToken: string) => {
    localStorage.setItem('auth_token', accessToken)
    setToken(accessToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    setToken(null)
  }

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>School Mgmt</h2>
          <p>Management System</p>
        </div>
        <nav>
          <NavLink to="/" end>
            <span className="icon">&#x1F3E0;</span> Dashboard
          </NavLink>
          <NavLink to="/students">
            <span className="icon">&#x1F393;</span> Students
          </NavLink>
          <NavLink to="/teachers">
            <span className="icon">&#x1F468;&#x200D;&#x1F3EB;</span> Teachers
          </NavLink>
          <NavLink to="/classes">
            <span className="icon">&#x1F3DB;</span> Classes
          </NavLink>
          <NavLink to="/subjects">
            <span className="icon">&#x1F4DA;</span> Subjects
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button type="button" className="btn btn-secondary btn-full" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
