import { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  user: { email: string } | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sm_auth') === 'true'
  })
  const [user, setUser] = useState<{ email: string } | null>(() => {
    const saved = localStorage.getItem('sm_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo credentials check
    if (email === 'admin@school.com' && password === 'admin123') {
      setIsAuthenticated(true)
      setUser({ email })
      localStorage.setItem('sm_auth', 'true')
      localStorage.setItem('sm_user', JSON.stringify({ email }))
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('sm_auth')
    localStorage.removeItem('sm_user')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
