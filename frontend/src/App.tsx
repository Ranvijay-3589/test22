import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Teachers from './pages/Teachers'
import Classes from './pages/Classes'
import Subjects from './pages/Subjects'
import './App.css'

function AppLayout() {
  const { user, logout } = useAuth()

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
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
            {user?.email}
          </div>
          <button
            onClick={logout}
            className="btn btn-sm"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#e2e8f0', width: '100%', justifyContent: 'center' }}
          >
            Sign Out
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

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    )
  }

  return <AppLayout />
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
