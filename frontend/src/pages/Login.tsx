import { useState, type FormEvent } from 'react'

type LoginProps = {
  onLogin: (email: string, password: string) => boolean
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const success = onLogin(email, password)

    if (!success) {
      setError('Please enter both email and password.')
      return
    }

    setError('')
  }

  return (
    <section className="login-page">
      <div className="login-card">
        <h1>School Management</h1>
        <p>Sign in to access your dashboard.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="admin@school.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />

          {error ? <p className="login-error">{error}</p> : null}

          <button type="submit" className="btn btn-primary login-btn">
            Login
          </button>
        </form>
      </div>
    </section>
  )
}

export default Login
