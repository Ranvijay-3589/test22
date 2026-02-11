import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '../types'
import { login as apiLogin, logout as apiLogout, getMe } from '../services/api'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      getMe(token)
        .then((userData) => {
          setUser(userData)
        })
        .catch(() => {
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        })
        .finally(() => setIsLoading(false))
    }
  }, [])

  const login = async (username: string, password: string) => {
    const response = await apiLogin({ username, password })
    localStorage.setItem('token', response.access_token)
    setToken(response.access_token)
    setUser(response.user)
  }

  const logout = () => {
    if (token) {
      apiLogout(token).catch(() => {})
    }
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
