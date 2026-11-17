import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'
import { useAccounts } from '../AccountsContext.jsx'

const home = { Donor: '/dashboard', Organiser: '/organiser', Reviewer: '/review', Admin: '/admin' }

export default function Login() {
  const { login } = useAuth()
  const { accounts } = useAccounts()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const u = accounts.find((x) => x.email === email.trim().toLowerCase() && x.password === password)
    if (!u) {
      setError('Email or password is incorrect.')
      return
    }
    login(u.role, u.name, u.org)
    navigate(home[u.role])
  }

  return (
    <section className="wrap narrow">
      <h1>Log in</h1>
      <p className="lead">Sign in with your TraceGood account. Your access is set by your account.</p>

      <form className="panel" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="pw">Password</label>
        <input id="pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <p style={{ color: 'var(--red)', fontWeight: 600 }}>{error}</p>}

        <button className="btn full">Log in</button>
        <p className="muted small-t">New to TraceGood? <Link className="link" to="/register">Create an account</Link></p>
      </form>

      <details style={{ marginTop: 24 }}>
        <summary className="muted small-t" style={{ cursor: 'pointer' }}>Demo accounts (for testing only)</summary>
        <table style={{ marginTop: 12 }}>
          <thead>
            <tr><th>Account</th><th>Email</th><th>Password</th></tr>
          </thead>
          <tbody>
            {accounts.map((u) => (
              <tr key={u.email}>
                <td>{u.name}</td>
                <td><code>{u.email}</code></td>
                <td><code>{u.password}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  )
}