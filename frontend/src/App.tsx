import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Teachers from './pages/Teachers'
import Classes from './pages/Classes'
import Subjects from './pages/Subjects'
import Test from './pages/Test'
import Test2 from './pages/Test2'
import Test3 from './pages/Test3'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import './App.css'

function App() {
  const { isAuthenticated, isLoading, user, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="spinner" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
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
          <NavLink to="/test">
            <span className="icon">&#x1F9EA;</span> Test
          </NavLink>
          <NavLink to="/test2">
            <span className="icon">&#x1F9EA;</span> Test2
          </NavLink>
          <NavLink to="/test3">
            <span className="icon">&#x1F9EA;</span> Test3
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-name">{user?.full_name || user?.username}</span>
          </div>
          <button className="btn-logout" onClick={logout}>
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
          <Route path="/test" element={<Test />} />
          <Route path="/test2" element={<Test2 />} />
          <Route path="/test3" element={<Test3 />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
