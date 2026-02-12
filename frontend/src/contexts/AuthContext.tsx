import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  name: string
  email: string
}

interface SignupResult {
  success: boolean
  message?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  authPage: 'login' | 'signup'
  setAuthPage: (page: 'login' | 'signup') => void
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<SignupResult>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function getStoredUsers(): Array<{ name: string; email: string; password: string }> {
  const data = localStorage.getItem('sm_users')
  return data ? JSON.parse(data) : []
}

function storeUsers(users: Array<{ name: string; email: string; password: string }>) {
  localStorage.setItem('sm_users', JSON.stringify(users))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sm_auth') === 'true'
  })
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sm_user')
    return saved ? JSON.parse(saved) : null
  })
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login')

  const login = async (email: string, password: string): Promise<boolean> => {
    // Check demo credentials
    if (email === 'admin@school.com' && password === 'admin123') {
      const u = { name: 'Admin', email }
      setIsAuthenticated(true)
      setUser(u)
      localStorage.setItem('sm_auth', 'true')
      localStorage.setItem('sm_user', JSON.stringify(u))
      return true
    }

    // Check registered users
    const users = getStoredUsers()
    const found = users.find((u) => u.email === email && u.password === password)
    if (found) {
      const u = { name: found.name, email: found.email }
      setIsAuthenticated(true)
      setUser(u)
      localStorage.setItem('sm_auth', 'true')
      localStorage.setItem('sm_user', JSON.stringify(u))
      return true
    }

    return false
  }

  const signup = async (name: string, email: string, password: string): Promise<SignupResult> => {
    const users = getStoredUsers()

    // Check if email already exists
    if (email === 'admin@school.com' || users.some((u) => u.email === email)) {
      return { success: false, message: 'An account with this email already exists.' }
    }

    // Register user
    users.push({ name, email, password })
    storeUsers(users)

    // Auto-login after signup
    const u = { name, email }
    setIsAuthenticated(true)
    setUser(u)
    localStorage.setItem('sm_auth', 'true')
    localStorage.setItem('sm_user', JSON.stringify(u))

    return { success: true }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('sm_auth')
    localStorage.removeItem('sm_user')
    setAuthPage('login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, authPage, setAuthPage, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
