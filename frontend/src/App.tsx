import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Teachers from './pages/Teachers'
import Classes from './pages/Classes'
import Subjects from './pages/Subjects'
import Login from './pages/Login'
import './App.css'

function ProtectedLayout() {
  const { user, logout } = useAuth()

  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

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
        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <div className="user-avatar">{initials}</div>
            <div className="user-details">
              <div className="user-name">{user?.full_name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={logout} title="Sign out">
            &#x2192;
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="spinner" />
      </div>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return <ProtectedLayout />
}

export default App
